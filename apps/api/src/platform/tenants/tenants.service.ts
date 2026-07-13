import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import argon2 from "argon2";
import type { Prisma } from "@estatify/database";
import type {
  CreateTenantInput,
  Paginated,
  TenantListItem,
  TenantListQuery,
  UpdateTenantInput,
} from "@estatify/types";
import { PrismaService } from "../../prisma/prisma.service";
import { AccountStateService } from "../../security/account-state.service";

/** Row shape from the list/detail query (Tenant + agency + owner + counts). */
type TenantRow = Prisma.TenantGetPayload<{
  include: {
    agency: { select: { name: true; primaryDomain: true } };
    memberships: { include: { user: { select: { email: true } } } };
    _count: { select: { memberships: true } };
  };
}>;

@Injectable()
export class TenantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accounts: AccountStateService,
  ) {}

  private readonly include = {
    agency: { select: { name: true, primaryDomain: true } },
    memberships: {
      where: { role: "owner" as const },
      take: 1,
      include: { user: { select: { email: true } } },
    },
    _count: { select: { memberships: true } },
  };

  async list(query: TenantListQuery): Promise<Paginated<TenantListItem>> {
    const { page, pageSize, search, sort, order, status, plan } = query;

    const where: Prisma.TenantWhereInput = {
      deletedAt: null,
      ...(status ? { status } : {}),
      ...(plan ? { plan } : {}),
      ...(search
        ? {
            OR: [
              { slug: { contains: search, mode: "insensitive" } },
              { agency: { is: { name: { contains: search, mode: "insensitive" } } } },
              {
                memberships: {
                  some: {
                    role: "owner",
                    user: { email: { contains: search, mode: "insensitive" } },
                  },
                },
              },
            ],
          }
        : {}),
    };

    // Cross-tenant read — platform bypass (behind PlatformGuard on the controller).
    return this.prisma.withPlatform(async (tx) => {
      const [rows, total] = await Promise.all([
        tx.tenant.findMany({
          where,
          include: this.include,
          orderBy: this.orderBy(sort, order),
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        tx.tenant.count({ where }),
      ]);
      return { items: rows.map((r) => this.toItem(r as TenantRow)), total, page, pageSize };
    });
  }

  async getById(id: string): Promise<TenantListItem> {
    const row = await this.prisma.withPlatform((tx) =>
      tx.tenant.findFirst({ where: { id, deletedAt: null }, include: this.include }),
    );
    if (!row) throw new NotFoundException("Tenant not found");
    return this.toItem(row as TenantRow);
  }

  async create(input: CreateTenantInput): Promise<TenantListItem> {
    if (
      await this.prisma.client.tenant.findUnique({
        where: { slug: input.slug },
        select: { id: true },
      })
    ) {
      throw new ConflictException("That subdomain is taken");
    }

    const tenantId = randomUUID();
    const existingOwner = await this.prisma.client.user.findUnique({
      where: { email: input.ownerEmail },
      select: { id: true },
    });
    const ownerId = existingOwner?.id ?? randomUUID();
    // Random password — the owner sets their own via the reset flow / invite.
    const passwordHash = await argon2.hash(randomUUID() + randomUUID(), { type: argon2.argon2id });

    await this.prisma.withTenant(
      tenantId,
      async (tx) => {
        await tx.tenant.create({
          data: { id: tenantId, slug: input.slug, status: "active", plan: input.plan },
        });
        if (!existingOwner) {
          await tx.user.create({
            data: { id: ownerId, email: input.ownerEmail, passwordHash, emailVerified: false },
          });
        }
        await tx.agency.create({ data: { tenantId, name: input.agencyName } });
        await tx.membership.create({ data: { tenantId, userId: ownerId, role: "owner" } });
      },
      { userId: ownerId },
    );

    return this.getById(tenantId);
  }

  async update(id: string, input: UpdateTenantInput): Promise<TenantListItem> {
    await this.ensureExists(id);
    if (input.agencyName) {
      await this.prisma.withTenant(id, (tx) =>
        tx.agency.update({ where: { tenantId: id }, data: { name: input.agencyName } }),
      );
    }
    const data: Prisma.TenantUpdateInput = {};
    if (input.plan) data.plan = input.plan;
    if (input.status) data.status = input.status;
    if (Object.keys(data).length > 0) {
      await this.prisma.client.tenant.update({ where: { id }, data });
    }
    return this.getById(id);
  }

  async setStatus(id: string, status: "active" | "suspended"): Promise<TenantListItem> {
    await this.ensureExists(id);
    await this.prisma.client.tenant.update({ where: { id }, data: { status } });
    // Invalidate the cached tenant status → the per-request guard sees the change
    // on the very next request. Also kill refresh sessions bound to this tenant.
    await this.accounts.invalidateTenant(id);
    if (status === "suspended") await this.revokeTenantSessions(id);
    return this.getById(id);
  }

  /** Soft delete — never hard-delete a customer. */
  async softDelete(id: string): Promise<void> {
    await this.ensureExists(id);
    await this.prisma.client.tenant.update({
      where: { id },
      data: { deletedAt: new Date(), status: "suspended" },
    });
    await this.accounts.invalidateTenant(id);
    await this.revokeTenantSessions(id);
  }

  private async revokeTenantSessions(tenantId: string): Promise<void> {
    await this.prisma.client.session.updateMany({
      where: { tenantId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  // ------------------------------------------------------------- internals
  private async ensureExists(id: string): Promise<void> {
    const t = await this.prisma.client.tenant.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!t) throw new NotFoundException("Tenant not found");
  }

  private orderBy(
    sort: string | undefined,
    order: "asc" | "desc",
  ): Prisma.TenantOrderByWithRelationInput {
    switch (sort) {
      case "agencyName":
        return { agency: { name: order } };
      case "slug":
        return { slug: order };
      case "plan":
        return { plan: order };
      case "status":
        return { status: order };
      case "lastActiveAt":
        return { lastActiveAt: order };
      default:
        return { createdAt: order };
    }
  }

  private toItem(t: TenantRow): TenantListItem {
    const owner = t.memberships[0]?.user ?? null;
    return {
      id: t.id,
      agencyName: t.agency?.name ?? t.slug,
      slug: t.slug,
      ownerName: null, // User has no display name yet (added with a later profile milestone)
      ownerEmail: owner?.email ?? null,
      plan: t.plan,
      status: t.status,
      propertiesCount: 0, // Property model lands in a later milestone; honest 0 until then
      agentsCount: t._count.memberships,
      website: t.agency?.primaryDomain ?? null,
      lastActiveAt: t.lastActiveAt ? t.lastActiveAt.toISOString() : null,
      createdAt: t.createdAt.toISOString(),
    };
  }
}

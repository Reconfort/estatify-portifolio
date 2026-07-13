import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import argon2 from "argon2";
import type { Prisma } from "@estatify/database";
import type {
  CreateStaffInput,
  Paginated,
  StaffListItem,
  StaffListQuery,
  UpdateStaffInput,
} from "@estatify/types";
import { PrismaService } from "../../prisma/prisma.service";
import { AccountStateService } from "../../security/account-state.service";

type StaffRow = Prisma.StaffProfileGetPayload<{
  include: { user: { select: { email: true } }; role: { select: { name: true } } };
}>;

/** StaffProfile/User are GLOBAL tables (no RLS) — no platform GUC needed here. */
@Injectable()
export class StaffService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accounts: AccountStateService,
  ) {}

  private readonly include = {
    user: { select: { email: true } },
    role: { select: { name: true } },
  };

  async list(query: StaffListQuery): Promise<Paginated<StaffListItem>> {
    const { page, pageSize, search, sort, order, department, status } = query;
    const where: Prisma.StaffProfileWhereInput = {
      deletedAt: null,
      ...(department ? { department } : {}),
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { fullName: { contains: search, mode: "insensitive" } },
              { user: { is: { email: { contains: search, mode: "insensitive" } } } },
            ],
          }
        : {}),
    };

    const [rows, total] = await Promise.all([
      this.prisma.client.staffProfile.findMany({
        where,
        include: this.include,
        orderBy: this.orderBy(sort, order),
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.client.staffProfile.count({ where }),
    ]);

    return { items: rows.map((r) => this.toItem(r)), total, page, pageSize };
  }

  async create(input: CreateStaffInput): Promise<StaffListItem> {
    if (
      await this.prisma.client.user.findUnique({
        where: { email: input.email },
        select: { id: true },
      })
    ) {
      throw new ConflictException("A user with that email already exists");
    }
    const passwordHash = await argon2.hash(input.password ?? randomUUID() + randomUUID(), {
      type: argon2.argon2id,
    });
    const userId = randomUUID();

    const profile = await this.prisma.client.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: userId,
          email: input.email,
          passwordHash,
          emailVerified: true,
          isPlatformStaff: true,
        },
      });
      return tx.staffProfile.create({
        data: {
          userId,
          fullName: input.fullName,
          department: input.department,
          roleId: input.roleId,
          status: "active",
        },
        include: this.include,
      });
    });
    return this.toItem(profile);
  }

  async update(id: string, input: UpdateStaffInput): Promise<StaffListItem> {
    await this.ensureExists(id);
    const row = await this.prisma.client.staffProfile.update({
      where: { id },
      data: {
        ...(input.fullName !== undefined ? { fullName: input.fullName } : {}),
        ...(input.department !== undefined ? { department: input.department } : {}),
        ...(input.roleId !== undefined ? { roleId: input.roleId } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
      },
      include: this.include,
    });
    return this.toItem(row);
  }

  async setStatus(id: string, status: "active" | "disabled"): Promise<StaffListItem> {
    await this.ensureExists(id);
    const row = await this.prisma.client.staffProfile.update({
      where: { id },
      data: { status },
      include: this.include,
    });
    // Disabling must take effect immediately: kill refresh sessions AND suspend
    // the user (bumps the token version + invalidates the authz cache) so the
    // per-request guard rejects any live access token on the next call.
    if (status === "disabled") {
      await this.revokeUserSessions(row.userId);
      await this.accounts.suspendUser(row.userId);
    } else {
      await this.accounts.reactivateUser(row.userId);
    }
    return this.toItem(row);
  }

  async softDelete(id: string): Promise<void> {
    await this.ensureExists(id);
    const profile = await this.prisma.client.staffProfile.update({
      where: { id },
      data: { deletedAt: new Date(), status: "disabled" },
      select: { userId: true },
    });
    await this.revokeUserSessions(profile.userId);
    await this.accounts.suspendUser(profile.userId);
  }

  private async revokeUserSessions(userId: string): Promise<void> {
    await this.prisma.client.session.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  // ------------------------------------------------------------- internals
  private async ensureExists(id: string): Promise<void> {
    const s = await this.prisma.client.staffProfile.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!s) throw new NotFoundException("Staff member not found");
  }

  private orderBy(
    sort: string | undefined,
    order: "asc" | "desc",
  ): Prisma.StaffProfileOrderByWithRelationInput {
    switch (sort) {
      case "fullName":
        return { fullName: order };
      case "department":
        return { department: order };
      case "status":
        return { status: order };
      case "lastLoginAt":
        return { lastLoginAt: order };
      default:
        return { createdAt: order };
    }
  }

  private toItem(s: StaffRow): StaffListItem {
    return {
      id: s.id,
      fullName: s.fullName,
      email: s.user.email,
      avatarUrl: s.avatarUrl,
      department: s.department,
      roleId: s.roleId,
      roleName: s.role?.name ?? null,
      status: s.status,
      twoFactorEnabled: s.twoFactorEnabled,
      lastLoginAt: s.lastLoginAt ? s.lastLoginAt.toISOString() : null,
      createdAt: s.createdAt.toISOString(),
    };
  }
}

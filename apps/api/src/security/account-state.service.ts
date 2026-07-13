import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CacheService } from "./cache.service";

export interface UserAuthState {
  status: "active" | "suspended";
  tokenVersion: number;
  isPlatformStaff: boolean;
  /** For staff: their StaffProfile is present, not deleted and active. Non-staff: true. */
  staffActive: boolean;
}

const USER_TTL = 60; // seconds — safety net; invalidation is write-through
const TENANT_TTL = 60;
const userKey = (id: string) => `authz:user:${id}`;
const tenantKey = (id: string) => `authz:tenant:${id}`;

/**
 * Authoritative account/tenant state for the per-request auth guard, cached in
 * Redis. The DB is the source of truth; mutations here update the DB AND
 * invalidate the cache so the very next request re-reads fresh state — giving
 * immediate (not TTL-bounded) revocation on suspend/disable/delete.
 */
@Injectable()
export class AccountStateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  // ------------------------------------------------------------- reads (hot path)
  async getUserAuthState(userId: string): Promise<UserAuthState | null> {
    const cached = await this.cache.get(userKey(userId));
    if (cached) return JSON.parse(cached) as UserAuthState;

    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: {
        status: true,
        tokenVersion: true,
        isPlatformStaff: true,
        staffProfile: { select: { status: true, deletedAt: true } },
      },
    });
    if (!user) return null;

    const state: UserAuthState = {
      status: user.status,
      tokenVersion: user.tokenVersion,
      isPlatformStaff: user.isPlatformStaff,
      staffActive: user.staffProfile
        ? !user.staffProfile.deletedAt && user.staffProfile.status === "active"
        : true,
    };
    await this.cache.set(userKey(userId), JSON.stringify(state), USER_TTL);
    return state;
  }

  /** Returns the tenant status, or "suspended" for missing/deleted tenants (fail-closed). */
  async getTenantStatus(tenantId: string): Promise<"active" | "suspended" | "pending"> {
    const cached = await this.cache.get(tenantKey(tenantId));
    if (cached) return cached as "active" | "suspended" | "pending";

    const tenant = await this.prisma.client.tenant.findUnique({
      where: { id: tenantId },
      select: { status: true, deletedAt: true },
    });
    const status = !tenant || tenant.deletedAt ? "suspended" : tenant.status;
    await this.cache.set(tenantKey(tenantId), status, TENANT_TTL);
    return status;
  }

  // ------------------------------------------------------- mutations (revocation)
  /** Suspend a user immediately: flip status + bump the token version, then invalidate. */
  async suspendUser(userId: string): Promise<void> {
    await this.prisma.client.user.update({
      where: { id: userId },
      data: { status: "suspended", tokenVersion: { increment: 1 } },
    });
    await this.cache.del(userKey(userId));
  }

  async reactivateUser(userId: string): Promise<void> {
    await this.prisma.client.user.update({ where: { id: userId }, data: { status: "active" } });
    await this.cache.del(userKey(userId));
  }

  /** Force-logout everywhere (e.g. password reset) without changing status. */
  async bumpUserVersion(userId: string): Promise<void> {
    await this.prisma.client.user.update({
      where: { id: userId },
      data: { tokenVersion: { increment: 1 } },
    });
    await this.cache.del(userKey(userId));
  }

  /** Invalidate a tenant's cached status after the caller updated it in the DB. */
  async invalidateTenant(tenantId: string): Promise<void> {
    await this.cache.del(tenantKey(tenantId));
  }
}

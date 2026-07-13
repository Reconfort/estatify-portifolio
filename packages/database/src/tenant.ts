import type { PrismaClient, Prisma } from "@prisma/client";

/** Transaction client type — same surface as PrismaClient minus tx controls. */
export type TenantTx = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

/**
 * Run `fn` with the current tenant bound for Row-Level Security.
 *
 * CRITICAL: the GUC is set with `set_config(..., is_local => true)` INSIDE a
 * transaction, so it is scoped to this transaction only. A bare `SET` on a
 * pooled connection would leak the tenant into the next unrelated request that
 * reuses the connection — the single most dangerous bug in this design. Every
 * tenant-scoped DB access MUST go through here.
 *
 * The value is passed as a bound parameter (not string-interpolated) so a
 * malicious tenantId cannot break out of the statement.
 */
export async function withTenant<T>(
  prisma: PrismaClient,
  tenantId: string,
  fn: (tx: TenantTx) => Promise<T>,
  opts?: { userId?: string },
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.current_tenant', ${tenantId}, true)`;
    if (opts?.userId) {
      await tx.$executeRaw`SELECT set_config('app.current_user', ${opts.userId}, true)`;
    }
    return fn(tx as unknown as TenantTx);
  });
}

/**
 * Identity-scoped reads: bind `app.current_user` (NOT a tenant) so a user can
 * read their OWN membership rows across every tenant they belong to — used to
 * build /auth/me and the tenant switcher. Writes to tenant-scoped tables are
 * still blocked (the self RLS policy is SELECT-only).
 */
export async function withUser<T>(
  prisma: PrismaClient,
  userId: string,
  fn: (tx: TenantTx) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.current_user', ${userId}, true)`;
    return fn(tx as unknown as TenantTx);
  });
}

/**
 * Platform-staff cross-tenant access (ADR: audited, never ambient).
 *
 * Sets `app.platform = 'on'` for the transaction, which the `platform_bypass`
 * RLS policy (see prisma/rls.sql) recognizes to lift tenant scoping on
 * Agency/Membership/Invite. This is how Access Management admins read/write
 * across ALL tenants. It MUST only be called from services sitting behind
 * PlatformGuard — never on a user-facing tenant path.
 */
export async function withPlatform<T>(
  prisma: PrismaClient,
  fn: (tx: TenantTx) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.platform', 'on', true)`;
    return fn(tx as unknown as TenantTx);
  });
}

/** @deprecated Use withPlatform. Kept for back-compat; now aliases withPlatform. */
export const asPlatform = withPlatform;

export type { Prisma };

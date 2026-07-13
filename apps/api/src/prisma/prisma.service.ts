import { Injectable, type OnModuleDestroy, type OnModuleInit } from "@nestjs/common";
import {
  prisma,
  withTenant,
  withUser,
  withPlatform,
  type PrismaClient,
  type TenantTx,
} from "@estatify/database";

/**
 * Thin Nest wrapper over the shared Prisma client. Exposes the tenant-scoping
 * helpers so services never touch the raw client for tenant data — every
 * tenant-scoped query goes through withTenant/withUser (which set the RLS GUC).
 *
 * `client` is for GLOBAL tables only (User, Session, Tenant, token tables) that
 * are not RLS-scoped.
 */
@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  readonly client: PrismaClient = prisma;

  async onModuleInit(): Promise<void> {
    await this.client.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.$disconnect();
  }

  withTenant<T>(
    tenantId: string,
    fn: (tx: TenantTx) => Promise<T>,
    opts?: { userId?: string },
  ): Promise<T> {
    return withTenant(this.client, tenantId, fn, opts);
  }

  withUser<T>(userId: string, fn: (tx: TenantTx) => Promise<T>): Promise<T> {
    return withUser(this.client, userId, fn);
  }

  /** Platform-staff cross-tenant access (sets app.platform GUC). Behind PlatformGuard only. */
  withPlatform<T>(fn: (tx: TenantTx) => Promise<T>): Promise<T> {
    return withPlatform(this.client, fn);
  }
}

import { Injectable } from "@nestjs/common";
import type { TenantPreference } from "@estatify/database";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class OnboardingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreate(tenantId: string): Promise<TenantPreference> {
    return this.prisma.withTenant(tenantId, async (tx) => {
      const existing = await tx.tenantPreference.findUnique({ where: { tenantId } });
      if (existing) return existing;

      return tx.tenantPreference.create({
        data: { tenantId, goals: [] },
      });
    });
  }

  async save(
    tenantId: string,
    userId: string,
    goals: string[],
    complete: boolean,
  ): Promise<TenantPreference> {
    await this.getOrCreate(tenantId);
    return this.prisma.withTenant(tenantId, async (tx) =>
      tx.tenantPreference.update({
        where: { tenantId },
        data: {
          goals,
          ...(complete
            ? { completedAt: new Date(), completedBy: userId }
            : { completedAt: null, completedBy: null }),
        },
      }),
    );
  }

  async isCompleted(tenantId: string): Promise<boolean> {
    const row = await this.prisma.withTenant(tenantId, async (tx) =>
      tx.tenantPreference.findUnique({
        where: { tenantId },
        select: { completedAt: true },
      }),
    );
    return Boolean(row?.completedAt);
  }
}

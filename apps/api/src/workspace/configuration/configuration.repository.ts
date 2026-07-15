import { Injectable } from "@nestjs/common";
import type { AgencyConfiguration, Prisma } from "@estatify/database";
import { PrismaService } from "../../prisma/prisma.service";

type DraftUpdateInput = Partial<{
  draftProfile: unknown;
  draftBrand: unknown;
  draftWebsite: unknown;
  draftSeo: unknown;
  draftComposition: unknown;
  templateId: string | null;
}>;

function asJsonInput(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

@Injectable()
export class ConfigurationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreate(tenantId: string, agencyId: string): Promise<AgencyConfiguration> {
    return this.prisma.withTenant(tenantId, async (tx) => {
      const existing = await tx.agencyConfiguration.findUnique({ where: { agencyId } });
      if (existing) return existing;

      return tx.agencyConfiguration.create({
        data: {
          agencyId,
          tenantId,
        },
      });
    });
  }

  async updateDraft(
    tenantId: string,
    agencyId: string,
    data: DraftUpdateInput,
  ): Promise<AgencyConfiguration> {
    await this.getOrCreate(tenantId, agencyId);
    const payload: Prisma.AgencyConfigurationUpdateInput = {};
    if (data.draftProfile !== undefined) payload.draftProfile = asJsonInput(data.draftProfile);
    if (data.draftBrand !== undefined) payload.draftBrand = asJsonInput(data.draftBrand);
    if (data.draftWebsite !== undefined) payload.draftWebsite = asJsonInput(data.draftWebsite);
    if (data.draftSeo !== undefined) payload.draftSeo = asJsonInput(data.draftSeo);
    if (data.draftComposition !== undefined)
      payload.draftComposition = asJsonInput(data.draftComposition);
    if (data.templateId !== undefined) payload.templateId = data.templateId;

    return this.prisma.withTenant(tenantId, async (tx) =>
      tx.agencyConfiguration.update({
        where: { agencyId },
        data: payload,
      }),
    );
  }

  async publish(tenantId: string, agencyId: string): Promise<AgencyConfiguration> {
    const row = await this.getOrCreate(tenantId, agencyId);
    return this.prisma.withTenant(tenantId, async (tx) =>
      tx.agencyConfiguration.update({
        where: { agencyId },
        data: {
          publishedProfile: asJsonInput(row.draftProfile),
          publishedBrand: asJsonInput(row.draftBrand),
          publishedWebsite: asJsonInput(row.draftWebsite),
          publishedSeo: asJsonInput(row.draftSeo),
          publishedComposition: asJsonInput(row.draftComposition),
          publishedAt: new Date(),
        },
      }),
    );
  }

  async discardCompositionDraft(tenantId: string, agencyId: string): Promise<AgencyConfiguration> {
    const row = await this.getOrCreate(tenantId, agencyId);
    return this.prisma.withTenant(tenantId, async (tx) =>
      tx.agencyConfiguration.update({
        where: { agencyId },
        data: {
          draftComposition: asJsonInput(row.publishedComposition),
        },
      }),
    );
  }
}

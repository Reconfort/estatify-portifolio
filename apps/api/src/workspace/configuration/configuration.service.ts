import { Injectable, NotFoundException } from "@nestjs/common";
import {
  agencyProfileSchema,
  brandIdentitySchema,
  defaultAgencyProfile,
  defaultBrandIdentity,
  defaultSeoConfiguration,
  defaultWebsiteComposition,
  defaultWebsiteSettings,
  draftConfigurationSchema,
  publishedConfigurationSchema,
  seoConfigurationSchema,
  websiteCompositionSchema,
  websiteSettingsSchema,
  type DraftConfiguration,
  type PublishedConfiguration,
  type UpdateAgencyProfileInput,
  type UpdateBrandIdentityInput,
  type UpdateCompositionInput,
  type UpdateSeoConfigurationInput,
  type UpdateWebsiteSettingsInput,
  type WebsiteComposition,
} from "@estatify/types";
import { PrismaService } from "../../prisma/prisma.service";
import { CacheService } from "../../security/cache.service";
import { ConfigurationRepository } from "./configuration.repository";
import { deepMerge, parseConfigSection } from "./configuration.helpers";

const PUBLIC_CACHE_TTL = 300;

@Injectable()
export class ConfigurationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repo: ConfigurationRepository,
    private readonly cache: CacheService,
  ) {}

  async getDraft(tenantId: string): Promise<DraftConfiguration> {
    const agency = await this.requireAgency(tenantId);
    const row = await this.repo.getOrCreate(tenantId, agency.id);
    return this.toDraft(row, agency);
  }

  async updateProfile(
    tenantId: string,
    patch: UpdateAgencyProfileInput,
  ): Promise<DraftConfiguration> {
    const agency = await this.requireAgency(tenantId);
    const row = await this.repo.getOrCreate(tenantId, agency.id);
    const current = parseConfigSection(agencyProfileSchema, row.draftProfile, defaultAgencyProfile);
    const merged = deepMerge(current, patch);
    if (patch.basic && !patch.basic.companyName) {
      merged.basic.companyName = merged.basic.companyName || agency.name;
    }
    const profile = agencyProfileSchema.parse(merged);
    const updated = await this.repo.updateDraft(tenantId, agency.id, { draftProfile: profile });
    return this.toDraft(updated, agency.name);
  }

  async updateBrand(
    tenantId: string,
    patch: UpdateBrandIdentityInput,
  ): Promise<DraftConfiguration> {
    const agency = await this.requireAgency(tenantId);
    const row = await this.repo.getOrCreate(tenantId, agency.id);
    const current = parseConfigSection(brandIdentitySchema, row.draftBrand, defaultBrandIdentity);
    const brand = brandIdentitySchema.parse(deepMerge(current, patch));
    const updated = await this.repo.updateDraft(tenantId, agency.id, { draftBrand: brand });
    return this.toDraft(updated, agency.name);
  }

  async updateWebsite(
    tenantId: string,
    patch: UpdateWebsiteSettingsInput,
  ): Promise<DraftConfiguration> {
    const agency = await this.requireAgency(tenantId);
    const row = await this.repo.getOrCreate(tenantId, agency.id);
    const current = parseConfigSection(
      websiteSettingsSchema,
      row.draftWebsite,
      defaultWebsiteSettings,
    );
    const website = websiteSettingsSchema.parse(deepMerge(current, patch));
    const updated = await this.repo.updateDraft(tenantId, agency.id, { draftWebsite: website });
    return this.toDraft(updated, agency.name);
  }

  async updateSeo(
    tenantId: string,
    patch: UpdateSeoConfigurationInput,
  ): Promise<DraftConfiguration> {
    const agency = await this.requireAgency(tenantId);
    const row = await this.repo.getOrCreate(tenantId, agency.id);
    const current = parseConfigSection(
      seoConfigurationSchema,
      row.draftSeo,
      defaultSeoConfiguration,
    );
    const seo = seoConfigurationSchema.parse(deepMerge(current, patch));
    const updated = await this.repo.updateDraft(tenantId, agency.id, { draftSeo: seo });
    return this.toDraft(updated, agency.name);
  }

  async getComposition(tenantId: string): Promise<WebsiteComposition> {
    const agency = await this.requireAgency(tenantId);
    const row = await this.repo.getOrCreate(tenantId, agency.id);
    return this.parseComposition(row.draftComposition);
  }

  async updateComposition(
    tenantId: string,
    patch: UpdateCompositionInput,
  ): Promise<DraftConfiguration> {
    const agency = await this.requireAgency(tenantId);
    const row = await this.repo.getOrCreate(tenantId, agency.id);
    const current = this.parseComposition(row.draftComposition);
    const merged = deepMerge(current, patch);
    const composition = websiteCompositionSchema.parse(merged);
    const updated = await this.repo.updateDraft(tenantId, agency.id, {
      draftComposition: composition,
    });
    return this.toDraft(updated, agency.name);
  }

  async discardComposition(tenantId: string): Promise<DraftConfiguration> {
    const agency = await this.requireAgency(tenantId);
    const updated = await this.repo.discardCompositionDraft(tenantId, agency.id);
    return this.toDraft(updated, agency.name);
  }

  async publish(tenantId: string): Promise<DraftConfiguration> {
    const agency = await this.requireAgency(tenantId);
    const row = await this.repo.publish(tenantId, agency.id);
    const cacheHost = agency.primaryDomain ?? `${agency.tenant.slug}.localhost`;
    await this.cache.del(this.publicCacheKey(cacheHost));
    return this.toDraft(row, agency.name);
  }

  async getPublishedByHost(host: string): Promise<PublishedConfiguration> {
    const resolved = await this.resolveHost(host);
    if (!resolved) throw new NotFoundException("No configuration for this host");

    const cacheKey = this.publicCacheKey(host);
    const cached = await this.cache.get(cacheKey);
    if (cached) return publishedConfigurationSchema.parse(JSON.parse(cached));

    const payload = await this.buildPublished(resolved.tenantId, resolved.agencyId);
    await this.cache.set(cacheKey, JSON.stringify(payload), PUBLIC_CACHE_TTL);
    return payload;
  }

  private async buildPublished(
    tenantId: string,
    agencyId: string,
  ): Promise<PublishedConfiguration> {
    const agency = await this.prisma.withTenant(tenantId, async (tx) =>
      tx.agency.findUnique({
        where: { id: agencyId },
        include: { tenant: { select: { slug: true } }, configuration: true },
      }),
    );
    if (!agency?.configuration) throw new NotFoundException("Configuration not found");

    const media = await this.prisma.withTenant(tenantId, async (tx) => {
      const rows = await tx.mediaAsset.findMany({
        where: { agencyId },
        orderBy: { createdAt: "desc" },
      });
      const map = (category: string) =>
        rows
          .filter((r) => r.category === category)
          .map((r) => ({
            id: r.id,
            category: r.category,
            url: r.url,
            fileName: r.fileName,
            mimeType: r.mimeType,
            fileSize: r.fileSize,
            width: r.width,
            height: r.height,
            uploadedBy: r.uploadedBy,
            createdAt: r.createdAt.toISOString(),
          }));

      return {
        logo: map("logo")[0] ?? null,
        favicon: map("favicon")[0] ?? null,
        hero: map("hero"),
        company: map("company"),
        gallery: map("gallery"),
      };
    });

    const row = agency.configuration;
    const profile = parseConfigSection(
      agencyProfileSchema,
      row.publishedProfile,
      defaultAgencyProfile,
    );
    const brand = parseConfigSection(brandIdentitySchema, row.publishedBrand, defaultBrandIdentity);
    const website = parseConfigSection(
      websiteSettingsSchema,
      row.publishedWebsite,
      defaultWebsiteSettings,
    );
    const seo = parseConfigSection(
      seoConfigurationSchema,
      row.publishedSeo,
      defaultSeoConfiguration,
    );
    const composition = this.parseComposition(row.publishedComposition);

    return publishedConfigurationSchema.parse({
      profile: { ...profile, basic: { ...profile.basic, companyName: agency.name } },
      brand,
      website: {
        ...website,
        general: { ...website.general, websiteName: website.general.websiteName || agency.name },
      },
      seo,
      composition,
      media,
      meta: {
        templateId: row.templateId,
        publishedAt: row.publishedAt?.toISOString() ?? null,
        updatedAt: row.updatedAt.toISOString(),
        primaryDomain: agency.primaryDomain,
        agencySlug: agency.tenant.slug,
      },
    });
  }

  private toDraft(
    row: {
      draftProfile: unknown;
      draftBrand: unknown;
      draftWebsite: unknown;
      draftSeo: unknown;
      draftComposition: unknown;
      templateId: string | null;
      publishedAt: Date | null;
      updatedAt: Date;
    },
    agencyName: string,
  ): DraftConfiguration {
    const profile = parseConfigSection(agencyProfileSchema, row.draftProfile, defaultAgencyProfile);
    const website = parseConfigSection(
      websiteSettingsSchema,
      row.draftWebsite,
      defaultWebsiteSettings,
    );
    const composition = this.parseComposition(row.draftComposition);
    return draftConfigurationSchema.parse({
      profile: {
        ...profile,
        basic: { ...profile.basic, companyName: agencyName || profile.basic.companyName },
      },
      brand: parseConfigSection(brandIdentitySchema, row.draftBrand, defaultBrandIdentity),
      website: {
        ...website,
        general: {
          ...website.general,
          websiteName: website.general.websiteName || agencyName,
        },
      },
      seo: parseConfigSection(seoConfigurationSchema, row.draftSeo, defaultSeoConfiguration),
      composition,
      meta: {
        templateId: row.templateId,
        publishedAt: row.publishedAt?.toISOString() ?? null,
        updatedAt: row.updatedAt.toISOString(),
      },
    });
  }

  private parseComposition(raw: unknown): WebsiteComposition {
    const parsed = parseConfigSection(websiteCompositionSchema, raw, defaultWebsiteComposition);
    const home = parsed.pages.home ?? defaultWebsiteComposition.pages.home;
    return websiteCompositionSchema.parse({
      ...parsed,
      pages: {
        ...parsed.pages,
        home,
      },
    });
  }

  private async requireAgency(tenantId: string) {
    const agency = await this.prisma.withTenant(tenantId, async (tx) =>
      tx.agency.findUnique({
        where: { tenantId },
        include: { tenant: { select: { slug: true } } },
      }),
    );
    if (!agency) throw new NotFoundException("Agency not found");
    return agency;
  }

  private async resolveHost(host: string) {
    const base = host.split(":")[0]?.toLowerCase() ?? "";
    if (!base) return null;

    const byDomain = await this.prisma.client.agency.findFirst({
      where: { primaryDomain: base },
      select: { id: true, tenantId: true, tenant: { select: { slug: true } } },
    });
    if (byDomain) {
      return { tenantId: byDomain.tenantId, agencyId: byDomain.id, slug: byDomain.tenant.slug };
    }

    const subdomain = this.extractSubdomain(base);
    if (!subdomain) return null;

    const tenant = await this.prisma.client.tenant.findFirst({
      where: { slug: subdomain, deletedAt: null, status: "active" },
      include: { agency: { select: { id: true } } },
    });
    if (!tenant?.agency) return null;
    return { tenantId: tenant.id, agencyId: tenant.agency.id, slug: tenant.slug };
  }

  private extractSubdomain(host: string): string | null {
    if (host === "localhost" || host.endsWith(".localhost")) {
      const parts = host.split(".");
      return parts.length > 1 && parts[0] !== "localhost" ? (parts[0] ?? null) : null;
    }
    const parts = host.split(".");
    if (parts.length < 3) return null;
    return parts[0] ?? null;
  }

  private publicCacheKey(host: string): string {
    return `config:published:${host.split(":")[0]?.toLowerCase() ?? host}`;
  }
}

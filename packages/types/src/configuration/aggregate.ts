import { z } from "zod";
import { websiteCompositionSchema } from "../composition";
import { agencyProfileSchema } from "./profile";
import { brandIdentitySchema } from "./brand";
import { websiteSettingsSchema } from "./website";
import { seoConfigurationSchema } from "./seo";
import { mediaAssetSchema } from "./media";

export const configurationMetaSchema = z.object({
  templateId: z.string().nullable(),
  publishedAt: z.string().datetime().nullable(),
  updatedAt: z.string().datetime(),
  agencySlug: z.string().nullable().default(null),
  primaryDomain: z.string().nullable().default(null),
});

export const draftConfigurationSchema = z.object({
  profile: agencyProfileSchema,
  brand: brandIdentitySchema,
  website: websiteSettingsSchema,
  seo: seoConfigurationSchema,
  composition: websiteCompositionSchema,
  meta: configurationMetaSchema,
});

export type DraftConfiguration = z.infer<typeof draftConfigurationSchema>;

/** Template-ready published payload — the only shape sites runtime may consume. */
export const publishedConfigurationSchema = z.object({
  profile: agencyProfileSchema,
  brand: brandIdentitySchema,
  website: websiteSettingsSchema,
  seo: seoConfigurationSchema,
  composition: websiteCompositionSchema,
  media: z.object({
    logo: mediaAssetSchema.nullable(),
    favicon: mediaAssetSchema.nullable(),
    hero: z.array(mediaAssetSchema),
    company: z.array(mediaAssetSchema),
    gallery: z.array(mediaAssetSchema),
  }),
  meta: configurationMetaSchema.extend({
    primaryDomain: z.string().nullable(),
    agencySlug: z.string(),
  }),
});

export type PublishedConfiguration = z.infer<typeof publishedConfigurationSchema>;

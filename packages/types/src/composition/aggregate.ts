import { z } from "zod";
import { sectionTypeSchema } from "./common";
import { ctaSectionConfigSchema } from "./sections/cta";
import { featuredPropertiesSectionConfigSchema } from "./sections/featured-properties";
import { footerSectionConfigSchema } from "./sections/footer";
import { heroSectionConfigSchema } from "./sections/hero";

const sectionConfigByType = {
  hero: heroSectionConfigSchema,
  "featured-properties": featuredPropertiesSectionConfigSchema,
  cta: ctaSectionConfigSchema,
  footer: footerSectionConfigSchema,
} as const;

export const pageSectionSchema = z.object({
  id: z.string().trim().min(1).max(64),
  type: sectionTypeSchema,
  order: z.number().int().min(0),
  visible: z.boolean().default(true),
  config: z.record(z.unknown()),
});

export type PageSection = z.infer<typeof pageSectionSchema>;

export const pageCompositionSchema = z.object({
  sections: z.array(pageSectionSchema),
});

export type PageComposition = z.infer<typeof pageCompositionSchema>;

export const websiteCompositionSchema = z.object({
  pages: z.record(pageCompositionSchema),
});

export type WebsiteComposition = z.infer<typeof websiteCompositionSchema>;

export function parseSectionConfig<T extends keyof typeof sectionConfigByType>(
  type: T,
  config: unknown,
): z.infer<(typeof sectionConfigByType)[T]> {
  return sectionConfigByType[type].parse(config);
}

export const updateCompositionSchema = z.object({
  pages: z.record(pageCompositionSchema).optional(),
});

export type UpdateCompositionInput = z.infer<typeof updateCompositionSchema>;

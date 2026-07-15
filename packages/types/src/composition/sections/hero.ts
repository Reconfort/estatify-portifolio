import { z } from "zod";
import { optionalStringSchema } from "../../configuration/common";

export const heroAlignmentSchema = z.enum(["left", "center", "right"]);
export const heroHeightSchema = z.enum(["sm", "md", "lg"]);

export const heroSectionConfigSchema = z.object({
  title: z.string().trim().min(1).max(120),
  subtitle: optionalStringSchema(240),
  ctaText: z.string().trim().min(1).max(80),
  ctaHref: z.string().trim().min(1).max(2048),
  backgroundImage: optionalStringSchema(2048),
  overlay: z.boolean().default(true),
  height: heroHeightSchema.default("lg"),
  alignment: heroAlignmentSchema.default("center"),
});

export type HeroSectionConfig = z.infer<typeof heroSectionConfigSchema>;

export const defaultHeroSectionConfig: HeroSectionConfig = {
  title: "Find Your Dream Home",
  subtitle: "Discover premium properties in your area",
  ctaText: "Browse Properties",
  ctaHref: "/properties",
  backgroundImage: undefined,
  overlay: true,
  height: "lg",
  alignment: "center",
};

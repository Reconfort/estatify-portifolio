import { z } from "zod";
import { optionalStringSchema } from "../../configuration/common";

export const propertySourceSchema = z.enum([
  "latest",
  "featured",
  "luxury",
  "for-sale",
  "for-rent",
  "manual",
]);

export const propertyLayoutSchema = z.enum(["grid", "carousel"]);
export const propertySortSchema = z.enum(["newest", "price-asc", "price-desc"]);

export const featuredPropertiesSectionConfigSchema = z.object({
  title: z.string().trim().min(1).max(120),
  subtitle: optionalStringSchema(240),
  source: propertySourceSchema.default("featured"),
  limit: z.coerce.number().int().min(1).max(24).default(6),
  layout: propertyLayoutSchema.default("grid"),
  columns: z.coerce.number().int().min(1).max(4).default(3),
  sort: propertySortSchema.default("newest"),
  buttonText: optionalStringSchema(80),
  buttonHref: optionalStringSchema(2048),
});

export type FeaturedPropertiesSectionConfig = z.infer<typeof featuredPropertiesSectionConfigSchema>;

export const defaultFeaturedPropertiesSectionConfig: FeaturedPropertiesSectionConfig = {
  title: "Featured Properties",
  subtitle: "Hand-picked listings from our portfolio",
  source: "featured",
  limit: 6,
  layout: "grid",
  columns: 3,
  sort: "newest",
  buttonText: "View all properties",
  buttonHref: "/properties",
};

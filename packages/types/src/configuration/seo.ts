import { z } from "zod";
import { optionalStringSchema, optionalUrlSchema } from "./common";

export const robotsDirectiveSchema = z.enum([
  "index,follow",
  "index,nofollow",
  "noindex,follow",
  "noindex,nofollow",
]);

export const twitterCardSchema = z.enum(["summary", "summary_large_image"]);

export const seoConfigurationSchema = z.object({
  metaTitle: optionalStringSchema(70),
  metaDescription: optionalStringSchema(320),
  keywords: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  canonicalUrl: optionalUrlSchema,
  robots: robotsDirectiveSchema.default("index,follow"),
  openGraph: z.object({
    title: optionalStringSchema(70),
    description: optionalStringSchema(320),
    imageUrl: optionalUrlSchema,
  }),
  twitter: z.object({
    card: twitterCardSchema.default("summary_large_image"),
    title: optionalStringSchema(70),
    description: optionalStringSchema(320),
    imageUrl: optionalUrlSchema,
  }),
  structuredData: z.record(z.unknown()).optional(),
  faviconUrl: optionalUrlSchema,
});

export type SeoConfiguration = z.infer<typeof seoConfigurationSchema>;
export const updateSeoConfigurationSchema = seoConfigurationSchema.deepPartial();
export type UpdateSeoConfigurationInput = z.infer<typeof updateSeoConfigurationSchema>;

export const defaultSeoConfiguration: SeoConfiguration = {
  metaTitle: undefined,
  metaDescription: undefined,
  keywords: [],
  canonicalUrl: undefined,
  robots: "index,follow",
  openGraph: {
    title: undefined,
    description: undefined,
    imageUrl: undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: undefined,
    description: undefined,
    imageUrl: undefined,
  },
  structuredData: undefined,
  faviconUrl: undefined,
};

import { z } from "zod";

export const sectionTypeSchema = z.enum(["hero", "featured-properties", "cta", "footer"]);

export type SectionType = z.infer<typeof sectionTypeSchema>;

export const pageKeySchema = z.enum([
  "home",
  "properties",
  "property-details",
  "agents",
  "about",
  "contact",
  "privacy",
  "terms",
]);

export type PageKey = z.infer<typeof pageKeySchema>;

export function createSectionId(type: SectionType): string {
  const rand = Math.random().toString(36).slice(2, 10);
  return `${type}-${rand}`;
}

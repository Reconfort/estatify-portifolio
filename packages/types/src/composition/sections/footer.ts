import { z } from "zod";

/** Footer section config is minimal — most content comes from global website settings. */
export const footerSectionConfigSchema = z.object({
  showSocialLinks: z.boolean().default(true),
  showQuickLinks: z.boolean().default(true),
});

export type FooterSectionConfig = z.infer<typeof footerSectionConfigSchema>;

export const defaultFooterSectionConfig: FooterSectionConfig = {
  showSocialLinks: true,
  showQuickLinks: true,
};

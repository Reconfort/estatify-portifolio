import { z } from "zod";
import { optionalEmailSchema, optionalPhoneSchema, optionalStringSchema } from "./common";

export const navItemSchema = z.object({
  id: z.string().trim().min(1).max(64),
  label: z.string().trim().min(1).max(80),
  href: z.string().trim().min(1).max(2048),
  openInNewTab: z.boolean().default(false),
});

export const footerLinkSchema = z.object({
  id: z.string().trim().min(1).max(64),
  label: z.string().trim().min(1).max(80),
  href: z.string().trim().min(1).max(2048),
});

export const ctaButtonSchema = z.object({
  label: z.string().trim().min(1).max(80),
  href: z.string().trim().min(1).max(2048),
  enabled: z.boolean().default(true),
});

export const websiteSettingsSchema = z.object({
  general: z.object({
    websiteName: z.string().trim().min(1).max(120),
    websiteTagline: optionalStringSchema(200),
    defaultLanguage: z.string().trim().min(2).max(10).default("en"),
    timezone: z.string().trim().min(1).max(64).default("UTC"),
    currency: z.string().trim().length(3).optional(),
  }),
  navigation: z.object({
    items: z.array(navItemSchema).max(20),
  }),
  footer: z.object({
    description: optionalStringSchema(500),
    copyright: optionalStringSchema(200),
    quickLinks: z.array(footerLinkSchema).max(12),
    socialLinks: z.array(footerLinkSchema).max(12),
    legalLinks: z.array(footerLinkSchema).max(12),
  }),
  ctas: z.object({
    primary: ctaButtonSchema.optional(),
    secondary: ctaButtonSchema.optional(),
    floating: ctaButtonSchema.optional(),
  }),
  contact: z.object({
    websiteEmail: optionalEmailSchema,
    websitePhone: optionalPhoneSchema,
    supportEmail: optionalEmailSchema,
    salesEmail: optionalEmailSchema,
  }),
});

export type WebsiteSettings = z.infer<typeof websiteSettingsSchema>;
export const updateWebsiteSettingsSchema = websiteSettingsSchema.deepPartial();
export type UpdateWebsiteSettingsInput = z.infer<typeof updateWebsiteSettingsSchema>;

export const defaultWebsiteSettings: WebsiteSettings = {
  general: {
    websiteName: "",
    websiteTagline: undefined,
    defaultLanguage: "en",
    timezone: "UTC",
    currency: undefined,
  },
  navigation: {
    items: [
      { id: "home", label: "Home", href: "/", openInNewTab: false },
      { id: "properties", label: "Properties", href: "/properties", openInNewTab: false },
      { id: "agents", label: "Agents", href: "/agents", openInNewTab: false },
      { id: "about", label: "About", href: "/about", openInNewTab: false },
      { id: "contact", label: "Contact", href: "/contact", openInNewTab: false },
    ],
  },
  footer: {
    description: undefined,
    copyright: undefined,
    quickLinks: [],
    socialLinks: [],
    legalLinks: [],
  },
  ctas: {
    primary: undefined,
    secondary: undefined,
    floating: undefined,
  },
  contact: {
    websiteEmail: undefined,
    websitePhone: undefined,
    supportEmail: undefined,
    salesEmail: undefined,
  },
};

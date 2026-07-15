import { z } from "zod";
import { hexColorSchema } from "./common";

export const themeModeSchema = z.enum(["light", "dark", "system"]);
export const buttonStyleSchema = z.enum(["solid", "outline", "soft"]);
export const shadowPresetSchema = z.enum(["none", "sm", "md", "lg"]);
export const radiusTokenSchema = z.enum(["sm", "md", "lg", "full"]);

export const brandIdentitySchema = z.object({
  colors: z.object({
    primary: hexColorSchema,
    secondary: hexColorSchema,
    accent: hexColorSchema,
    success: hexColorSchema,
    warning: hexColorSchema,
    error: hexColorSchema,
    neutral: hexColorSchema,
  }),
  typography: z.object({
    primaryFont: z.string().trim().min(1).max(120),
    secondaryFont: z.string().trim().min(1).max(120),
    baseFontSize: z.coerce.number().min(12).max(24).default(16),
    headingScale: z.coerce.number().min(1).max(2).default(1.25),
  }),
  radius: z.object({
    sm: radiusTokenSchema,
    md: radiusTokenSchema,
    lg: radiusTokenSchema,
    full: radiusTokenSchema,
  }),
  theme: z.object({
    mode: themeModeSchema,
  }),
  components: z.object({
    buttonStyle: buttonStyleSchema,
    cardRadius: radiusTokenSchema,
    inputRadius: radiusTokenSchema,
    shadowPreset: shadowPresetSchema,
  }),
});

export type BrandIdentity = z.infer<typeof brandIdentitySchema>;
export const updateBrandIdentitySchema = brandIdentitySchema.deepPartial();
export type UpdateBrandIdentityInput = z.infer<typeof updateBrandIdentitySchema>;

/** Defaults aligned with Estatify design-system primitives. */
export const defaultBrandIdentity: BrandIdentity = {
  colors: {
    primary: "#1e7a4f",
    secondary: "#28302d",
    accent: "#a4e636",
    success: "#22a35a",
    warning: "#f59e0b",
    error: "#ef4444",
    neutral: "#6b7873",
  },
  typography: {
    primaryFont: "Rubik, sans-serif",
    secondaryFont: "Rubik, sans-serif",
    baseFontSize: 16,
    headingScale: 1.25,
  },
  radius: {
    sm: "sm",
    md: "md",
    lg: "lg",
    full: "full",
  },
  theme: {
    mode: "system",
  },
  components: {
    buttonStyle: "solid",
    cardRadius: "lg",
    inputRadius: "md",
    shadowPreset: "sm",
  },
};

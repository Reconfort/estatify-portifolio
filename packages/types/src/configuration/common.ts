import { z } from "zod";

/** Hex color token (#RGB or #RRGGBB). */
export const hexColorSchema = z
  .string()
  .trim()
  .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Must be a hex color (#RGB or #RRGGBB)");

export const optionalEmailSchema = z
  .string()
  .trim()
  .email("Invalid email")
  .max(254)
  .optional()
  .or(z.literal("").transform(() => undefined));

export const optionalUrlSchema = z
  .string()
  .trim()
  .url("Invalid URL")
  .max(2048)
  .optional()
  .or(z.literal("").transform(() => undefined));

export const optionalPhoneSchema = z
  .string()
  .trim()
  .max(32)
  .optional()
  .or(z.literal("").transform(() => undefined));

export const optionalStringSchema = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal("").transform(() => undefined));

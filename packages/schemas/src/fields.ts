import { z } from "zod";

/**
 * Field-level validation primitives — the single vocabulary every form in
 * every app builds from. Compose these into form schemas; never re-declare
 * an email/password/phone rule inline in an app.
 *
 * Error messages live here so they are consistent platform-wide and can be
 * localized in one place later.
 */

export const emailField = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address");

export const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters");

export const nameField = z
  .string()
  .trim()
  .min(2, "Enter your full name")
  .max(100, "Name is too long");

/** Optional phone — permissive E.164-ish; real normalization happens server-side. */
export const phoneField = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s\-()]{7,20}$/, "Enter a valid phone number")
  .optional()
  .or(z.literal(""));

export const messageField = z
  .string()
  .trim()
  .max(2000, "Message is too long (max 2000 characters)")
  .optional()
  .or(z.literal(""));

/** A required non-empty selection (selects, radios). */
export const requiredChoice = (message = "Select an option") =>
  z.string().min(1, message);

/** ISO date string from `<input type="date">`, must parse to a real date. */
export const dateField = z
  .string()
  .min(1, "Date is required")
  .refine((v) => !Number.isNaN(Date.parse(v)), "Enter a valid date");

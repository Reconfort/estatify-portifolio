import { z } from "zod";

/** Normalized email — trimmed + lowercased so uniqueness is case-insensitive. */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address")
  .max(254);

/**
 * Password policy: length-first (NIST/OWASP guidance). 12–128 chars. We do not
 * enforce composition rules — length + a breached-password check (later) beats
 * arbitrary symbol requirements.
 */
export const passwordSchema = z
  .string()
  .min(12, "Use at least 12 characters")
  .max(128, "Password is too long");

/** Reserved subdomains that cannot be a tenant slug. */
export const RESERVED_SLUGS = [
  "www",
  "api",
  "app",
  "admin",
  "workspace",
  "platform",
  "sites",
  "mail",
  "static",
  "assets",
  "cdn",
  "status",
  "help",
  "support",
] as const;

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "At least 3 characters")
  .max(40, "At most 40 characters")
  .regex(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/, "Lowercase letters, numbers, and hyphens only")
  .refine((s) => !RESERVED_SLUGS.includes(s as (typeof RESERVED_SLUGS)[number]), {
    message: "That subdomain is reserved",
  });

/** POST /auth/register — creates a new agency (tenant) + its owner. */
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  agencyName: z.string().trim().min(2, "Agency name is too short").max(120),
  slug: slugSchema,
});
export type RegisterInput = z.infer<typeof registerSchema>;

/** Which product surface is requesting login — enforced server-side. */
export const authPortalSchema = z.enum(["workspace", "platform"]);
export type AuthPortal = z.infer<typeof authPortalSchema>;

/** POST /auth/login — do NOT apply the full password policy to existing creds. */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
  /** Required: staff may only use platform; agency users may only use workspace. */
  portal: authPortalSchema,
});
export type LoginInput = z.infer<typeof loginSchema>;

/** POST /auth/forgot-password */
export const forgotPasswordSchema = z.object({ email: emailSchema });
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/** POST /auth/reset-password */
export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: passwordSchema,
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/** GET /auth/verify-email?token=… and POST /auth/resend-verification */
export const verifyEmailSchema = z.object({ token: z.string().min(1) });
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

export const resendVerificationSchema = z.object({ email: emailSchema });
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;

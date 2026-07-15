import { createEnv } from "@estatify/config";
import { z } from "zod";

/**
 * API environment — validated at boot (fail-fast) via @estatify/config.
 * Extends the shared base schema with auth/cookie/mail/redis vars.
 */
export const env = createEnv({
  server: z.object({
    PORT: z.coerce.number().default(4000),
    DATABASE_URL: z.string().min(1),
    DATABASE_DIRECT_URL: z.string().min(1).optional(),
    REDIS_URL: z.string().url().optional(),

    JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET must be ≥32 chars"),
    JWT_ACCESS_TTL: z.string().default("15m"),
    REFRESH_TTL_DAYS: z.coerce.number().int().positive().default(30),

    COOKIE_DOMAIN: z.string().default(""),
    COOKIE_SECURE: z
      .union([z.boolean(), z.enum(["true", "false"])])
      .transform((v) => v === true || v === "true")
      .default(false),

    MAIL_PROVIDER: z.enum(["smtp", "sendgrid", "resend"]).default("smtp"),
    MAIL_FROM: z.string().default("Estatify <no-reply@estatify.com>"),
    SMTP_HOST: z.string().default("localhost"),
    SMTP_PORT: z.coerce.number().default(1025),
    SENDGRID_API_KEY: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),

    APP_WORKSPACE_URL: z.string().url().default("http://localhost:3000"),
    APP_PLATFORM_URL: z.string().url().default("http://localhost:3100"),

    STORAGE_ENDPOINT: z.string().url().optional(),
    STORAGE_BUCKET: z.string().optional(),
    STORAGE_ACCESS_KEY: z.string().optional(),
    STORAGE_SECRET_KEY: z.string().optional(),
    STORAGE_PUBLIC_URL: z.string().url().optional(),
    STORAGE_REGION: z.string().default("us-east-1"),
    STORAGE_FORCE_PATH_STYLE: z
      .union([z.boolean(), z.enum(["true", "false"])])
      .transform((v) => v === true || v === "true")
      .default(true),
  }),
  runtimeEnv: process.env,
});

export type ApiEnv = typeof env;

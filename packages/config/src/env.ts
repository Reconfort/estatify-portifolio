import { z } from "zod";

/**
 * Fail-fast, zod-validated environment loading for the Estatify monorepo.
 *
 * Design goals:
 *  - Boot MUST crash loudly (never silently `undefined`) when a required var is
 *    missing or malformed. A misconfigured env is a deploy bug, not a runtime
 *    surprise.
 *  - Server-only secrets are never exposed to the client bundle. Only vars
 *    prefixed `NEXT_PUBLIC_` are considered client-safe.
 *  - Each app composes its own schema on top of the shared base via `createEnv`.
 */

const nodeEnvSchema = z
  .enum(["development", "test", "production"])
  .default("development");

/** Vars available on the server for every app. Extend per-app as needed. */
export const baseServerSchema = z.object({
  NODE_ENV: nodeEnvSchema,
  /** Postgres/primary datastore connection string. */
  DATABASE_URL: z.string().url().optional(),
  /** Internal base URL the app uses to reach the NestJS API. */
  API_URL: z.string().url().optional(),
  /** Secret used to sign/verify auth sessions. Required in production. */
  AUTH_SECRET: z.string().min(16).optional(),
});

/** Vars that are safe to inline into the client bundle (must be NEXT_PUBLIC_*). */
export const baseClientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
});

export type ZodShape = z.ZodRawShape;

interface CreateEnvOptions<TServer extends ZodShape, TClient extends ZodShape> {
  /** App-specific server schema, merged over `baseServerSchema`. */
  server?: z.ZodObject<TServer>;
  /** App-specific client schema, merged over `baseClientSchema`. */
  client?: z.ZodObject<TClient>;
  /**
   * The raw env source. Pass an explicit object so bundlers can statically
   * replace `process.env.NEXT_PUBLIC_*`. Defaults to `process.env`.
   */
  runtimeEnv?: Record<string, string | undefined>;
  /** Escape hatch for Docker builds / linting where env is intentionally absent. */
  skipValidation?: boolean;
}

function formatIssues(source: string, error: z.ZodError): never {
  const lines = error.issues.map((i) => `  • ${i.path.join(".") || "(root)"}: ${i.message}`);
  throw new Error(
    `[@estatify/config] Invalid ${source} environment variables:\n${lines.join("\n")}\n` +
      `Fix your .env file (see .env.example) before starting the app.`,
  );
}

/**
 * Validate and return a typed, frozen env object. Throws immediately (fail-fast)
 * if anything is missing or malformed.
 */
export function createEnv<TServer extends ZodShape = {}, TClient extends ZodShape = {}>(
  opts: CreateEnvOptions<TServer, TClient> = {},
) {
  const runtimeEnv = opts.runtimeEnv ?? process.env;
  const isServer = typeof window === "undefined";

  const serverSchema = opts.server ? baseServerSchema.merge(opts.server) : baseServerSchema;
  const clientSchema = opts.client ? baseClientSchema.merge(opts.client) : baseClientSchema;

  if (opts.skipValidation || runtimeEnv.SKIP_ENV_VALIDATION === "true") {
    return runtimeEnv as unknown as z.infer<typeof serverSchema> & z.infer<typeof clientSchema>;
  }

  // Client bundle: only client vars are present; never touch server secrets.
  if (!isServer) {
    const parsed = clientSchema.safeParse(runtimeEnv);
    if (!parsed.success) formatIssues("client", parsed.error);
    return Object.freeze(parsed.data) as z.infer<typeof serverSchema> &
      z.infer<typeof clientSchema>;
  }

  const parsedServer = serverSchema.safeParse(runtimeEnv);
  if (!parsedServer.success) formatIssues("server", parsedServer.error);

  const parsedClient = clientSchema.safeParse(runtimeEnv);
  if (!parsedClient.success) formatIssues("client", parsedClient.error);

  // Production-only hard requirements that are optional in dev/test.
  if (parsedServer.data.NODE_ENV === "production" && !parsedServer.data.AUTH_SECRET) {
    throw new Error("[@estatify/config] AUTH_SECRET is required when NODE_ENV=production.");
  }

  return Object.freeze({ ...parsedServer.data, ...parsedClient.data });
}

/** Default env, validated against the shared base schemas from `process.env`. */
export const env = createEnv();

export type Env = typeof env;

import { PrismaClient } from "@prisma/client";

/**
 * Single PrismaClient for the API process. Reused across hot reloads in dev to
 * avoid exhausting Postgres connections. API-ONLY — frontends never import this
 * (enforced by Nx module boundaries: scope:api).
 */
const globalForPrisma = globalThis as unknown as { __estatifyPrisma?: PrismaClient };

export const prisma =
  globalForPrisma.__estatifyPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__estatifyPrisma = prisma;
}

export type { PrismaClient };

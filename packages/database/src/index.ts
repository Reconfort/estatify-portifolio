/**
 * @estatify/database
 * Prisma schema + client. API-ONLY — frontends must never import this
 * (enforced by Nx module boundaries: scope:api, type:data-access).
 */
export { prisma, type PrismaClient } from "./client";
export { withTenant, withUser, asPlatform, type TenantTx, type Prisma } from "./tenant";

// Re-export generated enums + model types so the API imports them from one place.
export { TenantStatus, MembershipRole, PlatformRole } from "@prisma/client";
export type {
  Tenant,
  Agency,
  User,
  Membership,
  Session,
  VerificationToken,
  PasswordResetToken,
  Invite,
} from "@prisma/client";

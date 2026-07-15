/**
 * @estatify/database
 * Prisma schema + client. API-ONLY — frontends must never import this
 * (enforced by Nx module boundaries: scope:api, type:data-access).
 */
export { prisma, type PrismaClient } from "./client";
export {
  withTenant,
  withUser,
  withPlatform,
  asPlatform,
  type TenantTx,
  type Prisma,
} from "./tenant";

export { syncRbac, attachStaff } from "./rbac-seed";

// Re-export generated enums + model types so the API imports them from one place.
export {
  TenantStatus,
  MembershipRole,
  PlatformRole,
  TenantPlan,
  StaffDepartment,
  StaffStatus,
  UserStatus,
  MediaCategory,
} from "@prisma/client";
export type {
  Tenant,
  Agency,
  AgencyConfiguration,
  MediaAsset,
  TenantPreference,
  User,
  Membership,
  Session,
  VerificationToken,
  PasswordResetToken,
  Invite,
  Permission,
  Role,
  RolePermission,
  StaffProfile,
} from "@prisma/client";

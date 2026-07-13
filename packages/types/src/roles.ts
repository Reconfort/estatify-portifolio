import { z } from "zod";

/** Tenant-scoped roles (on Membership). Mirror of the Prisma MembershipRole enum. */
export const membershipRoleSchema = z.enum(["owner", "admin", "agent", "member"]);
export type MembershipRole = z.infer<typeof membershipRoleSchema>;

/** Platform-staff roles (on User). Mirror of the Prisma PlatformRole enum. */
export const platformRoleSchema = z.enum(["none", "support", "superadmin"]);
export type PlatformRole = z.infer<typeof platformRoleSchema>;

/** Higher number = more privilege. Used for `hasAtLeast` checks. */
export const ROLE_RANK: Record<MembershipRole, number> = {
  member: 0,
  agent: 1,
  admin: 2,
  owner: 3,
};

/** True if `role` is at least as privileged as `required`. */
export function hasAtLeast(role: MembershipRole, required: MembershipRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[required];
}

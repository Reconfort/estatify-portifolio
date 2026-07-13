import { z } from "zod";
import { membershipRoleSchema, platformRoleSchema } from "./roles";

/** Decoded access-JWT payload. `tid` = active tenant; null for platform-only users. */
export interface AccessTokenPayload {
  sub: string; // user id
  tid: string | null; // active tenant id
  role: z.infer<typeof membershipRoleSchema> | null;
  typ: "access";
  iat?: number;
  exp?: number;
}

/**
 * A tenant the user belongs to, with their role in it. `agencyName` is resolved
 * only for the ACTIVE tenant (Agency is tenant-RLS-scoped); for other tenants in
 * the switcher it is null and the slug is used as the label.
 *
 * Defined as a zod schema so it doubles as the OpenAPI/Swagger response schema
 * (single source of truth — the docs can't drift from the type).
 */
export const tenantMembershipViewSchema = z.object({
  tenantId: z.string().uuid(),
  slug: z.string(),
  agencyName: z.string().nullable(),
  role: membershipRoleSchema,
});
export type TenantMembershipView = z.infer<typeof tenantMembershipViewSchema>;

/** GET /auth/me — the authenticated user + their tenant context. */
export const authUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  isPlatformStaff: z.boolean(),
  platformRole: platformRoleSchema,
  activeTenant: tenantMembershipViewSchema.nullable(),
  memberships: z.array(tenantMembershipViewSchema),
});
export type AuthUser = z.infer<typeof authUserSchema>;

/** Body returned by login/register/refresh. Refresh token is NOT here — it is an httpOnly cookie. */
export const authTokensSchema = z.object({
  accessToken: z.string(),
  expiresIn: z.number().int().describe("seconds until the access token expires"),
  user: authUserSchema,
});
export type AuthTokens = z.infer<typeof authTokensSchema>;

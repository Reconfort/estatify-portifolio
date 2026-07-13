/**
 * @estatify/auth
 * Client session/token handling + RBAC guard primitives.
 * Server enforcement lives in apps/api — these are cosmetic UI gates only.
 *
 * Tags: scope:shared, type:data-access
 */
export { SessionProvider, useSession, type SessionStatus } from "./session";
export { TenantProvider, useTenant } from "./tenant";
export { hasRole, hasPlatformRole, RequireRole, RequireAuth } from "./rbac";

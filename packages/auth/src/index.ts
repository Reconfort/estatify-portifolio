/**
 * @estatify/auth — client-safe barrel.
 * Route protection lives in `@estatify/auth/proxy` (next/server) and must not
 * be re-exported here, or Client Components will 500.
 *
 * Tags: scope:shared, type:data-access
 */
export { SessionProvider, useSession, type SessionStatus } from "./session";
export { TenantProvider, useTenant } from "./tenant";
export { hasRole, hasPlatformRole, RequireRole, RequireAuth } from "./rbac";
export {
  WORKSPACE_GUEST_ROUTES,
  PLATFORM_GUEST_ROUTES,
  DASHBOARD_PATH,
  authProxyMatcher,
} from "./constants";

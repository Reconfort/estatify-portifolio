/**
 * Server/edge-only entry for Next.js proxy.ts.
 * Do not import this from Client Components.
 */
export {
  WORKSPACE_GUEST_ROUTES,
  PLATFORM_GUEST_ROUTES,
  DASHBOARD_PATH,
  ONBOARDING_PATH,
  authProxyMatcher,
} from "./constants";
export { protectRoutes, type AuthAppKind, type ProtectRoutesOptions } from "./route-protection";

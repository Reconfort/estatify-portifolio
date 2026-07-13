/**
 * Shared auth routing constants — safe for client and server bundles.
 * Keep free of next/server imports.
 */
export const WORKSPACE_GUEST_ROUTES = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/login", // legacy
  "/register", // legacy
] as const;

export const PLATFORM_GUEST_ROUTES = ["/login"] as const;

export const DASHBOARD_PATH = "/dashboard";

/** Shared matcher — skip static assets and Next internals. */
export const authProxyMatcher = [
  "/((?!api|_next/static|_next/image|_next/data|favicon.ico|sitemap.xml|robots.txt|assets/|.*\\..*).*)",
];

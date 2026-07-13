import type { NextRequest } from "next/server";
import { protectRoutes, WORKSPACE_GUEST_ROUTES, DASHBOARD_PATH } from "@estatify/auth/proxy";

/**
 * Workspace route protection — guest-only auth pages + protected SaaS area.
 * Session is validated against the API before any protected page renders.
 */
export async function proxy(request: NextRequest) {
  return protectRoutes(request, {
    app: "workspace",
    guestRoutes: WORKSPACE_GUEST_ROUTES,
    signInPath: "/sign-in",
    dashboardPath: DASHBOARD_PATH,
    foreignAppUrl: process.env.NEXT_PUBLIC_PLATFORM_URL || "http://localhost:3100",
  });
}

// Matcher must be a static literal — Next parses it at compile time.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|_next/data|favicon.ico|sitemap.xml|robots.txt).*)"],
};

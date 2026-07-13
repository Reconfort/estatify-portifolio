import type { NextRequest } from "next/server";
import { protectRoutes, PLATFORM_GUEST_ROUTES, DASHBOARD_PATH } from "@estatify/auth/proxy";

/**
 * Platform route protection — staff-only. Customers are redirected to Workspace.
 */
export async function proxy(request: NextRequest) {
  return protectRoutes(request, {
    app: "platform",
    guestRoutes: PLATFORM_GUEST_ROUTES,
    signInPath: "/login",
    dashboardPath: DASHBOARD_PATH,
    allowAuthenticatedPublicRoutes: ["/forbidden"],
    foreignAppUrl: process.env.NEXT_PUBLIC_WORKSPACE_URL || "http://localhost:3000",
  });
}

// Matcher must be a static literal — Next parses it at compile time.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|_next/data|favicon.ico|sitemap.xml|robots.txt).*)"],
};

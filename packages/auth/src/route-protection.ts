/**
 * Centralized Next.js Proxy route protection.
 * Import ONLY from `@estatify/auth/proxy` — never from the client barrel.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { AuthTokens } from "@estatify/types";
import { DASHBOARD_PATH } from "./constants";

export type AuthAppKind = "workspace" | "platform";

export type ProtectRoutesOptions = {
  app: AuthAppKind;
  guestRoutes: readonly string[];
  signInPath: string;
  dashboardPath?: string;
  foreignAppUrl?: string;
  allowAuthenticatedPublicRoutes?: readonly string[];
  apiUrl?: string;
  refreshCookieName?: string;
};

function matchesPath(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}/`);
}

function isGuestRoute(pathname: string, guestRoutes: readonly string[]): boolean {
  return guestRoutes.some((route) => matchesPath(pathname, route));
}

function isAllowlistedPublic(pathname: string, allowlist: readonly string[] | undefined): boolean {
  if (!allowlist?.length) return false;
  return allowlist.some((route) => matchesPath(pathname, route));
}

/** Reject open redirects and internal Next asset paths as post-login destinations. */
function safeCallbackPath(pathname: string, dashboardPath: string): string | null {
  if (pathname === "/" || pathname === dashboardPath) return null;
  if (pathname.startsWith("//")) return null;
  if (pathname.startsWith("/_next")) return null;
  if (pathname.startsWith("/api")) return null;
  if (pathname.includes(".")) {
    // Static files (.js, .css, images) are never valid app destinations.
    const last = pathname.split("/").pop() ?? "";
    if (last.includes(".")) return null;
  }
  return pathname;
}

function foreignDashboardUrl(foreignAppUrl: string, dashboardPath: string): string {
  const base = foreignAppUrl.replace(/\/$/, "");
  return `${base}${dashboardPath}`;
}

function withSessionHeaders(
  request: NextRequest,
  tokens: AuthTokens,
  setCookieHeader: string | null,
): NextResponse {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("Authorization", `Bearer ${tokens.accessToken}`);
  requestHeaders.set("x-user", JSON.stringify(tokens.user));

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (setCookieHeader) {
    response.headers.set("set-cookie", setCookieHeader);
  }

  return response;
}

function clearRefreshAnd(response: NextResponse, cookieName: string): NextResponse {
  response.cookies.delete(cookieName);
  return response;
}

/**
 * Edge/proxy auth gate. Validates the refresh session against the API before
 * any protected page renders. Guest-only routes never render for authenticated users.
 */
export async function protectRoutes(
  request: NextRequest,
  options: ProtectRoutesOptions,
): Promise<NextResponse> {
  const {
    app,
    guestRoutes,
    signInPath,
    dashboardPath = DASHBOARD_PATH,
    foreignAppUrl,
    allowAuthenticatedPublicRoutes,
    apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
    refreshCookieName = "refresh_token",
  } = options;

  const { pathname } = request.nextUrl;

  // Hard skip for Next internals that slip past the matcher.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt"
  ) {
    return NextResponse.next();
  }

  const guest = isGuestRoute(pathname, guestRoutes);
  const allowPublic = isAllowlistedPublic(pathname, allowAuthenticatedPublicRoutes);
  const refreshToken = request.cookies.get(refreshCookieName)?.value;

  const shouldCanonicalizeRoot = pathname === "/" && Boolean(refreshToken);

  if (!refreshToken) {
    if (guest || allowPublic) {
      return NextResponse.next();
    }
    const loginUrl = new URL(signInPath, request.url);
    const callback = safeCallbackPath(pathname, dashboardPath);
    if (callback) {
      loginUrl.searchParams.set("callbackUrl", callback);
    }
    return NextResponse.redirect(loginUrl);
  }

  const isPrefetch =
    request.headers.get("next-router-prefetch") || request.headers.get("purpose") === "prefetch";

  if (isPrefetch) {
    if (guest) {
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }
    if (shouldCanonicalizeRoot) {
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }
    return NextResponse.next();
  }

  try {
    const res = await fetch(`${apiUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        Cookie: `${refreshCookieName}=${refreshToken}`,
      },
    });

    if (!res.ok) {
      const response =
        guest || allowPublic
          ? NextResponse.next()
          : NextResponse.redirect(new URL(signInPath, request.url));
      return clearRefreshAnd(response, refreshCookieName);
    }

    const data = (await res.json()) as AuthTokens;
    const setCookie = res.headers.get("set-cookie");

    if (app === "platform" && !data.user.isPlatformStaff) {
      if (foreignAppUrl) {
        const response = NextResponse.redirect(foreignDashboardUrl(foreignAppUrl, dashboardPath));
        if (setCookie) response.headers.set("set-cookie", setCookie);
        return response;
      }
      if (!matchesPath(pathname, "/forbidden")) {
        return NextResponse.redirect(new URL("/forbidden", request.url));
      }
      return withSessionHeaders(request, data, setCookie);
    }

    if (app === "workspace" && data.user.isPlatformStaff) {
      if (foreignAppUrl) {
        const response = NextResponse.redirect(foreignDashboardUrl(foreignAppUrl, dashboardPath));
        if (setCookie) response.headers.set("set-cookie", setCookie);
        return response;
      }
    }

    if (guest) {
      const response = NextResponse.redirect(new URL(dashboardPath, request.url));
      if (setCookie) response.headers.set("set-cookie", setCookie);
      return response;
    }

    if (shouldCanonicalizeRoot) {
      const response = NextResponse.redirect(new URL(dashboardPath, request.url));
      if (setCookie) response.headers.set("set-cookie", setCookie);
      return response;
    }

    return withSessionHeaders(request, data, setCookie);
  } catch (error) {
    console.error(`[${app}] auth proxy verification failed:`, error);
    if (guest || allowPublic) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(signInPath, request.url));
  }
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public auth-related routes for platform staff
const PUBLIC_ROUTES = ["/login", "/forbidden"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // 1. Unauthenticated state
  if (!refreshToken) {
    if (!isPublicRoute) {
      const loginUrl = new URL("/login", request.url);
      if (pathname !== "/") {
        loginUrl.searchParams.set("callbackUrl", pathname);
      }
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2. Authenticated check - skip full verification check for background prefetch requests
  const isPrefetch =
    request.headers.get("next-router-prefetch") || request.headers.get("purpose") === "prefetch";

  if (isPrefetch) {
    if (isPublicRoute && pathname !== "/forbidden") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 3. Full verification (initial page loads or document requests)
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const res = await fetch(`${apiUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        Cookie: `refresh_token=${refreshToken}`,
      },
    });

    if (res.ok) {
      const data = await res.json(); // returns AuthTokens: { accessToken, expiresIn, user }

      // SECURITY seam: platform app is strictly for platform staff
      if (!data.user.isPlatformStaff) {
        // Redirect standard users to forbidden page
        if (pathname !== "/forbidden") {
          return NextResponse.redirect(new URL("/forbidden", request.url));
        }
        return NextResponse.next();
      }

      // Authenticated staff member trying to load login page -> redirect to dashboard
      if (isPublicRoute && pathname !== "/forbidden") {
        return NextResponse.redirect(new URL("/", request.url));
      }

      // Propagate validated session metadata to Next.js Server Components
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("Authorization", `Bearer ${data.accessToken}`);
      requestHeaders.set("x-user", JSON.stringify(data.user));

      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      // Forward rotated refresh token cookie to the client browser
      const setCookieHeader = res.headers.get("set-cookie");
      if (setCookieHeader) {
        response.headers.set("set-cookie", setCookieHeader);
      }

      return response;
    } else {
      // Refresh token expired or invalid -> delete cookie and redirect
      const response = isPublicRoute
        ? NextResponse.next()
        : NextResponse.redirect(new URL("/login", request.url));

      response.cookies.delete("refresh_token");
      return response;
    }
  } catch (error) {
    console.error("Platform proxy verification failed:", error);
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Apply proxy to all routes except public API endpoints, static assets, and favicon
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

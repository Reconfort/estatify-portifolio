import { NextResponse, type NextRequest } from "next/server";
// import { resolveTenantByHost } from "@estatify/feature-tenant-runtime";

/**
 * Sites runtime entry point. Every request: host -> tenant -> theme/template.
 * Tenant lookup MUST be cache-backed (Redis/edge) — it is on the hot path.
 */
export async function middleware(req: NextRequest) {
  const host = req.headers.get("host")?.split(":")[0] ?? "";
  // const tenant = await resolveTenantByHost(host);
  // if (!tenant) return NextResponse.rewrite(new URL("/404", req.url));
  const res = NextResponse.next();
  res.headers.set("x-tenant-host", host); // downstream RSC reads tenant context
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

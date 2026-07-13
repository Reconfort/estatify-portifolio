"use client";

import type { ReactNode } from "react";
import type { AuthUser, MembershipRole, PlatformRole } from "@estatify/types";
import { hasAtLeast } from "@estatify/types";
import { useSession } from "./session";

/** Cosmetic client check — the API is the real enforcement point. */
export function hasRole(user: AuthUser | null | undefined, required: MembershipRole): boolean {
  const role = user?.activeTenant?.role;
  if (!role) return false;
  return hasAtLeast(role, required);
}

/** Cosmetic client check for platform staff apps. */
export function hasPlatformRole(
  user: AuthUser | null | undefined,
  required: PlatformRole,
): boolean {
  if (!user?.isPlatformStaff) return false;
  switch (required) {
    case "none":
      return true;
    case "support":
      return user.platformRole === "support" || user.platformRole === "superadmin";
    case "superadmin":
      return user.platformRole === "superadmin";
    default: {
      const _exhaustive: never = required;
      return _exhaustive;
    }
  }
}

/**
 * Conditionally render children when the active tenant role is high enough.
 * UI-only — never a security boundary.
 */
export function RequireRole({
  role,
  children,
  fallback = null,
}: {
  role: MembershipRole;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { user, status } = useSession();
  if (status === "loading") return fallback;
  if (!hasRole(user, role)) return fallback;
  return children;
}

/**
 * Conditionally render children when a session is authenticated.
 * UI-only — route protection belongs in protectRoutes (app proxy.ts).
 */
export function RequireAuth({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { status } = useSession();
  if (status !== "authenticated") return fallback;
  return children;
}

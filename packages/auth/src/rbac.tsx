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

/** Cosmetic client check for a platform permission key (e.g. "tenant.create"). */
export function hasPermission(user: AuthUser | null | undefined, permission: string): boolean {
  return Boolean(user?.platformPermissions?.includes(permission));
}

/** Hook returning a `can(permission)` predicate for the current session. */
export function usePermissions(): { can: (permission: string) => boolean } {
  const { user } = useSession();
  return { can: (permission: string) => hasPermission(user, permission) };
}

/** Conditionally render children when the staff user holds `permission`. UI-only. */
export function RequirePermission({
  permission,
  children,
  fallback = null,
}: {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { user, status } = useSession();
  if (status === "loading") return fallback;
  if (!hasPermission(user, permission)) return fallback;
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

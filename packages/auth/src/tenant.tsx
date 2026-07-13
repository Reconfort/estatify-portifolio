"use client";

import * as React from "react";
import type { TenantMembershipView } from "@estatify/types";
import { useSession } from "./session";

interface TenantValue {
  /** Active tenant from the validated session JWT /auth/me — never from user input. */
  activeTenant: TenantMembershipView | null;
  memberships: TenantMembershipView[];
}

const TenantContext = React.createContext<TenantValue | null>(null);

/**
 * TenantProvider — hydrated from SessionProvider's /auth/me user.
 * Apps never invent a tenant id; switching tenants requires a re-issued access
 * token (API) and is wired in a later phase.
 */
export function TenantProvider({ children }: { children: React.ReactNode }) {
  const { user } = useSession();

  const value = React.useMemo<TenantValue>(
    () => ({
      activeTenant: user?.activeTenant ?? null,
      memberships: user?.memberships ?? [],
    }),
    [user],
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant(): TenantValue {
  const ctx = React.useContext(TenantContext);
  if (!ctx) throw new Error("useTenant must be used within <TenantProvider>");
  return ctx;
}

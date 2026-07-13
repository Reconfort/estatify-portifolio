"use client";

import type { ReactNode } from "react";
import { SessionProvider, TenantProvider } from "@estatify/auth";
import { QueryProvider } from "@estatify/providers";
import type { AuthUser } from "@estatify/types";

interface ProvidersProps {
  children: ReactNode;
  initialUser?: AuthUser | null;
  initialAccessToken?: string | null;
}

/** Platform provider stack: Query → Session → Tenant. */
export function Providers({
  children,
  initialUser = null,
  initialAccessToken = null,
}: ProvidersProps) {
  return (
    <QueryProvider>
      <SessionProvider initialUser={initialUser} initialAccessToken={initialAccessToken}>
        <TenantProvider>{children}</TenantProvider>
      </SessionProvider>
    </QueryProvider>
  );
}

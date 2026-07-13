"use client";

import * as React from "react";
import type { AuthTokens, AuthUser } from "@estatify/types";
import {
  AUTH_EXPIRED_EVENT,
  authApi,
  clearAccessToken,
  setAccessToken,
} from "@estatify/api-client";

export type SessionStatus = "loading" | "authenticated" | "unauthenticated";

interface SessionValue {
  user: AuthUser | null;
  status: SessionStatus;
  /** Adopt the tokens returned by login/register (sets access token + user). */
  setAuth: (tokens: AuthTokens) => void;
  /** Re-mint the access token from the refresh cookie and reload the user. */
  reload: () => Promise<void>;
  signOut: () => Promise<void>;
}

const SessionContext = React.createContext<SessionValue | null>(null);

/**
 * SessionProvider — the client's source of truth for "who is signed in".
 * On mount it silently calls /auth/refresh (using the httpOnly cookie) to
 * restore the session after a reload, since the access token lives only in
 * memory. Data-access layer (not UI): it owns token + user state.
 */
interface SessionProviderProps {
  children: React.ReactNode;
  initialUser?: AuthUser | null;
  initialAccessToken?: string | null;
}

/**
 * SessionProvider — the client's source of truth for "who is signed in".
 * On mount it silently calls /auth/refresh (using the httpOnly cookie) to
 * restore the session after a reload, since the access token lives only in
 * memory. Data-access layer (not UI): it owns token + user state.
 *
 * Supports server-side hydration (initialUser + initialAccessToken) to avoid
 * duplicate requests when authed by Next server-side.
 */
export function SessionProvider({
  children,
  initialUser = null,
  initialAccessToken = null,
}: SessionProviderProps) {
  const [user, setUser] = React.useState<AuthUser | null>(initialUser);
  const [status, setStatus] = React.useState<SessionStatus>(
    initialUser ? "authenticated" : "loading",
  );

  React.useEffect(() => {
    if (initialUser && initialAccessToken) {
      setAccessToken(initialAccessToken);
    }
  }, [initialUser, initialAccessToken]);

  const setAuth = React.useCallback((tokens: AuthTokens) => {
    setAccessToken(tokens.accessToken);
    setUser(tokens.user);
    setStatus("authenticated");
  }, []);

  const reload = React.useCallback(async () => {
    try {
      const tokens = await authApi.refresh();
      setAccessToken(tokens.accessToken);
      setUser(tokens.user);
      setStatus("authenticated");
    } catch {
      clearAccessToken();
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  const signOut = React.useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Always clear local state even if the network call fails.
    } finally {
      clearAccessToken();
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  // Bootstrap from the httpOnly refresh cookie after a full page load.
  React.useEffect(() => {
    if (initialUser && initialAccessToken) {
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const tokens = await authApi.refresh();
        if (cancelled) return;
        setAccessToken(tokens.accessToken);
        setUser(tokens.user);
        setStatus("authenticated");
      } catch {
        if (cancelled) return;
        clearAccessToken();
        setUser(null);
        setStatus("unauthenticated");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initialUser, initialAccessToken]);

  // Hard-invalidation: a request was rejected and refresh was refused (account or
  // tenant suspended server-side). Clear session and bounce to the sign-in page.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const onExpired = () => {
      clearAccessToken();
      setUser(null);
      setStatus("unauthenticated");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.assign("/login?reason=session_expired");
      }
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
  }, []);

  const value = React.useMemo<SessionValue>(
    () => ({ user, status, setAuth, reload, signOut }),
    [user, status, setAuth, reload, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const ctx = React.useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within <SessionProvider>");
  return ctx;
}

import { API_URL } from "./config";
import { ApiError, type FieldErrors } from "./errors";
import { clearAccessToken, getAccessToken, setAccessToken } from "./token-store";

interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** false = don't attach bearer / don't auto-refresh (auth endpoints themselves). */
  auth?: boolean;
}

/** Fired on window when a session is hard-invalidated (refresh refused). */
export const AUTH_EXPIRED_EVENT = "estatify:auth-expired";

// Single-flight refresh: many parallel 401s trigger exactly one /auth/refresh.
let refreshInFlight: Promise<boolean> | null = null;

/**
 * Re-mint the access token from the httpOnly refresh cookie.
 * Returns true when a new access token was stored.
 */
export function refreshOnce(): Promise<boolean> {
  refreshInFlight ??= fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  })
    .then(async (res) => {
      if (!res.ok) return false;
      const data = (await res.json()) as { accessToken?: string };
      if (data.accessToken) {
        setAccessToken(data.accessToken);
        return true;
      }
      return false;
    })
    .catch(() => false)
    .finally(() => {
      refreshInFlight = null;
    });
  return refreshInFlight;
}

async function parse<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  const body = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const fieldErrors: FieldErrors | undefined = Array.isArray(body?.errors)
      ? Object.fromEntries(
          body.errors.map((e: { path: string; message: string }) => [e.path, e.message]),
        )
      : undefined;
    const message = Array.isArray(body?.message)
      ? body.message.join(", ")
      : (body?.message ?? res.statusText);
    throw new ApiError(res.status, message, fieldErrors);
  }
  return body as T;
}

/** The single fetch entry point for the platform. Handles auth + silent refresh. */
export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { auth = true, body, headers, ...rest } = options;

  const run = (): Promise<Response> =>
    fetch(`${API_URL}${path}`, {
      ...rest,
      credentials: "include",
      headers: {
        "content-type": "application/json",
        ...(auth && getAccessToken() ? { authorization: `Bearer ${getAccessToken()}` } : {}),
        ...headers,
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

  let res = await run();

  // Access token expired (or missing in memory) — try the refresh cookie once, then retry.
  if (res.status === 401 && auth) {
    const ok = await refreshOnce();
    if (ok) {
      res = await run();
    } else {
      // Refresh refused (e.g. account/tenant suspended server-side). Clear the
      // token and broadcast so the SessionProvider clears + redirects to login.
      clearAccessToken();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
      }
    }
  }

  return parse<T>(res);
}

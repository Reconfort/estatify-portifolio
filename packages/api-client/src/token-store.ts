/**
 * In-memory access token. Deliberately NOT persisted to localStorage — an XSS
 * read of a persisted token is a full account takeover. The refresh token lives
 * in an httpOnly cookie the JS can't read; on reload we silently re-mint the
 * access token from it (see SessionProvider bootstrap).
 */
let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}
export function getAccessToken(): string | null {
  return accessToken;
}
export function clearAccessToken(): void {
  accessToken = null;
}

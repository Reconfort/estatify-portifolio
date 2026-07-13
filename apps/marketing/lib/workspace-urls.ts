/**
 * Cross-app URLs — marketing never hosts auth; it only redirects into Workspace.
 * Prod: workspace.estatify.africa · Dev: localhost:3000
 */
export const WORKSPACE_URL =
  process.env.NEXT_PUBLIC_WORKSPACE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const workspaceSignInUrl = (callbackUrl?: string) => {
  const url = new URL("/sign-in", WORKSPACE_URL);
  if (callbackUrl) url.searchParams.set("callbackUrl", callbackUrl);
  return url.toString();
};

export const workspaceSignUpUrl = () => new URL("/sign-up", WORKSPACE_URL).toString();

/**
 * Cross-app URLs — Workspace may send users back to the public marketing site.
 * Prod: estatify.africa · Dev: localhost:3200
 */
export const MARKETING_URL =
  process.env.NEXT_PUBLIC_MARKETING_URL?.replace(/\/$/, "") || "http://localhost:3200";

export const marketingHomeUrl = () => MARKETING_URL;

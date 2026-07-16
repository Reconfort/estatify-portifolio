function formatRelativeTime(iso: string | null): string {
  if (!iso) return "Never";
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  return date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

/** Public site URL for links (published custom domain or platform subdomain). */
export function websiteVisitUrl(
  agencySlug: string | undefined,
  primaryDomain: string | null | undefined,
  isPublished: boolean,
): string | null {
  if (isPublished && primaryDomain) {
    return `https://${primaryDomain}`;
  }
  if (!agencySlug) return null;

  const sitesBase = process.env.NEXT_PUBLIC_SITES_URL ?? "http://localhost:3300";
  try {
    const base = new URL(sitesBase);
    if (base.hostname === "localhost") {
      return `http://${agencySlug}.localhost:${base.port || "3300"}`;
    }
    return `https://${agencySlug}.estatify.site`;
  } catch {
    return `https://${agencySlug}.estatify.site`;
  }
}

export function websiteDisplayHost(
  agencySlug: string | undefined,
  primaryDomain: string | null | undefined,
): string {
  if (primaryDomain) return primaryDomain;
  if (!agencySlug) return "—";

  const sitesBase = process.env.NEXT_PUBLIC_SITES_URL ?? "http://localhost:3300";
  try {
    const base = new URL(sitesBase);
    if (base.hostname === "localhost") {
      return `${agencySlug}.localhost:${base.port || "3300"}`;
    }
    return `${agencySlug}.estatify.site`;
  } catch {
    return `${agencySlug}.estatify.site`;
  }
}

export function seoScoreFromReadiness(rules: { module: string; status: string }[]): number {
  const seoRule = rules.find((r) => r.module === "seo");
  if (seoRule?.status === "complete") return 84;
  if (seoRule?.status === "warning") return 62;
  return 40;
}

export { formatRelativeTime };

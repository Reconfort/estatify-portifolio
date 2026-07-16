import type { SectionType } from "@estatify/types";

const SECTION_LABELS: Record<SectionType, string> = {
  hero: "Hero",
  "featured-properties": "Featured Properties",
  cta: "CTA",
  footer: "Footer",
};

export function sectionLabel(type: SectionType): string {
  return SECTION_LABELS[type];
}

const TEMPLATE_LABELS: Record<string, string> = {
  "modern-horizon": "Modern Horizon",
};

export function templateLabel(templateId: string | null): string {
  if (!templateId) return "Default";
  return TEMPLATE_LABELS[templateId] ?? templateId;
}

export function platformSiteUrl(slug: string | null): string {
  if (!slug) return "";
  const sitesBase = process.env.NEXT_PUBLIC_SITES_URL ?? "http://localhost:3300";
  try {
    const url = new URL(sitesBase);
    if (url.hostname === "localhost") {
      return `http://${slug}.localhost:3300`;
    }
    return `https://${slug}.estatify.site`;
  } catch {
    return `https://${slug}.estatify.site`;
  }
}

export function formatRelativeTime(iso: string | null): string {
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

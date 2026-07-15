import { defaultBrandIdentity } from "@estatify/types";
import type { ReadinessInput } from "./evaluate-input";
import type { ReadinessRule } from "./types";

export function evaluateProfileRule(input: ReadinessInput): ReadinessRule {
  const { profile } = input.draft;
  const done = Boolean(
    profile.basic.companyName?.trim() &&
    profile.contact.primaryEmail?.trim() &&
    profile.address.city?.trim(),
  );
  return {
    id: "profile",
    module: "profile",
    label: "Agency profile",
    status: done ? "complete" : "warning",
    message: done ? "Complete" : "Add company name, email, and city",
    weight: 15,
    action: { label: "Edit profile", tab: "profile" },
  };
}

export function evaluateBrandRule(input: ReadinessInput): ReadinessRule {
  const { brand } = input.draft;
  const hasLogo = Boolean(input.media.logo);
  const customized =
    brand.colors.primary !== defaultBrandIdentity.colors.primary ||
    brand.colors.accent !== defaultBrandIdentity.colors.accent ||
    brand.typography.primaryFont !== defaultBrandIdentity.typography.primaryFont;
  const done = hasLogo || customized;
  return {
    id: "brand",
    module: "brand",
    label: "Branding",
    status: done ? "complete" : "warning",
    message: done ? "Complete" : "Upload a logo or customize brand colors",
    weight: 15,
    action: { label: "Edit brand", tab: "brand" },
  };
}

export function evaluateSettingsRule(input: ReadinessInput): ReadinessRule {
  const { website } = input.draft;
  const done = Boolean(
    website.general.websiteTagline?.trim() || website.contact.websiteEmail?.trim(),
  );
  return {
    id: "settings",
    module: "settings",
    label: "Website settings",
    status: done ? "complete" : "warning",
    message: done ? "Complete" : "Add a tagline or public contact email",
    weight: 10,
    action: { label: "Edit settings", tab: "settings" },
  };
}

export function evaluateSeoRule(input: ReadinessInput): ReadinessRule {
  const { seo } = input.draft;
  const done = Boolean(seo.metaTitle?.trim() && seo.metaDescription?.trim());
  const hasFavicon = Boolean(input.media.favicon || seo.faviconUrl?.trim());
  return {
    id: "seo",
    module: "seo",
    label: "SEO basics",
    status: done && hasFavicon ? "complete" : done ? "warning" : "warning",
    message: done
      ? hasFavicon
        ? "Complete"
        : "Add a favicon for better search appearance"
      : "Add meta title and description",
    weight: 15,
    action: { label: "Edit SEO", tab: "seo" },
  };
}

export function evaluateComposerRule(input: ReadinessInput): ReadinessRule {
  const sections = input.draft.composition.pages.home?.sections ?? [];
  const visible = sections.filter((s) => s.visible);
  const hasHero = visible.some((s) => s.type === "hero");
  const hasCta = visible.some((s) => s.type === "cta");
  const done = hasHero && hasCta && visible.length >= 2;
  return {
    id: "homepage",
    module: "composer",
    label: "Homepage",
    status: done ? "complete" : "blocked",
    message: done ? "Complete" : "Homepage needs a visible Hero and CTA section",
    weight: 20,
    action: { label: "Customize website", tab: "composer" },
  };
}

export function evaluateSubdomainRule(input: ReadinessInput): ReadinessRule {
  const slug = input.tenantSlug ?? input.draft.meta.agencySlug;
  const done = Boolean(slug?.trim());
  return {
    id: "subdomain",
    module: "domain",
    label: "Platform URL",
    status: done ? "complete" : "warning",
    message: done ? "Subdomain ready" : "Tenant slug missing",
    weight: 5,
  };
}

export function evaluateCustomDomainRule(input: ReadinessInput): ReadinessRule {
  const domain = input.primaryDomain ?? input.draft.meta.primaryDomain;
  const done = Boolean(domain?.trim());
  return {
    id: "custom-domain",
    module: "domain",
    label: "Custom domain",
    status: done ? "complete" : "warning",
    message: done ? `Connected: ${domain}` : "Not connected",
    weight: 10,
    action: { label: "Connect domain", tab: "settings" },
  };
}

export function evaluatePublishRule(input: ReadinessInput): ReadinessRule {
  const done = Boolean(input.draft.meta.publishedAt);
  return {
    id: "publish",
    module: "publish",
    label: "Published",
    status: done ? "complete" : "warning",
    message: done ? "Live version published" : "Never published",
    weight: 5,
  };
}

export function evaluateAnalyticsRule(_input: ReadinessInput): ReadinessRule {
  return {
    id: "analytics",
    module: "analytics",
    label: "Analytics",
    status: "warning",
    message: "Not connected",
    weight: 5,
    action: { label: "Set up analytics", tab: "overview" },
  };
}

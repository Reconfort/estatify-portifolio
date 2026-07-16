import type { DraftConfiguration } from "@estatify/types";

export type ReadinessStatus = "complete" | "warning" | "blocked";

export type ReadinessModule =
  "profile" | "brand" | "settings" | "seo" | "composer" | "domain" | "analytics" | "publish";

/** Tab keys used by the Website Manager UI for one-click navigation. */
export type WebsiteTab = "overview" | "profile" | "brand" | "settings" | "seo" | "composer";

export interface ReadinessRule {
  id: string;
  module: ReadinessModule;
  label: string;
  status: ReadinessStatus;
  message: string;
  /** Weight toward the readiness score (0–1 contribution when complete). */
  weight: number;
  actionTab?: WebsiteTab;
  fixLabel?: string;
}

export interface ReadinessContext {
  draft: DraftConfiguration;
  agencySlug?: string;
  primaryDomain?: string | null;
  hasLogo?: boolean;
  hasFavicon?: boolean;
}

export interface ReadinessResult {
  score: number;
  rules: ReadinessRule[];
  completeCount: number;
  warningCount: number;
  blockedCount: number;
  blockers: ReadinessRule[];
  warnings: ReadinessRule[];
}

export type ReadinessEvaluator = (ctx: ReadinessContext) => ReadinessRule;

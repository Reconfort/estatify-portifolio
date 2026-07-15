/** Tabs the Website Manager shell can navigate to from readiness actions. */
export type WebsiteTabKey = "overview" | "profile" | "brand" | "settings" | "seo" | "composer";

export type ReadinessStatus = "complete" | "warning" | "blocked" | "not_applicable";

export interface ReadinessRule {
  id: string;
  module: string;
  label: string;
  status: ReadinessStatus;
  message: string;
  weight: number;
  action?: { label: string; tab: WebsiteTabKey };
}

export interface ReadinessReport {
  score: number;
  rules: ReadinessRule[];
  blockers: ReadinessRule[];
  warnings: ReadinessRule[];
  complete: ReadinessRule[];
}

export type ReadinessEvaluator = (input: import("./evaluate").ReadinessInput) => ReadinessRule;

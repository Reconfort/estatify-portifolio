import { evaluateAnalytics } from "./rules/analytics";
import { evaluateBrand } from "./rules/brand";
import { evaluateHomepage } from "./rules/composer";
import { evaluateDomain } from "./rules/domain";
import { evaluateProfile } from "./rules/profile";
import { evaluatePublish } from "./rules/publish";
import { evaluateSeo } from "./rules/seo";
import { evaluateSettings } from "./rules/settings";
import type { ReadinessContext, ReadinessEvaluator, ReadinessResult } from "./types";

/** All readiness evaluators — add new modules here. */
export const readinessEvaluators: ReadinessEvaluator[] = [
  evaluateProfile,
  evaluateBrand,
  evaluateSettings,
  evaluateHomepage,
  evaluateSeo,
  evaluateDomain,
  evaluateAnalytics,
  evaluatePublish,
];

function statusMultiplier(status: ReadinessResult["rules"][number]["status"]): number {
  switch (status) {
    case "complete":
      return 1;
    case "warning":
      return 0.5;
    case "blocked":
      return 0;
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

export function evaluateWebsiteReadiness(ctx: ReadinessContext): ReadinessResult {
  const rules = readinessEvaluators.map((fn) => fn(ctx));
  const totalWeight = rules.reduce((sum, r) => sum + r.weight, 0);
  const earned = rules.reduce((sum, r) => sum + r.weight * statusMultiplier(r.status), 0);
  const score = totalWeight > 0 ? Math.round((earned / totalWeight) * 100) : 0;

  const blockers = rules.filter((r) => r.status === "blocked");
  const warnings = rules.filter((r) => r.status === "warning");
  const completeCount = rules.filter((r) => r.status === "complete").length;

  return {
    score,
    rules,
    completeCount,
    warningCount: warnings.length,
    blockedCount: blockers.length,
    blockers,
    warnings,
  };
}

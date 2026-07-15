import type { ReadinessInput } from "./evaluate-input";
import { getReadinessEvaluators, registerReadinessRule } from "./registry";
import {
  evaluateAnalyticsRule,
  evaluateBrandRule,
  evaluateComposerRule,
  evaluateCustomDomainRule,
  evaluateProfileRule,
  evaluatePublishRule,
  evaluateSeoRule,
  evaluateSettingsRule,
  evaluateSubdomainRule,
} from "./rules";
import type { ReadinessReport } from "./types";

let registered = false;

function ensureRulesRegistered(): void {
  if (registered) return;
  registerReadinessRule(evaluateProfileRule);
  registerReadinessRule(evaluateBrandRule);
  registerReadinessRule(evaluateSettingsRule);
  registerReadinessRule(evaluateSeoRule);
  registerReadinessRule(evaluateComposerRule);
  registerReadinessRule(evaluateSubdomainRule);
  registerReadinessRule(evaluateCustomDomainRule);
  registerReadinessRule(evaluatePublishRule);
  registerReadinessRule(evaluateAnalyticsRule);
  registered = true;
}

export function evaluateReadiness(input: ReadinessInput): ReadinessReport {
  ensureRulesRegistered();
  const rules = getReadinessEvaluators().map((fn) => fn(input));

  const scorable = rules.filter((r) => r.status !== "not_applicable");
  const totalWeight = scorable.reduce((sum, r) => sum + r.weight, 0);
  const earnedWeight = scorable
    .filter((r) => r.status === "complete")
    .reduce((sum, r) => sum + r.weight, 0);
  const score = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;

  return {
    score,
    rules,
    blockers: rules.filter((r) => r.status === "blocked"),
    warnings: rules.filter((r) => r.status === "warning"),
    complete: rules.filter((r) => r.status === "complete"),
  };
}

export type { ReadinessInput } from "./evaluate-input";

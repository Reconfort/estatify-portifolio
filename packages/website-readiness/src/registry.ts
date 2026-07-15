import type { ReadinessEvaluator } from "./types";

const evaluators: ReadinessEvaluator[] = [];

export function registerReadinessRule(evaluator: ReadinessEvaluator): void {
  evaluators.push(evaluator);
}

export function getReadinessEvaluators(): ReadinessEvaluator[] {
  return [...evaluators];
}

export function clearReadinessRules(): void {
  evaluators.length = 0;
}

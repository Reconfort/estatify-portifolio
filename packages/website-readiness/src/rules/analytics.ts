import type { ReadinessEvaluator } from "../types";

/** Placeholder until analytics integration lands. */
export const evaluateAnalytics: ReadinessEvaluator = () => ({
  id: "analytics-connected",
  module: "analytics",
  label: "Analytics",
  status: "warning",
  message: "Not connected — visitor insights unavailable",
  weight: 0.5,
  fixLabel: "Connect analytics",
});

import type { ReadinessEvaluator } from "../types";

export const evaluatePublish: ReadinessEvaluator = ({ draft }) => {
  if (draft.meta.publishedAt) {
    return {
      id: "publish-live",
      module: "publish",
      label: "Published",
      status: "complete",
      message: "Your website is live for customers",
      weight: 0.5,
      fixLabel: "Publish again",
    };
  }

  return {
    id: "publish-live",
    module: "publish",
    label: "Publish",
    status: "warning",
    message: "Site has never been published",
    weight: 0.5,
    fixLabel: "Publish website",
  };
};

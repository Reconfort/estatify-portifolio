import type { ReadinessEvaluator } from "../types";

export const evaluateSeo: ReadinessEvaluator = ({ draft, hasFavicon }) => {
  const { seo } = draft;
  const hasTitle = Boolean(seo.metaTitle?.trim());
  const hasDescription = Boolean(seo.metaDescription?.trim());

  if (hasTitle && hasDescription && hasFavicon) {
    return {
      id: "seo-complete",
      module: "seo",
      label: "SEO",
      status: "complete",
      message: "Meta tags and favicon configured",
      weight: 1,
      actionTab: "seo",
      fixLabel: "Edit",
    };
  }

  if (hasTitle && hasDescription) {
    return {
      id: "seo-complete",
      module: "seo",
      label: "SEO",
      status: "warning",
      message: "Add a favicon for search and browser tabs",
      weight: 1,
      actionTab: "seo",
      fixLabel: "Add favicon",
    };
  }

  const missing: string[] = [];
  if (!hasTitle) missing.push("meta title");
  if (!hasDescription) missing.push("meta description");

  return {
    id: "seo-complete",
    module: "seo",
    label: "SEO",
    status: "blocked",
    message: `Add ${missing.join(" and ")}`,
    weight: 1,
    actionTab: "seo",
    fixLabel: "Complete SEO",
  };
};

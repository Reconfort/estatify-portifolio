import type { ReadinessEvaluator } from "../types";

export const evaluateDomain: ReadinessEvaluator = ({ agencySlug, primaryDomain }) => {
  if (primaryDomain) {
    return {
      id: "domain-custom",
      module: "domain",
      label: "Custom domain",
      status: "complete",
      message: primaryDomain,
      weight: 0.5,
      actionTab: "settings",
      fixLabel: "Manage",
    };
  }

  const subdomain = agencySlug ? `${agencySlug}.estatify.site` : "your-agency.estatify.site";

  return {
    id: "domain-custom",
    module: "domain",
    label: "Custom domain",
    status: "warning",
    message: `Using ${subdomain} — connect your own domain`,
    weight: 0.5,
    actionTab: "settings",
    fixLabel: "Connect domain",
  };
};

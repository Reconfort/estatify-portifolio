import type { ReadinessEvaluator } from "../types";

export const evaluateProfile: ReadinessEvaluator = ({ draft }) => {
  const { profile } = draft;
  const hasName = Boolean(profile.basic.companyName?.trim());
  const hasEmail = Boolean(profile.contact.primaryEmail?.trim());
  const hasCity = Boolean(profile.address.city?.trim());

  if (hasName && hasEmail && hasCity) {
    return {
      id: "profile-complete",
      module: "profile",
      label: "Agency profile",
      status: "complete",
      message: "Company details are set",
      weight: 1,
      actionTab: "profile",
      fixLabel: "Edit",
    };
  }

  const missing: string[] = [];
  if (!hasName) missing.push("company name");
  if (!hasEmail) missing.push("email");
  if (!hasCity) missing.push("city");

  return {
    id: "profile-complete",
    module: "profile",
    label: "Agency profile",
    status: "blocked",
    message: `Add ${missing.join(", ")}`,
    weight: 1,
    actionTab: "profile",
    fixLabel: "Complete profile",
  };
};

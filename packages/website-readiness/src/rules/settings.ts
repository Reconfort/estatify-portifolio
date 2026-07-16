import type { ReadinessEvaluator } from "../types";

export const evaluateSettings: ReadinessEvaluator = ({ draft }) => {
  const { website } = draft;
  const hasName = Boolean(website.general.websiteName?.trim());
  const hasContact =
    Boolean(website.contact.websiteEmail?.trim()) || Boolean(website.contact.websitePhone?.trim());

  if (hasName && hasContact) {
    return {
      id: "settings-complete",
      module: "settings",
      label: "Website settings",
      status: "complete",
      message: "Site name and public contact are set",
      weight: 1,
      actionTab: "settings",
      fixLabel: "Edit",
    };
  }

  return {
    id: "settings-complete",
    module: "settings",
    label: "Website settings",
    status: "warning",
    message: "Add public contact email or phone",
    weight: 1,
    actionTab: "settings",
    fixLabel: "Add contact",
  };
};

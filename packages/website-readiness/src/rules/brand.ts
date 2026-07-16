import type { ReadinessEvaluator } from "../types";

export const evaluateBrand: ReadinessEvaluator = ({ draft, hasLogo }) => {
  const { brand } = draft;
  const hasColors = Boolean(brand.colors.primary?.trim());
  const hasFonts = Boolean(brand.typography.primaryFont?.trim());

  if (hasColors && hasFonts && hasLogo) {
    return {
      id: "brand-complete",
      module: "brand",
      label: "Branding",
      status: "complete",
      message: "Logo and brand tokens configured",
      weight: 1,
      actionTab: "brand",
      fixLabel: "Edit",
    };
  }

  if (hasColors && hasFonts) {
    return {
      id: "brand-complete",
      module: "brand",
      label: "Branding",
      status: "warning",
      message: "Upload a logo for a polished site",
      weight: 1,
      actionTab: "brand",
      fixLabel: "Upload logo",
    };
  }

  return {
    id: "brand-complete",
    module: "brand",
    label: "Branding",
    status: "blocked",
    message: "Customize colors, fonts, and logo",
    weight: 1,
    actionTab: "brand",
    fixLabel: "Set up brand",
  };
};

import type { ReadinessContext, ReadinessEvaluator } from "../types";

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  "featured-properties": "Featured properties",
  cta: "CTA",
  footer: "Footer",
};

export const evaluateHomepage: ReadinessEvaluator = ({ draft }) => {
  const home = draft.composition?.pages?.home;
  const visible = (home?.sections ?? []).filter((s) => s.visible);
  const hasHero = visible.some((s) => s.type === "hero");
  const hasCta = visible.some((s) => s.type === "cta");

  if (visible.length >= 3 && hasHero && hasCta) {
    return {
      id: "homepage-complete",
      module: "composer",
      label: "Homepage",
      status: "complete",
      message: `${visible.length} sections on your homepage`,
      weight: 1,
      actionTab: "composer",
      fixLabel: "Edit layout",
    };
  }

  if (visible.length > 0) {
    return {
      id: "homepage-complete",
      module: "composer",
      label: "Homepage",
      status: "warning",
      message: "Add a hero and call-to-action section",
      weight: 1,
      actionTab: "composer",
      fixLabel: "Customize website",
    };
  }

  return {
    id: "homepage-complete",
    module: "composer",
    label: "Homepage",
    status: "blocked",
    message: "Compose your homepage in the website builder",
    weight: 1,
    actionTab: "composer",
    fixLabel: "Customize website",
  };
};

export function getHomepageSectionSummary(draft: ReadinessContext["draft"]) {
  const sections = draft.composition?.pages?.home?.sections ?? [];
  return [...sections]
    .sort((a, b) => a.order - b.order)
    .map((s) => ({
      id: s.id,
      type: s.type,
      label: SECTION_LABELS[s.type] ?? s.type,
      visible: s.visible,
    }));
}

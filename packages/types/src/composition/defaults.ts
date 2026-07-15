import type { PageSection, WebsiteComposition } from "./aggregate";
import { defaultCtaSectionConfig } from "./sections/cta";
import { defaultFeaturedPropertiesSectionConfig } from "./sections/featured-properties";
import { defaultFooterSectionConfig } from "./sections/footer";
import { defaultHeroSectionConfig } from "./sections/hero";

export const defaultHomeSections: PageSection[] = [
  {
    id: "hero-default",
    type: "hero",
    order: 1,
    visible: true,
    config: defaultHeroSectionConfig,
  },
  {
    id: "featured-properties-default",
    type: "featured-properties",
    order: 2,
    visible: true,
    config: defaultFeaturedPropertiesSectionConfig,
  },
  {
    id: "cta-default",
    type: "cta",
    order: 3,
    visible: true,
    config: defaultCtaSectionConfig,
  },
  {
    id: "footer-default",
    type: "footer",
    order: 4,
    visible: true,
    config: defaultFooterSectionConfig,
  },
];

export const defaultWebsiteComposition: WebsiteComposition = {
  pages: {
    home: { sections: defaultHomeSections },
  },
};

export function emptyWebsiteComposition(): WebsiteComposition {
  return { pages: {} };
}

"use client";

import type {
  AgencyProfile,
  BrandIdentity,
  FeaturedPropertiesSectionConfig,
  FooterSectionConfig,
  HeroSectionConfig,
  CtaSectionConfig,
  PageKey,
  PageSection,
  SeoConfiguration,
  WebsiteComposition,
  WebsiteSettings,
} from "@estatify/types";
import { parseSectionConfig } from "@estatify/types";
import {
  CtaSection,
  FeaturedPropertiesSection,
  FooterSection,
  HeroSection,
} from "@estatify/website-sections";
import { resolveProperties } from "./fixtures";

export interface SiteRenderInput {
  page: PageKey;
  profile: AgencyProfile;
  brand: BrandIdentity;
  website: WebsiteSettings;
  seo: SeoConfiguration;
  composition: WebsiteComposition;
}

function renderSection(section: PageSection, input: SiteRenderInput) {
  if (!section.visible) return null;

  switch (section.type) {
    case "hero": {
      const config = parseSectionConfig("hero", section.config) as HeroSectionConfig;
      return <HeroSection key={section.id} config={config} />;
    }
    case "featured-properties": {
      const config = parseSectionConfig(
        "featured-properties",
        section.config,
      ) as FeaturedPropertiesSectionConfig;
      const properties = resolveProperties(config.source, config.limit);
      return <FeaturedPropertiesSection key={section.id} config={config} properties={properties} />;
    }
    case "cta": {
      const config = parseSectionConfig("cta", section.config) as CtaSectionConfig;
      return <CtaSection key={section.id} config={config} />;
    }
    case "footer": {
      const config = parseSectionConfig("footer", section.config) as FooterSectionConfig;
      return (
        <FooterSection
          key={section.id}
          config={config}
          website={input.website}
          profile={input.profile}
        />
      );
    }
    default: {
      const _exhaustive: never = section.type;
      return _exhaustive;
    }
  }
}

export { renderSection };

export function getPageSections(composition: WebsiteComposition, page: PageKey): PageSection[] {
  const pageData = composition.pages[page];
  if (!pageData) return [];
  return [...pageData.sections].sort((a, b) => a.order - b.order);
}

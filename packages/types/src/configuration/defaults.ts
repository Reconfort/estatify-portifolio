import type { DraftConfiguration } from "./aggregate";
import { defaultWebsiteComposition } from "../composition";
import { defaultAgencyProfile } from "./profile";
import { defaultBrandIdentity } from "./brand";
import { defaultWebsiteSettings } from "./website";
import { defaultSeoConfiguration } from "./seo";

export function emptyDraftConfiguration(updatedAt: string): DraftConfiguration {
  return {
    profile: defaultAgencyProfile,
    brand: defaultBrandIdentity,
    website: defaultWebsiteSettings,
    seo: defaultSeoConfiguration,
    composition: defaultWebsiteComposition,
    meta: {
      templateId: null,
      publishedAt: null,
      updatedAt,
      agencySlug: null,
      primaryDomain: null,
    },
  };
}

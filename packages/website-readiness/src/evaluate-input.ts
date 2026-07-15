import type { DraftConfiguration, MediaAssetItem } from "@estatify/types";

export interface ReadinessInput {
  draft: DraftConfiguration;
  tenantSlug: string | null;
  primaryDomain: string | null;
  media: {
    logo: MediaAssetItem | null;
    favicon: MediaAssetItem | null;
  };
}

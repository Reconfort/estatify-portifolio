"use client";

import type { DraftConfiguration } from "@estatify/types";
import { PageRenderer } from "@estatify/website-renderer";

export function ComposerPreviewPanel({
  draft,
  page,
  composition,
  selectedSectionId,
  onSelectSection,
}: {
  draft: DraftConfiguration;
  page: "home";
  composition: DraftConfiguration["composition"];
  selectedSectionId: string | null;
  onSelectSection: (id: string) => void;
}) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-muted/30 p-4">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-xl border border-border bg-white">
        <PageRenderer
          input={{
            page,
            profile: draft.profile,
            brand: draft.brand,
            website: draft.website,
            seo: draft.seo,
            composition,
          }}
          selectedSectionId={selectedSectionId}
          onSelectSection={onSelectSection}
        />
      </div>
    </div>
  );
}

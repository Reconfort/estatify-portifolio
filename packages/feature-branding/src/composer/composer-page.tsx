"use client";

import * as React from "react";
import type { DraftConfiguration } from "@estatify/types";
import { ComposerInspectorPanel } from "./composer-inspector-panel";
import { ComposerPreviewPanel } from "./composer-preview-panel";
import { ComposerSectionPicker } from "./composer-section-picker";
import { ComposerStructurePanel } from "./composer-structure-panel";
import { ComposerToolbar } from "./composer-toolbar";
import { useComposerState } from "./hooks/use-composer-state";

export function ComposerPage({
  draft,
  onBack,
}: {
  draft: DraftConfiguration;
  onBack?: () => void;
}) {
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const composer = useComposerState(draft);

  const draftWithLocalComposition: DraftConfiguration = {
    ...draft,
    composition: composer.localComposition,
  };

  return (
    <div className="-mx-4 flex min-h-[calc(100dvh-8rem)] flex-col overflow-hidden sm:-mx-6">
      <ComposerToolbar
        pageLabel="Home page"
        updatedAt={draft.meta.updatedAt}
        publishedAt={draft.meta.publishedAt}
        saving={composer.isSaving}
        {...(onBack ? { onBack } : {})}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <ComposerStructurePanel
          page={composer.page}
          onPageChange={composer.setPage}
          sections={composer.pageSections}
          selectedSectionId={composer.selectedSectionId}
          onSelectSection={composer.setSelectedSectionId}
          onReorder={composer.reorderSection}
          onToggleVisibility={composer.toggleVisibility}
          onDuplicate={composer.duplicateSection}
          onRemove={composer.removeSection}
          onAddSection={() => setPickerOpen(true)}
        />

        <ComposerPreviewPanel
          draft={draftWithLocalComposition}
          page="home"
          composition={composer.localComposition}
          selectedSectionId={composer.selectedSectionId}
          onSelectSection={composer.setSelectedSectionId}
        />

        <ComposerInspectorPanel
          section={composer.selectedSection}
          onUpdate={(config) => {
            if (composer.selectedSection) {
              composer.updateSectionConfig(composer.selectedSection.id, config);
            }
          }}
          onRemove={() => {
            if (composer.selectedSection) composer.removeSection(composer.selectedSection.id);
          }}
        />
      </div>

      <ComposerSectionPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={composer.addSection}
      />
    </div>
  );
}

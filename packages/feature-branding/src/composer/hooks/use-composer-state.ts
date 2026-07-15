"use client";

import * as React from "react";
import type {
  DraftConfiguration,
  PageKey,
  PageSection,
  SectionType,
  WebsiteComposition,
} from "@estatify/types";
import {
  createSectionId,
  defaultCtaSectionConfig,
  defaultFeaturedPropertiesSectionConfig,
  defaultFooterSectionConfig,
  defaultHeroSectionConfig,
  defaultWebsiteComposition,
} from "@estatify/types";
import { useUpdateComposition } from "@estatify/api-client";

const DEFAULT_CONFIG: Record<SectionType, PageSection["config"]> = {
  hero: defaultHeroSectionConfig,
  "featured-properties": defaultFeaturedPropertiesSectionConfig,
  cta: defaultCtaSectionConfig,
  footer: defaultFooterSectionConfig,
};

export function useComposerState(draft: DraftConfiguration) {
  const update = useUpdateComposition();
  const [page, setPage] = React.useState<PageKey>("home");
  const [selectedSectionId, setSelectedSectionId] = React.useState<string | null>(null);
  const serverComposition = draft.composition ?? defaultWebsiteComposition;
  const [localComposition, setLocalComposition] =
    React.useState<WebsiteComposition>(serverComposition);
  const [syncedComposition, setSyncedComposition] =
    React.useState<WebsiteComposition>(serverComposition);

  if (serverComposition !== syncedComposition) {
    setSyncedComposition(serverComposition);
    setLocalComposition(serverComposition);
  }

  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    [],
  );

  const persist = React.useCallback(
    (next: WebsiteComposition) => {
      setLocalComposition(next);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        void update.mutateAsync({ pages: next.pages });
      }, 400);
    },
    [update],
  );

  const pageSections = React.useMemo(() => {
    const sections = localComposition.pages[page]?.sections ?? [];
    return [...sections].sort((a, b) => a.order - b.order);
  }, [localComposition, page]);

  const selectedSection = pageSections.find((s) => s.id === selectedSectionId) ?? null;

  const updateSections = (sections: PageSection[]) => {
    const next: WebsiteComposition = {
      pages: {
        ...localComposition.pages,
        [page]: { sections },
      },
    };
    void persist(next);
  };

  const reorderSection = (id: string, direction: "up" | "down") => {
    const sorted = [...pageSections];
    const idx = sorted.findIndex((s) => s.id === id);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[swapIdx];
    if (!a || !b) return;
    sorted[idx] = { ...b, order: a.order };
    sorted[swapIdx] = { ...a, order: b.order };
    updateSections(sorted);
  };

  const toggleVisibility = (id: string) => {
    updateSections(pageSections.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)));
  };

  const removeSection = (id: string) => {
    updateSections(pageSections.filter((s) => s.id !== id));
    if (selectedSectionId === id) setSelectedSectionId(null);
  };

  const duplicateSection = (id: string) => {
    const source = pageSections.find((s) => s.id === id);
    if (!source) return;
    const maxOrder = Math.max(...pageSections.map((s) => s.order), 0);
    const copy: PageSection = {
      ...source,
      id: createSectionId(source.type),
      order: maxOrder + 1,
      config: { ...source.config },
    };
    updateSections([...pageSections, copy]);
    setSelectedSectionId(copy.id);
  };

  const addSection = (type: SectionType) => {
    const maxOrder = Math.max(...pageSections.map((s) => s.order), 0);
    const section: PageSection = {
      id: createSectionId(type),
      type,
      order: maxOrder + 1,
      visible: true,
      config: DEFAULT_CONFIG[type],
    };
    updateSections([...pageSections, section]);
    setSelectedSectionId(section.id);
  };

  const updateSectionConfig = (id: string, config: PageSection["config"]) => {
    updateSections(pageSections.map((s) => (s.id === id ? { ...s, config } : s)));
  };

  return {
    page,
    setPage,
    selectedSectionId,
    setSelectedSectionId,
    selectedSection,
    pageSections,
    localComposition,
    reorderSection,
    toggleVisibility,
    removeSection,
    duplicateSection,
    addSection,
    updateSectionConfig,
    isSaving: update.isPending,
  };
}

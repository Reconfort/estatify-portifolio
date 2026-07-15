"use client";

import {
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  EyeOff,
  LayoutTemplate,
  Plus,
  Trash2,
} from "lucide-react";
import type { PageKey, PageSection, SectionType } from "@estatify/types";
import { cn } from "@estatify/utils";
import { Button } from "@estatify/ui";

const PAGES: Array<{ key: PageKey; label: string; enabled: boolean }> = [
  { key: "home", label: "Home", enabled: true },
  { key: "properties", label: "Properties", enabled: false },
  { key: "agents", label: "Agents", enabled: false },
  { key: "about", label: "About", enabled: false },
  { key: "contact", label: "Contact", enabled: false },
];

const SECTION_LABELS: Record<SectionType, string> = {
  hero: "Hero",
  "featured-properties": "Featured Properties",
  cta: "CTA",
  footer: "Footer",
};

export function ComposerStructurePanel({
  page,
  onPageChange,
  sections,
  selectedSectionId,
  onSelectSection,
  onReorder,
  onToggleVisibility,
  onDuplicate,
  onRemove,
  onAddSection,
}: {
  page: PageKey;
  onPageChange: (page: PageKey) => void;
  sections: PageSection[];
  selectedSectionId: string | null;
  onSelectSection: (id: string) => void;
  onReorder: (id: string, direction: "up" | "down") => void;
  onToggleVisibility: (id: string) => void;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
  onAddSection: () => void;
}) {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
          Pages
        </p>
        <ul className="mt-2 space-y-1">
          {PAGES.map((p) => (
            <li key={p.key}>
              <button
                type="button"
                disabled={!p.enabled}
                onClick={() => onPageChange(p.key)}
                className={cn(
                  "w-full rounded-md px-2 py-1.5 text-left text-body-sm",
                  page === p.key
                    ? "bg-secondary font-medium text-foreground"
                    : "text-muted-foreground",
                  !p.enabled && "cursor-not-allowed opacity-50",
                )}
              >
                {p.label}
                {!p.enabled ? " (soon)" : ""}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
            Sections
          </p>
          <Button type="button" variant="ghost" size="sm" onClick={onAddSection}>
            <Plus className="size-4" aria-hidden />
            Add
          </Button>
        </div>
        <ul className="flex-1 overflow-y-auto p-2">
          {sections.map((section, index) => (
            <li key={section.id}>
              <div
                className={cn(
                  "flex items-center gap-1 rounded-md border border-transparent p-1",
                  selectedSectionId === section.id && "border-border bg-secondary/60",
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelectSection(section.id)}
                  className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left text-body-sm"
                >
                  <LayoutTemplate className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                  <span
                    className={cn(
                      "truncate",
                      !section.visible && "text-muted-foreground line-through",
                    )}
                  >
                    {SECTION_LABELS[section.type]}
                  </span>
                </button>
                <button
                  type="button"
                  aria-label="Move up"
                  disabled={index === 0}
                  onClick={() => onReorder(section.id, "up")}
                  className="rounded p-1 text-muted-foreground hover:bg-secondary disabled:opacity-30"
                >
                  <ChevronUp className="size-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Move down"
                  disabled={index === sections.length - 1}
                  onClick={() => onReorder(section.id, "down")}
                  className="rounded p-1 text-muted-foreground hover:bg-secondary disabled:opacity-30"
                >
                  <ChevronDown className="size-3.5" />
                </button>
                <button
                  type="button"
                  aria-label={section.visible ? "Hide section" : "Show section"}
                  onClick={() => onToggleVisibility(section.id)}
                  className="rounded p-1 text-muted-foreground hover:bg-secondary"
                >
                  {section.visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                </button>
                <button
                  type="button"
                  aria-label="Duplicate"
                  onClick={() => onDuplicate(section.id)}
                  className="rounded p-1 text-muted-foreground hover:bg-secondary"
                >
                  <Copy className="size-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Remove"
                  onClick={() => onRemove(section.id)}
                  className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

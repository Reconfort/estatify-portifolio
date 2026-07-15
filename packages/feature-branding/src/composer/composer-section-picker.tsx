"use client";

import type { SectionType } from "@estatify/types";
import { Button } from "@estatify/ui";

const SECTION_OPTIONS: Array<{ type: SectionType; label: string; description: string }> = [
  { type: "hero", label: "Hero", description: "Large banner with headline and CTA" },
  {
    type: "featured-properties",
    label: "Featured Properties",
    description: "Grid of property listings",
  },
  { type: "cta", label: "CTA", description: "Call-to-action band" },
  { type: "footer", label: "Footer", description: "Site footer with contact info" },
];

export function ComposerSectionPicker({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (type: SectionType) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative z-10 w-full max-w-md rounded-xl border border-border bg-card p-5">
        <h2 className="text-h5 font-semibold text-foreground">Add section</h2>
        <p className="mt-1 text-body-sm text-muted-foreground">
          Choose a predefined section for your page.
        </p>
        <ul className="mt-4 space-y-2">
          {SECTION_OPTIONS.map((option) => (
            <li key={option.type}>
              <button
                type="button"
                onClick={() => {
                  onPick(option.type);
                  onClose();
                }}
                className="flex w-full flex-col rounded-lg border border-border px-4 py-3 text-left hover:bg-secondary/60"
              >
                <span className="text-body-sm font-medium text-foreground">{option.label}</span>
                <span className="text-caption text-muted-foreground">{option.description}</span>
              </button>
            </li>
          ))}
        </ul>
        <Button type="button" variant="ghost" className="mt-4 w-full" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

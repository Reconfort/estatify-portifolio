"use client";

import { Check } from "lucide-react";
import type { getHomepageSectionSummary } from "@estatify/website-readiness";
import { cn } from "@estatify/utils";

export function HomepageSummary({
  sections,
  onEdit,
}: {
  sections: ReturnType<typeof getHomepageSectionSummary>;
  onEdit: () => void;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-h5 font-semibold text-foreground">Homepage</h2>
          <p className="mt-1 text-body-sm text-muted-foreground">Sections visitors see first</p>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="text-body-sm font-medium text-primary hover:underline"
        >
          Edit layout →
        </button>
      </div>

      {sections.length === 0 ? (
        <p className="mt-4 text-body-sm text-muted-foreground">
          No sections yet. Customize your website to add a homepage.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {sections.map((section) => (
            <li
              key={section.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-2"
            >
              <span
                className={cn(
                  "text-body-sm",
                  section.visible ? "text-foreground" : "text-muted-foreground line-through",
                )}
              >
                {section.label}
              </span>
              {section.visible ? (
                <Check className="size-4 text-accent" aria-hidden />
              ) : (
                <span className="text-caption text-muted-foreground">Hidden</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

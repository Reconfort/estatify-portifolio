"use client";

import type { PageKey } from "@estatify/types";
import { cn } from "@estatify/utils";
import { getPageSections, renderSection, type SiteRenderInput } from "./registry";
import { ThemeProvider } from "./theme-provider";

export function PageRenderer({
  input,
  selectedSectionId,
  onSelectSection,
  className,
}: {
  input: SiteRenderInput;
  selectedSectionId?: string | null;
  onSelectSection?: (sectionId: string) => void;
  className?: string;
}) {
  const sections = getPageSections(input.composition, input.page as PageKey);

  return (
    <ThemeProvider brand={input.brand} {...(className ? { className } : {})}>
      <div className="min-h-full">
        {sections.map((section) => {
          const node = renderSection(section, input);
          if (!node) return null;
          const selected = selectedSectionId === section.id;
          return (
            <div
              key={section.id}
              role={onSelectSection ? "button" : undefined}
              tabIndex={onSelectSection ? 0 : undefined}
              onClick={onSelectSection ? () => onSelectSection(section.id) : undefined}
              onKeyDown={
                onSelectSection
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelectSection(section.id);
                      }
                    }
                  : undefined
              }
              className={cn(
                onSelectSection && "cursor-pointer outline-none",
                selected && "ring-2 ring-inset ring-primary",
              )}
            >
              {node}
            </div>
          );
        })}
      </div>
    </ThemeProvider>
  );
}

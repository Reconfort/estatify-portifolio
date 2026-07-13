"use client";

import { CoverflowCarousel } from "@estatify/ui";
import { templateCarousel } from "@/components/landing-data";

/**
 * TemplateCarousel — full-viewport autonomous coverflow under the hero.
 */
export function TemplateCarousel() {
  return (
    <div
      aria-label={templateCarousel.ariaLabel}
      className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden pb-2"
    >
      <CoverflowCarousel
        items={templateCarousel.items.map((item) => ({ ...item }))}
        autoplay
        intervalMs={templateCarousel.intervalMs}
      />
    </div>
  );
}

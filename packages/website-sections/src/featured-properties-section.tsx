"use client";

import Link from "next/link";
import type { FeaturedPropertiesSectionConfig } from "@estatify/types";
import type { SiteProperty } from "./types";
import { cn } from "@estatify/utils";

export function FeaturedPropertiesSection({
  config,
  properties,
}: {
  config: FeaturedPropertiesSectionConfig;
  properties: SiteProperty[];
}) {
  const items = properties.slice(0, config.limit);
  const gridCols =
    config.layout === "grid"
      ? { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" }[
          config.columns as 1 | 2 | 3 | 4
        ]
      : "grid-cols-1";

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[var(--site-secondary)]">{config.title}</h2>
          {config.subtitle ? (
            <p className="mt-1 text-sm text-[var(--site-neutral)]">{config.subtitle}</p>
          ) : null}
        </div>
        {config.buttonText && config.buttonHref ? (
          <Link
            href={config.buttonHref}
            className="text-sm font-medium text-[var(--site-primary)] hover:underline"
          >
            {config.buttonText}
          </Link>
        ) : null}
      </div>

      <div className={cn("grid gap-5", gridCols)}>
        {items.map((property) => (
          <article
            key={property.id}
            className="overflow-hidden rounded-xl border border-black/10 bg-white"
          >
            <div
              className="aspect-4/3 bg-cover bg-center"
              style={{ backgroundImage: `url(${property.imageUrl})` }}
              role="img"
              aria-label={property.title}
            />
            <div className="space-y-1 p-4">
              <h3 className="font-semibold text-[var(--site-secondary)]">{property.title}</h3>
              <p className="text-sm text-[var(--site-neutral)]">{property.location}</p>
              <p className="text-sm font-semibold text-[var(--site-primary)]">{property.price}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-[var(--site-neutral)]">
        Sample listings shown until property data is connected.
      </p>
    </section>
  );
}

"use client";

import Link from "next/link";
import type { CtaSectionConfig } from "@estatify/types";

export function CtaSection({ config }: { config: CtaSectionConfig }) {
  return (
    <section className="bg-[var(--site-primary)] px-6 py-14 text-center text-white">
      <div className="mx-auto max-w-2xl space-y-4">
        <h2 className="text-2xl font-semibold">{config.title}</h2>
        {config.subtitle ? <p className="text-white/85">{config.subtitle}</p> : null}
        <Link
          href={config.buttonHref}
          className="inline-flex rounded-lg bg-[var(--site-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--site-secondary)]"
        >
          {config.buttonText}
        </Link>
      </div>
    </section>
  );
}

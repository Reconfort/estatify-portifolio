"use client";

import Link from "next/link";
import type { HeroSectionConfig } from "@estatify/types";
import { cn } from "@estatify/utils";

const heightClass = { sm: "min-h-[280px]", md: "min-h-[360px]", lg: "min-h-[440px]" } as const;
const alignClass = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
} as const;

export function HeroSection({ config }: { config: HeroSectionConfig }) {
  return (
    <section
      className={cn(
        "relative flex w-full flex-col justify-center px-6 py-16 sm:px-10",
        heightClass[config.height],
        alignClass[config.alignment],
      )}
      style={
        config.backgroundImage
          ? {
              backgroundImage: `url(${config.backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {
              background: "linear-gradient(135deg, var(--site-primary), var(--site-secondary))",
            }
      }
    >
      {config.overlay ? <div className="absolute inset-0 bg-black/40" aria-hidden /> : null}
      <div className={cn("relative z-10 max-w-2xl space-y-4", alignClass[config.alignment])}>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{config.title}</h1>
        {config.subtitle ? (
          <p className="text-base text-white/90 sm:text-lg">{config.subtitle}</p>
        ) : null}
        <Link
          href={config.ctaHref}
          className="inline-flex rounded-lg bg-[var(--site-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--site-secondary)]"
        >
          {config.ctaText}
        </Link>
      </div>
    </section>
  );
}

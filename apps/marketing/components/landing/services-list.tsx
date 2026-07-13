"use client";

import * as React from "react";
import Image from "next/image";
import { Container } from "@estatify/ui";
import { ArrowRightIcon } from "@estatify/ui/icons";
import { cn } from "@estatify/utils";
import { Reveal } from "./reveal";
import { SectionHeader } from "./section-header";
import { servicesV2 } from "@/components/landing-data";

/**
 * ServicesList — editorial row list; hovering (or focusing) a row reveals a
 * floating preview image on desktop. Rows remain plain links on touch/mobile.
 */
export function ServicesList() {
  const [active, setActive] = React.useState<number | null>(null);

  return (
    <section id="services" className="py-20 sm:py-28">
      <Container className="flex flex-col gap-12">
        <SectionHeader eyebrow={servicesV2.marquee} title={servicesV2.title} />

        <div className="relative">
          <ul className="flex flex-col divide-y divide-border border-y border-border">
            {servicesV2.items.map((item, i) => (
              <li key={item.title}>
                <Reveal index={i} y={14}>
                  <a
                    href={item.href}
                    className="group flex items-center justify-between gap-6 py-7 outline-none sm:py-8"
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                  >
                    <span className="flex items-baseline gap-6">
                      <span className="text-body-sm font-medium tabular-nums text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "text-h2 font-semibold text-foreground transition-colors sm:text-display-md",
                          active === i && "text-primary",
                        )}
                      >
                        {item.title}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border transition-all",
                        active === i
                          ? "border-transparent bg-accent text-accent-foreground"
                          : "text-muted-foreground",
                      )}
                      aria-hidden
                    >
                      <ArrowRightIcon className="h-4 w-4 -rotate-45" />
                    </span>
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>

          {/* Desktop-only floating preview; decorative. */}
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute right-24 top-1/2 z-10 hidden w-64 -translate-y-1/2 overflow-hidden rounded-lg shadow-xl transition-all duration-300 lg:block",
              active !== null ? "scale-100 opacity-100" : "scale-95 opacity-0",
            )}
          >
            {servicesV2.items.map((item, i) => (
              <Image
                key={item.image}
                src={item.image}
                alt=""
                width={512}
                height={384}
                sizes="256px"
                className={cn("h-44 w-full object-cover", active === i ? "block" : "hidden")}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-body-md text-muted-foreground">{servicesV2.closing}</p>
          <a
            href="#pricing"
            className="group inline-flex items-center gap-2 text-body-sm font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            {servicesV2.ctaLabel}
            <ArrowRightIcon
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </a>
        </div>
      </Container>
    </section>
  );
}

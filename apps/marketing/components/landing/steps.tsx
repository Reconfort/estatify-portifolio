"use client";

import type { ComponentType } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@estatify/utils";
import {
  AgentsIcon,
  AnalyticsIcon,
  BuildingIcon,
  GlobeIcon,
  type IconComponent,
  LeadsIcon,
  ListingsIcon,
} from "@estatify/ui/icons";
import { Container } from "@estatify/ui";
import { services } from "@/components/landing-data";

const ease = [0.22, 1, 0.36, 1] as const;

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease },
  }),
};

const serviceIcons: Record<(typeof services)[number]["icon"], IconComponent> = {
  sites: GlobeIcon,
  listings: ListingsIcon,
  leads: LeadsIcon,
  agents: AgentsIcon,
  analytics: AnalyticsIcon,
  whitelabel: BuildingIcon,
};

function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17L17 7M17 7H8M17 7V16" />
    </svg>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[number];
  index: number;
}) {
  const reduceMotion = useReducedMotion();
  const Icon: ComponentType<{ className?: string }> = serviceIcons[service.icon];

  return (
    <motion.article
      custom={index}
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-8% 0px" }}
      {...(!reduceMotion ? { whileHover: { y: -4 } } : {})}
      transition={{ duration: 0.3, ease }}
      className="group relative rounded-[28px] bg-card border border-border p-7 sm:p-8"
    >
      <div className="flex items-start justify-between">
        <Icon className="h-8 w-8 text-foreground" />
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-105">
          <ArrowUpRightIcon className="h-5 w-5" />
        </span>
      </div>

      <h3 className="mt-12 text-h3 font-semibold leading-tight tracking-tight text-card-foreground">
        {service.title}
      </h3>
      <p className="mt-4 text-body-md leading-relaxed text-muted-foreground">
        {service.description}
      </p>
    </motion.article>
  );
}

/** What we offer — staggered services grid with line icons + corner actions. */
export function Steps() {
  // Split into three columns so we can cascade them on desktop.
  const columns = [services.slice(0, 2), services.slice(2, 4), services.slice(4, 6)];

  return (
    <section className="py-20 sm:py-28">
      <Container className="flex flex-col gap-14 lg:gap-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <span className="inline-flex w-fit rounded-full border border-accent/50 bg-background/40 px-5 py-2.5 text-caption font-semibold uppercase tracking-[0.14em] text-foreground">
            What we offer
          </span>
          <h2 className="max-w-2xl text-balance text-display-md font-bold leading-tight tracking-tight text-foreground sm:text-display-lg lg:text-right">
            Everything your agency needs to sell more property
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3 md:gap-7">
          {columns.map((col, ci) => (
            <div
              key={ci}
              className={cn(
                "flex flex-col gap-6 md:gap-7",
                ci === 1 && "md:mt-16",
                ci === 2 && "md:mt-32",
              )}
            >
              {col.map((service, i) => (
                <ServiceCard key={service.title} service={service} index={ci * 2 + i} />
              ))}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

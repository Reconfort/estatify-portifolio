"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@estatify/utils";
import {
  ArrowRightIcon,
  GlobeIcon,
  LeadsIcon,
  ListingsIcon,
  LocationIcon,
} from "@estatify/ui/icons";
import { Badge } from "@estatify/ui";
import { showcase, steps } from "@/components/landing-data";

const ease = [0.22, 1, 0.36, 1] as const;

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease },
  }),
};

const stepMeta: Record<
  (typeof steps)[number]["n"],
  { icon: ReactNode; preview: ReactNode; tint: string }
> = {
  "01": {
    icon: <GlobeIcon className="h-5 w-5" />,
    tint: "from-primary/12 to-primary/4",
    preview: (
      <div className="flex items-center gap-2" aria-hidden>
        {["#1a4d3e", "#c9a227", "#f4f4f5"].map((color) => (
          <span
            key={color}
            className="h-7 w-7 rounded-full border border-border/60"
            style={{ backgroundColor: color }}
          />
        ))}
        <span className="ml-1 rounded-md border border-border/60 bg-background px-2 py-1 text-[10px] font-medium text-muted-foreground">
          youragency.rw
        </span>
      </div>
    ),
  },
  "02": {
    icon: <ListingsIcon className="h-5 w-5" />,
    tint: "from-accent/15 to-accent/5",
    preview: (
      <div className="grid grid-cols-3 gap-1.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <div key={i} className="overflow-hidden rounded-md border border-border/50 bg-background">
            <div
              className={cn(
                "h-8 bg-gradient-to-br",
                i === 0 ? "from-primary/25" : i === 1 ? "from-accent/30" : "from-secondary",
              )}
            />
            <div className="space-y-1 p-1.5">
              <span className="block h-1 w-full rounded-full bg-muted" />
              <span className="block h-1 w-2/3 rounded-full bg-muted/70" />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  "03": {
    icon: <LeadsIcon className="h-5 w-5" />,
    tint: "from-success/15 to-success/5",
    preview: (
      <div className="flex flex-col gap-1.5" aria-hidden>
        {[
          { name: "New enquiry", time: "2m ago" },
          { name: "Viewing booked", time: "14m ago" },
        ].map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between rounded-lg border border-border/50 bg-background px-2.5 py-1.5"
          >
            <span className="text-[10px] font-medium text-foreground">{item.name}</span>
            <span className="text-[9px] text-muted-foreground">{item.time}</span>
          </div>
        ))}
      </div>
    ),
  },
};

export function StepsGrid() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute left-[16.5%] right-[16.5%] top-[4.25rem] hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block"
      />
      <div className="grid gap-5 md:grid-cols-3 md:gap-6">
        {steps.map((step, i) => {
          const meta = stepMeta[step.n];
          return (
            <motion.article
              key={step.n}
              custom={i}
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-6% 0px" }}
              {...(!reduceMotion ? { whileHover: { y: -6 } } : {})}
              transition={{ duration: 0.25, ease }}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card p-6",
                "hover:border-primary/20",
              )}
            >
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80",
                  meta.tint,
                )}
              />
              <div className="relative flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/10 bg-background/90 text-primary ring-1 ring-primary/5">
                  {meta.icon}
                </div>
                <span className="text-display-md font-bold leading-none text-primary/15">{step.n}</span>
              </div>

              <div className="relative mt-5 flex flex-col gap-2">
                <h3 className="text-h4 text-card-foreground">{step.title}</h3>
                <p className="text-body-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>

              <div className="relative mt-5 rounded-xl border border-border/50 bg-background/80 p-3 backdrop-blur-sm">
                {meta.preview}
              </div>

              {i < steps.length - 1 ? (
                <ArrowRightIcon
                  className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-border md:block lg:-right-5"
                  aria-hidden
                />
              ) : null}
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

export function ShowcaseGrid() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {showcase.map((property, i) => (
        <motion.article
          key={property.name}
          custom={i}
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-6% 0px" }}
          {...(!reduceMotion ? { whileHover: { y: -8 } } : {})}
          transition={{ duration: 0.28, ease }}
          className={cn(
            "group overflow-hidden rounded-3xl border border-border/70 bg-card",
            "hover:border-primary/20",
          )}
        >
          <div className="relative h-52 overflow-hidden sm:h-56">
            <motion.div
              className="absolute inset-0"
              {...(!reduceMotion ? { whileHover: { scale: 1.06 } } : {})}
              transition={{ duration: 0.55, ease }}
            >
              <Image
                src={property.image}
                alt={property.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
            <div className="absolute left-4 top-4">
              <Badge variant="accent" className="bg-white/90 text-sm">
                {property.tag}
              </Badge>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
              <div>
                <h3 className="text-h5 text-white">{property.name}</h3>
                <p className="mt-0.5 flex items-center gap-1 text-caption text-white/90">
                  <LocationIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {property.location}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border/60 px-5 py-4">
            <p className="text-h5 text-primary">{property.price}</p>
            <span className="flex items-center gap-1 text-caption font-medium text-muted-foreground transition-colors group-hover:text-primary">
              View listing
              <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

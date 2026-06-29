"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@estatify/utils";
import { ArrowRightIcon, CheckIcon, SparkleIcon } from "@estatify/ui/icons";
import { Badge, Button, Marquee } from "@estatify/ui";
import { pricing, testimonials } from "@/components/landing-data";

const ease = [0.22, 1, 0.36, 1] as const;

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease },
  }),
};

function initials(name: string) {
  return name
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden className={className} viewBox="0 0 32 32" fill="currentColor">
      <path d="M10 18c0-3.3 2.1-6.2 5.2-7.3L13 6.8C7.8 8.5 4 13.2 4 18.6V26h8v-8H10zm14 0c0-3.3 2.1-6.2 5.2-7.3L27 6.8C21.8 8.5 18 13.2 18 18.6V26h8v-8h-2z" />
    </svg>
  );
}

function StarRow() {
  return (
    <div className="flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="h-3.5 w-3.5 text-accent" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsMarquee() {
  return (
    <Marquee speed={42} className="py-2">
      {testimonials.map((t) => (
        <figure
          key={t.name}
          className={cn(
            "group flex w-88 shrink-0 flex-col gap-5 rounded-3xl border border-border/70 bg-card p-6",
            "shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-accent/25 hover:shadow-md",
          )}
        >
          <div className="flex items-center justify-between">
            <QuoteIcon className="h-7 w-7 text-accent/25 transition-colors group-hover:text-accent/40" />
            <StarRow />
          </div>
          <blockquote className="min-h-[4.5rem] text-body-md leading-relaxed text-card-foreground">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <figcaption className="flex items-center gap-3 border-t border-border/60 pt-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-body-sm font-semibold text-lime-800 ring-1 ring-accent/25">
              {initials(t.name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-body-sm font-semibold text-foreground">{t.name}</p>
              <p className="truncate text-caption text-muted-foreground">{t.role}</p>
            </div>
          </figcaption>
        </figure>
      ))}
    </Marquee>
  );
}

export function PricingGrid() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="grid items-stretch gap-6 pt-6 lg:grid-cols-3 lg:gap-5 lg:pt-8">
      {pricing.map((tier, i) => {
        const isFeatured = tier.featured;

        return (
          <motion.article
            key={tier.name}
            custom={i}
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-6% 0px" }}
            {...(!reduceMotion ? { whileHover: { y: -4 } } : {})}
            transition={{ duration: 0.28, ease }}
            className={cn("relative flex flex-col", isFeatured && "lg:z-10")}
          >
            {isFeatured ? (
              <div className="absolute left-1/2 top-0 z-30 -translate-x-1/2 -translate-y-1/2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent px-4 py-1.5 text-caption font-semibold text-accent-foreground">
                  <SparkleIcon className="h-3.5 w-3.5 text-accent-foreground" aria-hidden />
                  Most popular
                </span>
              </div>
            ) : null}

            <div
              className={cn(
                "relative flex h-full flex-col gap-6 rounded-3xl border p-8 transition-[border-color,box-shadow] duration-300",
                isFeatured
                  ? "border-accent/30 bg-card pt-10 shadow-md ring-1 ring-accent/15"
                  : "border-border/70 bg-card shadow-sm hover:border-accent/20 hover:shadow-md",
              )}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-h4 text-card-foreground">{tier.name}</h3>
                    <p className="text-body-sm text-muted-foreground">{tier.blurb}</p>
                  </div>
                  {isFeatured ? (
                    <Badge variant="accent" className="shrink-0 text-xs">
                      Best value
                    </Badge>
                  ) : null}
                </div>
              </div>

              <div
                className={cn(
                  "rounded-2xl px-1 py-1",
                  isFeatured ? "border border-accent/15 bg-accent/5 px-4 py-4" : "border-b border-border/60 pb-6",
                )}
              >
                <p className="flex items-end gap-1">
                  <span
                    className={cn(
                      "font-semibold tracking-tight text-foreground",
                      isFeatured ? "text-display-lg" : "text-display-md",
                    )}
                  >
                    {tier.price}
                  </span>
                  {tier.cadence ? (
                    <span className="pb-2 text-body-sm text-muted-foreground">{tier.cadence}</span>
                  ) : null}
                </p>
                {isFeatured ? (
                  <p className="mt-2 text-caption font-medium text-lime-800">
                    14-day trial included · Cancel anytime
                  </p>
                ) : null}
              </div>

              <ul className="flex flex-1 flex-col gap-3">
                {tier.features.map((feature, fi) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: reduceMotion ? 0 : 0.12 + fi * 0.04, duration: 0.4, ease }}
                    className="flex items-start gap-3 text-body-sm text-card-foreground"
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                        isFeatured ? "bg-accent text-accent-foreground" : "bg-accent/10 text-lime-800",
                      )}
                    >
                      <CheckIcon className="h-3 w-3" />
                    </span>
                    {feature}
                  </motion.li>
                ))}
              </ul>

              <Button
                variant={isFeatured ? "accent" : "outline"}
                className={cn(
                  "group mt-auto w-full rounded-full",
                  !isFeatured && "hover:border-accent/40 hover:text-foreground",
                )}
              >
                {tier.cta}
                {isFeatured ? (
                  <ArrowRightIcon
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                ) : null}
              </Button>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}

const ctaLeadBars = [38, 55, 42, 68, 50, 72] as const;

/** Single-panel product mock — no overlapping cards, reads as one dashboard. */
function CtaIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.6, ease }}
      className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-sm xl:max-w-md"
      aria-hidden
    >
      <div className="overflow-hidden rounded-2xl border border-white/15 bg-white shadow-[0_20px_48px_rgba(0,0,0,0.22)]">
        <div className="flex items-center gap-2 border-b border-border/40 bg-muted/40 px-3 py-2.5">
          <div className="flex items-center gap-1.5" aria-hidden>
            <span className="h-2 w-2 rounded-full bg-destructive/70" />
            <span className="h-2 w-2 rounded-full bg-warning/70" />
            <span className="h-2 w-2 rounded-full bg-success/70" />
          </div>
          <span className="truncate text-[10px] text-muted-foreground">yourcompany.estatify.rw</span>
        </div>

        <div className="relative aspect-16/10">
          <Image
            src="/assets/bento/modern-home.jpg"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 448px"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-black/50 to-transparent" />
          <span className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold text-accent-foreground">
            Live in 48h
          </span>
          <div className="absolute bottom-3 left-3 right-3 space-y-1.5">
            <span className="block h-1.5 w-2/3 rounded-full bg-white/90" />
            <span className="block h-1.5 w-1/2 rounded-full bg-white/70" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border/40 bg-white px-4 py-3.5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              This week
            </p>
            <p className="text-h5 text-foreground">+128 leads</p>
          </div>
          <div className="flex h-9 w-28 items-end gap-1">
            {ctaLeadBars.map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-t-sm bg-lime-500"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function CtaBandPolished() {
  const trustPoints = [
    "Setup in a weekend",
    "No credit card",
    "Cancel anytime",
  ] as const;

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-lime-800/40 px-6 py-12 sm:px-10 sm:py-14 lg:px-12 lg:py-16"
      style={{
        background:
          "linear-gradient(145deg, color-mix(in oklab, var(--color-lime-900) 92%, black) 0%, color-mix(in oklab, var(--color-lime-950) 96%, black) 52%, color-mix(in oklab, var(--color-lime-800) 78%, black) 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/50 to-transparent"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-caption font-medium text-white/90 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            14-day free trial · No card required
          </span>

          <div className="space-y-3">
            <h2 className="max-w-xl text-h1 text-white sm:text-display-md">
              Your agency&apos;s platform is one weekend away
            </h2>
            <p className="max-w-lg text-body-lg leading-relaxed text-white/75">
              Join the agencies building branded, lead-generating property sites with Estatify.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <Button size="lg" variant="accent" className="group rounded-full px-8">
              Start free
              <ArrowRightIcon
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white/25 bg-transparent px-8 text-white hover:border-white/40 hover:bg-white/10"
            >
              Book a demo
            </Button>
          </div>

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-white/10 pt-5 lg:justify-start">
            {trustPoints.map((point) => (
              <li
                key={point}
                className="flex items-center gap-2 text-caption font-medium text-white/70"
              >
                <CheckIcon className="h-3.5 w-3.5 text-accent" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </motion.div>

        <CtaIllustration />
      </div>
    </div>
  );
}

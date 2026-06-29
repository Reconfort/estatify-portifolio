"use client";

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
    <svg
      aria-hidden
      className={className}
      viewBox="0 0 32 32"
      fill="currentColor"
    >
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
    <Marquee speed={38} className="py-1">
      {testimonials.map((t) => (
        <figure
          key={t.name}
          className={cn(
            "group flex w-[22rem] shrink-0 flex-col gap-5 rounded-3xl border border-border/70 bg-card p-6",
          )}
        >
          <div className="flex items-center justify-between">
            <QuoteIcon className="h-8 w-8 text-primary/15 transition-colors group-hover:text-primary/25" />
            <StarRow />
          </div>
          <blockquote className="text-body-md leading-relaxed text-card-foreground">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <figcaption className="flex items-center gap-3 border-t border-border/60 pt-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-body-sm font-semibold text-primary ring-2 ring-primary/10">
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
    <div className="grid items-stretch gap-6 pt-4 lg:grid-cols-3 lg:gap-5 lg:pt-5">
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
            {...(!reduceMotion ? { whileHover: { y: isFeatured ? -6 : -4 } } : {})}
            transition={{ duration: 0.28, ease }}
            className={cn(
              "relative flex flex-col",
              isFeatured && "lg:-mt-4 lg:mb-4 lg:z-10",
            )}
          >
            {isFeatured ? (
              <div className="absolute left-1/2 top-0 z-30 -translate-x-1/2 -translate-y-1/2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent px-4 py-1.5 text-caption font-semibold text-accent-foreground shadow-sm">
                  <SparkleIcon className="h-3.5 w-3.5 text-accent-foreground" aria-hidden />
                  Most popular
                </span>
              </div>
            ) : null}

            {isFeatured ? (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-accent via-lime-500 to-lime-700 p-px"
              >
                <div className="h-full w-full rounded-3xl bg-card" />
              </div>
            ) : null}

            <div
              className={cn(
                "relative flex h-full flex-col gap-6 rounded-3xl border p-8",
                isFeatured
                  ? "border-transparent bg-gradient-to-b from-accent/[0.07] via-card to-card pt-10"
                  : "overflow-hidden border-border/70 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_28px_rgba(0,0,0,0.05)]",
                "transition-[border-color,box-shadow] duration-300 hover:border-accent/25",
                !isFeatured &&
                  "hover:shadow-[0_2px_4px_rgba(0,0,0,0.04),0_16px_40px_rgba(0,0,0,0.08)]",
              )}
            >
              {isFeatured ? (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-32 rounded-t-3xl bg-gradient-to-b from-accent/10 to-transparent"
                />
              ) : (
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-secondary/60 blur-3xl"
                />
              )}

              <div className="relative flex flex-col gap-2 pt-2">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-h4 text-card-foreground">{tier.name}</h3>
                  {isFeatured ? (
                    <Badge variant="accent" className="shrink-0">
                      Best value
                    </Badge>
                  ) : null}
                </div>
                <p className="text-body-sm text-muted-foreground">{tier.blurb}</p>
              </div>

              <div
                className={cn(
                  "relative",
                  isFeatured
                    ? "rounded-2xl border border-accent/15 bg-accent/[0.06] px-4 py-4"
                    : "border-b border-border/60 pb-6",
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

              <ul className="relative flex flex-1 flex-col gap-3">
                {tier.features.map((feature, fi) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: reduceMotion ? 0 : 0.15 + fi * 0.05, duration: 0.4, ease }}
                    className="flex items-start gap-3 text-body-sm text-card-foreground"
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                        isFeatured
                          ? "bg-accent text-accent-foreground shadow-sm"
                          : "bg-accent/10 text-lime-800",
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
                className="group relative mt-auto w-full rounded-full"
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

export function CtaBandPolished() {
  const reduceMotion = useReducedMotion();

  const trustPoints = [
    "Setup in a weekend",
    "No credit card",
    "Cancel anytime",
  ] as const;

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-white/10 px-6 py-14 sm:px-10 sm:py-16 lg:px-12 lg:py-14"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in oklab, var(--color-lime-400) 75%, white) 0%, transparent 55%), linear-gradient(145deg, color-mix(in oklab, var(--color-lime-400) 35%, var(--color-lime-800)) 0%, color-mix(in oklab, var(--color-lime-700) 82%, #1b2c05) 48%, color-mix(in oklab, var(--color-lime-800) 90%, black) 100%)",
        boxShadow:
          "0 24px 60px -12px color-mix(in oklab, var(--color-lime-500) 55%, transparent), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 45% at 50% 40%, color-mix(in oklab, white 12%, transparent), transparent 70%)",
        }}
      />

      {reduceMotion ? (
        <>
          <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        </>
      ) : (
        <>
          <motion.div
            aria-hidden
            animate={{ x: [0, 24, 0], y: [0, -14, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-accent/25 blur-3xl"
          />
          <motion.div
            aria-hidden
            animate={{ x: [0, -18, 0], y: [0, 16, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-white/12 blur-3xl"
          />
        </>
      )}

      <div className="relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease }}
          className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.45, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-caption font-medium text-primary-foreground/95 shadow-sm backdrop-blur-md"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" aria-hidden />
            14-day free trial · No card required
          </motion.span>

          <div className="space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.18, duration: 0.55, ease }}
              className="max-w-xl text-h1 text-primary-foreground sm:text-display-md"
            >
              Your agency&apos;s platform is one weekend away
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.28, duration: 0.5, ease }}
              className="max-w-lg text-body-lg leading-relaxed text-primary-foreground/88"
            >
              Join the agencies building branded, lead-generating property sites with Estatify.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.38, duration: 0.5, ease }}
            className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4"
          >
            <Button
              size="lg"
              variant="accent"
              className="group rounded-full px-8 shadow-[0_10px_32px_-6px_color-mix(in_oklab,var(--color-accent)_70%,transparent)] transition-transform hover:scale-[1.03]"
            >
              Start free
              <ArrowRightIcon
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white/40 bg-white/8 px-8 text-primary-foreground backdrop-blur-sm hover:border-white/55 hover:bg-white/16"
            >
              Book a demo
            </Button>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.48, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start"
          >
            {trustPoints.map((point) => (
              <li
                key={point}
                className="flex items-center gap-2 text-caption font-medium text-primary-foreground/75"
              >
                <CheckIcon className="h-3.5 w-3.5 text-accent" aria-hidden />
                {point}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.7, ease }}
          className="relative mx-auto hidden w-full max-w-md lg:mx-0 lg:block"
          aria-hidden
        >
          <div className="relative min-h-[17rem]">
            <motion.div
              {...(!reduceMotion
                ? { animate: { y: [0, -6, 0] }, transition: { duration: 5, repeat: Infinity, ease: "easeInOut" } }
                : {})}
              className="absolute right-0 top-0 w-[78%] overflow-hidden rounded-2xl border border-white/20 bg-white/95 shadow-[0_24px_50px_rgba(0,0,0,0.25)]"
            >
              <div className="flex items-center gap-2 border-b border-border/50 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-destructive/70" />
                <span className="h-2 w-2 rounded-full bg-warning/70" />
                <span className="h-2 w-2 rounded-full bg-success/70" />
                <span className="ml-1 truncate text-[10px] text-muted-foreground">
                  yourcompany.estatify.rw
                </span>
              </div>
              <div
                className="h-28 bg-cover bg-center"
                style={{ backgroundImage: "url(/assets/bento/modern-home.jpg)" }}
              />
              <div className="space-y-1.5 p-3">
                <span className="block h-2 w-2/3 rounded-full bg-muted" />
                <span className="block h-2 w-1/2 rounded-full bg-muted/70" />
              </div>
            </motion.div>

            <motion.div
              {...(!reduceMotion
                ? {
                    animate: { y: [0, 8, 0] },
                    transition: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
                  }
                : {})}
              className="absolute bottom-2 left-0 w-[52%] rounded-2xl border border-white/20 bg-white/95 p-4 shadow-[0_20px_44px_rgba(0,0,0,0.22)]"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                This week
              </p>
              <p className="mt-1 text-h4 text-foreground">+128 leads</p>
              <div className="mt-3 flex items-end gap-1">
                {[40, 62, 48, 78, 56, 88].map((h, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-t bg-lime-500/80"
                    style={{ height: `${h * 0.22}rem` }}
                  />
                ))}
              </div>
            </motion.div>

            <motion.div
              {...(!reduceMotion
                ? {
                    animate: { y: [0, -4, 0] },
                    transition: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 },
                  }
                : {})}
              className="absolute left-[38%] top-[18%] rounded-full border border-white/30 bg-accent px-3 py-1.5 text-caption font-semibold text-accent-foreground shadow-lg"
            >
              Live in 48h
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

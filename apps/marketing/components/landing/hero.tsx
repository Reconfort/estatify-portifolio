"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Button, Container, TiltCard } from "@estatify/ui";
import { CheckIcon } from "@estatify/ui/icons";
import { hero } from "@/components/landing-data";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.2, 0, 0, 1] as const },
  }),
};

const PREVIEW_URL = "yourcompany.estatify.rw";

/**
 * Hero — full-bleed photo, centered pitch, dashboard preview overlapping the logos band.
 */
export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate min-h-[88svh] overflow-visible sm:min-h-[92svh]">
      <Image
        src="/assets/Concrete_Building_Daytime.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[center_30%]"
      />

      {/* Solid legibility scrim (no gradient). */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "color-mix(in oklab, var(--neutral-950) 60%, transparent)" }}
      />

      <Container className="relative flex flex-col items-center gap-6 px-5 pb-[clamp(13rem,34vw,20rem)] pt-28 text-center sm:gap-7 sm:pt-32 md:pt-36">
        <motion.span
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-caption font-medium text-white backdrop-blur-sm"
        >
          <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_var(--color-accent)]" />
          {hero.badge}
        </motion.span>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="max-w-4xl text-balance text-display-md font-medium tracking-tight text-white sm:text-display-xl"
        >
          {hero.title} <span className="text-accent">{hero.highlight}</span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="max-w-2xl text-balance text-body-md text-white/85 sm:text-body-lg"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row"
        >
          <Button
            size="lg"
            className="w-full rounded-full bg-background text-foreground hover:bg-background/90 sm:w-auto"
          >
            {hero.secondaryCta}
          </Button>
          <Button size="lg" variant="accent" className="w-full rounded-full sm:w-auto">
            {hero.primaryCta}
          </Button>
        </motion.div>

        <motion.p
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 text-caption font-medium text-white/70"
        >
          <CheckIcon className="h-3.5 w-3.5 text-accent" aria-hidden />
          {hero.note}
        </motion.p>
      </Container>

      <motion.div
        custom={5}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="absolute inset-x-0 bottom-12 z-10 flex translate-y-[46%] justify-center px-4 sm:px-6 rounded-t-3xl! scale-95 "
      >
        <div className="w-full max-w-[min(100%,56rem)]">
          <TiltCard
            intensity={reduceMotion ? 0 : 4}
            className="overflow-hidden bg-card p-0 shadow-[0_32px_70px_-20px_rgba(0,0,0,0.55)] ring-1 ring-white/15"
          >
            <SitePreviewFrame />
          </TiltCard>
        </div>
      </motion.div>
    </section>
  );
}

/** Browser chrome framing a tenant-site preview. */
function SitePreviewFrame() {
  return (
    <div className="overflow-hidden rounded-2xl text-left">
      <div className="flex items-end gap-1 border-b border-border/60 bg-muted/50 px-3 pt-3">
        <div className="flex items-center gap-1.5 px-1 pb-2.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/80" />
        </div>
        <div className="flex min-w-0 max-w-xs items-center gap-2 rounded-t-lg border border-b-0 border-border bg-background px-4 py-2 shadow-sm">
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-accent text-[10px] font-bold text-accent-foreground">
            E
          </span>
          <span className="truncate text-xs font-base text-foreground">{PREVIEW_URL}</span>
        </div>
      </div>

      <Image
        src="/assets/dashboard_preview.avif"
        alt={`${PREVIEW_URL} dashboard preview`}
        width={2043}
        height={1328}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 896px"
        className="block h-auto w-full bg-background scale-95"
        draggable={false}
        priority
      />
    </div>
  );
}

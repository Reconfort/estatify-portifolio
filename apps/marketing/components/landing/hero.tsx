"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Button, Container, TiltCard } from "@estatify/ui";
import { hero } from "@/components/landing-data";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.2, 0, 0, 1] as const },
  }),
};

/**
 * Hero — full-bleed photographic background (tenant/agency building image) with
 * a legibility scrim, overlaid headline + CTAs, and an original Estatify
 * tenant site preview in a browser frame. White text passes contrast thanks to the dark scrim.
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden min-h-screen">
      {/* Background photo */}
      <Image
        src="/assets/Concrete_Building_Daytime.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      {/* Legibility scrim (token-based dark gradient) */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in oklab, var(--neutral-950) 82%, transparent), color-mix(in oklab, var(--neutral-950) 62%, transparent) 42%, color-mix(in oklab, var(--neutral-950) 94%, transparent))",
        }}
      />

      <Container className="relative flex flex-col items-center gap-7 px-5 pb-0 pt-36 text-center sm:pt-40">
        <motion.span
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-caption font-medium text-white backdrop-blur"
        >
          <span className="h-2 w-2 rounded-full bg-accent" />
          {hero.badge}
        </motion.span>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="max-w-4xl text-display-md font-medium text-white sm:text-display-xl"
        >
          {hero.title} <span className="text-accent">{hero.highlight}</span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="max-w-2xl text-body-lg text-white/85"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button size="lg" className="bg-background text-foreground hover:bg-background/90">
            {hero.secondaryCta}
          </Button>
          <Button size="lg" variant="accent">
            {hero.primaryCta}
          </Button>
        </motion.div>

        {/* Tenant site preview — browser frame with iframe */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="w-full max-w-5xl lg:scale-90"
        >
          <TiltCard intensity={4} className="overflow-hidden bg-card/95 p-0 backdrop-blur">
            <SitePreviewFrame />
          </TiltCard>
        </motion.div>
      </Container>
    </section>
  );
}

const PREVIEW_URL = "yourcompany.estatify.rw";

/** Browser chrome framing a tenant-site preview. */
function SitePreviewFrame() {
  return (
    <div className="overflow-hidden rounded-2xl text-left">
      <div className="flex items-end gap-1 border-b border-border bg-muted/40 px-3 pt-3">
        <div className="flex items-center gap-1.5 px-1 pb-2.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/80" />
        </div>
        <div className="flex min-w-0 max-w-xs items-center gap-2 rounded-t-lg border border-b-0 border-border bg-background px-4 py-2">
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-primary text-[10px] font-bold text-primary-foreground">
            E
          </span>
          <span className="truncate text-body-sm font-medium text-foreground">{PREVIEW_URL}</span>
        </div>
      </div>

      <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
        <Image
          src="/assets/dashboard_preview.avif"
          alt={`${PREVIEW_URL} site preview`}
          fill
          sizes="(max-width: 1024px) 100vw, 896px"
          className="object-contain object-center"
          draggable={false}
        />
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRightIcon, CheckIcon } from "@estatify/ui/icons";
import { Button, Container } from "@estatify/ui";

const ease = [0.22, 1, 0.36, 1] as const;

const ctaLeadBars = [38, 55, 42, 68, 50, 72] as const;

/** Single-panel product mock — reads as one dashboard. */
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
              <span key={i} className="flex-1 rounded-t-sm bg-lime-500" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CtaBandPolished() {
  const trustPoints = ["Setup in a weekend", "No credit card", "Cancel anytime"] as const;

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
              <li key={point} className="flex items-center gap-2 text-caption font-medium text-white/70">
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

/** Final CTA band. */
export function CtaBand() {
  return (
    <section className="py-24 sm:py-28">
      <Container>
        <CtaBandPolished />
      </Container>
    </section>
  );
}

"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRightIcon, CheckIcon } from "@estatify/ui/icons";
import { Button, Container } from "@estatify/ui";

const ease = [0.22, 1, 0.36, 1] as const;

const CTA_BUILDING_IMAGE = "/assets/Image.png";

/** Building cutout — primary CTA visual on the dark panel. */
function CtaIllustration() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.65, ease }}
      className="relative mx-auto flex w-full max-w-sm items-end justify-center lg:mx-0 lg:max-w-md"
    >
      <motion.div
        {...(!reduceMotion
          ? { animate: { y: [0, -10, 0] }, transition: { duration: 6, repeat: Infinity, ease: "easeInOut" } }
          : {})}
        className="relative w-full"
      >
        <Image
          src={CTA_BUILDING_IMAGE}
          alt="Modern property building representing your agency platform"
          width={941}
          height={993}
          sizes="(max-width: 1024px) 80vw, 448px"
          className="h-auto w-full object-contain object-bottom drop-shadow-[0_32px_64px_rgba(0,0,0,0.45)] scale-125"
        />
      </motion.div>

      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        {...(!reduceMotion
          ? {
              animate: { y: [0, -4, 0] },
              transition: {
                opacity: { delay: 0.45, duration: 0.4, ease },
                scale: { delay: 0.45, duration: 0.4, ease },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
              },
            }
          : { transition: { delay: 0.45, duration: 0.4, ease } })}
        className="absolute right-2 top-[18%] rounded-full border border-white/20 bg-accent px-3 py-1.5 text-caption font-semibold text-accent-foreground shadow-lg sm:right-6"
      >
        Live in 48h
      </motion.span>

      <motion.div
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.55, duration: 0.5, ease }}
        className="absolute bottom-[12%] left-0 rounded-2xl border border-white/15 bg-white/95 px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.25)] backdrop-blur-sm sm:left-2"
      >
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          This week
        </p>
        <p className="text-h5 text-foreground">+128 leads</p>
      </motion.div>
    </motion.div>
  );
}

function CtaBandPolished() {
  const trustPoints = ["Setup in a weekend", "No credit card", "Cancel anytime"] as const;

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-lime-800/40 px-6 py-12 sm:px-10 sm:py-14 lg:px-12 lg:py-16"
      style={{
        background: "var(--color-lime-950)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-accent/40"
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

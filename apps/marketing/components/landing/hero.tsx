"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Container } from "@estatify/ui";
import { ArrowRightIcon } from "@estatify/ui/icons";
import { heroV2 } from "@/components/landing-data";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.2, 0, 0, 1] as const },
  }),
};

/**
 * Hero — full-bleed photo, editorial split layout: oversized headline left,
 * supporting statement + CTA right, three pillar cards anchored at the bottom.
 *
 * Pinned (`sticky top-0`) so the rest of the page scrolls over it like a
 * curtain — page.tsx supplies the rounded overlay wrapper. The photo drifts
 * slowly while pinned for depth; disabled under reduced motion.
 */
export function Hero() {
  const ref = React.useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <section
      ref={ref}
      className="sticky top-0 z-0 isolate flex min-h-[86svh] flex-col justify-end overflow-hidden"
    >
      <motion.div
        aria-hidden
        {...(reduceMotion ? {} : { style: { y: bgY } })}
        className="absolute inset-0 -z-20 scale-110"
      >
        <Image
          src="/assets/Concrete_Building_Daytime.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_30%]"
        />
      </motion.div>

      {/* Solid legibility scrim (no gradients per design constitution). */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "color-mix(in oklab, var(--neutral-950) 62%, transparent)" }}
      />

      <Container className="flex flex-col gap-10 pb-32 pt-32 sm:pt-36 lg:gap-14">
        <div className="grid items-end gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div className="flex flex-col gap-5">
            <motion.p
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 text-overline uppercase tracking-[0.2em] text-accent"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              {heroV2.eyebrow}
            </motion.p>
            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-balance text-display-lg font-bold tracking-tight text-white sm:text-display-xl lg:text-display-2xl"
            >
              {heroV2.title}
            </motion.h1>
          </div>

          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex max-w-md flex-col gap-6"
          >
            <p className="text-body-md font-medium text-white/90 sm:text-body-lg">
              {heroV2.statement}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={heroV2.cta.href}
                className="group inline-flex w-fit items-center gap-2 rounded-full bg-accent px-6 py-3 text-body-sm font-semibold text-accent-foreground transition-[background-color,transform] duration-150 ease-out hover:bg-accent/90 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {heroV2.cta.label}
                <ArrowRightIcon
                  className="h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
                  aria-hidden
                />
              </a>
              <a
                href={heroV2.secondaryCta.href}
                className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-body-sm font-semibold text-white transition-[background-color,transform] duration-150 ease-out hover:bg-white/10 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {heroV2.secondaryCta.label}
              </a>
            </div>
          </motion.div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-3">
          {heroV2.pillars.map((pillar, i) => (
            <motion.li
              key={pillar.title}
              custom={3 + i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-2 p-6 rounded-xl border border-white/15"
              style={{ background: "color-mix(in oklab, var(--neutral-950) 55%, transparent)" }}
            >
              <h2 className="text-h5 font-semibold text-white">{pillar.title}</h2>
              <p className="text-body-sm leading-relaxed text-white/70">{pillar.body}</p>
            </motion.li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

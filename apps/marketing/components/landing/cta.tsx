"use client";

import { motion } from "motion/react";
import { ArrowRightIcon, CheckIcon } from "@estatify/ui/icons";
import { Container } from "@estatify/ui";
import { workspaceSignUpUrl } from "@/lib/workspace-urls";

const ease = [0.23, 1, 0.32, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease },
  }),
};

const TRUST_POINTS = ["No credit card", "Cancel anytime", "Launch in a weekend"] as const;

/** Corner tick — the precision detail framing the panel. Decorative. */
function CornerTick({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute select-none font-mono text-body-md leading-none text-white/20 ${className}`}
    >
      +
    </span>
  );
}

/**
 * CtaBand — the final conversion block. Deliberately austere: one dark
 * brand panel, oversized typography, a single dominant action. No
 * illustrations, no invented metrics — restraint is the credibility.
 */
export function CtaBand() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div
          className="relative overflow-hidden rounded-3xl border border-white/10 px-6 py-20 text-center sm:px-12 sm:py-24 lg:py-28"
          style={{ background: "var(--green-950)" }}
        >
          {/* Accent hairline along the top edge. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-accent/40"
          />

          <CornerTick className="left-5 top-4" />
          <CornerTick className="right-5 top-4" />
          <CornerTick className="bottom-4 left-5" />
          <CornerTick className="bottom-4 right-5" />

          <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
            <motion.span
              custom={0}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-caption font-medium tracking-wide text-white/80"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              14-day free trial
            </motion.span>

            <motion.h2
              custom={1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="text-balance text-display-md font-bold tracking-tight text-white sm:text-display-lg lg:text-display-xl"
            >
              Your agency&apos;s website is one template away
            </motion.h2>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="max-w-xl text-balance text-body-lg leading-relaxed text-white/70"
            >
              Pick a template today, publish this weekend — your brand, your listings, your leads.
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="flex w-full flex-col items-center gap-5 sm:w-auto sm:flex-row sm:gap-7"
            >
              <a
                href={workspaceSignUpUrl()}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-9 py-3.5 text-body-sm font-semibold text-accent-foreground transition-[background-color,transform] duration-150 ease-out hover:bg-accent/90 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:w-auto"
              >
                Start Free
                <ArrowRightIcon
                  className="h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
                  aria-hidden
                />
              </a>
              <a
                href="#templates"
                className="text-body-sm font-semibold text-white/80 underline-offset-4 transition-colors duration-150 hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                Browse templates
              </a>
            </motion.div>

            <motion.ul
              custom={4}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="mt-2 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 border-t border-white/10 pt-6"
            >
              {TRUST_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-2 text-caption font-medium text-white/60"
                >
                  <CheckIcon className="h-3.5 w-3.5 text-accent" aria-hidden />
                  {point}
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

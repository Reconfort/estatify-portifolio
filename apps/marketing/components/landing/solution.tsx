"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@estatify/ui";
import { CheckIcon, LockIcon, MailIcon, MoreVerticalIcon, StarIcon } from "@estatify/ui/icons";
import { cn } from "@estatify/utils";
import { EASE_OUT, Reveal } from "./reveal";
import { SectionHeader } from "./section-header";
import { solution } from "@/components/landing-data";

const skeletons = {
  design: <SkeletonDesign />,
  invest: <SkeletonInvest />,
  support: <SkeletonSupport />,
  launch: <SkeletonLaunch />,
} as const satisfies Record<(typeof solution.cards)[number]["skeleton"], ReactNode>;

/**
 * Solution — feature bento under Problem.
 * 3-col chessboard (2+1 / 1+2) keeps vertical gutters aligned across rows.
 * Card illustrations mirror the reference mockup 1:1 (composition, overlaps,
 * crops) with the palette mapped to the Estatify lime/green brand.
 *
 * NOTE: motion.* owns `transform` inline, so positioning translates/rotates
 * always live on a plain wrapper element, never on the animated node itself.
 */
export function Solution() {
  return (
    <section id="solution" className="py-20 sm:py-28">
      <Container className="flex flex-col gap-12 sm:gap-14">
        <SectionHeader
          eyebrow={solution.eyebrow}
          eyebrowVariant="badge"
          eyebrowDotClassName="bg-lime-500"
          title={solution.title.lead}
          titleMuted={solution.title.muted}
        />

        <div className="relative mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[minmax(23rem,auto)]">
            {solution.cards.map((card, i) => (
              <Reveal key={card.key} index={i} className={cn(card.className, "h-full min-h-0")}>
                <FeatureCard>
                  <FeatureTitle>{card.title}</FeatureTitle>
                  <FeatureDescription>{card.description}</FeatureDescription>
                  <div className="mt-4 min-h-0 flex-1">{skeletons[card.skeleton]}</div>
                </FeatureCard>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function FeatureCard({ children }: { children?: ReactNode }) {
  return (
    <div className="relative flex h-full min-h-[24rem] flex-col overflow-hidden rounded-[1.75rem] border border-border/80 bg-card p-5 shadow-[0_1px_0_rgba(0,0,0,0.02)] sm:min-h-0 sm:p-7">
      {children}
    </div>
  );
}

function FeatureTitle({ children }: { children?: ReactNode }) {
  return (
    <h3 className="max-w-xl text-left text-xl font-semibold tracking-tight text-balance text-foreground md:text-lg md:leading-snug">
      {children}
    </h3>
  );
}

function FeatureDescription({ children }: { children?: ReactNode }) {
  return (
    <p className="mt-2 max-w-sm text-left text-sm leading-relaxed text-muted-foreground md:text-base">
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Card 1 — Premium design: orbit rings + avatars, browser, testimonial */
/* ------------------------------------------------------------------ */

/** Shared square stage (viewBox units). Rings + avatars use the same centre. */
const ORBIT = {
  size: 400,
  cx: 200,
  cy: 210, // slightly low so the top arc clears the title area
  rings: [90, 130, 170, 210],
  /** Avatars sit on this radius — must match a ring above. */
  avatarR: 170,
} as const;

function SkeletonDesign() {
  const reduceMotion = useReducedMotion();

  /**
   * Upper-arc angles only (deg, CSS y-down). These clear the browser chrome
   * so every avatar stays visible on the ring, not buried under the window.
   */
  const avatars = [
    { src: "/assets/bento/agent-2.jpg", angle: -150 }, // upper-left
    { src: "/assets/bento/agent-3.jpg", angle: -90 }, // top
    { src: "/assets/bento/agent-4.jpg", angle: -30 }, // upper-right
  ] as const;

  return (
    <div className="relative -mx-5 -mb-5 flex h-full min-h-64 items-end justify-center overflow-hidden sm:-mx-7 sm:-mb-7 sm:min-h-72">
      {/* One square stage: rings (back) → browser → avatars (front) */}
      <div className="relative aspect-square w-[min(100%,22rem)] sm:w-[min(100%,26rem)]">
        {/* Rings */}
        <svg
          viewBox={`0 0 ${ORBIT.size} ${ORBIT.size}`}
          className="pointer-events-none absolute inset-0 size-full"
          aria-hidden
        >
          {ORBIT.rings.map((r, i) => (
            <circle
              key={r}
              cx={ORBIT.cx}
              cy={ORBIT.cy}
              r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth={i === ORBIT.rings.length - 1 ? 1.25 : 1}
              strokeDasharray={i === ORBIT.rings.length - 1 ? "6 8" : undefined}
              className={cn(
                r === ORBIT.avatarR ? "text-border" : "text-border/60",
                i === ORBIT.rings.length - 1 && "text-border/50",
              )}
            />
          ))}
        </svg>

        {/* Browser — centred on the orbit, cropped by the card bottom */}
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: EASE_OUT }}
          className="absolute top-[32%] left-1/2 z-10 w-[68%] -translate-x-1/2 overflow-hidden rounded-t-lg border border-b-0 border-border/80 bg-background shadow-[0_20px_50px_-20px_rgba(0,0,0,0.22)]"
        >
          <div className="flex items-center gap-2 border-b border-border/50 bg-muted/30 px-2.5 py-2">
            <span className="flex shrink-0 items-center gap-1.5" aria-hidden>
              <span className="size-1.5 rounded-full bg-[#FF5F57]" />
              <span className="size-1.5 rounded-full bg-[#FEBC2E]" />
              <span className="size-1.5 rounded-full bg-[#28C840]" />
            </span>
            <span className="mx-auto flex min-w-0 flex-1 items-center gap-1 rounded-full border border-border/50 bg-background px-2.5 py-0.5">
              <LockIcon className="size-2.5 shrink-0 text-muted-foreground" aria-hidden />
              <span className="truncate text-[0.65rem] text-muted-foreground">
                youragency.estatify.rw
              </span>
              <StarIcon
                className="ml-auto size-2.5 shrink-0 text-muted-foreground/70"
                aria-hidden
              />
            </span>
          </div>
          <div className="relative aspect-[5/4] bg-background p-4">
            <div className="space-y-1.5" aria-hidden>
              <span className="block h-1.5 w-20 rounded-full bg-muted" />
              <span className="block h-1.5 w-12 rounded-full bg-muted" />
            </div>
            <div
              className="mt-3 h-[70%] w-[60%] rounded-lg bg-lime-500 shadow-[inset_0_-10px_20px_rgba(0,0,0,0.08)]"
              aria-hidden
            />
          </div>
        </motion.div>

        {/* Avatars — same SVG coordinate space, painted ABOVE the browser */}
        {avatars.map((avatar, i) => {
          const rad = (avatar.angle * Math.PI) / 180;
          const x = ORBIT.cx + ORBIT.avatarR * Math.cos(rad);
          const y = ORBIT.cy + ORBIT.avatarR * Math.sin(rad);

          return (
            <div
              key={avatar.src}
              aria-hidden
              className="absolute z-30 size-10 -translate-x-1/2 -translate-y-1/2 sm:size-11"
              style={{
                left: `${(x / ORBIT.size) * 100}%`,
                top: `${(y / ORBIT.size) * 100}%`,
              }}
            >
              <motion.span
                className="relative block size-full overflow-hidden rounded-full border-[2.5px] border-card  ring-1 ring-black/5"
                initial={{ opacity: 0, scale: 0.75 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.45, ease: EASE_OUT }}
              >
                <Image src={avatar.src} alt="" fill sizes="44px" className="object-cover" />
              </motion.span>
            </div>
          );
        })}

        {/* Testimonial — intentional overlap on the browser's left chrome */}
        <div className="absolute top-[75%] left-[2%] z-40 w-[min(100%,12.5rem)] sm:left-[4%]">
          <motion.div
            initial={{ opacity: 0, x: reduceMotion ? 0 : -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.45, ease: EASE_OUT }}
            className="rounded-lg border border-border/60 bg-card p-2.5 "
          >
            <div className="flex items-center gap-2.5">
              <div className="min-w-0 flex-1">
                <p className="text-caption font-semibold text-foreground">Kevin Hobbs</p>
                <p className="mt-0.5 text-caption leading-snug text-muted-foreground">
                  This site is seriously cool.
                </p>
              </div>
              <span className="relative size-9 shrink-0 overflow-hidden rounded-full ring-2 ring-border/40">
                <Image
                  src="/assets/bento/agent-2.jpg"
                  alt=""
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- */
/* Card 2 — Invest: rising profit chart + combined badge         */
/* ------------------------------------------------------------- */

/** Chart viewBox + peak point the marker/badge lock onto. */
const CHART = {
  w: 400,
  h: 200,
  /** Peak on the stroke path — keep in sync with the path `d` below. */
  peakX: 340,
  peakY: 36,
} as const;

function SkeletonInvest() {
  const reduceMotion = useReducedMotion();
  const peakLeft = `${(CHART.peakX / CHART.w) * 100}%`;
  const peakTop = `${(CHART.peakY / CHART.h) * 100}%`;

  return (
    <div className="relative -mx-5 -mb-5 mt-auto flex h-full min-h-56 flex-col justify-end overflow-hidden sm:-mx-7 sm:-mb-7 sm:min-h-64">
      {/* Chart stage — SVG + marker + badge share one box so the dot sits ON the line */}
      <div className="absolute inset-x-0 bottom-0 h-[13.5rem] sm:h-[15rem]">
        <svg
          viewBox={`0 0 ${CHART.w} ${CHART.h}`}
          className="absolute inset-0 size-full"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="solution-chart-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-lime-500)" stopOpacity="0.4" />
              <stop offset="60%" stopColor="var(--color-lime-500)" stopOpacity="0.12" />
              <stop offset="100%" stopColor="var(--color-lime-500)" stopOpacity="0" />
            </linearGradient>
          </defs>

          <motion.path
            d="M0 178 C60 176, 110 160, 160 125 C210 90, 260 58, 340 36 C365 28, 385 22, 400 18 L400 200 L0 200 Z"
            fill="url(#solution-chart-fill)"
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.65 }}
          />
          <motion.path
            d="M0 178 C60 176, 110 160, 160 125 C210 90, 260 58, 340 36 C365 28, 385 22, 400 18"
            fill="none"
            stroke="var(--color-lime-600)"
            strokeWidth="3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
          />
        </svg>

        {/* Dot locked to peakX/peakY in the same box as the SVG */}
        <motion.span
          aria-hidden
          className="absolute z-10 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] border-card bg-lime-500 shadow-md"
          style={{ left: peakLeft, top: peakTop }}
          initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.4 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45, duration: 0.35, ease: EASE_OUT }}
        />

        {/* Badge sits just above the same peak */}
        <div
          className="absolute z-20 -translate-x-1/2 -translate-y-[calc(100%+0.65rem)]"
          style={{ left: peakLeft, top: peakTop }}
        >
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 10, scale: reduceMotion ? 1 : 0.92 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.45, ease: EASE_OUT }}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-lime-500 px-3 py-1.5 text-caption font-bold text-lime-950  shadow-lime-600/25"
          >
            Net Profit
            <span className="rounded-full bg-lime-950/10 px-1.5 py-0.5 text-[0.65rem]">+80%</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- */
/* Card 3 — Support: light phone + mail tile + notification        */
/* --------------------------------------------------------------- */

function SkeletonSupport() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative -mx-5 -mb-5 flex h-full min-h-64 items-end justify-center overflow-hidden pt-2 sm:-mx-7 sm:-mb-7 sm:min-h-72">
      {/* Soft glow behind the phone */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-8 left-1/2 size-48 -translate-x-1/2 rounded-full bg-lime-400/20 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: reduceMotion ? 0 : 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, ease: EASE_OUT }}
        className="relative mb-[-42%] w-[11.5rem] sm:mb-[-38%] sm:w-[13rem]"
        aria-hidden
      >
        <div className="relative -rotate-[4deg]">
          {/* Device shell */}
          <div className="relative overflow-hidden rounded-[2.1rem] border-[3px] border-neutral-900 bg-neutral-900 p-[3px]  shadow-black/25">
            <div className="relative overflow-hidden rounded-[1.85rem] bg-[#f7f6f3]">
              {/* Dynamic Island */}
              <div className="absolute top-2.5 left-1/2 z-10 h-5 w-[4.25rem] -translate-x-1/2 rounded-full bg-neutral-950" />

              {/* Screen body */}
              <div className="flex aspect-[9/19] flex-col items-center px-5 pt-[28%]">
                <div className="relative">
                  <span className="flex size-[4.75rem] items-center justify-center rounded-[1.35rem] bg-lime-500 shadow-[0_12px_28px_-8px_rgba(132,204,22,0.55)]">
                    <MailIcon className="size-9 text-white" strokeWidth={2.15} />
                  </span>
                  <motion.span
                    className="absolute -top-1 -right-1 block size-4 rounded-full border-[2.5px] border-[#f7f6f3] bg-lime-600"
                    animate={reduceMotion ? { scale: 1 } : { scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>

                <div className="mt-5 w-full space-y-2 px-1">
                  <span className="mx-auto block h-2 w-3/4 rounded-full bg-neutral-200/90" />
                  <span className="mx-auto block h-2 w-1/2 rounded-full bg-neutral-200/70" />
                </div>
              </div>
            </div>
          </div>

          {/* Side buttons (decorative) */}
          <span className="absolute top-[18%] -left-[5px] h-8 w-[3px] rounded-l-sm bg-neutral-800" />
          <span className="absolute top-[28%] -left-[5px] h-12 w-[3px] rounded-l-sm bg-neutral-800" />
          <span className="absolute top-[26%] -right-[5px] h-16 w-[3px] rounded-r-sm bg-neutral-800" />
        </div>
      </motion.div>

      {/* Support notification over the phone */}
      <div className="absolute bottom-3 left-1/2 z-30 w-[min(100%-1.25rem,16.5rem)] -translate-x-1/2 sm:bottom-4">
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.5, ease: EASE_OUT }}
          className="rounded-lg border border-border/60 bg-card p-3 "
        >
          <div className="flex items-start gap-3">
            <span className="relative size-10 shrink-0 overflow-hidden rounded-full ring-2 ring-border/30">
              <Image
                src="/assets/bento/agent-2.jpg"
                alt=""
                fill
                sizes="40px"
                className="object-cover"
              />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-caption font-semibold text-foreground">Support Team</p>
                <p className="shrink-0 text-[0.65rem] text-muted-foreground">now</p>
              </div>
              <p className="mt-0.5 text-caption leading-snug text-muted-foreground">
                Let me help you with those edits.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- */
/* Card 4 — Launch: Original → New listing rows + dashed cycle arrows  */
/* ----------------------------------------------------------------- */

function SkeletonLaunch() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative flex h-full min-h-60 items-center justify-center px-2 py-4">
      <div className="relative w-[min(100%,24rem)]">
        {/* Dashed cycle arrows */}
        <ConnectorArc side="left" />
        <ConnectorArc side="right" />

        {/* Original listing */}
        <div className="relative z-10 -translate-x-2 sm:-translate-x-6">
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: EASE_OUT }}
            {...(reduceMotion ? {} : { whileHover: { y: -2 } })}
            className="rounded-lg border border-border/80 bg-card p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="min-w-0 truncate text-caption text-muted-foreground">
                Original: <span className="font-semibold text-foreground">Coastal Villa</span>
              </p>
              <span
                aria-hidden
                className="flex shrink-0 items-center gap-0.5 rounded-lg border border-border/80 bg-background px-2 py-1 text-caption font-medium text-foreground"
              >
                <MoreVerticalIcon className="size-3 text-muted-foreground" />
                Edit
              </span>
            </div>
            <div className="mt-2.5 flex items-center gap-2.5">
              <span className="relative size-11 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src="/assets/showcase/coastal-villas.jpg"
                  alt=""
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </span>
              <span className="h-9 flex-1 rounded-lg bg-muted" aria-hidden />
            </div>
          </motion.div>
        </div>

        {/* New listing — offset right, overlapping, like the mockup */}
        <div className="relative z-20 -mt-1.5 translate-x-2 sm:translate-x-6">
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.55, ease: EASE_OUT }}
            {...(reduceMotion ? {} : { whileHover: { y: -2 } })}
            className="rounded-lg border border-border/80 bg-card p-3 "
          >
            <div className="flex items-center justify-between gap-2">
              <p className="min-w-0 truncate text-caption text-muted-foreground">
                New: <span className="font-semibold text-foreground">Garden Estate</span>
              </p>
              <motion.span
                initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.35, ease: EASE_OUT }}
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-lime-500 px-2.5 py-1 text-[0.65rem] font-bold text-lime-950"
              >
                <CheckIcon className="size-3" strokeWidth={3} />
                Saved
              </motion.span>
            </div>
            <div className="mt-2.5 flex items-center gap-2.5">
              <span className="relative size-11 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src="/assets/showcase/garden-estate.jpg"
                  alt=""
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </span>
              <span className="h-9 flex-1 rounded-lg bg-muted" aria-hidden />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/** Dashed arc + arrowhead connecting the two listing rows (marching ants). */
function ConnectorArc({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <div
      aria-hidden
      className={cn(
        "absolute top-1/2 z-0 h-24 w-10 -translate-y-1/2",
        isLeft ? "-left-4 sm:-left-8" : "-right-4 -scale-x-100 -scale-y-100 sm:-right-8",
      )}
    >
      <motion.svg
        viewBox="0 0 40 96"
        className="size-full text-lime-500"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.55, duration: 0.5 }}
      >
        {/* Arc from the top row around to the bottom row */}
        <path
          d="M38 8 C10 18, 10 74, 32 88"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeDasharray="5 5"
          strokeLinecap="round"
          className="bento-march-line"
        />
        {/* Arrowhead */}
        <path
          d="M25 84 L32 88 L30 80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </div>
  );
}

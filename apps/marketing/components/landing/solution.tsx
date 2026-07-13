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
    <div className="relative flex h-full min-h-[23rem] flex-col overflow-hidden rounded-3xl border border-border bg-card p-5 sm:min-h-0 sm:p-7">
      {children}
    </div>
  );
}

function FeatureTitle({ children }: { children?: ReactNode }) {
  return (
    <h3 className="max-w-xl text-left text-xl font-semibold tracking-tight text-balance text-foreground md:text-2xl md:leading-snug">
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

function SkeletonDesign() {
  const reduceMotion = useReducedMotion();
  const avatars = [
    { src: "/assets/bento/agent-2.jpg", className: "left-[15%] top-[26%] sm:left-[19%]" },
    {
      src: "/assets/bento/agent-3.jpg",
      className: "left-[calc(50%-1.25rem)] top-[2%] sm:left-[calc(50%-1.5rem)]",
    },
    { src: "/assets/bento/agent-4.jpg", className: "right-[13%] top-[16%] sm:right-[17%]" },
  ] as const;

  return (
    <div className="relative -mx-5 -mb-5 flex h-full min-h-60 items-end justify-center overflow-hidden px-6 pt-14 sm:-mx-7 sm:-mb-7 sm:min-h-64">
      {/* Concentric orbit rings, centred on the browser */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[62%] -translate-x-1/2 -translate-y-1/2"
      >
        <span className="absolute left-1/2 top-1/2 block size-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/80" />
        <span className="absolute left-1/2 top-1/2 block size-[33rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/60" />
        <span className="absolute left-1/2 top-1/2 block size-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-border/50" />
      </div>

      {/* Browser window — cropped by the card's bottom edge, like the mockup */}
      <motion.div
        initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-t-2xl border border-b-0 border-border/80 bg-background shadow-xl"
      >
        <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-3 py-2">
          <span className="flex shrink-0 items-center gap-1.5" aria-hidden>
            <span className="size-2 rounded-full bg-destructive/70" />
            <span className="size-2 rounded-full bg-warning/70" />
            <span className="size-2 rounded-full bg-success/70" />
          </span>
          <span className="mx-auto flex min-w-0 max-w-[16rem] flex-1 items-center gap-1.5 rounded-full border border-border/60 bg-background px-3 py-1">
            <LockIcon className="size-2.5 shrink-0 text-muted-foreground" aria-hidden />
            <span className="truncate text-caption text-muted-foreground">
              youragency.estatify.rw
            </span>
            <StarIcon className="ml-auto size-2.5 shrink-0 text-muted-foreground" aria-hidden />
          </span>
        </div>

        {/* Page body: skeleton copy + hero block, exactly like the mockup */}
        <div className="relative aspect-[16/9] bg-background p-4 sm:p-5">
          <div className="space-y-2">
            <span className="block h-2 w-24 rounded-full bg-muted" aria-hidden />
            <span className="block h-2 w-14 rounded-full bg-muted" aria-hidden />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.5, ease: EASE_OUT }}
            className="mt-4 h-full w-[58%] rounded-lg bg-gradient-to-br from-lime-400 to-lime-600"
            aria-hidden
          />
        </div>
      </motion.div>

      {/* Orbiting avatars */}
      {avatars.map((avatar, i) => (
        <div
          key={avatar.src}
          aria-hidden
          className={cn("absolute z-20 size-10 sm:size-12", avatar.className)}
        >
          <motion.span
            className="block size-full"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.08, duration: 0.45, ease: EASE_OUT }}
          >
            <motion.span
              className="relative block size-full overflow-hidden rounded-full border-2 border-card shadow-md"
              animate={reduceMotion ? { y: 0 } : { y: [0, i % 2 === 0 ? -5 : 5, 0] }}
              transition={{ duration: 3.5 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image src={avatar.src} alt="" fill sizes="48px" className="object-cover" />
            </motion.span>
          </motion.span>
        </div>
      ))}

      {/* Floating testimonial — overlaps the browser's left edge */}
      <div className="absolute bottom-[26%] left-2 z-30 w-[min(100%,15.5rem)] sm:left-5">
        <motion.div
          initial={{ opacity: 0, x: reduceMotion ? 0 : -14 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5, ease: EASE_OUT }}
          className="rounded-2xl border border-border/70 bg-card/95 p-3 shadow-lg backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-caption font-semibold text-foreground">Kevin Hobbs</p>
              <p className="mt-0.5 text-caption leading-snug text-muted-foreground">
                &ldquo;This site is seriously cool!&rdquo;
              </p>
            </div>
            <span className="relative size-10 shrink-0 overflow-hidden rounded-xl">
              <Image
                src="/assets/bento/agent-1.jpg"
                alt=""
                fill
                sizes="40px"
                className="object-cover"
              />
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- */
/* Card 2 — Invest: rising profit chart, pills, marker + drop line */
/* ------------------------------------------------------------- */

/** Marker x-position as a fraction of the chart width (158 / 220). */
const CHART_MARKER_X = "71.8%";

function SkeletonInvest() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative -mx-5 -mb-5 mt-auto flex h-full min-h-52 flex-col justify-end overflow-hidden sm:-mx-7 sm:-mb-7">
      {/* Net Profit pill + gain badge, stacked over the marker like the mockup */}
      <div
        className="absolute z-10 flex -translate-x-1/2 flex-col items-center gap-1.5"
        style={{ left: CHART_MARKER_X, bottom: "108px" }}
      >
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.55, duration: 0.45, ease: EASE_OUT }}
          className="flex flex-col items-center gap-1.5"
        >
          <span className="whitespace-nowrap rounded-full border border-border/70 bg-card px-3 py-1 text-caption font-semibold text-foreground shadow-md">
            Net Profit
          </span>
          <span className="rounded-full bg-lime-500/15 px-2.5 py-0.5 text-caption font-bold text-lime-600">
            +80%
          </span>
        </motion.div>
      </div>

      {/* Dashed drop line, from beneath the pills through the marker */}
      <motion.span
        aria-hidden
        className="absolute bottom-0 z-0 h-[100px] border-l-[1.5px] border-dashed border-border"
        style={{ left: CHART_MARKER_X }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.4 }}
      />

      {/* Marker — rounded square sitting on the line */}
      <div
        className="absolute z-10 -translate-x-1/2"
        style={{ left: CHART_MARKER_X, bottom: "94px" }}
        aria-hidden
      >
        <motion.span
          className="block size-3 rounded-[4px] border-2 border-card bg-lime-500 shadow-sm"
          initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.75, duration: 0.35, ease: EASE_OUT }}
        />
      </div>

      <svg viewBox="0 0 220 150" className="h-40 w-full" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="solution-chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-lime-500)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-lime-500)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <motion.path
          d="M-2 132 C40 130, 90 118, 120 96 C138 82, 148 66, 158 56 C176 39, 200 33, 224 28 L224 150 L-2 150 Z"
          fill="url(#solution-chart-fill)"
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
        />
        <motion.path
          d="M-2 132 C40 130, 90 118, 120 96 C138 82, 148 66, 158 56 C176 39, 200 33, 224 28"
          fill="none"
          stroke="var(--color-lime-600)"
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={reduceMotion ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: EASE_OUT }}
        />
      </svg>
    </div>
  );
}

/* --------------------------------------------------------------- */
/* Card 3 — Support: iPhone 17 frame + mail app + notification card  */
/* --------------------------------------------------------------- */

function SkeletonSupport() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative -mx-5 -mb-5 flex h-full min-h-64 items-end justify-center overflow-hidden pt-3 sm:-mx-7 sm:-mb-7">
      {/* Phone — real iPhone 17 frame, bottom cropped by the card edge */}
      <motion.div
        initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, ease: EASE_OUT }}
        className="relative w-48 sm:w-56"
        style={{ marginBottom: "-11rem" }}
        aria-hidden
      >
        <div className="relative aspect-[880/1832] -rotate-3">
          {/* Screen content, sitting behind the transparent screen cut-out */}
          <div
            className="absolute overflow-hidden bg-gradient-to-b from-lime-50 to-background"
            style={{
              left: "4.32%",
              top: "2.3%",
              width: "91.36%",
              height: "95.4%",
              borderRadius: "25% / 11.4%",
            }}
          >
            <div className="flex flex-col items-center gap-4 pt-[34%]">
              <div className="relative">
                <span className="flex size-16 items-center justify-center rounded-[1.4rem] bg-gradient-to-br from-lime-400 to-lime-600 shadow-lg shadow-lime-600/30">
                  <MailIcon className="size-8 text-white" strokeWidth={2.25} />
                </span>
                {/* Unread badge */}
                <motion.span
                  className="absolute -right-1.5 -top-1.5 block size-4 rounded-full border-2 border-white bg-lime-500"
                  animate={reduceMotion ? { scale: 1 } : { scale: [1, 1.25, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <div className="w-full space-y-2 px-[14%]">
                <span className="block h-2 w-full rounded-full bg-muted" />
                <span className="block h-2 w-2/3 rounded-full bg-muted" />
              </div>
            </div>
          </div>

          {/* Device frame on top */}
          <Image
            src="/assets/iPhone17.svg"
            alt=""
            fill
            sizes="(max-width: 640px) 192px, 224px"
            className="pointer-events-none select-none object-contain"
            unoptimized
          />
        </div>
      </motion.div>

      {/* Support notification — slides up over the phone */}
      <div className="absolute bottom-4 left-1/2 z-30 w-[min(100%-1.5rem,17rem)] -translate-x-1/2">
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.5, ease: EASE_OUT }}
          className="rounded-2xl border border-border/70 bg-card/95 p-3 shadow-lg backdrop-blur-sm"
        >
          <div className="flex items-start gap-3">
            <span className="relative size-10 shrink-0 overflow-hidden rounded-full">
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
            className="rounded-2xl border border-border/80 bg-card p-3 shadow-sm"
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
              <span className="relative size-11 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src="/assets/showcase/coastal-villas.jpg"
                  alt=""
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </span>
              <span className="h-9 flex-1 rounded-xl bg-muted" aria-hidden />
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
            className="rounded-2xl border border-border/80 bg-card p-3 shadow-lg"
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
              <span className="relative size-11 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src="/assets/showcase/garden-estate.jpg"
                  alt=""
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </span>
              <span className="h-9 flex-1 rounded-xl bg-muted" aria-hidden />
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

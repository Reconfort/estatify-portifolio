"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Container } from "@estatify/ui";
import {
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  GlobeIcon,
  LoaderIcon,
  UserIcon,
} from "@estatify/ui/icons";
import { cn } from "@estatify/utils";
import { Reveal } from "./reveal";
import { SectionHeader } from "./section-header";
import { processSection } from "@/components/landing-data";

type PublishPhase = "idle" | "loading" | "browser" | "listings";

/**
 * Process — three interactive steps under Solution.
 * Card demos autoplay: dual template marquee, color cycle, publish sequence.
 */
export function Process() {
  return (
    <section id="process" className="py-20 sm:py-28">
      <Container className="flex flex-col gap-14 sm:gap-16">
        <SectionHeader
          eyebrow={processSection.eyebrow}
          eyebrowVariant="badge"
          eyebrowDotClassName="bg-violet-500"
          title={processSection.title.lead}
          titleMuted={processSection.title.muted}
          titleBreak
        />

        <ol className="mx-auto grid w-full max-w-6xl list-none grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
          {processSection.steps.map((step, i) => (
            <Reveal key={step.key} index={i}>
              <li className="flex h-full flex-col items-center text-center">
                <div className="mb-6 w-full overflow-hidden rounded-lg bg-secondary/70 p-4 sm:p-5">
                  {step.key === "purchase" ? <TemplateMarqueeDemo /> : null}
                  {step.key === "customize" ? <ColorCustomizeDemo /> : null}
                  {step.key === "launch" ? <PublishDemo /> : null}
                </div>
                <h3 className="text-h4 font-semibold tracking-tight text-foreground sm:text-h3">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-[34ch] text-body-sm leading-relaxed text-muted-foreground sm:text-body-md">
                  {step.body}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/** Two vertical columns — left scrolls down, right scrolls up — seamless loop. */
function TemplateMarqueeDemo() {
  const reduceMotion = useReducedMotion();
  const images = processSection.templates;
  const colA = images;
  const colB = [...images].reverse();

  return (
    <div className="relative h-56 overflow-hidden rounded-lg bg-muted/40 sm:h-64">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-linear-to-b from-secondary/90 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-linear-to-t from-secondary/90 to-transparent"
      />
      <div className="grid h-full grid-cols-2 gap-2.5 p-2.5">
        <VerticalLoop images={colA} direction="down" paused={!!reduceMotion} />
        <VerticalLoop images={colB} direction="up" paused={!!reduceMotion} />
      </div>
    </div>
  );
}

function VerticalLoop({
  images,
  direction,
  paused,
}: {
  images: readonly string[];
  direction: "up" | "down";
  paused: boolean;
}) {
  const duration = 18;
  const yFrom = direction === "down" ? "0%" : "-50%";
  const yTo = direction === "down" ? "-50%" : "0%";

  return (
    <div className="relative h-full overflow-hidden rounded-lg">
      <motion.div
        className="flex flex-col gap-2.5"
        animate={paused ? { y: yFrom } : { y: [yFrom, yTo] }}
        transition={paused ? { duration: 0 } : { duration, repeat: Infinity, ease: "linear" }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex flex-col gap-2.5" aria-hidden={copy === 1}>
            {images.map((src) => (
              <div
                key={`${copy}-${src}`}
                className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-background ring-1 ring-border/60"
              >
                <Image src={src} alt="" fill sizes="160px" className="object-cover" />
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/** Auto-cycles brand colors; preview tile follows the selected swatch. */
function ColorCustomizeDemo() {
  const reduceMotion = useReducedMotion();
  const colors = processSection.colors;
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % colors.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, [colors.length, reduceMotion]);

  const current = colors[active] ?? colors[0]!;

  return (
    <div className="flex h-56 items-stretch gap-3 rounded-lg bg-muted/40 p-3 sm:h-64 sm:gap-4 sm:p-4">
      <ul className="flex w-[42%] flex-col justify-center gap-1.5 sm:gap-2">
        {colors.map((color, i) => {
          const selected = i === active;
          return (
            <li key={color.key}>
              <button
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors",
                  selected ? "bg-background ring-1 ring-border" : "hover:bg-background/60",
                )}
              >
                <span
                  aria-hidden
                  className="size-3.5 shrink-0 rounded-full ring-1 ring-black/10"
                  style={{ backgroundColor: color.swatch }}
                />
                <span
                  className={cn(
                    "text-caption font-medium sm:text-body-sm",
                    selected ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {color.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-lg bg-background p-3 ring-1 ring-border/70">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            initial={reduceMotion ? false : { opacity: 0.4, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35 }}
            className="aspect-square w-[78%] max-w-[9.5rem] rounded-lg shadow-md"
            style={{
              background: `linear-gradient(145deg, ${current.swatch}, color-mix(in srgb, ${current.swatch} 55%, black))`,
            }}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * Publish demo — idle → loader → live browser → listing skeletons.
 * Auto-runs on a loop; Publish can also be clicked to restart.
 */
function PublishDemo() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = React.useState<PublishPhase>("idle");
  const stepTimers = React.useRef<number[]>([]);

  const clearStepTimers = React.useEffectEvent(() => {
    stepTimers.current.forEach((id) => window.clearTimeout(id));
    stepTimers.current = [];
  });

  const runSequence = React.useEffectEvent(() => {
    clearStepTimers();
    setPhase("loading");
    stepTimers.current.push(
      window.setTimeout(() => setPhase("browser"), 1100),
      window.setTimeout(() => setPhase("listings"), 2600),
      window.setTimeout(() => setPhase("idle"), 5200),
    );
  });

  React.useEffect(() => {
    if (reduceMotion) return;
    const start = window.setTimeout(() => runSequence(), 1200);
    const loop = window.setInterval(() => runSequence(), 7000);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(loop);
      clearStepTimers();
    };
  }, [clearStepTimers, reduceMotion, runSequence]);

  return (
    <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-lg bg-muted/40 p-3 sm:h-64 sm:p-4">
      <AnimatePresence mode="wait">
        {phase === "idle" || phase === "loading" ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-[15.5rem] rounded-lg border border-border bg-background p-3.5 shadow-md"
          >
            <div className="flex items-center gap-2 text-body-sm text-foreground">
              <GlobeIcon className="size-4 text-muted-foreground" aria-hidden />
              <span className="truncate font-medium">{processSection.publish.domain}</span>
            </div>
            <div className="mt-2.5 flex items-center gap-2 text-caption text-muted-foreground">
              <ClockIcon className="size-3.5" aria-hidden />
              <span>
                {processSection.publish.when} · by {processSection.publish.author}
              </span>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-caption text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <UserIcon className="size-3.5" aria-hidden />
                View changes
              </span>
              <ChevronRightIcon className="size-3.5" aria-hidden />
            </div>
            <button
              type="button"
              onClick={() => runSequence()}
              disabled={phase === "loading"}
              className={cn(
                "mt-3.5 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-violet-600 text-body-sm font-semibold text-white transition-opacity",
                "hover:bg-violet-500 disabled:cursor-wait",
              )}
            >
              {phase === "loading" ? (
                <>
                  <LoaderIcon className="size-4 animate-spin" aria-hidden />
                  Publishing…
                </>
              ) : (
                "Publish"
              )}
            </button>
          </motion.div>
        ) : null}

        {phase === "browser" ? (
          <motion.div
            key="browser"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-[17rem] overflow-hidden rounded-lg border border-border bg-background "
          >
            <div className="flex items-center gap-1.5 border-b border-border bg-muted/50 px-2.5 py-2">
              <span className="size-2 rounded-full bg-destructive/70" aria-hidden />
              <span className="size-2 rounded-full bg-warning/70" aria-hidden />
              <span className="size-2 rounded-full bg-success/70" aria-hidden />
              <span className="ml-2 truncate rounded-md bg-background px-2 py-0.5 text-[10px] text-muted-foreground ring-1 ring-border">
                https://{processSection.publish.domain}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
              <span className="flex size-9 items-center justify-center rounded-full bg-success/15 text-success">
                <CheckIcon className="size-4" aria-hidden />
              </span>
              <p className="text-body-sm font-semibold text-foreground">Your site is live</p>
              <p className="text-caption text-muted-foreground">Visitors can browse listings now</p>
            </div>
          </motion.div>
        ) : null}

        {phase === "listings" ? (
          <motion.div
            key="listings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="grid w-full max-w-[17rem] grid-cols-2 gap-2.5"
          >
            {[0, 1].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-lg border border-border bg-background"
              >
                <div className="aspect-4/3 animate-pulse bg-muted" />
                <div className="space-y-2 p-2.5">
                  <div className="h-2.5 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="h-2 w-1/2 animate-pulse rounded bg-muted" />
                  <div className="h-2 w-2/3 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@estatify/utils";

export type CoverflowItem = {
  id: string;
  image: string;
  alt?: string;
  label?: string;
};

export type CoverflowCarouselProps = {
  items: CoverflowItem[];
  /** Initial centered index. */
  active?: number;
  /** Auto-advance (default true). */
  autoplay?: boolean;
  /** Autoplay interval in ms (default 4000). */
  intervalMs?: number;
  className?: string;
  onActiveChange?: (index: number) => void;
};

type Pose = {
  x: number;
  scale: number;
  opacity: number;
  zIndex: number;
  visible: boolean;
};

type Layout = {
  baseWidth: number;
  edgeScale: number;
  edgeOpacity: number;
  /** Normalized center-x range (can extend past 0–1 so sides peek off-screen). */
  spanStart: number;
  spanEnd: number;
};

const ease = [0.22, 1, 0.36, 1] as const;
const MAX_VISIBLE = 7;

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Shortest signed distance on a circular deck. */
function circularDelta(index: number, active: number, length: number) {
  let delta = index - active;
  if (delta > length / 2) delta -= length;
  if (delta < -length / 2) delta += length;
  return delta;
}

/** Per-breakpoint coverflow geometry — mobile gets a wide hero card, not a thin strip. */
function layoutForVisible(visibleCount: number): Layout {
  switch (visibleCount) {
    case 3:
      return {
        baseWidth: 0.78,
        edgeScale: 0.72,
        edgeOpacity: 0.5,
        spanStart: -0.12,
        spanEnd: 1.12,
      };
    case 5:
      return {
        baseWidth: 0.38,
        edgeScale: 0.7,
        edgeOpacity: 0.55,
        spanStart: 0.0,
        spanEnd: 1.0,
      };
    default:
      return {
        baseWidth: 0.22,
        edgeScale: 0.64,
        edgeOpacity: 0.55,
        spanStart: 0.06,
        spanEnd: 0.94,
      };
  }
}

/**
 * GPU-friendly pose: only x + scale + opacity.
 * Level: +half (far left) … 0 (center) … −half (far right).
 */
function poseForLevel(level: number, half: number, trackWidth: number, layout: Layout): Pose {
  const depth = half === 0 ? 0 : Math.abs(level) / half;
  const scale = lerp(1, layout.edgeScale, depth);
  const opacity = lerp(1, layout.edgeOpacity, depth);
  const zIndex = half + 1 - Math.abs(level);

  const i = half - level;
  const n = half * 2 + 1;
  const t = n === 1 ? 0.5 : i / (n - 1);
  const centerX = lerp(layout.spanStart, layout.spanEnd, t) * trackWidth;
  const cardWidth = trackWidth * layout.baseWidth;
  const x = centerX - cardWidth / 2;

  return { x, scale, opacity, zIndex, visible: true };
}

function useVisibleCount() {
  // Mobile-first default avoids a 7-up flash on small screens before matchMedia runs.
  const [count, setCount] = React.useState(3);

  React.useEffect(() => {
    const mqSm = window.matchMedia("(min-width: 640px)");
    const mqLg = window.matchMedia("(min-width: 1024px)");

    const update = () => {
      if (mqLg.matches) setCount(7);
      else if (mqSm.matches) setCount(5);
      else setCount(3);
    };

    update();
    mqSm.addEventListener("change", update);
    mqLg.addEventListener("change", update);
    return () => {
      mqSm.removeEventListener("change", update);
      mqLg.removeEventListener("change", update);
    };
  }, []);

  return count;
}

function useTrackWidth(ref: React.RefObject<HTMLDivElement | null>) {
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => setWidth(el.clientWidth);
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  return width;
}

/**
 * CoverflowCarousel — full-width coverflow (7 / 5 / 3 by breakpoint).
 * Transform-only animation; mobile uses a wide center card with peeks on the sides.
 */
export function CoverflowCarousel({
  items,
  active: activeProp = 0,
  autoplay = true,
  intervalMs = 4000,
  className,
  onActiveChange,
}: CoverflowCarouselProps) {
  const reduceMotion = useReducedMotion();
  const visibleCount = useVisibleCount();
  const half = (visibleCount - 1) / 2;
  const layout = layoutForVisible(visibleCount);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const trackWidth = useTrackWidth(trackRef);
  const pausedRef = React.useRef(false);

  const deck = React.useMemo(() => {
    if (items.length === 0) return [] as CoverflowItem[];
    if (items.length >= MAX_VISIBLE) return [...items];
    const padded: CoverflowItem[] = [];
    while (padded.length < MAX_VISIBLE) {
      const src = items[padded.length % items.length];
      if (!src) break;
      padded.push({ ...src, id: `${src.id}__${padded.length}` });
    }
    return padded;
  }, [items]);

  const length = deck.length;
  const [active, setActive] = React.useState(() =>
    length > 0 ? wrapIndex(activeProp, length) : 0,
  );

  const go = React.useEffectEvent((dir: "left" | "right") => {
    if (length === 0) return;
    setActive((current) => {
      const next = wrapIndex(dir === "right" ? current + 1 : current - 1, length);
      onActiveChange?.(next % Math.max(items.length, 1));
      return next;
    });
  });

  React.useEffect(() => {
    if (!autoplay || reduceMotion || length <= 1) return;
    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      go("right");
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [autoplay, go, intervalMs, length, reduceMotion]);

  if (length === 0) return null;

  const duration = reduceMotion ? 0 : 0.55;
  const cardW = trackWidth > 0 ? trackWidth * layout.baseWidth : 0;

  return (
    <div
      className={cn("relative w-full select-none", className)}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      <div
        ref={trackRef}
        className="relative h-[220px] w-full overflow-hidden sm:h-[260px] md:h-[320px] lg:h-[380px]"
      >
        {deck.map((item, index) => {
          const delta = circularDelta(index, active, length);
          const inWindow = Math.abs(delta) <= half;
          const level = -delta;

          let pose: Pose;
          if (trackWidth <= 0) {
            pose = { x: 0, scale: 1, opacity: 0, zIndex: 0, visible: false };
          } else if (inWindow) {
            pose = poseForLevel(level, half, trackWidth, layout);
          } else {
            pose = {
              x: delta > 0 ? trackWidth + 8 : -cardW - 8,
              scale: layout.edgeScale,
              opacity: 0,
              zIndex: 0,
              visible: false,
            };
          }

          return (
            <motion.div
              key={item.id}
              className="absolute top-0 left-0 h-full origin-center overflow-hidden rounded-2xl bg-muted shadow-lg ring-1 ring-foreground/10 will-change-transform [backface-visibility:hidden]"
              style={{
                width: trackWidth > 0 ? cardW : `${layout.baseWidth * 100}%`,
                zIndex: pose.zIndex,
                pointerEvents: pose.visible ? "auto" : "none",
              }}
              initial={false}
              animate={{
                x: pose.x,
                scale: pose.scale,
                opacity: pose.visible ? pose.opacity : 0,
              }}
              transition={{
                x: { duration, ease },
                scale: { duration, ease },
                opacity: { duration: duration * 0.65, ease },
              }}
            >
              <img
                src={item.image}
                alt={item.alt ?? item.label ?? ""}
                className="size-full object-cover"
                draggable={false}
                decoding="async"
                loading={inWindow ? "eager" : "lazy"}
              />
              {item.label && level === 0 && inWindow ? (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/35 to-transparent px-4 pt-14 pb-4">
                  <div className="inline-flex max-w-[calc(100%-0.5rem)] items-center gap-2 rounded-full border border-white/25 bg-black/40 px-3.5 py-1.5">
                    <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-accent" />
                    <span className="truncate text-body-sm font-medium tracking-wide text-white">
                      {item.label}
                    </span>
                  </div>
                </div>
              ) : null}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

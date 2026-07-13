"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { AppImage } from "./app-image";
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from "./icons";
import { cn } from "@estatify/utils";

export interface AuthTestimonial {
  quote: string;
  name: string;
  role: string;
  company?: string;
  image: string;
  imageAlt: string;
  rating?: number;
}

export interface AuthTestimonialPanelProps {
  items: readonly AuthTestimonial[];
  /** Auto-advance interval in ms. Default 5500. Set 0 to disable. */
  intervalMs?: number;
  className?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * AuthTestimonialPanel — full-bleed photo + frosted quote card.
 * Auto-rotates infinitely; pauses on hover/focus. Respects reduced motion.
 */
export function AuthTestimonialPanel({
  items,
  intervalMs = 5500,
  className,
}: AuthTestimonialPanelProps) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const count = items.length;
  const active = items[Math.min(index, Math.max(count - 1, 0))];

  React.useEffect(() => {
    if (count <= 1 || intervalMs <= 0 || paused || reduceMotion) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [count, intervalMs, paused, reduceMotion, index]);

  if (!active || count === 0) return null;

  const go = (dir: -1 | 1) => {
    setIndex((i) => (i + dir + count) % count);
  };

  const rating = active.rating ?? 5;
  const autoplay = count > 1 && intervalMs > 0 && !reduceMotion;

  return (
    <div
      className={cn("relative h-full min-h-dvh w-full bg-neutral-900", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      {items.map((item, i) => (
        <div
          key={item.image}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-out",
            i === index ? "opacity-100" : "opacity-0",
          )}
          aria-hidden={i !== index}
        >
          <motion.div
            className="absolute inset-0"
            animate={i === index && !reduceMotion ? { scale: [1, 1.06] } : { scale: 1 }}
            transition={
              i === index && !reduceMotion
                ? { duration: Math.max(intervalMs, 4000) / 1000, ease: "linear" }
                : { duration: 0.35 }
            }
          >
            <AppImage
              src={item.image}
              alt={item.imageAlt}
              fill
              priority={i === 0}
              sizes="50vw"
              className="object-cover object-center"
            />
          </motion.div>
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10"
          />
        </div>
      ))}

      <div className="absolute inset-x-0 bottom-0 z-10 p-8 xl:p-10">
        <div className="relative overflow-hidden rounded-lg border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-md xl:p-7">
          {autoplay ? (
            <div aria-hidden className="absolute inset-x-0 top-0 h-0.5 overflow-hidden bg-white/10">
              <motion.div
                key={index}
                className="h-full origin-left bg-white/70"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: paused ? 0 : 1 }}
                transition={
                  paused ? { duration: 0 } : { duration: intervalMs / 1000, ease: "linear" }
                }
              />
            </div>
          ) : null}

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <blockquote className="text-balance text-xl leading-snug font-medium text-white xl:text-2xl">
                &ldquo;{active.quote}&rdquo;
              </blockquote>

              <div className="mt-6 flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-white">{active.name}</p>
                  <p className="mt-0.5 text-body-sm text-white/75">{active.role}</p>
                  {active.company ? (
                    <p className="text-body-sm text-white/60">{active.company}</p>
                  ) : null}
                </div>

                <div className="flex shrink-0 flex-col items-end gap-3">
                  <div
                    className="flex items-center gap-0.5"
                    aria-label={`${rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <StarIcon
                        key={i}
                        className={cn(
                          "size-4",
                          i < rating ? "fill-white text-white" : "text-white/30",
                        )}
                        aria-hidden
                      />
                    ))}
                  </div>

                  {count > 1 ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => go(-1)}
                        aria-label="Previous testimonial"
                        className="flex size-9 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white/15"
                      >
                        <ChevronLeftIcon className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => go(1)}
                        aria-label="Next testimonial"
                        className="flex size-9 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white/15"
                      >
                        <ChevronRightIcon className="size-4" />
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {count > 1 ? (
            <div className="mt-5 flex items-center justify-center gap-1.5">
              {items.map((item, i) => (
                <button
                  key={item.image}
                  type="button"
                  aria-label={`Go to testimonial ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === index ? "w-5 bg-white" : "w-1.5 bg-white/35 hover:bg-white/55",
                  )}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

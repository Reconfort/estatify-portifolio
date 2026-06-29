"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@estatify/utils";
import { AppImage } from "@estatify/ui/image";
import { Container } from "@estatify/ui";
import { testimonials } from "@/components/landing-data";

const ease = [0.22, 1, 0.36, 1] as const;
const AUTO_ADVANCE_MS = 6000;
const ESTATE_IMAGE = "/assets/showcase/garden-estate.jpg";
const SPIN_LABEL =
  "WHAT PEOPLE SAYS · WHAT PEOPLE SAYS · WHAT PEOPLE SAYS · WHAT PEOPLE SAYS · ";

function QuoteMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden className={className} viewBox="0 0 32 32" fill="currentColor">
      <path d="M10 18c0-3.3 2.1-6.2 5.2-7.3L13 6.8C7.8 8.5 4 13.2 4 18.6V26h8v-8H10zm14 0c0-3.3 2.1-6.2 5.2-7.3L27 6.8C21.8 8.5 18 13.2 18 18.6V26h8v-8h-2z" />
    </svg>
  );
}

/** Circular estate image inside a slowly spinning "WHAT PEOPLE SAYS" text ring. */
function SpinningEstateBadge() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative h-44 w-44 sm:h-52 sm:w-52">
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full text-foreground/85"
        aria-hidden
        {...(!reduceMotion
          ? {
              animate: { rotate: 360 },
              transition: { duration: 22, repeat: Infinity, ease: "linear" as const },
            }
          : {})}
      >
        <defs>
          <path
            id="estatify-testimonial-ring"
            d="M 100,100 m -82,0 a 82,82 0 1,1 164,0 a 82,82 0 1,1 -164,0"
            fill="none"
          />
        </defs>
        <text
          fill="currentColor"
          fontSize="10.5"
          fontWeight="600"
          letterSpacing="2.8"
          style={{ textTransform: "uppercase" }}
        >
          <textPath href="#estatify-testimonial-ring" startOffset="0">
            {SPIN_LABEL}
          </textPath>
        </text>
      </motion.svg>

      <div className="absolute left-1/2 top-1/2 h-[56%] w-[56%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-[3px] border-background bg-background shadow-md ring-1 ring-border/50">
        <AppImage
          src={ESTATE_IMAGE}
          alt=""
          fill
          sizes="(max-width: 640px) 176px, 208px"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 flex justify-center bg-linear-to-t from-black/50 to-transparent pb-2 pt-6">
          <QuoteMark className="h-5 w-5 text-white sm:h-6 sm:w-6" />
        </div>
      </div>
    </div>
  );
}

function NavChevron({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      aria-hidden
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {direction === "prev" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  );
}

function NavButton({
  direction,
  onClick,
  variant = "side",
}: {
  direction: "prev" | "next";
  onClick: () => void;
  variant?: "side" | "inline";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous testimonial" : "Next testimonial"}
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-border/70 bg-background/80 text-foreground backdrop-blur",
        "transition-colors hover:border-accent/40 hover:bg-accent/10",
        variant === "side" && [
          "absolute top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 sm:inline-flex",
          direction === "prev" ? "left-0" : "right-0",
        ],
        variant === "inline" && "h-11 w-11 shrink-0",
      )}
    >
      <NavChevron direction={direction} />
    </button>
  );
}

function MobileCarouselNav({
  index,
  onPrev,
  onNext,
  onSelect,
}: {
  index: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (nextIndex: number) => void;
}) {
  return (
    <div className="mt-8 flex flex-col items-center gap-4 sm:hidden">
      <div className="flex items-center justify-center gap-4">
        <NavButton direction="prev" variant="inline" onClick={onPrev} />

        <div className="flex items-center gap-2" role="tablist" aria-label="Testimonial slides">
          {testimonials.map((t, i) => (
            <button
              key={t.name}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show testimonial from ${t.name}`}
              onClick={() => onSelect(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === index ? "w-6 bg-accent" : "w-2 bg-border hover:bg-accent/50",
              )}
            />
          ))}
        </div>

        <NavButton direction="next" variant="inline" onClick={onNext} />
      </div>

      <p className="text-caption text-muted-foreground">
        {index + 1} / {testimonials.length}
      </p>
    </div>
  );
}

/** Testimonials — spinning estate badge over a soft top band, large open quote. */
export function Testimonials() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = testimonials[index];

  const go = (direction: -1 | 1) =>
    setIndex((current) => (current + direction + testimonials.length) % testimonials.length);

  useEffect(() => {
    if (reduceMotion || paused || testimonials.length <= 1) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % testimonials.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [reduceMotion, paused, index]);

  if (!active) return null;

  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-28">
      <Container className="relative flex flex-col items-center gap-12 text-center sm:gap-16">

        <div className="relative flex w-full flex-col items-center">
          {/* Soft beige band that arches down behind the badge (no card). */}
          <div aria-hidden className="absolute inset-x-0 top-6 -z-0 flex justify-center overflow-hidden">
            <div
              className="h-52 w-[160%] rounded-b-[50%]"
            />
          </div>

          <div className="relative z-10 flex w-full flex-col items-center gap-12 pt-4 sm:gap-14">
            <SpinningEstateBadge />

            {/* Quote + side arrows in open space. */}
            <div
              className="relative mx-auto w-full max-w-5xl px-4 sm:px-14 md:px-20"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocusCapture={() => setPaused(true)}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setPaused(false);
                }
              }}
            >
              <NavButton direction="prev" onClick={() => go(-1)} />
              <NavButton direction="next" onClick={() => go(1)} />

              <div className="min-h-52 sm:min-h-64" aria-live="polite" aria-atomic="true">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.figure
                    key={active.name}
                    {...(reduceMotion
                      ? {}
                      : { initial: { opacity: 0, y: 16 }, exit: { opacity: 0, y: -16 } })}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease }}
                    className="flex flex-col items-center gap-8 sm:gap-10"
                  >
                    <blockquote className="max-w-4xl text-balance text-h2 font-semibold leading-tight tracking-tight text-foreground sm:text-display-md lg:text-display-lg">
                      &ldquo;{active.quote}&rdquo;
                    </blockquote>
                    <figcaption className="flex flex-col items-center gap-1">
                      <span className="border-b-2 border-foreground/30 pb-1.5 text-h5 font-semibold text-foreground">
                        {active.name}
                      </span>
                      <span className="text-body-md text-muted-foreground">{active.role}</span>
                    </figcaption>
                  </motion.figure>
                </AnimatePresence>
              </div>

              <MobileCarouselNav
                index={index}
                onPrev={() => go(-1)}
                onNext={() => go(1)}
                onSelect={setIndex}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

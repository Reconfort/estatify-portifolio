"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Container } from "@estatify/ui";
import { ChevronLeftIcon, ChevronRightIcon, QuoteIcon } from "@estatify/ui/icons";
import { ImageReveal, Reveal } from "./reveal";
import { Parallax } from "./parallax";
import { SectionHeader } from "./section-header";
import { commitment, testimonials } from "@/components/landing-data";

/**
 * Commitment — differentiators on the left, photo with a rotating testimonial
 * card on the right.
 */
export function Commitment() {
  const [index, setIndex] = React.useState(0);
  const reduceMotion = useReducedMotion();
  const current = testimonials[index]!;

  const step = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);

  return (
    <section className="py-20 sm:py-28">
      <Container className="flex flex-col gap-14 sm:gap-16">
        <SectionHeader
          eyebrow={commitment.marquee}
          title={commitment.title}
          description={commitment.description}
        />

        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <ul className="flex flex-col gap-6">
            {commitment.values.map((value, i) => (
              <li key={value.title}>
                <Reveal index={i} y={14} className="flex gap-5">
                  <span
                    aria-hidden
                    className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-body-sm font-bold text-primary"
                  >
                    {i + 1}
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-h5 font-semibold text-foreground">{value.title}</h3>
                    <p className="text-body-sm leading-relaxed text-muted-foreground">
                      {value.body}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>

          <div className="relative flex flex-col">
            <ImageReveal className="overflow-hidden rounded-lg">
              <Parallax range={20} className="h-full">
                <Image
                  src={commitment.image}
                  alt="Estatify agency team reviewing portfolio analytics"
                  width={1024}
                  height={768}
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="h-full min-h-72 w-full scale-110 object-cover"
                />
              </Parallax>
            </ImageReveal>

            <div className="relative z-10 -mt-16 flex flex-col gap-4 self-end rounded-lg bg-card p-6  ring-1 ring-border sm:mr-6 sm:max-w-md">
              <QuoteIcon className="h-6 w-6 text-accent" aria-hidden />
              <div aria-live="polite" className="min-h-24">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.figure
                    key={index}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    {...(!reduceMotion ? { exit: { opacity: 0, y: -8 } } : {})}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-3"
                  >
                    <blockquote className="text-body-md leading-relaxed text-foreground">
                      “{current.quote}”
                    </blockquote>
                    <figcaption className="text-body-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">{current.name}</span> ·{" "}
                      {current.role}
                    </figcaption>
                  </motion.figure>
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-caption tabular-nums text-muted-foreground">
                  {index + 1} / {testimonials.length}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous testimonial"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <ChevronLeftIcon className="h-4 w-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next testimonial"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <ChevronRightIcon className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

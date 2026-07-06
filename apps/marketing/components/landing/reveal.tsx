"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@estatify/utils";

/** Strong ease-out — entrances should start fast and settle. */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;

interface RevealProps {
  children: React.ReactNode;
  /** Stagger index — each unit adds 60ms of delay. */
  index?: number | undefined;
  /** Extra delay in seconds, on top of the index stagger. */
  delay?: number | undefined;
  /** Vertical travel in px (ignored under reduced motion). */
  y?: number | undefined;
  className?: string | undefined;
}

/**
 * Reveal — the single scroll-entrance used across the landing page.
 * Fades + rises once when scrolled into view. Under reduced motion it
 * keeps the opacity fade (comprehension) and drops the movement.
 */
export function Reveal({ children, index = 0, delay = 0, y = 20, className }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: reduceMotion ? 0.25 : 0.6,
        delay: delay + index * 0.06,
        ease: EASE_OUT,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * ImageReveal — clip-path curtain reveal for imagery (bottom-up).
 * Decorative, plays once; reduced motion falls back to a plain fade.
 */
export function ImageReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { clipPath: "inset(100% 0 0 0)", opacity: 1 }
      }
      whileInView={reduceMotion ? { opacity: 1 } : { clipPath: "inset(0% 0 0 0)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: reduceMotion ? 0.25 : 0.8, ease: EASE_OUT }}
      className={cn("will-change-[clip-path]", className)}
    >
      {children}
    </motion.div>
  );
}

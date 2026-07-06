"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * Parallax — subtle scroll-linked vertical drift for depth. The element
 * travels `range`px → -`range`px as it crosses the viewport, so it moves
 * slower than the page around it. Decorative only: disabled under reduced
 * motion. Keep `range` small (16–48) — parallax reads as cheap the moment
 * it's obvious.
 */
export function Parallax({
  children,
  range = 32,
  className,
}: {
  children: React.ReactNode;
  /** Max vertical travel in px in each direction. */
  range?: number | undefined;
  className?: string | undefined;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);

  return (
    <motion.div ref={ref} {...(reduceMotion ? {} : { style: { y } })} className={className}>
      {children}
    </motion.div>
  );
}

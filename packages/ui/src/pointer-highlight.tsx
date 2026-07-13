"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@estatify/utils";

export type PointerHighlightProps = {
  children: React.ReactNode;
  /** Classes for the animated rectangle border. */
  rectangleClassName?: string;
  /** Classes for the pointer glyph. */
  pointerClassName?: string;
  /** Classes for the outer wrapper. */
  containerClassName?: string;
};

/**
 * PointerHighlight — Aceternity-style in-view highlight: animated border + pointer.
 * Presentational only. Wrap any inline title/phrase you want to call out.
 */
export function PointerHighlight({
  children,
  rectangleClassName,
  pointerClassName,
  containerClassName,
}: PointerHighlightProps) {
  const containerRef = React.useRef<HTMLSpanElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const update = () => {
      const { width, height } = node.getBoundingClientRect();
      setDimensions({ width, height });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const ready = dimensions.width > 0 && dimensions.height > 0;

  return (
    <span ref={containerRef} className={cn("relative inline-block w-fit", containerClassName)}>
      <span className="relative z-10">{children}</span>

      {ready ? (
        <motion.span
          className="pointer-events-none absolute top-0 left-0 z-0"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
          aria-hidden
        >
          <motion.span
            className={cn("absolute top-0 left-0 border border-neutral-900", rectangleClassName)}
            initial={{ width: 0, height: 0 }}
            whileInView={{
              width: dimensions.width,
              height: dimensions.height,
            }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.span
            className={cn("absolute text-neutral-900", pointerClassName)}
            initial={{ opacity: 0, x: 0, y: 0 }}
            whileInView={{
              opacity: 1,
              x: dimensions.width + 2,
              y: dimensions.height + 2,
            }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{
              opacity: { duration: 0.15, delay: 0.55 },
              x: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
              y: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
            }}
            style={{ rotate: -90 }}
          >
            <PointerIcon />
          </motion.span>
        </motion.span>
      ) : null}
    </span>
  );
}

function PointerIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .557.103z" />
    </svg>
  );
}

"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@estatify/utils";

/**
 * Marquee — an infinite, auto-scrolling row. Renders children twice and
 * animates -50% so the loop is seamless. Pauses on hover. Token-based edge fade.
 * For logos, testimonials, or social proof.
 */
export function Marquee({
  children,
  speed = 30,
  className,
}: {
  children: React.ReactNode;
  /** Seconds for one full loop. Lower = faster. */
  speed?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]",
        className,
      )}
    >
      <motion.div
        className="flex w-max gap-4 group-hover:[animation-play-state:paused]"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        <div className="flex shrink-0 gap-4">{children}</div>
        <div className="flex shrink-0 gap-4" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

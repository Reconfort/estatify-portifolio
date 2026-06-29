"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@estatify/utils";

/**
 * Spotlight — a soft, slowly-drifting radial glow for hero backgrounds.
 * Token-based (uses --color-primary / --color-accent), respects reduced-motion
 * via the global CSS rule. Purely decorative, so aria-hidden.
 */
export function Spotlight({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <motion.div
        className="absolute -top-1/3 left-1/2 h-[55rem] w-[55rem] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--color-primary) 22%, transparent), transparent)",
        }}
        animate={{ x: ["-52%", "-48%", "-52%"], y: [0, 24, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -top-24 right-[8%] h-[34rem] w-[34rem] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--color-accent) 30%, transparent), transparent)",
        }}
        animate={{ x: [0, -28, 0], y: [0, 18, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/** Subtle dotted grid backdrop using the border token. Decorative. */
export function GridBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]",
        className,
      )}
      style={{
        backgroundImage:
          "radial-gradient(color-mix(in oklab, var(--color-foreground) 8%, transparent) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    />
  );
}

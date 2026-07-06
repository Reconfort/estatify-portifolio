"use client";

import { SectionHeading } from "@estatify/ui";
import type { ComponentProps } from "react";
import { Reveal } from "./reveal";

type SectionHeaderProps = ComponentProps<typeof SectionHeading> & {
  /** Stagger index passed through to Reveal. */
  revealIndex?: number;
};

/**
 * SectionHeader — the single landing-page section intro.
 * Wraps SectionHeading with a scroll reveal; use this instead of ad-hoc headers.
 */
export function SectionHeader({ revealIndex, className, ...props }: SectionHeaderProps) {
  return (
    <Reveal index={revealIndex} className={className}>
      <SectionHeading {...props} />
    </Reveal>
  );
}

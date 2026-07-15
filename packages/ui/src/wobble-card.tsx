"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@estatify/utils";

export type WobbleCardProps = {
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
};

/**
 * WobbleCard — light hover-parallax card.
 * Defaults to card/token surfaces; override via containerClassName.
 */
export function WobbleCard({ children, containerClassName, className }: WobbleCardProps) {
  const reduceMotion = useReducedMotion();
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = React.useState(false);

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    if (reduceMotion) return;
    const { clientX, clientY } = event;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (clientX - (rect.left + rect.width / 2)) / 28;
    const y = (clientY - (rect.top + rect.height / 2)) / 28;
    setMousePosition({ x, y });
  };

  const hovering = isHovering && !reduceMotion;

  return (
    <motion.section
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      style={{
        transform: hovering
          ? `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0)`
          : "translate3d(0px, 0px, 0)",
        transition: "transform 0.15s ease-out",
      }}
      className={cn(
        "relative mx-auto w-full overflow-hidden border border-border bg-card",
        containerClassName,
      )}
    >
      <div className="relative h-full overflow-hidden rounded-[inherit]">
        <motion.div
          style={{
            transform: hovering
              ? `translate3d(${-mousePosition.x}px, ${-mousePosition.y}px, 0) scale3d(1.02, 1.02, 1)`
              : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
            transition: "transform 0.15s ease-out",
          }}
          className={cn("relative h-full px-6 py-8 sm:px-8 sm:py-10", className)}
        >
          {children}
        </motion.div>
      </div>
    </motion.section>
  );
}

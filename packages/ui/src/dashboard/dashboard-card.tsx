"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@estatify/utils";

/** Strong ease-out — entrances start fast and settle. */
export const DASH_EASE = [0.23, 1, 0.32, 1] as const;

/* ------------------------------ WidgetReveal ------------------------------ */

interface WidgetRevealProps {
  children: React.ReactNode;
  /** Stagger index — each unit adds 50ms. */
  index?: number;
  className?: string;
}

/** Single scroll/mount entrance used by every dashboard widget. */
export function WidgetReveal({ children, index = 0, className }: WidgetRevealProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: reduceMotion ? 0.2 : 0.45, delay: index * 0.05, ease: DASH_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------ DashboardCard ----------------------------- */

export interface DashboardCardProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Right-aligned header slot (filters, "View all", …). */
  action?: React.ReactNode;
  children: React.ReactNode;
  /** Remove body padding (tables, full-bleed charts). */
  flush?: boolean | undefined;
  className?: string | undefined;
  contentClassName?: string | undefined;
}

/**
 * DashboardCard — the one widget container.
 * Soft border, tiny shadow, calm hover; header + content slots.
 */
export function DashboardCard({
  title,
  description,
  action,
  children,
  flush = false,
  className,
  contentClassName,
}: DashboardCardProps) {
  return (
    <section
      className={cn(
        "group/card flex h-full flex-col rounded-lg border border-border/70 bg-card shadow-2xs",
        "transition-shadow duration-200",
        className,
      )}
    >
      {title ? (
        <header className="flex items-start justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
          <div className="min-w-0">
            <h2 className="text-h5 font-semibold tracking-tight text-foreground">{title}</h2>
            {description ? (
              <p className="mt-0.5 text-body-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </header>
      ) : null}
      <div
        className={cn(
          "min-h-0 flex-1",
          flush ? "pt-4" : "px-5 pb-5 pt-4 sm:px-6 sm:pb-6",
          !title && !flush && "pt-5 sm:pt-6",
          contentClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}

/* ------------------------------- MetricBadge ------------------------------ */

export function MetricBadge({ trend, className }: { trend: number; className?: string }) {
  const up = trend >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-caption font-semibold",
        up ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
        className,
      )}
    >
      <Icon className="size-3" aria-hidden />
      {up ? "+" : ""}
      {trend.toFixed(1)}%
    </span>
  );
}

/* ------------------------------- StatusBadge ------------------------------ */

export type StatusTone = "success" | "warning" | "info" | "neutral" | "destructive";

const statusToneClasses: Record<StatusTone, string> = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
  info: "bg-info/10 text-info",
  neutral: "bg-muted text-muted-foreground",
  destructive: "bg-destructive/10 text-destructive",
};

export function StatusBadge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: StatusTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-caption text-sm!",
        statusToneClasses[tone],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" aria-hidden />
      {children}
    </span>
  );
}

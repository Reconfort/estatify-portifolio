"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { DASH_EASE, DashboardCard, DonutChart } from "@estatify/ui";
import { leadPipeline, leadSources, leadSourcesTotal } from "./dashboard-data";

/** Lead Pipeline — horizontal progress rows per stage. */
export function LeadPipeline({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const max = Math.max(...leadPipeline.map((s) => s.count));

  return (
    <DashboardCard
      title="Lead pipeline"
      description="Where your leads are right now"
      action={
        <Link
          href="/leads"
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-body-sm font-medium text-primary transition-colors hover:bg-secondary"
        >
          Open
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      }
      className={className}
      contentClassName="flex flex-col justify-center gap-4"
    >
      {leadPipeline.map((stage, i) => (
        <div key={stage.stage}>
          <div className="mb-1.5 flex items-baseline justify-between gap-2">
            <span className="text-body-sm font-medium text-foreground">{stage.stage}</span>
            <span className="text-body-sm font-semibold tabular-nums text-foreground">
              {stage.count}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.span
              className="block h-full rounded-full"
              style={{ backgroundColor: stage.tone }}
              initial={{ width: reduceMotion ? `${(stage.count / max) * 100}%` : "0%" }}
              whileInView={{ width: `${(stage.count / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.6, ease: DASH_EASE }}
            />
          </div>
        </div>
      ))}
    </DashboardCard>
  );
}

/** Lead Sources — donut + legend. */
export function LeadSources({ className }: { className?: string }) {
  return (
    <DashboardCard
      title="Lead sources"
      description="Where inquiries come from"
      className={className}
      contentClassName="flex flex-col items-center gap-5"
    >
      <DonutChart
        slices={leadSources}
        centerLabel="Total leads"
        centerValue={leadSourcesTotal}
        formatValue={(v) => `${v}%`}
      />
      <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-2">
        {leadSources.map((s) => (
          <li key={s.name} className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: s.color }}
                aria-hidden
              />
              <span className="truncate text-body-sm text-muted-foreground">{s.name}</span>
            </span>
            <span className="text-body-sm font-semibold tabular-nums text-foreground">
              {s.value}%
            </span>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}

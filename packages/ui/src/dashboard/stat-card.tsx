"use client";

import type { LucideIcon } from "lucide-react";
import { DashboardCard, MetricBadge } from "./dashboard-card";
import { MiniBarChart } from "./charts";

export interface StatCardProps {
  label: string;
  value: string;
  trend: number;
  comparison: string;
  icon: LucideIcon;
  spark: readonly number[];
  /** Tooltip labels for the sparkline (same length as spark). */
  sparkLabels?: readonly string[] | undefined;
}

/** StatisticCard — KPI tile: icon, value, trend badge, sparkline. */
export function StatCard({
  label,
  value,
  trend,
  comparison,
  icon: Icon,
  spark,
  sparkLabels,
}: StatCardProps) {
  return (
    <DashboardCard contentClassName="flex flex-col justify-between gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-body-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1.5 text-display-md font-semibold tracking-tight text-foreground">
            {value}
          </p>
        </div>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground">
          <Icon className="size-4.5" aria-hidden />
        </span>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <MetricBadge trend={trend} />
          <span className="text-caption text-muted-foreground">{comparison}</span>
        </div>
        <MiniBarChart values={spark} labels={sparkLabels} positive={trend >= 0} />
      </div>
    </DashboardCard>
  );
}

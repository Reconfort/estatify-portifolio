"use client";

import { DashboardCard, StackedBarChart } from "@estatify/ui";
import { inquiryMonths, inquirySeries, inquiryTotals } from "./dashboard-data";

/** Inquiry Overview — stacked bars by channel across the year. */
export function InquiryChart({ className }: { className?: string }) {
  return (
    <DashboardCard
      title="Inquiry overview"
      description="(+18%) more inquiries than last year"
      action={
        <span className="rounded-lg border border-border/70 bg-background px-2.5 py-1 text-body-sm font-medium text-muted-foreground">
          2026
        </span>
      }
      className={className}
      contentClassName="flex flex-col gap-6"
    >
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {inquirySeries.map((s, i) => (
          <div key={s.name} className="flex items-center gap-2">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: s.color }}
              aria-hidden
            />
            <span className="text-body-sm text-muted-foreground">{s.name}</span>
            <span className="text-body-sm font-semibold text-foreground">
              {i === 0
                ? inquiryTotals.website
                : i === 1
                  ? inquiryTotals.whatsapp
                  : inquiryTotals.social}
            </span>
          </div>
        ))}
      </div>

      <StackedBarChart labels={inquiryMonths} series={inquirySeries} />
    </DashboardCard>
  );
}

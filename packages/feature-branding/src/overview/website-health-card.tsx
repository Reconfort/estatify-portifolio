"use client";

import { BarChart3 } from "lucide-react";
import type { ReadinessResult } from "@estatify/website-readiness";
import { Button } from "@estatify/ui";

/** Health signals + analytics placeholder — real audits land later. */
export function WebsiteHealthCard({ readiness }: { readiness: ReadinessResult }) {
  const seoRule = readiness.rules.find((r) => r.module === "seo");
  const homepageRule = readiness.rules.find((r) => r.module === "composer");
  const domainRule = readiness.rules.find((r) => r.module === "domain");

  const seoScore = seoRule?.status === "complete" ? 84 : seoRule?.status === "warning" ? 62 : 40;
  const mobileReady = homepageRule?.status !== "blocked";

  const rows = [
    { label: "SEO", value: `${seoScore}%`, ok: seoScore >= 70 },
    { label: "Mobile ready", value: mobileReady ? "Yes" : "No", ok: mobileReady },
    {
      label: "Custom domain",
      value: domainRule?.status === "complete" ? "Connected" : "Not connected",
      ok: domainRule?.status === "complete",
    },
    { label: "Analytics", value: "Not connected", ok: false },
  ];

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
          <BarChart3 className="size-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-h5 font-semibold text-foreground">Health & analytics</h2>
          <p className="mt-1 text-body-sm text-muted-foreground">
            Quick signals — full audits and visitor insights come later
          </p>
        </div>
      </div>

      <ul className="mt-4 divide-y divide-border/60">
        {rows.map((row) => (
          <li
            key={row.label}
            className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
          >
            <span className="text-body-sm text-muted-foreground">{row.label}</span>
            <span
              className={
                row.ok
                  ? "text-body-sm font-medium text-foreground"
                  : "text-body-sm text-muted-foreground"
              }
            >
              {row.value}
            </span>
          </li>
        ))}
      </ul>

      <dl className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border/60 px-3 py-2">
          <dt className="text-caption text-muted-foreground">Visitors · 7 days</dt>
          <dd className="mt-0.5 text-h4 font-semibold text-muted-foreground">—</dd>
        </div>
        <div className="rounded-lg border border-border/60 px-3 py-2">
          <dt className="text-caption text-muted-foreground">Page views</dt>
          <dd className="mt-0.5 text-h4 font-semibold text-muted-foreground">—</dd>
        </div>
      </dl>

      <Button type="button" variant="outline" className="mt-4 w-full" disabled>
        Connect analytics
      </Button>
    </section>
  );
}

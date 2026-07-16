"use client";

import { AlertTriangle, ArrowRight, Check } from "lucide-react";
import type { ReadinessResult, WebsiteTab } from "@estatify/website-readiness";
import { cn } from "@estatify/utils";

export function ReadinessPanel({
  readiness,
  onNavigate,
}: {
  readiness: ReadinessResult;
  onNavigate: (tab: WebsiteTab) => void;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-h5 font-semibold text-foreground">Website readiness</h2>
          <p className="mt-1 text-body-sm text-muted-foreground">
            What&apos;s left before customers can trust your site
          </p>
        </div>
        <div className="text-right">
          <p className="text-h3 font-semibold tabular-nums text-foreground">{readiness.score}%</p>
          <p className="text-caption text-muted-foreground">
            {readiness.completeCount} of {readiness.rules.length} ready
          </p>
        </div>
      </div>

      <div
        className="mt-4 h-2 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={readiness.score}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300"
          style={{ width: `${readiness.score}%` }}
        />
      </div>

      <ul className="mt-4 space-y-2">
        {readiness.rules.map((rule) => (
          <li key={rule.id}>
            <button
              type="button"
              onClick={() => rule.actionTab && onNavigate(rule.actionTab)}
              disabled={!rule.actionTab}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border border-border/60 px-3 py-2.5 text-left transition-colors",
                rule.actionTab && "hover:bg-secondary/50",
              )}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full",
                  rule.status === "complete" && "bg-accent/15 text-accent",
                  rule.status === "warning" && "bg-warning/15 text-warning",
                  rule.status === "blocked" && "bg-destructive/10 text-destructive",
                )}
              >
                {rule.status === "complete" ? (
                  <Check className="size-3.5" aria-hidden />
                ) : (
                  <AlertTriangle className="size-3.5" aria-hidden />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-body-sm font-medium text-foreground">{rule.label}</span>
                <span className="block text-caption text-muted-foreground">{rule.message}</span>
              </span>
              {rule.actionTab ? (
                <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

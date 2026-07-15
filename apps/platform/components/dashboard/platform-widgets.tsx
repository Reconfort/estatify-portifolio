"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  GitBranch,
  Globe,
  Info,
  LayoutTemplate,
  LifeBuoy,
  Rocket,
  Building2,
} from "lucide-react";
import { cn } from "@estatify/utils";
import {
  Button,
  DASH_EASE,
  DashboardCard,
  MetricBadge,
  RowActionsMenu,
  StackedBarChart,
  StatusBadge,
  type StatusTone,
} from "@estatify/ui";
import {
  activity,
  alerts,
  avgResponseTime,
  billing,
  customerSuccess,
  growthRanges,
  growthSeries,
  platformStatus,
  revenue,
  services,
  support,
  templates,
  tenantRows,
  websiteOverview,
  type GrowthRange,
  type ServiceState,
} from "./platform-data";

/* ------------------------------- Hero / status ----------------------------- */

export function PlatformHero({ firstName }: { firstName?: string | undefined }) {
  const reduceMotion = useReducedMotion();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const metrics = [
    {
      icon: Activity,
      value: platformStatus.uptime,
      label: "Uptime",
    },
    {
      icon: CheckCircle2,
      value: String(platformStatus.incidents),
      label: "Critical incidents",
    },
    {
      icon: Rocket,
      value: String(platformStatus.deploymentsToday),
      label: "Deployments today",
    },
    {
      icon: LifeBuoy,
      value: String(platformStatus.ticketsAwaiting),
      label: "Tickets awaiting",
    },
  ] as const;

  return (
    <section className="relative flex h-full min-h-56 flex-col justify-center overflow-hidden rounded-lg border border-white/5 bg-linear-to-br from-brand-950 via-brand-900 to-brand-950 p-6 text-neutral-50 sm:p-7 lg:p-8">
      {/* Atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgb(164_230_54_/_0.14),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-1/2 size-72 -translate-y-1/2 rounded-full bg-lime-400/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "linear-gradient(90deg, transparent 0%, black 40%, black 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
        <div className="min-w-0 flex-1 space-y-5">
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: DASH_EASE }}
            className="space-y-2"
          >
            <p className="text-body-sm text-neutral-400">
              {greeting}
              {firstName ? `, ${firstName}` : ""}
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-h2 font-semibold tracking-tight text-white sm:text-h1">
                Platform status
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-lime-400/95 px-2.5 py-1 text-caption font-semibold text-green-950">
                <span className="size-1.5 animate-pulse rounded-full bg-green-900" aria-hidden />
                {platformStatus.state}
              </span>
            </div>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.5, ease: DASH_EASE }}
            className="grid grid-cols-2 gap-2 sm:grid-cols-4"
          >
            {metrics.map((m) => (
              <li
                key={m.label}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur-sm"
              >
                <div className="mb-1.5 flex items-center gap-1.5 text-lime-400">
                  <m.icon className="size-3.5 shrink-0" aria-hidden />
                  <span className="truncate text-[0.65rem] font-medium uppercase tracking-[0.08em] text-neutral-400">
                    {m.label}
                  </span>
                </div>
                <p className="text-body-md font-semibold tabular-nums tracking-tight text-white">
                  {m.value}
                </p>
              </li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.5, ease: DASH_EASE }}
            className="flex flex-wrap items-center gap-2.5"
          >
            <Button href="/tenants" variant="accent" size="md" className="text-black!">
              <Building2 className="size-4" aria-hidden />
              View Tenants
            </Button>
            <Button
              href="/health"
              variant="ghost"
              size="md"
              className="border border-white/15 bg-white/5 text-neutral-100 hover:bg-white/10 hover:text-white"
            >
              <Activity className="size-4" aria-hidden />
              System Health
            </Button>
          </motion.div>
        </div>

        {/* Status pulse — desktop visual anchor */}
      </div>
    </section>
  );
}

/* ------------------------------ Growth overview ---------------------------- */

export function GrowthOverview({ className }: { className?: string | undefined }) {
  const [range, setRange] = React.useState<GrowthRange>("12m");
  const points = growthSeries[range];

  return (
    <DashboardCard
      title="Growth overview"
      description="MRR growth across the platform"
      action={
        <div
          role="tablist"
          aria-label="Date range"
          className="flex rounded-lg border border-border/70 bg-muted/40 p-0.5"
        >
          {growthRanges.map((r) => (
            <button
              key={r.key}
              role="tab"
              aria-selected={range === r.key}
              onClick={() => setRange(r.key)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs! text-caption font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
                range === r.key
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      }
      className={className}
      contentClassName="flex flex-col justify-end"
    >
      <StackedBarChart
        key={range}
        labels={points.map((p) => p.label)}
        series={[
          {
            name: "MRR",
            color: "var(--chart-1)",
            values: points.map((p) => p.value),
          },
        ]}
        formatValue={(v) => `$${v.toFixed(1)}k`}
      />
    </DashboardCard>
  );
}

/* --------------------------------- Revenue --------------------------------- */

export function RevenueCard({ className }: { className?: string | undefined }) {
  return (
    <DashboardCard
      title="Revenue"
      description="Subscription economics"
      action={
        <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-foreground">
          <CircleDollarSign className="size-4" aria-hidden />
        </span>
      }
      className={className}
      contentClassName="flex flex-col justify-center"
    >
      <ul className="divide-y divide-border/60">
        {revenue.rows.map((r) => (
          <li key={r.label} className="flex items-center justify-between gap-3 py-2.5">
            <span className="text-body-sm text-muted-foreground">{r.label}</span>
            <span className="flex items-center gap-2">
              <span className="text-body-sm font-semibold tabular-nums text-foreground">
                {r.value}
              </span>
              <MetricBadge trend={"invert" in r && r.invert ? -r.trend : r.trend} />
            </span>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}

/* ------------------------------- Tenant health ----------------------------- */

export function TenantHealthTable({ className }: { className?: string | undefined }) {
  return (
    <DashboardCard
      title="Tenant health"
      description="Every agency at a glance — flags for churn risk and growth"
      action={
        <Link
          href="/tenants"
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-body-sm font-medium text-primary transition-colors hover:bg-secondary"
        >
          All tenants
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      }
      flush
      className={className}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[52rem] border-collapse text-left">
          <thead>
            <tr className="border-y border-border/60 bg-muted/40">
              {[
                "Agency",
                "Plan",
                "Status",
                "Properties",
                "Leads",
                "Website",
                "Last activity",
                "",
              ].map((h, i) => (
                <th
                  key={i}
                  scope="col"
                  className="px-4 py-2.5 text-caption font-semibold tracking-wide text-muted-foreground first:pl-5 last:pr-5 sm:first:pl-6 sm:last:pr-6"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tenantRows.map((t) => (
              <tr
                key={t.slug}
                className={cn(
                  "group border-b border-border/50 transition-colors last:border-0 hover:bg-muted/30",
                  t.flag === "inactive" && "bg-muted/20",
                )}
              >
                <td className="px-4 py-3.5 first:pl-5 sm:first:pl-6">
                  <p className="flex items-center gap-2 text-body-sm font-medium text-foreground">
                    {t.agency}
                    {t.flag === "growth" ? (
                      <span className="rounded-full bg-accent/20 px-1.5 py-0.5 text-[0.65rem] font-bold text-lime-700 dark:text-lime-400">
                        High growth
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 text-caption text-muted-foreground">{t.slug}.estatify.rw</p>
                </td>
                <td className="px-4 py-3.5 text-body-sm text-muted-foreground">{t.plan}</td>
                <td className="px-4 py-3.5">
                  <StatusBadge tone={t.status.tone as StatusTone}>{t.status.label}</StatusBadge>
                </td>
                <td className="px-4 py-3.5 text-body-sm tabular-nums text-foreground">
                  {t.properties}
                </td>
                <td className="px-4 py-3.5 text-body-sm tabular-nums text-foreground">{t.leads}</td>
                <td className="px-4 py-3.5">
                  <StatusBadge tone={t.website.tone as StatusTone}>{t.website.label}</StatusBadge>
                </td>
                <td className="px-4 py-3.5 text-body-sm text-muted-foreground">{t.lastActivity}</td>
                <td className="px-4 py-3.5 pr-5 text-right sm:pr-6">
                  <RowActionsMenu ariaLabel={`Actions for ${t.agency}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}

/* ------------------------------ Platform health ---------------------------- */

const serviceTone: Record<ServiceState, { badge: StatusTone; label: string }> = {
  healthy: { badge: "success", label: "Healthy" },
  warning: { badge: "warning", label: "Warning" },
  critical: { badge: "destructive", label: "Critical" },
};

export function PlatformHealth({ className }: { className?: string | undefined }) {
  return (
    <DashboardCard
      title="Platform health"
      description={`All systems · avg response ${avgResponseTime}`}
      action={
        <Link
          href="/health"
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-body-sm font-medium text-primary transition-colors hover:bg-secondary"
        >
          Details
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      }
      className={className}
    >
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        {services.map((s) => {
          const tone = serviceTone[s.state];
          return (
            <div
              key={s.name}
              className={cn(
                "rounded-lg border p-3.5 transition-colors",
                s.state === "healthy"
                  ? "border-border/60 bg-background"
                  : s.state === "warning"
                    ? "border-warning/40 bg-warning/5"
                    : "border-destructive/40 bg-destructive/5",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-body-sm font-semibold text-foreground">{s.name}</p>
                <StatusBadge tone={tone.badge}>{tone.label}</StatusBadge>
              </div>
              <p className="mt-2 text-caption text-muted-foreground">
                Latency <span className="font-semibold text-foreground">{s.latency}</span>
              </p>
              <p className="mt-0.5 text-caption text-muted-foreground">
                Last incident {s.lastIncident}
              </p>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}

/* --------------------------------- Support --------------------------------- */

export function SupportCenter({ className }: { className?: string | undefined }) {
  const stats = [
    { label: "Open", value: String(support.open) },
    { label: "Critical", value: String(support.critical), warn: support.critical > 0 },
    { label: "Avg response", value: support.avgResponse },
    { label: "Resolved today", value: String(support.resolvedToday) },
    { label: "CSAT", value: support.csat },
  ] as const;

  return (
    <DashboardCard
      title="Support center"
      description="Queue health and latest conversations"
      action={
        <Link
          href="/tenants"
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-body-sm font-medium text-primary transition-colors hover:bg-secondary"
        >
          Queue
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      }
      className={className}
      contentClassName="flex flex-col gap-4"
    >
      <div className="grid grid-cols-5 divide-x divide-border/60 rounded-lg border border-border/60 bg-muted/30">
        {stats.map((s) => (
          <div key={s.label} className="px-2 py-2.5 text-center">
            <p
              className={cn(
                "text-h5 font-semibold tabular-nums",
                "warn" in s && s.warn ? "text-destructive" : "text-foreground",
              )}
            >
              {s.value}
            </p>
            <p className="mt-0.5 truncate text-[0.65rem] font-medium text-muted-foreground">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <ul className="space-y-1">
        {support.conversations.map((m) => (
          <li key={m.from}>
            <button
              type="button"
              className="flex w-full items-start gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-muted/40"
            >
              <span className="relative mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-caption font-bold text-brand-800 dark:bg-brand-900 dark:text-brand-200">
                {m.initials}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-body-sm font-semibold text-foreground">
                    {m.from}
                    {m.critical ? (
                      <span className="ml-2 rounded-full bg-destructive/10 px-1.5 py-0.5 text-[0.65rem] font-bold text-destructive">
                        Critical
                      </span>
                    ) : null}
                  </span>
                  <span className="shrink-0 text-caption text-muted-foreground">{m.time}</span>
                </span>
                <span className="mt-0.5 block truncate text-body-sm text-muted-foreground">
                  {m.preview}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}

/* -------------------------- Stat-list style widgets ------------------------ */

function StatList({
  rows,
}: {
  rows: readonly { label: string; value: string; warn?: boolean | undefined }[];
}) {
  return (
    <ul className="divide-y divide-border/60">
      {rows.map((r) => (
        <li key={r.label} className="flex items-center justify-between gap-3 py-2.5">
          <span className="flex items-center gap-2 text-body-sm text-muted-foreground">
            {r.warn ? <AlertTriangle className="size-3.5 text-warning" aria-hidden /> : null}
            {r.label}
          </span>
          <span
            className={cn(
              "text-body-sm font-semibold tabular-nums",
              r.warn ? "text-warning" : "text-foreground",
            )}
          >
            {r.value}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function WebsiteOverview({ className }: { className?: string | undefined }) {
  return (
    <DashboardCard
      title="Websites"
      description="Fleet across all tenants"
      action={
        <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-foreground">
          <Globe className="size-4" aria-hidden />
        </span>
      }
      className={className}
    >
      <StatList rows={websiteOverview} />
    </DashboardCard>
  );
}

export function BillingOverview({ className }: { className?: string | undefined }) {
  return (
    <DashboardCard title="Billing" description="Payments needing attention" className={className}>
      <StatList rows={billing} />
    </DashboardCard>
  );
}

/* ----------------------------- Customer success ---------------------------- */

export function CustomerSuccess({ className }: { className?: string | undefined }) {
  return (
    <DashboardCard
      title="Customer success"
      description="Who's winning, who needs a call"
      className={className}
      contentClassName="flex flex-col gap-4"
    >
      <div>
        <p className="mb-1.5 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
          Fastest growing
        </p>
        <ul className="space-y-1.5">
          {customerSuccess.fastestGrowing.map((c) => (
            <li key={c.name} className="flex items-center justify-between gap-2">
              <span className="truncate text-body-sm font-medium text-foreground">{c.name}</span>
              <span className="shrink-0 text-caption text-success">{c.metric}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-border/60 pt-3">
        <p className="mb-1.5 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
          Needs attention
        </p>
        <ul className="space-y-1.5">
          {customerSuccess.attention.map((c) => (
            <li key={c.name} className="flex items-center justify-between gap-2">
              <span className="truncate text-body-sm font-medium text-foreground">{c.name}</span>
              <span className="shrink-0 text-caption text-warning">{c.metric}</span>
            </li>
          ))}
        </ul>
      </div>
    </DashboardCard>
  );
}

/* -------------------------------- Templates -------------------------------- */

export function TemplateMarketplace({ className }: { className?: string | undefined }) {
  const max = Math.max(...templates.map((t) => t.installs));
  return (
    <DashboardCard
      title="Templates"
      description="Most installed this quarter"
      action={
        <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-foreground">
          <LayoutTemplate className="size-4" aria-hidden />
        </span>
      }
      className={className}
      contentClassName="flex flex-col justify-center gap-4"
    >
      {templates.map((t) => (
        <div key={t.name}>
          <div className="mb-1.5 flex items-baseline justify-between gap-2">
            <span className="text-body-sm font-medium text-foreground">{t.name}</span>
            <span className="text-caption tabular-nums text-muted-foreground">
              {t.installs} installs · {t.share}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <span
              className="block h-full rounded-full bg-chart-2"
              style={{ width: `${(t.installs / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </DashboardCard>
  );
}

/* -------------------------------- Activity --------------------------------- */

const activityIcon = {
  deploy: GitBranch,
  billing: CircleDollarSign,
  domain: Globe,
  tenant: Building2,
  website: Rocket,
  support: LifeBuoy,
} as const;

export function PlatformActivity({ className }: { className?: string | undefined }) {
  return (
    <DashboardCard
      title="Recent platform activity"
      description="Everything that happened this morning"
      className={className}
    >
      <ol className="relative space-y-4 before:absolute before:inset-y-1 before:left-[1.06rem] before:w-px before:bg-border/70">
        {activity.map((a, i) => {
          const Icon = activityIcon[a.type];
          return (
            <li key={i} className="relative flex items-start gap-3.5">
              <span
                className={cn(
                  "relative z-10 flex size-8.5 shrink-0 items-center justify-center rounded-full border border-border/70 bg-card",
                  i === 0 && "border-accent bg-accent/15",
                )}
              >
                <Icon
                  className={cn(
                    "size-3.5",
                    i === 0 ? "text-lime-700 dark:text-lime-400" : "text-muted-foreground",
                  )}
                  aria-hidden
                />
              </span>
              <div className="flex min-w-0 flex-1 items-baseline justify-between gap-3 pt-1.5">
                <p className="truncate text-body-sm font-medium text-foreground">{a.text}</p>
                <p className="shrink-0 text-caption tabular-nums text-muted-foreground">{a.time}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </DashboardCard>
  );
}

/* --------------------------------- Alerts ---------------------------------- */

const alertMeta = {
  warning: { icon: AlertTriangle, className: "text-warning bg-warning/10" },
  info: { icon: Info, className: "text-info bg-info/10" },
  success: { icon: CheckCircle2, className: "text-success bg-success/10" },
} as const;

export function ActionableAlerts({ className }: { className?: string | undefined }) {
  return (
    <DashboardCard
      title="Needs your attention"
      description="Only actionable notifications"
      className={className}
      contentClassName="flex flex-col gap-2.5"
    >
      {alerts.map((a) => {
        const meta = alertMeta[a.severity];
        const Icon = meta.icon;
        return (
          <div
            key={a.title}
            className="flex items-start gap-3 rounded-lg border border-border/60 bg-background p-3"
          >
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-lg",
                meta.className,
              )}
            >
              <Icon className="size-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-body-sm font-semibold text-foreground">{a.title}</p>
              <p className="mt-0.5 text-caption text-muted-foreground">{a.detail}</p>
            </div>
          </div>
        );
      })}
    </DashboardCard>
  );
}

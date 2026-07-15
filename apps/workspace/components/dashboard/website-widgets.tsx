"use client";

import Link from "next/link";
import { ExternalLink, Globe, Lock, Rocket } from "lucide-react";
import { DashboardCard, RadialProgress, StatusBadge } from "@estatify/ui";
import { quickActions, websiteStatus } from "./dashboard-data";

/** Website Status — domain, SSL, SEO score, deployment. */
export function WebsiteStatusCard({ className }: { className?: string }) {
  return (
    <DashboardCard
      title="Website"
      description="Your public agency site"
      action={
        <a
          href={`https://${websiteStatus.domain}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-body-sm font-medium text-primary transition-colors hover:bg-secondary"
        >
          Visit
          <ExternalLink className="size-3.5" aria-hidden />
        </a>
      }
      className={className}
      contentClassName="flex flex-col gap-5"
    >
      <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/30 p-3.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-lime-700 dark:text-lime-400">
          <Globe className="size-4.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-body-sm font-semibold text-foreground">
            {websiteStatus.domain}
          </p>
          <p className="mt-0.5 flex items-center gap-2 text-caption text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Lock className="size-3" aria-hidden /> SSL active
            </span>
            · Deployed {websiteStatus.lastDeploy}
          </p>
        </div>
        <StatusBadge tone="success">Live</StatusBadge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <RadialProgress value={websiteStatus.seoScore} label="SEO score" />
          <div>
            <p className="text-body-sm font-semibold text-foreground">SEO score</p>
            <p className="text-caption text-muted-foreground">Search readiness</p>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-h3 font-semibold tracking-tight text-foreground">
            {websiteStatus.visitors7d}
          </p>
          <p className="text-caption text-muted-foreground">Visitors · last 7 days</p>
        </div>
      </div>

      <Link
        href="/branding"
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-body-sm font-semibold text-foreground transition-colors hover:bg-secondary"
      >
        <Rocket className="size-4" aria-hidden />
        Publish changes
      </Link>
    </DashboardCard>
  );
}

/** Quick Actions — grid of shortcut cards. */
export function QuickActions({ className }: { className?: string }) {
  return (
    <DashboardCard
      title="Quick actions"
      description="Jump straight into common tasks"
      className={className}
    >
      <div className="grid grid-cols-2 gap-2.5">
        {quickActions.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.label}
              href={a.href}
              className="group flex flex-col gap-2.5 rounded-lg border border-border/60 bg-background p-3.5 transition-all hover:-translate-y-0.5 hover:border-border  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span className="flex size-8.5 items-center justify-center rounded-lg bg-secondary text-foreground transition-colors group-hover:bg-accent/20 group-hover:text-lime-700 dark:group-hover:text-lime-400">
                <Icon className="size-4" aria-hidden />
              </span>
              <span>
                <span className="block text-body-sm font-semibold text-foreground">{a.label}</span>
                <span className="mt-0.5 block text-caption text-muted-foreground">
                  {a.description}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </DashboardCard>
  );
}

"use client";

import Link from "next/link";
import { ExternalLink, Globe, Loader2, Rocket } from "lucide-react";
import { useMedia, useDraftConfiguration } from "@estatify/api-client";
import { useTenant } from "@estatify/auth";
import { evaluateWebsiteReadiness } from "@estatify/website-readiness";
import { DashboardCard, RadialProgress, StatusBadge } from "@estatify/ui";
import { quickActions } from "./dashboard-data";
import {
  formatRelativeTime,
  seoScoreFromReadiness,
  websiteDisplayHost,
  websiteVisitUrl,
} from "./website-utils";

/** Website Status — live config, readiness, and publish shortcut. */
export function WebsiteStatusCard({ className }: { className?: string }) {
  const { activeTenant } = useTenant();
  const { data, isLoading } = useDraftConfiguration();
  const logoQuery = useMedia({ category: "logo", page: 1, pageSize: 1 });
  const faviconQuery = useMedia({ category: "favicon", page: 1, pageSize: 1 });

  const agencySlug = activeTenant?.slug ?? data?.meta.agencySlug ?? undefined;
  const primaryDomain = data?.meta.primaryDomain ?? null;
  const isPublished = Boolean(data?.meta.publishedAt);
  const displayHost = websiteDisplayHost(agencySlug, primaryDomain);
  const visitUrl = websiteVisitUrl(agencySlug, primaryDomain, isPublished);

  const readiness = data
    ? evaluateWebsiteReadiness({
        draft: data,
        primaryDomain,
        hasLogo: (logoQuery.data?.items.length ?? 0) > 0,
        hasFavicon: (faviconQuery.data?.items.length ?? 0) > 0,
        ...(agencySlug ? { agencySlug } : {}),
      })
    : null;

  const seoScore = readiness ? seoScoreFromReadiness(readiness.rules) : 0;
  const lastPublished = data?.meta.publishedAt
    ? formatRelativeTime(data.meta.publishedAt)
    : "Never";

  return (
    <DashboardCard
      title="Website"
      description="Your public agency site"
      action={
        visitUrl ? (
          <a
            href={visitUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-body-sm font-medium text-primary transition-colors hover:bg-secondary"
          >
            Visit
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        ) : undefined
      }
      className={className}
      contentClassName="flex flex-col gap-5"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-10 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/30 p-3.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-lime-700 dark:text-lime-400">
              <Globe className="size-4.5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-body-sm font-semibold text-foreground">{displayHost}</p>
              <p className="mt-0.5 text-caption text-muted-foreground">
                {isPublished ? `Published ${lastPublished}` : "Draft — not live yet"}
              </p>
            </div>
            <StatusBadge tone={isPublished ? "success" : "warning"}>
              {isPublished ? "Live" : "Draft"}
            </StatusBadge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <RadialProgress value={seoScore} label="Readiness" />
              <div>
                <p className="text-body-sm font-semibold text-foreground">Readiness</p>
                <p className="text-caption text-muted-foreground">
                  {readiness ? `${readiness.score}% ready` : "—"}
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-h3 font-semibold tracking-tight text-foreground">
                {readiness?.blockedCount ?? 0}
              </p>
              <p className="text-caption text-muted-foreground">Blockers before publish</p>
            </div>
          </div>

          <Link
            href="/website"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-body-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            <Rocket className="size-4" aria-hidden />
            {isPublished ? "Manage website" : "Finish setup"}
          </Link>
        </>
      )}
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
              className="group flex flex-col gap-2.5 rounded-lg border border-border/60 bg-background p-3.5 transition-all hover:-translate-y-0.5 hover:border-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
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

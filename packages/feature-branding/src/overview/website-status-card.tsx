"use client";

import type { DraftConfiguration } from "@estatify/types";
import { cn } from "@estatify/utils";
import { platformSiteUrl, templateLabel } from "./utils";

function fmt(iso: string | null) {
  if (!iso) return "Never";
  return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function countPages(composition: DraftConfiguration["composition"]) {
  return Object.keys(composition?.pages ?? {}).length;
}

function countSections(composition: DraftConfiguration["composition"]) {
  return Object.values(composition?.pages ?? {}).reduce(
    (sum, page) => sum + (page.sections?.length ?? 0),
    0,
  );
}

export function WebsiteStatusCard({
  draft,
  readinessScore,
  agencySlug,
}: {
  draft: DraftConfiguration;
  readinessScore: number;
  agencySlug?: string;
}) {
  const isPublished = Boolean(draft.meta.publishedAt);
  const templateName = templateLabel(draft.meta.templateId);
  const pages = countPages(draft.composition);
  const sections = countSections(draft.composition);
  const domainLabel =
    draft.meta.primaryDomain ?? (agencySlug ? new URL(platformSiteUrl(agencySlug)).host : "—");

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
            Website status
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={cn("size-2 rounded-full", isPublished ? "bg-accent" : "bg-warning")}
              aria-hidden
            />
            <p className="text-h4 font-semibold text-foreground">
              {isPublished ? "Live" : "Draft"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-h3 font-semibold tabular-nums text-foreground">{readinessScore}%</p>
          <p className="text-caption text-muted-foreground">Readiness</p>
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-caption text-muted-foreground">Last published</dt>
          <dd className="text-body-sm font-medium text-foreground">
            {fmt(draft.meta.publishedAt)}
          </dd>
        </div>
        <div>
          <dt className="text-caption text-muted-foreground">Draft updated</dt>
          <dd className="text-body-sm font-medium text-foreground">{fmt(draft.meta.updatedAt)}</dd>
        </div>
        <div>
          <dt className="text-caption text-muted-foreground">Domain</dt>
          <dd className="truncate text-body-sm font-medium text-foreground">{domainLabel}</dd>
        </div>
        <div>
          <dt className="text-caption text-muted-foreground">Template</dt>
          <dd className="text-body-sm font-medium text-foreground">{templateName}</dd>
        </div>
        <div>
          <dt className="text-caption text-muted-foreground">Pages</dt>
          <dd className="text-body-sm font-medium text-foreground">{pages}</dd>
        </div>
        <div>
          <dt className="text-caption text-muted-foreground">Sections</dt>
          <dd className="text-body-sm font-medium text-foreground">{sections}</dd>
        </div>
      </dl>
    </section>
  );
}

"use client";

import { ExternalLink } from "lucide-react";
import { platformSiteUrl } from "./utils";

function formatHost(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

export function DomainCard({
  agencySlug,
  primaryDomain,
  isPublished,
}: {
  agencySlug?: string;
  primaryDomain?: string | null;
  isPublished: boolean;
}) {
  const platformUrl = agencySlug ? platformSiteUrl(agencySlug) : null;
  const platformHost = platformUrl ? formatHost(platformUrl) : "—";

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-h5 font-semibold text-foreground">Website URL</h2>
      <dl className="mt-4 space-y-3">
        <div>
          <dt className="text-caption text-muted-foreground">Platform URL</dt>
          <dd className="text-body-sm font-medium text-foreground">
            {platformUrl ? (
              <a
                href={platformUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                {platformHost}
                <ExternalLink className="size-3" aria-hidden />
              </a>
            ) : (
              "—"
            )}
          </dd>
        </div>
        <div>
          <dt className="text-caption text-muted-foreground">Status</dt>
          <dd className="text-body-sm font-medium text-foreground">
            {isPublished ? "Published" : "Draft only"}
          </dd>
        </div>
        <div>
          <dt className="text-caption text-muted-foreground">Custom domain</dt>
          <dd className="text-body-sm font-medium text-foreground">
            {primaryDomain ? (
              <a
                href={`https://${primaryDomain}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                {primaryDomain}
                <ExternalLink className="size-3" aria-hidden />
              </a>
            ) : (
              "Not connected"
            )}
          </dd>
        </div>
      </dl>
      {!primaryDomain ? (
        <p className="mt-4 text-caption text-muted-foreground">
          Custom domain connection will be available in a later milestone.
        </p>
      ) : null}
    </section>
  );
}

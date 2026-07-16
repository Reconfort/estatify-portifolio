"use client";

import * as React from "react";
import { ExternalLink, Monitor, Smartphone, Tablet } from "lucide-react";
import type { DraftConfiguration } from "@estatify/types";
import { Button } from "@estatify/ui";
import { cn } from "@estatify/utils";
import { PageRenderer } from "@estatify/website-renderer";
import { platformSiteUrl } from "./utils";

type PreviewDevice = "desktop" | "tablet" | "mobile";

const DEVICE_WIDTH: Record<PreviewDevice, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

function liveSiteUrl(
  agencySlug: string | undefined,
  primaryDomain: string | null | undefined,
  isPublished: boolean,
): string | undefined {
  if (isPublished && primaryDomain) {
    return `https://${primaryDomain}`;
  }
  if (agencySlug) {
    return platformSiteUrl(agencySlug);
  }
  return undefined;
}

export function PreviewPanel({
  draft,
  agencySlug,
  primaryDomain,
  isPublished,
  onCustomize,
}: {
  draft: DraftConfiguration;
  agencySlug?: string;
  primaryDomain?: string | null;
  isPublished: boolean;
  onCustomize: () => void;
}) {
  const [device, setDevice] = React.useState<PreviewDevice>("desktop");
  const previewUrl = liveSiteUrl(agencySlug, primaryDomain, isPublished);

  return (
    <section className="flex h-full flex-col rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <h2 className="text-h5 font-semibold text-foreground">Live preview</h2>
        <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
          {(
            [
              { id: "desktop" as const, icon: Monitor, label: "Desktop" },
              { id: "tablet" as const, icon: Tablet, label: "Tablet" },
              { id: "mobile" as const, icon: Smartphone, label: "Mobile" },
            ] as const
          ).map((d) => (
            <button
              key={d.id}
              type="button"
              aria-label={d.label}
              onClick={() => setDevice(d.id)}
              className={cn(
                "rounded-md p-1.5 transition-colors",
                device === d.id
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <d.icon className="size-4" aria-hidden />
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-muted/30 p-4">
        <div
          className="mx-auto transition-[max-width] duration-200"
          style={{ maxWidth: DEVICE_WIDTH[device] }}
        >
          <div className="overflow-hidden rounded-lg border border-border bg-white">
            <PageRenderer
              input={{
                page: "home",
                profile: draft.profile,
                brand: draft.brand,
                website: draft.website,
                seo: draft.seo,
                composition: draft.composition,
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3">
        <div className="flex items-center gap-2 text-caption text-muted-foreground">
          <span className="rounded-md border border-border px-2 py-0.5">
            {isPublished ? "Live" : "Draft"}
          </span>
          {previewUrl ? (
            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              {isPublished ? "View live site" : "Preview website"}
              <ExternalLink className="size-3" aria-hidden />
            </a>
          ) : null}
        </div>
        <Button type="button" size="sm" onClick={onCustomize}>
          Customize website
        </Button>
      </div>
    </section>
  );
}

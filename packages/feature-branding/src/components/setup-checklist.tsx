"use client";

import { ArrowRight, Check, LayoutTemplate } from "lucide-react";
import { cn } from "@estatify/utils";
import type {
  AgencyProfile,
  BrandIdentity,
  SeoConfiguration,
  WebsiteSettings,
} from "@estatify/types";

type SetupTab = "profile" | "brand" | "website" | "seo";

type SetupItem = {
  id: SetupTab;
  label: string;
  done: boolean;
  hint: string;
};

function buildItems(
  profile: AgencyProfile,
  brand: BrandIdentity,
  website: WebsiteSettings,
  seo: SeoConfiguration,
): SetupItem[] {
  const profileDone = Boolean(
    profile.basic.companyName?.trim() &&
    profile.contact.primaryEmail?.trim() &&
    profile.address.city?.trim(),
  );
  const brandDone = Boolean(
    brand.colors.primary?.trim() &&
    brand.typography.primaryFont?.trim() &&
    brand.typography.primaryFont !== "Rubik, sans-serif",
  );
  const websiteDone = Boolean(
    website.general.websiteTagline?.trim() || website.contact.websiteEmail?.trim(),
  );
  const seoDone = Boolean(seo.metaTitle?.trim() && seo.metaDescription?.trim());

  return [
    {
      id: "profile",
      label: "Agency profile",
      done: profileDone,
      hint: profileDone ? "Complete" : "Add company name, email, and city",
    },
    {
      id: "brand",
      label: "Brand identity",
      done: brandDone,
      hint: brandDone ? "Complete" : "Customize colors and fonts",
    },
    {
      id: "website",
      label: "Website settings",
      done: websiteDone,
      hint: websiteDone ? "Complete" : "Add tagline or public contact email",
    },
    {
      id: "seo",
      label: "SEO basics",
      done: seoDone,
      hint: seoDone ? "Complete" : "Add meta title and description",
    },
  ];
}

export function SetupChecklist({
  profile,
  brand,
  website,
  seo,
  activeTab,
  onNavigateTab,
  onOpenComposer,
}: {
  profile: AgencyProfile;
  brand: BrandIdentity;
  website: WebsiteSettings;
  seo: SeoConfiguration;
  activeTab: SetupTab;
  onNavigateTab: (tab: SetupTab) => void;
  onOpenComposer?: () => void;
}) {
  const items = buildItems(profile, brand, website, seo);
  const doneCount = items.filter((i) => i.done).length;
  const allDone = doneCount === items.length;
  const progress = Math.round((doneCount / items.length) * 100);
  const nextItem = items.find((i) => !i.done);

  if (allDone) {
    return (
      <section className="rounded-xl border border-border bg-card px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
              <Check className="size-4" aria-hidden />
            </span>
            <div>
              <p className="text-body-sm font-semibold text-foreground">Essentials configured</p>
              <p className="text-caption text-muted-foreground">
                Arrange your homepage in the Composer when you are ready.
              </p>
            </div>
          </div>
          {onOpenComposer ? (
            <button
              type="button"
              onClick={onOpenComposer}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-body-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <LayoutTemplate className="size-4" aria-hidden />
              Open Composer
            </button>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-h5 font-semibold text-foreground">Before you publish</h2>
          <p className="mt-1 text-body-sm text-muted-foreground">
            Finish these workspace settings. Your live site also needs a composed homepage in
            Composer.
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-h4 font-semibold tabular-nums text-foreground">{progress}%</p>
          <p className="text-caption text-muted-foreground">
            {doneCount} of {items.length} done
          </p>
        </div>
      </div>

      <div
        className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Setup progress"
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ul className="mt-4 divide-y divide-border/60 rounded-lg border border-border/60">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onNavigateTab(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/50",
                  isActive && "bg-secondary/40",
                )}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border text-caption font-semibold",
                    item.done
                      ? "border-accent/30 bg-accent/15 text-accent"
                      : "border-border bg-muted/40 text-muted-foreground",
                  )}
                  aria-hidden
                >
                  {item.done ? <Check className="size-3.5" /> : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block text-body-sm font-medium",
                      item.done ? "text-foreground" : "text-foreground",
                    )}
                  >
                    {item.label}
                  </span>
                  <span className="block text-caption text-muted-foreground">{item.hint}</span>
                </span>
                {!item.done ? (
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

      {nextItem && onOpenComposer ? (
        <p className="mt-3 text-caption text-muted-foreground">
          Tip: you can open{" "}
          <button
            type="button"
            onClick={onOpenComposer}
            className="font-medium text-primary hover:underline"
          >
            Composer
          </button>{" "}
          anytime, but publishing works best after the essentials above are filled in.
        </p>
      ) : null}
    </section>
  );
}

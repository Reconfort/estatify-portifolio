"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@estatify/utils";
import { getApiErrorMessage, useDraftConfiguration } from "@estatify/api-client";
import type { WebsiteTab } from "@estatify/website-readiness";
import {
  defaultAgencyProfile,
  defaultBrandIdentity,
  defaultSeoConfiguration,
  defaultWebsiteComposition,
  defaultWebsiteSettings,
} from "@estatify/types";
import { PublishBar } from "./components/publish-bar";
import { FormError } from "./components/section-shell";
import { BrandSection } from "./brand/brand-section";
import { ComposerPage } from "./composer/composer-page";
import { OverviewPage } from "./overview/overview-page";
import { ProfileSection } from "./profile/profile-section";
import { SeoSection } from "./seo/seo-section";
import { WebsiteSection } from "./website/website-section";

const CONFIG_TABS = [
  {
    key: "overview",
    label: "Overview",
    description: "Is your website ready for customers?",
  },
  {
    key: "profile",
    label: "Profile",
    description: "Agency identity shown on your public website.",
  },
  {
    key: "brand",
    label: "Brand",
    description: "Colors, fonts, and theme tokens for every page.",
  },
  {
    key: "settings",
    label: "Settings",
    description: "Site name, contact details, and navigation defaults.",
  },
  {
    key: "seo",
    label: "SEO",
    description: "Search and social metadata.",
  },
] as const;

type ConfigTabKey = (typeof CONFIG_TABS)[number]["key"];
export type WebsiteManagerTab = ConfigTabKey | "composer";

/** Website Manager — overview, configuration, and visual builder. */
export function WebsitePage() {
  const [tab, setTab] = React.useState<WebsiteManagerTab>("overview");
  const { data, isLoading, isError, error, refetch } = useDraftConfiguration();

  const navigate = React.useCallback((target: WebsiteTab) => {
    setTab(target);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <WebsiteHeader />
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="size-6 animate-spin" aria-hidden />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col gap-6">
        <WebsiteHeader />
        <div className="rounded-xl border border-border bg-card p-6">
          <FormError message={getApiErrorMessage(error)} />
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-3 text-body-sm font-medium text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const profile = data.profile ?? defaultAgencyProfile;
  const brand = data.brand ?? defaultBrandIdentity;
  const website = data.website ?? defaultWebsiteSettings;
  const seo = data.seo ?? defaultSeoConfiguration;
  const composition = data.composition ?? defaultWebsiteComposition;
  const activeTab = CONFIG_TABS.find((t) => t.key === tab);
  const isComposer = tab === "composer";
  const isOverview = tab === "overview";

  return (
    <div className={cn("flex flex-col", isComposer ? "gap-0" : "gap-6")}>
      {isComposer ? (
        <ComposerPage draft={{ ...data, composition }} onBack={() => setTab("overview")} />
      ) : (
        <>
          <WebsiteHeader />

          <div className="sticky top-0 z-20 -mx-1 space-y-3 bg-background/95 px-1 py-2 backdrop-blur-sm">
            {!isOverview ? (
              <PublishBar
                publishedAt={data.meta.publishedAt}
                updatedAt={data.meta.updatedAt}
                onCustomize={() => setTab("composer")}
              />
            ) : null}

            <nav className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2 border-b border-border pb-1">
                {CONFIG_TABS.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setTab(t.key)}
                    className={cn(
                      "rounded-md px-3 py-2 text-[0.8125rem] font-medium transition-colors",
                      tab === t.key
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                    )}
                  >
                    {t.label}
                  </button>
                ))}

                <span className="mx-1 hidden h-4 w-px bg-border sm:block" aria-hidden />

                <button
                  type="button"
                  onClick={() => setTab("composer")}
                  className="rounded-md px-3 py-2 text-[0.8125rem] font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
                >
                  Composer
                </button>
              </div>
            </nav>

            {activeTab ? (
              <p className="text-body-sm text-muted-foreground">{activeTab.description}</p>
            ) : null}
          </div>

          {isOverview ? (
            <OverviewPage draft={{ ...data, composition }} onNavigate={navigate} />
          ) : (
            <div className="mx-auto w-full max-w-3xl space-y-4">
              {tab === "profile" ? <ProfileSection profile={profile} /> : null}
              {tab === "brand" ? <BrandSection brand={brand} /> : null}
              {tab === "settings" ? <WebsiteSection website={website} /> : null}
              {tab === "seo" ? <SeoSection seo={seo} /> : null}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/** @deprecated Use WebsitePage instead. */
export const BrandingPage = WebsitePage;

function WebsiteHeader() {
  return (
    <div>
      <h1 className="text-h2 font-semibold text-foreground">Website</h1>
      <p className="mt-1 text-body-sm text-muted-foreground">
        Your website control center — see readiness, customize pages, and publish when you are
        ready.
      </p>
    </div>
  );
}

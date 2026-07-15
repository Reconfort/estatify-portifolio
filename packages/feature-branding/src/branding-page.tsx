"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@estatify/utils";
import { getApiErrorMessage, useDraftConfiguration } from "@estatify/api-client";
import {
  defaultAgencyProfile,
  defaultBrandIdentity,
  defaultSeoConfiguration,
  defaultWebsiteSettings,
} from "@estatify/types";
import { PublishBar } from "./components/publish-bar";
import { FormError } from "./components/section-shell";
import { BrandSection } from "./brand/brand-section";
import { ProfileSection } from "./profile/profile-section";
import { SeoSection } from "./seo/seo-section";
import { WebsiteSection } from "./website/website-section";

const TABS = [
  { key: "profile", label: "Profile" },
  { key: "brand", label: "Brand" },
  { key: "website", label: "Website" },
  { key: "seo", label: "SEO" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/** Workspace branding editor — profile, brand tokens, website, SEO, publish. */
export function BrandingPage() {
  const [tab, setTab] = React.useState<TabKey>("profile");
  const { data, isLoading, isError, error, refetch } = useDraftConfiguration();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <BrandingHeader />
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="size-6 animate-spin" aria-hidden />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col gap-6">
        <BrandingHeader />
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

  return (
    <div className="flex flex-col gap-6">
      <BrandingHeader />
      <PublishBar publishedAt={data.meta.publishedAt} updatedAt={data.meta.updatedAt} />

      <div className="flex flex-wrap gap-2 border-b border-border pb-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-md px-3 py-2 text-body-sm font-medium transition-colors",
              tab === t.key
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" ? <ProfileSection profile={profile} /> : null}
      {tab === "brand" ? <BrandSection brand={brand} /> : null}
      {tab === "website" ? <WebsiteSection website={website} /> : null}
      {tab === "seo" ? <SeoSection seo={seo} /> : null}
    </div>
  );
}

function BrandingHeader() {
  return (
    <div>
      <h1 className="text-h2 font-semibold text-foreground">Branding</h1>
      <p className="mt-1 text-body-sm text-muted-foreground">
        Customize your agency website identity, then publish when you are ready.
      </p>
    </div>
  );
}

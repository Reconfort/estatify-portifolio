"use client";

import type { DraftConfiguration } from "@estatify/types";
import { useMedia } from "@estatify/api-client";
import { useTenant } from "@estatify/auth";
import {
  evaluateWebsiteReadiness,
  getHomepageSectionSummary,
  type WebsiteTab,
} from "@estatify/website-readiness";
import { DomainCard } from "./domain-card";
import { HomepageSummary } from "./homepage-summary";
import { PreviewPanel } from "./preview-panel";
import { PublishingPanel } from "./publishing-panel";
import { ReadinessPanel } from "./readiness-panel";
import { TemplateCard } from "./template-card";
import { WebsiteHealthCard } from "./website-health-card";
import { WebsiteStatusCard } from "./website-status-card";

export function OverviewPage({
  draft,
  onNavigate,
}: {
  draft: DraftConfiguration;
  onNavigate: (tab: WebsiteTab) => void;
}) {
  const { activeTenant } = useTenant();
  const logoQuery = useMedia({ category: "logo", page: 1, pageSize: 1 });
  const faviconQuery = useMedia({ category: "favicon", page: 1, pageSize: 1 });

  const agencySlug = activeTenant?.slug ?? draft.meta.agencySlug ?? undefined;
  const primaryDomain = draft.meta.primaryDomain;
  const readiness = evaluateWebsiteReadiness({
    draft,
    primaryDomain,
    hasLogo: (logoQuery.data?.items.length ?? 0) > 0,
    hasFavicon: (faviconQuery.data?.items.length ?? 0) > 0,
    ...(agencySlug ? { agencySlug } : {}),
  });

  const homepageSections = getHomepageSectionSummary(draft);
  const isPublished = Boolean(draft.meta.publishedAt);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4">
      <div className="grid gap-4 lg:grid-cols-5 lg:gap-6">
        {/* Decision path — status, readiness, publish */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <WebsiteStatusCard
            draft={draft}
            readinessScore={readiness.score}
            {...(agencySlug ? { agencySlug } : {})}
          />
          <ReadinessPanel readiness={readiness} onNavigate={onNavigate} />
          <PublishingPanel
            readiness={readiness}
            publishedAt={draft.meta.publishedAt}
            updatedAt={draft.meta.updatedAt}
            isPublished={isPublished}
          />
        </div>

        {/* Live preview — primary visual */}
        <div className="lg:col-span-3 lg:min-h-[640px]">
          <PreviewPanel
            draft={draft}
            {...(agencySlug ? { agencySlug } : {})}
            primaryDomain={primaryDomain}
            isPublished={isPublished}
            onCustomize={() => onNavigate("composer")}
          />
        </div>
      </div>

      {/* Secondary context — homepage, template, domain, health */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <HomepageSummary sections={homepageSections} onEdit={() => onNavigate("composer")} />
        <TemplateCard templateId={draft.meta.templateId} onPreview={() => onNavigate("composer")} />
        <DomainCard
          {...(agencySlug ? { agencySlug } : {})}
          primaryDomain={primaryDomain}
          isPublished={isPublished}
        />
        <WebsiteHealthCard readiness={readiness} />
      </div>
    </div>
  );
}

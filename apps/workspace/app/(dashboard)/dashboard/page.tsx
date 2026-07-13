"use client";

import { useSession, useTenant } from "@estatify/auth";
import {
  HeroBanner,
  InquiryChart,
  LeadPipeline,
  LeadSources,
  PropertiesTable,
  QuickActions,
  RecentMessages,
  StatCard,
  UpcomingAppointments,
  WebsiteStatusCard,
  WidgetReveal,
} from "@/components/dashboard";
import { kpis, sparkLabels } from "@/components/dashboard/dashboard-data";

/**
 * Workspace dashboard — 12-column widget grid.
 * Every section is a reusable component; this file only composes.
 */
export default function DashboardHome() {
  const { user } = useSession();
  const { activeTenant } = useTenant();

  const agencyName = activeTenant?.agencyName ?? activeTenant?.slug ?? "Your Agency";
  const firstName = user?.email?.split("@")[0]?.split(/[._-]/)[0];
  const displayName = firstName
    ? firstName.charAt(0).toUpperCase() + firstName.slice(1)
    : undefined;

  return (
    <div className="grid grid-cols-12 gap-4 sm:gap-5">
      {/* Row 1 — hero + website status */}
      <WidgetReveal index={0} className="col-span-12 xl:col-span-8">
        <HeroBanner agencyName={agencyName} {...(displayName ? { firstName: displayName } : {})} />
      </WidgetReveal>
      <WidgetReveal index={1} className="col-span-12 xl:col-span-4">
        <WebsiteStatusCard className="h-full" />
      </WidgetReveal>

      {/* Row 2 — KPI tiles */}
      {kpis.map((kpi, i) => (
        <WidgetReveal
          key={kpi.key}
          index={2 + i}
          className="col-span-12 sm:col-span-6 xl:col-span-3"
        >
          <StatCard
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
            comparison={kpi.comparison}
            icon={kpi.icon}
            spark={kpi.spark}
            sparkLabels={sparkLabels}
          />
        </WidgetReveal>
      ))}

      {/* Row 3 — inquiries + lead sources */}
      <WidgetReveal index={6} className="col-span-12 xl:col-span-8">
        <InquiryChart className="h-full" />
      </WidgetReveal>
      <WidgetReveal index={7} className="col-span-12 xl:col-span-4">
        <LeadSources className="h-full" />
      </WidgetReveal>

      {/* Row 4 — properties table + pipeline */}
      <WidgetReveal index={8} className="col-span-12 xl:col-span-8">
        <PropertiesTable className="h-full" />
      </WidgetReveal>
      <WidgetReveal index={9} className="col-span-12 xl:col-span-4">
        <LeadPipeline className="h-full" />
      </WidgetReveal>

      {/* Row 5 — schedule, messages, shortcuts */}
      <WidgetReveal index={10} className="col-span-12 md:col-span-6 xl:col-span-4">
        <UpcomingAppointments className="h-full" />
      </WidgetReveal>
      <WidgetReveal index={11} className="col-span-12 md:col-span-6 xl:col-span-4">
        <RecentMessages className="h-full" />
      </WidgetReveal>
      <WidgetReveal index={12} className="col-span-12 xl:col-span-4">
        <QuickActions className="h-full" />
      </WidgetReveal>
    </div>
  );
}

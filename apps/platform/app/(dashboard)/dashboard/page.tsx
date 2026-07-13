"use client";

import { useSession } from "@estatify/auth";
import { StatCard, WidgetReveal } from "@estatify/ui";
import {
  ActionableAlerts,
  BillingOverview,
  CustomerSuccess,
  GrowthOverview,
  PlatformActivity,
  PlatformHealth,
  PlatformHero,
  RevenueCard,
  SupportCenter,
  TemplateMarketplace,
  TenantHealthTable,
  WebsiteOverview,
} from "@/components/dashboard/platform-widgets";
import { platformKpis, sparkLabels } from "@/components/dashboard/platform-data";

/**
 * Platform admin dashboard — Estatify's internal command center.
 * Same shell + widget kit as the Workspace dashboard; platform content only.
 */
export default function PlatformDashboardHome() {
  const { user } = useSession();
  const firstName = user?.email?.split("@")[0]?.split(/[._-]/)[0];
  const displayName = firstName
    ? firstName.charAt(0).toUpperCase() + firstName.slice(1)
    : undefined;

  return (
    <div className="grid grid-cols-12 gap-4 sm:gap-5">
      {/* Row 1 — status hero + support queue */}
      <WidgetReveal index={0} className="col-span-12 xl:col-span-8">
        <PlatformHero firstName={displayName} />
      </WidgetReveal>
      <WidgetReveal index={1} className="col-span-12 xl:col-span-4">
        <SupportCenter className="h-full" />
      </WidgetReveal>

      {/* Rows 2–3 — KPI tiles */}
      {platformKpis.map((kpi, i) => (
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

      {/* Row 4 — growth + revenue */}
      <WidgetReveal index={10} className="col-span-12 xl:col-span-8">
        <GrowthOverview className="h-full" />
      </WidgetReveal>
      <WidgetReveal index={11} className="col-span-12 xl:col-span-4">
        <RevenueCard className="h-full" />
      </WidgetReveal>

      {/* Row 5 — tenant health */}
      <WidgetReveal index={12} className="col-span-12">
        <TenantHealthTable />
      </WidgetReveal>

      {/* Row 6 — platform health + websites */}
      <WidgetReveal index={13} className="col-span-12 xl:col-span-8">
        <PlatformHealth className="h-full" />
      </WidgetReveal>
      <WidgetReveal index={14} className="col-span-12 xl:col-span-4">
        <WebsiteOverview className="h-full" />
      </WidgetReveal>

      {/* Row 7 — billing, customer success, templates */}
      <WidgetReveal index={15} className="col-span-12 md:col-span-6 xl:col-span-4">
        <BillingOverview className="h-full" />
      </WidgetReveal>
      <WidgetReveal index={16} className="col-span-12 md:col-span-6 xl:col-span-4">
        <CustomerSuccess className="h-full" />
      </WidgetReveal>
      <WidgetReveal index={17} className="col-span-12 xl:col-span-4">
        <TemplateMarketplace className="h-full" />
      </WidgetReveal>

      {/* Row 8 — activity + alerts */}
      <WidgetReveal index={18} className="col-span-12 xl:col-span-8">
        <PlatformActivity className="h-full" />
      </WidgetReveal>
      <WidgetReveal index={19} className="col-span-12 xl:col-span-4">
        <ActionableAlerts className="h-full" />
      </WidgetReveal>
    </div>
  );
}

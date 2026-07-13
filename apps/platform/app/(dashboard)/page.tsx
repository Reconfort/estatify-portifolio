"use client";

import { useSession } from "@estatify/auth";
import { Button } from "@estatify/ui";
import { Shield, Activity, Database, Users, Cpu, Layers } from "lucide-react";

export default function PlatformDashboardHome() {
  const { user } = useSession();

  // Mock platform system metrics
  const metrics = [
    { label: "Active Tenants", value: "348", icon: Users, color: "text-blue-500" },
    { label: "Total Properties", value: "4,912", icon: Layers, color: "text-brand-500" },
    { label: "System Load", value: "14.2%", icon: Cpu, color: "text-lime-500" },
    { label: "Database Pool", value: "99.8%", icon: Database, color: "text-purple-500" },
  ];

  // Mock list of registered tenants/agencies for staff review
  const tenants = [
    {
      name: "Acme Real Estate",
      slug: "acme",
      owner: "owner@acme.com",
      plan: "Enterprise",
      status: "Active",
      created: "2026-06-12",
    },
    {
      name: "Apex Agency",
      slug: "apex",
      owner: "billing@apex.com",
      plan: "Professional",
      status: "Active",
      created: "2026-06-30",
    },
    {
      name: "Safari Properties",
      slug: "safari",
      owner: "safari@gmail.com",
      plan: "Basic",
      status: "Active",
      created: "2026-07-04",
    },
    {
      name: "Eldoret Realty",
      slug: "eldoret",
      owner: "info@eldoretrealty.co.ke",
      plan: "Professional",
      status: "Pending Verification",
      created: "2026-07-11",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Staff Hero banner */}
      <div className="rounded-2xl bg-linear-to-r from-neutral-900 to-neutral-950 p-6 md:p-8 text-neutral-0 shadow-lg border border-neutral-800 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-brand-500/10 blur-3xl"></div>
        <div className="relative space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-500/20 px-2.5 py-0.5 text-caption font-semibold text-brand-400">
              <Shield className="h-3 w-3" />
              Staff Dashboard
            </span>
          </div>
          <h1 className="text-display-md font-bold leading-tight">Estatify Platform Console</h1>
          <p className="text-body-md text-neutral-300 max-w-xl">
            You are logged in as a platform operations administrator. Track system health, provision
            agency tenants, modify pricing structures, and manage global settings.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-800 px-3 py-1 text-caption text-neutral-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {user?.email}
            </span>
            <span className="inline-flex items-center rounded-full bg-brand-500/20 px-3 py-1 text-caption font-semibold text-brand-400">
              Platform Role: {user?.platformRole?.toUpperCase() || "SUPPORT"}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-6 md:grid-cols-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <p className="text-body-sm font-medium text-muted-foreground">{m.label}</p>
                <div className={`rounded-lg bg-secondary p-2 ${m.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-2 text-display-sm font-bold text-foreground">{m.value}</p>
            </div>
          );
        })}
      </div>

      {/* System alerts banner */}
      <div className="rounded-xl border border-lime-500/20 bg-lime-500/5 p-4 flex items-start gap-3">
        <Activity className="h-5 w-5 text-lime-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-body-sm font-bold text-foreground">All Core Systems Operational</h4>
          <p className="text-caption text-muted-foreground">
            Multi-tenant Sites Runtime (africa-sites deploy group) is running healthy. Next.js Edge
            routing latency: 12ms.
          </p>
        </div>
      </div>

      {/* Tenant agencies list */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="p-6 border-b border-border/50 flex justify-between items-center">
          <div>
            <h3 className="text-h3 font-semibold text-foreground">Global Tenants Overview</h3>
            <p className="text-caption text-muted-foreground">
              Recently registered tenant workspaces across the cluster.
            </p>
          </div>
          <Button variant="outline" className="h-9 text-body-xs font-semibold">
            View All Tenants
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/40 text-caption font-semibold text-muted-foreground uppercase border-b border-border/50">
                <th className="p-4 pl-6">Agency Name</th>
                <th className="p-4">Subdomain</th>
                <th className="p-4">Owner</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-body-sm">
              {tenants.map((tenant, idx) => (
                <tr key={idx} className="hover:bg-secondary/20 transition-colors">
                  <td className="p-4 pl-6 font-semibold text-foreground">{tenant.name}</td>
                  <td className="p-4 font-mono text-muted-foreground">{tenant.slug}</td>
                  <td className="p-4 text-muted-foreground">{tenant.owner}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center rounded-md bg-brand-500/10 px-2 py-0.5 text-caption font-semibold text-brand-600 dark:text-brand-400">
                      {tenant.plan}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-caption font-medium ${
                        tenant.status === "Active"
                          ? "bg-lime-500/15 text-lime-700 dark:text-lime-400"
                          : "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                      }`}
                    >
                      {tenant.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-muted-foreground">{tenant.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

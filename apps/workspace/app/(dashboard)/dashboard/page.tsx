"use client";

import * as React from "react";
import { useSession, useTenant } from "@estatify/auth";
import { Button } from "@estatify/ui";
import { Building2, Users, TrendingUp, Settings, LogOut, Palette } from "lucide-react";

export default function DashboardHome() {
  const { user, signOut } = useSession();
  const { activeTenant } = useTenant();
  const [signingOut, setSigningOut] = React.useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      window.location.assign("/sign-in");
    }
  };

  const agencyName = activeTenant?.agencyName ?? activeTenant?.slug ?? "Your Agency";
  const userRole = activeTenant?.role ?? "Member";

  // Mock dashboard stats
  const stats = [
    {
      label: "Active Listings",
      value: "12",
      icon: Building2,
      color: "text-brand-600 dark:text-brand-400",
    },
    { label: "New Leads", value: "48", icon: Users, color: "text-lime-600 dark:text-lime-400" },
    {
      label: "Agent Performance",
      value: "+18%",
      icon: TrendingUp,
      color: "text-brand-600 dark:text-brand-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Welcome banner */}
      <div className="rounded-2xl bg-linear-to-r from-brand-900 to-brand-950 p-6 md:p-8 text-neutral-0 shadow-lg border border-brand-800 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-lime-400/10 blur-3xl"></div>
        <div className="relative space-y-4">
          <p className="text-overline uppercase tracking-widest text-lime-400">Welcome Back</p>
          <h1 className="text-display-md font-bold leading-tight">
            Manage <span className="text-lime-300">{agencyName}</span>
          </h1>
          <p className="text-body-md text-brand-100 max-w-xl">
            Analyze property metrics, track inbound customer leads, coordinate agent operations, and
            configure your white-label public branding.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-800 px-3 py-1 text-caption text-brand-200">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-400 animate-pulse"></span>
              {user?.email}
            </span>
            <span className="inline-flex items-center rounded-full bg-lime-400/20 px-3 py-1 text-caption font-semibold text-lime-300">
              Role: {userRole.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-body-sm font-medium text-muted-foreground">{stat.label}</p>
                <div className={`rounded-lg bg-secondary p-2 ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-2 text-display-md font-bold text-foreground">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick actions & system details */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
          <h2 className="text-h3 font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center p-6 h-auto gap-3 text-center transition-all hover:border-brand-500"
            >
              <Building2 className="h-6 w-6 text-brand-600 dark:text-brand-400" />
              <span className="font-semibold text-body-sm">Add Property</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center p-6 h-auto gap-3 text-center transition-all hover:border-brand-500"
            >
              <Users className="h-6 w-6 text-lime-600 dark:text-lime-400" />
              <span className="font-semibold text-body-sm">Manage Leads</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center p-6 h-auto gap-3 text-center transition-all hover:border-brand-500"
            >
              <Palette className="h-6 w-6 text-brand-600 dark:text-brand-400" />
              <span className="font-semibold text-body-sm">Edit Branding</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center p-6 h-auto gap-3 text-center transition-all hover:border-brand-500"
            >
              <Settings className="h-6 w-6 text-lime-600 dark:text-lime-400" />
              <span className="font-semibold text-body-sm">Agency Settings</span>
            </Button>
          </div>
        </div>

        {/* Info & Session Card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-h3 font-semibold text-foreground">Session Diagnostics</h2>
            <div className="space-y-2 text-body-sm text-muted-foreground">
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span>User ID</span>
                <span className="font-mono text-foreground">{user?.id}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span>Tenant ID</span>
                <span className="font-mono text-foreground">{activeTenant?.tenantId}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span>Subdomain Slug</span>
                <span className="text-foreground">{activeTenant?.slug}.estatify.com</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Button
              variant="destructive"
              className="w-full flex items-center justify-center gap-2 h-11"
              onClick={handleSignOut}
              disabled={signingOut}
            >
              <LogOut className="h-4 w-4" />
              {signingOut ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

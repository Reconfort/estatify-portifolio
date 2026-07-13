"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, useTenant } from "@estatify/auth";
import { cn } from "@estatify/utils";
import {
  Building2,
  Users,
  Compass,
  TrendingUp,
  LogOut,
  Palette,
  LayoutDashboard,
  CreditCard,
  Menu,
  X,
  User,
  ShieldCheck,
} from "lucide-react";
import { VisitEstatifyLink } from "../../components/visit-estatify-link";

const SIDEBAR_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Properties", href: "/properties", icon: Building2 },
  { label: "Leads", href: "/leads", icon: Users },
  { label: "Agents", href: "/agents", icon: ShieldCheck },
  { label: "Branding", href: "/branding", icon: Palette },
  { label: "Analytics", href: "/analytics", icon: TrendingUp },
  { label: "Billing", href: "/billing", icon: CreditCard },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useSession();
  const { activeTenant } = useTenant();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

  const agencyName = activeTenant?.agencyName ?? activeTenant?.slug ?? "Workspace";

  return (
    <div className="flex min-h-dvh bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-border md:bg-card">
        {/* Logo Section */}
        <div className="flex h-16 items-center px-6 border-b border-border/50 gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-brand-500 to-lime-400 shadow-md">
            <Compass className="h-5 w-5 text-neutral-950 font-bold" />
          </div>
          <div>
            <span className="font-bold text-body-md tracking-tight block">Estatify</span>
            <span className="text-caption text-muted-foreground block -mt-1 font-medium">
              workspace
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 space-y-1.5 px-4 py-6">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-sm font-medium transition-all duration-150 outline-none hover:bg-secondary",
                  active
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-400 border-l-2 border-brand-500 rounded-l-none pl-2.5"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "h-4.5 w-4.5",
                    active ? "text-brand-600 dark:text-brand-400" : "text-muted-foreground",
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer Tenant Switcher Info */}
        <div className="space-y-3 border-t border-border/50 bg-secondary/30 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-body-sm font-bold text-neutral-0">
              {agencyName.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-body-sm leading-tight font-semibold text-foreground">
                {agencyName}
              </p>
              <p className="truncate text-caption leading-normal text-muted-foreground">
                {activeTenant?.role || "Member"}
              </p>
            </div>
          </div>
          <VisitEstatifyLink
            variant="visit"
            className="text-caption text-muted-foreground transition-colors hover:text-foreground"
          />
        </div>
      </aside>

      {/* Mobile Drawer (backdrop + nav) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          ></div>
          {/* Drawer content */}
          <aside className="relative flex w-64 max-w-xs flex-col bg-card border-r border-border p-6 shadow-xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Compass className="h-6 w-6 text-brand-600" />
                <span className="font-bold text-body-lg">Estatify</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-2">
              {SIDEBAR_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-sm font-medium transition-colors",
                      active
                        ? "bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto space-y-3 border-t border-border pt-4">
              <div>
                <p className="text-caption text-muted-foreground">Active Agency</p>
                <p className="truncate text-body-sm font-bold text-foreground">{agencyName}</p>
              </div>
              <VisitEstatifyLink
                variant="visit"
                className="text-caption text-muted-foreground transition-colors hover:text-foreground"
              />
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Top Header navbar */}
        <header className="flex h-16 items-center justify-between border-b border-border/50 bg-card px-6 shadow-2xs">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="hidden md:block text-body-lg font-semibold text-foreground">
              {agencyName}
            </h2>
          </div>

          {/* Top Actions & Profile Dropdown */}
          <div className="flex items-center gap-4 relative">
            <button
              type="button"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary border border-border">
                <User className="h-4 w-4" />
              </div>
              <span className="hidden sm:inline text-body-sm font-medium pr-1 text-foreground">
                {user?.email}
              </span>
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setProfileDropdownOpen(false)}
                ></div>
                <div className="absolute right-0 top-10 z-20 w-56 rounded-lg border border-border bg-card p-2 shadow-lg animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-2 border-b border-border/50 mb-1">
                    <p className="text-body-xs text-muted-foreground font-medium">Logged in as</p>
                    <p className="text-body-sm font-semibold truncate text-foreground">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      void (async () => {
                        await signOut();
                        window.location.assign("/sign-in");
                      })();
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-body-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page Inner Container */}
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-10 bg-background/50">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

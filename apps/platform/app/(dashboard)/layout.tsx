"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@estatify/auth";
import { cn } from "@estatify/utils";
import {
  Compass,
  LayoutDashboard,
  Shield,
  Activity,
  Layers,
  Database,
  Logs,
  Settings,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";

const SIDEBAR_ITEMS = [
  { label: "Console Home", href: "/", icon: LayoutDashboard },
  { label: "Tenants Directory", href: "/tenants", icon: Layers },
  { label: "Database Pools", href: "/db", icon: Database },
  { label: "System Health", href: "/health", icon: Activity },
  { label: "Audit Logs", href: "/logs", icon: Logs },
  { label: "Global Settings", href: "/settings", icon: Settings },
];

export default function PlatformDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useSession();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

  return (
    <div className="flex min-h-dvh bg-background text-foreground">
      {/* Desktop Sidebar (Steel themed) */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-border md:bg-neutral-900 md:text-neutral-100">
        {/* Logo Section */}
        <div className="flex h-16 items-center px-6 border-b border-neutral-800 gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-neutral-700 to-neutral-500 shadow-inner border border-neutral-600">
            <Compass className="h-5 w-5 text-neutral-100" />
          </div>
          <div>
            <span className="font-bold text-body-md tracking-tight block text-neutral-100">
              Estatify
            </span>
            <span className="text-caption text-neutral-400 block -mt-1 font-semibold flex items-center gap-1">
              <Shield className="h-3 w-3 text-brand-500" />
              platform
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 space-y-1.5 px-4 py-6">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-sm font-medium transition-all duration-150 outline-none",
                  active
                    ? "bg-neutral-800 text-neutral-50 border-l-2 border-brand-500 rounded-l-none pl-2.5"
                    : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-850",
                )}
              >
                <Icon
                  className={cn("h-4.5 w-4.5", active ? "text-brand-500" : "text-neutral-400")}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="border-t border-neutral-800 p-4 bg-neutral-950/40">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/20 text-brand-400 text-caption font-bold">
              OP
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-caption font-semibold truncate text-neutral-100 leading-tight">
                Staff Operations
              </p>
              <p className="text-caption text-neutral-400 truncate leading-normal">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer (backdrop + nav) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-neutral-950/50 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          ></div>
          {/* Drawer content */}
          <aside className="relative flex w-64 max-w-xs flex-col bg-neutral-900 border-r border-neutral-800 p-6 shadow-xl text-neutral-100 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Compass className="h-6 w-6 text-brand-500" />
                <span className="font-bold text-body-lg text-neutral-100">Estatify Platform</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-850 hover:text-neutral-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-2">
              {SIDEBAR_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-sm font-medium transition-colors",
                      active
                        ? "bg-neutral-800 text-neutral-50"
                        : "text-neutral-400 hover:bg-neutral-850 hover:text-neutral-100",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-neutral-850 pt-4 mt-auto">
              <p className="text-caption text-neutral-400">Authenticated Staff</p>
              <p className="text-body-sm font-bold truncate text-neutral-100">{user?.email}</p>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Top Header navbar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="hidden md:block text-body-lg font-semibold text-foreground flex items-center gap-1.5">
              <Shield className="h-4.5 w-4.5 text-brand-500" />
              Operations Center
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
                    <p className="text-body-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Shield className="h-3 w-3 text-brand-500" /> Authorized Staff
                    </p>
                    <p className="text-body-sm font-semibold truncate text-foreground">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      void signOut();
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

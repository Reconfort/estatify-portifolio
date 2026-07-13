"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@estatify/auth";
import { cn } from "@estatify/utils";
import {
  Activity,
  Bell,
  Database,
  LayoutDashboard,
  Layers,
  LogOut,
  Logs,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  User,
  X,
} from "lucide-react";

/**
 * Platform shell — the Workspace shell's sibling.
 * Identical structure, tokens and interactions; platform modules only.
 */

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Customers",
    items: [{ label: "Tenants", href: "/tenants", icon: Layers }],
  },
  {
    label: "Infrastructure",
    items: [
      { label: "Database Pools", href: "/db", icon: Database },
      { label: "System Health", href: "/health", icon: Activity },
    ],
  },
  {
    label: "Governance",
    items: [
      { label: "Audit Logs", href: "/logs", icon: Logs },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
] as const;

function NavLink({
  item,
  active,
  onClick,
}: {
  item: { label: string; href: string; icon: React.ComponentType<{ className?: string }> };
  active: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      {...(onClick ? { onClick } : {})}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-body-sm font-medium outline-none",
        "transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-accent transition-opacity",
          active ? "opacity-100" : "opacity-0",
        )}
      />
      <Icon
        className={cn(
          "size-4 shrink-0 transition-colors",
          active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
        )}
      />
      {item.label}
    </Link>
  );
}

function SidebarContent({ email, onNavigate }: { email?: string; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center gap-2.5 px-5">
        <Image
          src="/assets/logo-gp.svg"
          alt=""
          width={22}
          height={26}
          className="h-6.5 w-auto shrink-0"
          aria-hidden
        />
        <div className="leading-tight">
          <span className="block text-body-md font-semibold tracking-tight text-foreground">
            Estatify
          </span>
          <span className="-mt-0.5 block text-[0.65rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Platform
          </span>
        </div>
      </div>

      {/* Operator badge */}
      <div className="px-3 pb-2">
        <div className="flex w-full items-center gap-2.5 rounded-lg border border-sidebar-border bg-card px-3 py-2.5 shadow-2xs">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-700 text-neutral-50">
            <ShieldCheck className="size-4" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-body-sm font-semibold text-foreground">
              Staff Operations
            </span>
            <span className="block truncate text-caption text-muted-foreground">
              {email ?? "Internal console"}
            </span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4" aria-label="Platform">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-3 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground/80">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                  {...(onNavigate ? { onClick: onNavigate } : {})}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-sidebar-border px-5 py-4">
        <p className="text-caption text-muted-foreground">
          Production · <span className="font-medium text-foreground">eu-west-1</span>
        </p>
      </div>
    </>
  );
}

export default function PlatformDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useSession();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      {/* Desktop sidebar — fixed column; page scroll lives in main */}
      <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <SidebarContent {...(user?.email ? { email: user.email } : {})} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="relative flex w-72 max-w-[85vw] flex-col border-r border-sidebar-border bg-sidebar shadow-xl animate-in slide-in-from-left duration-200">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-4 z-10 rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
            >
              <X className="size-5" aria-hidden />
            </button>
            <SidebarContent
              {...(user?.email ? { email: user.email } : {})}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="z-40 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border/60 bg-background/85 px-4 backdrop-blur-md sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground md:hidden"
            >
              <Menu className="size-5" aria-hidden />
            </button>

            {/* Search */}
            <label className="relative hidden items-center sm:flex">
              <Search
                className="pointer-events-none absolute left-3 size-4 text-muted-foreground"
                aria-hidden
              />
              <input
                type="search"
                placeholder="Search tenants, domains…"
                aria-label="Search"
                className="h-9 w-64 rounded-lg border border-border/70 bg-muted/40 pl-9 pr-12 text-body-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-input focus:bg-background focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring lg:w-80"
              />
              <kbd
                aria-hidden
                className="pointer-events-none absolute right-2.5 rounded border border-border bg-background px-1.5 py-0.5 text-[0.65rem] font-medium text-muted-foreground"
              >
                ⌘K
              </kbd>
            </label>
          </div>

          <div className="relative flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Notifications"
              className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Bell className="size-4.5" aria-hidden />
              <span
                className="absolute right-1.5 top-1.5 size-2 rounded-full border-2 border-background bg-accent"
                aria-hidden
              />
            </button>

            <span className="mx-1 hidden h-5 w-px bg-border sm:block" aria-hidden />

            {/* Profile */}
            <button
              type="button"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              aria-haspopup="menu"
              aria-expanded={profileDropdownOpen}
              className="flex items-center gap-2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span className="flex size-8 items-center justify-center rounded-full border border-border bg-secondary">
                <User className="size-4" aria-hidden />
              </span>
              <span className="hidden max-w-40 truncate pr-1 text-body-sm font-medium text-foreground lg:inline">
                {user?.email}
              </span>
            </button>

            {profileDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setProfileDropdownOpen(false)}
                  aria-hidden
                />
                <div
                  role="menu"
                  className="absolute right-0 top-11 z-20 w-60 rounded-lg border border-border bg-popover p-1.5 shadow-lg animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  <div className="mb-1 border-b border-border/60 px-3 py-2.5">
                    <p className="text-caption font-medium text-muted-foreground">Signed in as</p>
                    <p className="truncate text-body-sm font-semibold text-foreground">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    role="menuitem"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      void (async () => {
                        await signOut();
                        window.location.assign("/login");
                      })();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-body-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="size-4" aria-hidden />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page container */}
        <main className="flex-1 overflow-y-auto bg-muted/30 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto w-full max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}

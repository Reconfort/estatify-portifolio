"use client";

import * as React from "react";
import Link from "next/link";
import type { AuthUser } from "@estatify/types";
import { cn } from "@estatify/utils";
import { Building2, CheckCircle2, ChevronRight, Mail, Shield, User } from "lucide-react";

function ProfileSection({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("overflow-hidden rounded-xl border border-border bg-card", className)}>
      <header className="flex items-start justify-between gap-4 border-b border-border/60 px-5 py-4">
        <div className="min-w-0">
          <h2 className="text-h5 font-semibold tracking-tight text-foreground">{title}</h2>
          {description ? (
            <p className="mt-1 text-body-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60">
        <Icon className="size-4 text-muted-foreground" aria-hidden />
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-caption font-medium text-muted-foreground">{label}</p>
        <div className="mt-0.5 text-body-sm text-foreground">{value}</div>
      </div>
    </div>
  );
}

function roleLabel(role: string | undefined): string {
  if (!role) return "Member";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function ProfileDetails({ user }: { user: AuthUser | null }) {
  const activeTenant = user?.activeTenant;
  const memberships = user?.memberships ?? [];
  const agencyName = activeTenant?.agencyName ?? activeTenant?.slug ?? "—";
  const role = roleLabel(activeTenant?.role);

  return (
    <div className="flex flex-col gap-4">
      <ProfileSection title="Account" description="Your sign-in details for this workspace.">
        <div className="divide-y divide-border/60">
          <DetailRow
            icon={Mail}
            label="Email"
            value={<span className="break-all">{user?.email ?? "—"}</span>}
          />
          <DetailRow
            icon={Shield}
            label="Email verification"
            value={
              user?.emailVerified ? (
                <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                  <CheckCircle2 className="size-4 text-accent" aria-hidden />
                  Verified
                </span>
              ) : (
                <span className="text-muted-foreground">Not verified</span>
              )
            }
          />
          <DetailRow icon={User} label="Display name" value={user?.email?.split("@")[0] ?? "—"} />
        </div>
      </ProfileSection>

      <ProfileSection
        title="Workspace"
        description="Your role and agency in the active workspace."
        action={
          <Link
            href="/website"
            className="inline-flex items-center gap-0.5 text-body-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            Website
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        }
      >
        <div className="divide-y divide-border/60">
          <DetailRow icon={Building2} label="Agency" value={agencyName} />
          <DetailRow icon={User} label="Role" value={role} />
          <DetailRow
            icon={Building2}
            label="Workspace slug"
            value={
              activeTenant?.slug ? (
                <code className="rounded-md border border-border bg-muted/40 px-2 py-0.5 font-mono text-caption">
                  {activeTenant.slug}
                </code>
              ) : (
                "—"
              )
            }
          />
        </div>
      </ProfileSection>

      {memberships.length > 1 ? (
        <ProfileSection
          title="Memberships"
          description="Workspaces you belong to. Tenant switching arrives in a later release."
        >
          <ul className="divide-y divide-border/60">
            {memberships.map((membership) => {
              const isActive = membership.tenantId === activeTenant?.tenantId;
              const label = membership.agencyName ?? membership.slug;
              return (
                <li
                  key={membership.tenantId}
                  className="flex flex-wrap items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="text-body-sm font-medium text-foreground">{label}</p>
                    <p className="mt-0.5 text-caption text-muted-foreground">
                      {roleLabel(membership.role)}
                    </p>
                  </div>
                  {isActive ? (
                    <span className="rounded-md border border-border bg-muted/40 px-2.5 py-0.5 text-caption font-medium text-foreground">
                      Active
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </ProfileSection>
      ) : null}
    </div>
  );
}

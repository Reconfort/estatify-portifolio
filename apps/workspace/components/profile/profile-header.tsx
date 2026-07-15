"use client";

import Link from "next/link";

export function ProfileHeader({
  displayName,
  role,
  agencyName,
  avatarInitials,
}: {
  displayName: string;
  role: string;
  agencyName: string;
  avatarInitials: string;
}) {
  return (
    <header className="space-y-6">
      <div>
        <h1 className="text-h2 font-semibold tracking-tight text-foreground">Profile</h1>
        <nav className="mt-1.5 text-body-sm text-muted-foreground" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/dashboard" className="transition-colors hover:text-foreground">
                Dashboard
              </Link>
            </li>
            <li aria-hidden>·</li>
            <li>Account</li>
            <li aria-hidden>·</li>
            <li className="font-medium text-foreground">{displayName}</li>
          </ol>
        </nav>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="relative h-32 sm:h-36">
          <div
            className="absolute inset-0 bg-linear-to-r from-teal-600/90 via-cyan-700/90 to-slate-800"
            aria-hidden
          />

          <div className="absolute inset-x-0 bottom-0 flex items-end gap-4 px-5 pb-5">
            <span className="flex size-[4.5rem] shrink-0 items-center justify-center rounded-full border-[3px] border-card bg-linear-to-br from-primary to-teal-700 text-lg font-semibold text-white sm:size-20 sm:text-xl">
              {avatarInitials}
            </span>
            <div className="min-w-0 pb-0.5">
              <p className="truncate text-h4 font-semibold text-white">{displayName}</p>
              <p className="text-body-sm text-white/80">{role}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-3.5">
          <p className="text-body-sm text-muted-foreground">
            Workspace · <span className="font-medium text-foreground">{agencyName}</span>
          </p>
        </div>
      </div>
    </header>
  );
}

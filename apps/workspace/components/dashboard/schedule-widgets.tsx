"use client";

import Link from "next/link";
import { ArrowRight, CalendarClock, FileSignature, Phone } from "lucide-react";
import { cn } from "@estatify/utils";
import { DashboardCard } from "@estatify/ui";
import { appointments, recentMessages } from "./dashboard-data";

const appointmentIcon = {
  viewing: CalendarClock,
  call: Phone,
  signing: FileSignature,
} as const;

/** Upcoming Appointments — compact timeline. */
export function UpcomingAppointments({ className }: { className?: string }) {
  return (
    <DashboardCard
      title="Upcoming appointments"
      description="Next viewings, calls and signings"
      className={className}
    >
      <ol className="relative space-y-5 before:absolute before:inset-y-1 before:left-[1.06rem] before:w-px before:bg-border/70">
        {appointments.map((a, i) => {
          const Icon = appointmentIcon[a.type];
          return (
            <li key={i} className="relative flex gap-3.5">
              <span
                className={cn(
                  "relative z-10 flex size-8.5 shrink-0 items-center justify-center rounded-full border border-border/70 bg-card",
                  i === 0 && "border-accent bg-accent/15",
                )}
              >
                <Icon
                  className={cn(
                    "size-3.5",
                    i === 0 ? "text-lime-700 dark:text-lime-400" : "text-muted-foreground",
                  )}
                  aria-hidden
                />
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="text-caption font-semibold tracking-wide text-muted-foreground">
                  {a.day} · {a.time}
                </p>
                <p className="mt-0.5 truncate text-body-sm font-medium text-foreground">
                  {a.title}
                </p>
                <p className="mt-0.5 truncate text-caption text-muted-foreground">{a.with}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </DashboardCard>
  );
}

/** Recent Messages — compact communication widget. */
export function RecentMessages({ className }: { className?: string }) {
  return (
    <DashboardCard
      title="Recent messages"
      description="Latest client conversations"
      action={
        <Link
          href="/leads"
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-body-sm font-medium text-primary transition-colors hover:bg-secondary"
        >
          Inbox
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      }
      flush
      className={className}
      contentClassName="pb-2"
    >
      <ul>
        {recentMessages.map((m, i) => (
          <li key={i}>
            <button
              type="button"
              className="flex w-full items-start gap-3 px-5 py-3 text-left transition-colors hover:bg-muted/40 sm:px-6"
            >
              <span className="relative mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-caption font-bold text-brand-800 dark:bg-brand-900 dark:text-brand-200">
                {m.initials}
                {m.unread ? (
                  <span
                    className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-card bg-accent"
                    aria-label="Unread"
                  />
                ) : null}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span
                    className={cn(
                      "truncate text-body-sm text-foreground",
                      m.unread ? "font-semibold" : "font-medium",
                    )}
                  >
                    {m.from}
                  </span>
                  <span className="shrink-0 text-caption text-muted-foreground">{m.time}</span>
                </span>
                <span className="mt-0.5 block truncate text-body-sm text-muted-foreground">
                  {m.preview}
                </span>
                <span className="mt-1 inline-flex rounded-full bg-muted px-2 py-0.5 text-[0.65rem] font-medium text-muted-foreground">
                  {m.channel}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}

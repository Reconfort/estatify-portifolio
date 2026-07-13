"use client";

import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import { cn } from "@estatify/utils";
import { DashboardCard, RowActionsMenu, StatusBadge } from "@estatify/ui";
import { propertyStatusMeta, recentProperties } from "./dashboard-data";

/** Recent Properties — modern flush table inside a DashboardCard. */
export function PropertiesTable({ className }: { className?: string }) {
  return (
    <DashboardCard
      title="Recent properties"
      description="Latest listings across your portfolio"
      action={
        <Link
          href="/properties"
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-body-sm font-medium text-primary transition-colors hover:bg-secondary"
        >
          View all
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      }
      flush
      className={className}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-left">
          <thead>
            <tr className="border-y border-border/60 bg-muted/40">
              {["Property", "Status", "Price", "Agent", "Views", "Updated", ""].map((h, i) => (
                <th
                  key={i}
                  scope="col"
                  className={cn(
                    "px-4 py-2.5 text-caption font-semibold tracking-wide text-muted-foreground first:pl-5 last:pr-5 sm:first:pl-6 sm:last:pr-6",
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentProperties.map((p) => {
              const meta = propertyStatusMeta[p.status];
              return (
                <tr
                  key={p.id}
                  className="group border-b border-border/50 transition-colors last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3.5 first:pl-5 sm:first:pl-6">
                    <p className="text-body-sm font-medium text-foreground">{p.name}</p>
                    <p className="mt-0.5 text-caption text-muted-foreground">{p.location}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                  </td>
                  <td className="px-4 py-3.5 text-body-sm font-semibold text-foreground">
                    {p.price}
                  </td>
                  <td className="px-4 py-3.5 text-body-sm text-muted-foreground">{p.agent}</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 text-body-sm text-muted-foreground">
                      <Eye className="size-3.5" aria-hidden />
                      {p.views.toLocaleString("en-US")}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-body-sm text-muted-foreground">{p.updated}</td>
                  <td className="px-4 py-3.5 pr-5 text-right sm:pr-6">
                    <RowActionsMenu ariaLabel={`Actions for ${p.name}`} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}

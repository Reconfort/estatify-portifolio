"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal, Pencil, Plus, Search } from "lucide-react";
import { Button, Input } from "@estatify/ui";
import { cn } from "@estatify/utils";
import {
  getApiErrorMessage,
  useActivateTenant,
  useDeleteTenant,
  useSuspendTenant,
  useTenants,
} from "@estatify/api-client";
import {
  tenantPlanSchema,
  type TenantListItem,
  type TenantListQuery,
  type TenantStatusValue,
} from "@estatify/types";
import { PlanBadge, StatusBadge } from "./status-badges";
import { ConfirmDialog, CreateTenantDialog, EditTenantDialog } from "./tenant-dialogs";

const PAGE_SIZE = 10;
const TABS: Array<{ key: "all" | TenantStatusValue; label: string }> = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "suspended", label: "Suspended" },
  { key: "pending", label: "Pending" },
];

function useDebounced<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

type ConfirmState = { kind: "suspend" | "activate" | "delete"; tenant: TenantListItem } | null;

/** Per-row action menu. */
function RowActions({
  tenant,
  onEdit,
  onSuspend,
  onActivate,
  onDelete,
}: {
  tenant: TenantListItem;
  onEdit: () => void;
  onSuspend: () => void;
  onActivate: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const item =
    "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-body-sm hover:bg-secondary";

  return (
    <div className="relative flex justify-end">
      <button
        type="button"
        aria-label="Row actions"
        onClick={() => setOpen((v) => !v)}
        className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
      >
        <MoreHorizontal className="size-4" aria-hidden />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden />
          <div
            role="menu"
            className="absolute right-0 top-9 z-20 w-52 rounded-lg border border-border bg-popover p-1 "
          >
            {tenant.website ? (
              <a
                role="menuitem"
                href={`https://${tenant.website}`}
                target="_blank"
                rel="noreferrer"
                className={item}
                onClick={() => setOpen(false)}
              >
                View website
              </a>
            ) : null}
            <button
              role="menuitem"
              className={item}
              onClick={() => {
                setOpen(false);
                onEdit();
              }}
            >
              <Pencil className="size-3.5" aria-hidden /> Edit
            </button>
            {tenant.status === "active" ? (
              <button
                role="menuitem"
                className={item}
                onClick={() => {
                  setOpen(false);
                  onSuspend();
                }}
              >
                Suspend
              </button>
            ) : (
              <button
                role="menuitem"
                className={item}
                onClick={() => {
                  setOpen(false);
                  onActivate();
                }}
              >
                Activate
              </button>
            )}
            <button
              role="menuitem"
              className={cn(item, "text-destructive hover:bg-destructive/10")}
              onClick={() => {
                setOpen(false);
                onDelete();
              }}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function TenantsPage() {
  const [tab, setTab] = React.useState<"all" | TenantStatusValue>("all");
  const [plan, setPlan] = React.useState<string>("");
  const [searchInput, setSearchInput] = React.useState("");
  const [page, setPage] = React.useState(1);
  const search = useDebounced(searchInput);

  const filterKey = `${tab}\0${plan}\0${search}`;
  const [appliedFilter, setAppliedFilter] = React.useState(filterKey);
  if (appliedFilter !== filterKey) {
    setAppliedFilter(filterKey);
    setPage(1);
  }

  const query: TenantListQuery = {
    page,
    pageSize: PAGE_SIZE,
    order: "desc",
    ...(search ? { search } : {}),
    ...(tab !== "all" ? { status: tab } : {}),
    ...(plan ? { plan: plan as TenantListQuery["plan"] } : {}),
  };

  const { data, isLoading, isError, error } = useTenants(query);
  const suspend = useSuspendTenant();
  const activate = useActivateTenant();
  const remove = useDeleteTenant();

  const [createOpen, setCreateOpen] = React.useState(false);
  const [editTenant, setEditTenant] = React.useState<TenantListItem | null>(null);
  const [confirm, setConfirm] = React.useState<ConfirmState>(null);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-h2 font-semibold text-foreground">Tenants</h1>
          <p className="mt-1 text-body-sm text-muted-foreground">
            Manage customer agencies — their plan, status, and workspace.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" aria-hidden /> Add tenant
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        {/* Tabs */}
        <div className="flex gap-1 border-b border-border px-3 pt-3">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "rounded-t-md px-3 py-2 text-body-sm font-medium",
                tab === t.key
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 p-4">
          <label className="relative flex min-w-56 flex-1 items-center">
            <Search
              className="pointer-events-none absolute left-3 size-4 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search agency, subdomain, owner…"
              className="pl-9"
              aria-label="Search tenants"
            />
          </label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            aria-label="Filter by plan"
            className="h-10 rounded-lg border border-input bg-background px-3 text-body-sm text-foreground"
          >
            <option value="">All plans</option>
            {tenantPlanSchema.options.map((p) => (
              <option key={p} value={p} className="capitalize">
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-body-sm">
            <thead>
              <tr className="border-y border-border bg-muted/40 text-left text-caption uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-semibold">Agency</th>
                <th className="px-4 py-3 font-semibold">Owner</th>
                <th className="px-4 py-3 font-semibold">Plan</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Properties</th>
                <th className="px-4 py-3 font-semibold">Agents</th>
                <th className="px-4 py-3 font-semibold">Website</th>
                <th className="px-4 py-3 font-semibold">Last active</th>
                <th className="px-4 py-3 font-semibold">Created</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td colSpan={10} className="px-4 py-4">
                      <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-body-sm text-destructive">
                    {getApiErrorMessage(error, "Could not load tenants.")}
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-16 text-center">
                    <p className="text-body-md font-medium text-foreground">No tenants found</p>
                    <p className="mt-1 text-body-sm text-muted-foreground">
                      {search || plan || tab !== "all"
                        ? "Try adjusting your search or filters."
                        : "Create your first tenant to get started."}
                    </p>
                  </td>
                </tr>
              ) : (
                items.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{t.agencyName}</div>
                      <div className="text-caption text-muted-foreground">{t.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{t.ownerEmail ?? "—"}</td>
                    <td className="px-4 py-3">
                      <PlanBadge plan={t.plan} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-4 py-3 tabular-nums text-foreground">{t.propertiesCount}</td>
                    <td className="px-4 py-3 tabular-nums text-foreground">{t.agentsCount}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {t.website ? (
                        <a
                          href={`https://${t.website}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline"
                        >
                          {t.website}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{fmtDate(t.lastActiveAt)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{fmtDate(t.createdAt)}</td>
                    <td className="px-4 py-3">
                      <RowActions
                        tenant={t}
                        onEdit={() => setEditTenant(t)}
                        onSuspend={() => setConfirm({ kind: "suspend", tenant: t })}
                        onActivate={() => setConfirm({ kind: "activate", tenant: t })}
                        onDelete={() => setConfirm({ kind: "delete", tenant: t })}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
          <p className="text-caption text-muted-foreground">
            {rangeStart}–{rangeEnd} of {total}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="size-4" aria-hidden />
            </Button>
            <span className="px-2 text-caption text-muted-foreground">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="size-4" aria-hidden />
            </Button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {createOpen && <CreateTenantDialog onClose={() => setCreateOpen(false)} />}
      {editTenant && <EditTenantDialog tenant={editTenant} onClose={() => setEditTenant(null)} />}
      {confirm?.kind === "suspend" && (
        <ConfirmDialog
          title="Suspend tenant"
          description={`Suspend ${confirm.tenant.agencyName}? Their workspace will be inaccessible until reactivated.`}
          confirmLabel="Suspend"
          destructive
          onConfirm={() => suspend.mutateAsync(confirm.tenant.id).then(() => undefined)}
          onClose={() => setConfirm(null)}
        />
      )}
      {confirm?.kind === "activate" && (
        <ConfirmDialog
          title="Activate tenant"
          description={`Reactivate ${confirm.tenant.agencyName}?`}
          confirmLabel="Activate"
          onConfirm={() => activate.mutateAsync(confirm.tenant.id).then(() => undefined)}
          onClose={() => setConfirm(null)}
        />
      )}
      {confirm?.kind === "delete" && (
        <ConfirmDialog
          title="Delete tenant"
          description={`Delete ${confirm.tenant.agencyName}? This soft-deletes the tenant and suspends access. This can be restored by an engineer.`}
          confirmLabel="Delete"
          destructive
          onConfirm={() => remove.mutateAsync(confirm.tenant.id).then(() => undefined)}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
} from "lucide-react";
import { Button, Input } from "@estatify/ui";
import { cn } from "@estatify/utils";
import {
  getApiErrorMessage,
  useDeleteStaff,
  useDisableStaff,
  useEnableStaff,
  useStaff,
} from "@estatify/api-client";
import {
  staffDepartmentSchema,
  type StaffListItem,
  type StaffListQuery,
  type StaffStatus,
} from "@estatify/types";
import { ConfirmDialog } from "../tenants/tenant-dialogs";
import { CreateStaffDialog, EditStaffDialog } from "./staff-dialogs";

const PAGE_SIZE = 10;
const TABS: Array<{ key: "all" | StaffStatus; label: string }> = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "disabled", label: "Disabled" },
  { key: "invited", label: "Invited" },
];

const STATUS_STYLES: Record<StaffStatus, string> = {
  active: "bg-success/12 text-success",
  disabled: "bg-destructive/12 text-destructive",
  invited: "bg-warning/15 text-warning-foreground",
};

function prettyDept(d: string): string {
  return d.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
function useDebounced<T>(value: T, delay = 350): T {
  const [d, setD] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setD(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return d;
}

type ConfirmState = { kind: "disable" | "enable" | "delete"; staff: StaffListItem } | null;

function RowActions({
  staff,
  onEdit,
  onDisable,
  onEnable,
  onDelete,
}: {
  staff: StaffListItem;
  onEdit: () => void;
  onDisable: () => void;
  onEnable: () => void;
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
            className="absolute right-0 top-9 z-20 w-48 rounded-lg border border-border bg-popover p-1 "
          >
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
            {staff.status === "active" ? (
              <button
                role="menuitem"
                className={item}
                onClick={() => {
                  setOpen(false);
                  onDisable();
                }}
              >
                Disable
              </button>
            ) : (
              <button
                role="menuitem"
                className={item}
                onClick={() => {
                  setOpen(false);
                  onEnable();
                }}
              >
                Enable
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

export function StaffPage() {
  const [tab, setTab] = React.useState<"all" | StaffStatus>("all");
  const [dept, setDept] = React.useState("");
  const [searchInput, setSearchInput] = React.useState("");
  const [page, setPage] = React.useState(1);
  const search = useDebounced(searchInput);

  const filterKey = `${tab}\0${dept}\0${search}`;
  const [appliedFilter, setAppliedFilter] = React.useState(filterKey);
  if (appliedFilter !== filterKey) {
    setAppliedFilter(filterKey);
    setPage(1);
  }

  const query: StaffListQuery = {
    page,
    pageSize: PAGE_SIZE,
    order: "desc",
    ...(search ? { search } : {}),
    ...(tab !== "all" ? { status: tab } : {}),
    ...(dept ? { department: dept as StaffListQuery["department"] } : {}),
  };

  const { data, isLoading, isError, error } = useStaff(query);
  const disable = useDisableStaff();
  const enable = useEnableStaff();
  const remove = useDeleteStaff();

  const [createOpen, setCreateOpen] = React.useState(false);
  const [editStaff, setEditStaff] = React.useState<StaffListItem | null>(null);
  const [confirm, setConfirm] = React.useState<ConfirmState>(null);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-h2 font-semibold text-foreground">Platform Staff</h1>
          <p className="mt-1 text-body-sm text-muted-foreground">
            Manage Estatify employees and their access.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" aria-hidden /> Add staff
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
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

        <div className="flex flex-wrap items-center gap-3 p-4">
          <label className="relative flex min-w-56 flex-1 items-center">
            <Search
              className="pointer-events-none absolute left-3 size-4 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search name or email…"
              className="pl-9"
              aria-label="Search staff"
            />
          </label>
          <select
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            aria-label="Filter by department"
            className="h-10 rounded-lg border border-input bg-background px-3 text-body-sm text-foreground"
          >
            <option value="">All departments</option>
            {staffDepartmentSchema.options.map((d) => (
              <option key={d} value={d}>
                {prettyDept(d)}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-body-sm">
            <thead>
              <tr className="border-y border-border bg-muted/40 text-left text-caption uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Department</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">2FA</th>
                <th className="px-4 py-3 font-semibold">Last login</th>
                <th className="px-4 py-3 font-semibold">Created</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td colSpan={9} className="px-4 py-4">
                      <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-body-sm text-destructive">
                    {getApiErrorMessage(error, "Could not load staff.")}
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center">
                    <p className="text-body-md font-medium text-foreground">No staff found</p>
                    <p className="mt-1 text-body-sm text-muted-foreground">
                      {search || dept || tab !== "all"
                        ? "Try adjusting your search or filters."
                        : "Add your first staff member."}
                    </p>
                  </td>
                </tr>
              ) : (
                items.map((s) => (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-caption font-semibold text-foreground">
                          {initials(s.fullName)}
                        </span>
                        <span className="font-medium text-foreground">{s.fullName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{s.email}</td>
                    <td className="px-4 py-3 text-foreground">{prettyDept(s.department)}</td>
                    <td className="px-4 py-3 text-foreground">{s.roleName ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-md px-2 py-0.5 text-caption font-semibold capitalize",
                          STATUS_STYLES[s.status],
                        )}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {s.twoFactorEnabled ? (
                        <span className="inline-flex items-center gap-1 text-caption font-medium text-success">
                          <Check className="size-3.5" aria-hidden /> On
                        </span>
                      ) : (
                        <span className="text-caption text-muted-foreground">Off</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{fmtDate(s.lastLoginAt)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{fmtDate(s.createdAt)}</td>
                    <td className="px-4 py-3">
                      <RowActions
                        staff={s}
                        onEdit={() => setEditStaff(s)}
                        onDisable={() => setConfirm({ kind: "disable", staff: s })}
                        onEnable={() => setConfirm({ kind: "enable", staff: s })}
                        onDelete={() => setConfirm({ kind: "delete", staff: s })}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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

      {createOpen && <CreateStaffDialog onClose={() => setCreateOpen(false)} />}
      {editStaff && <EditStaffDialog staff={editStaff} onClose={() => setEditStaff(null)} />}
      {confirm?.kind === "disable" && (
        <ConfirmDialog
          title="Disable staff"
          description={`Disable ${confirm.staff.fullName}? They will lose access until re-enabled.`}
          confirmLabel="Disable"
          destructive
          onConfirm={() => disable.mutateAsync(confirm.staff.id).then(() => undefined)}
          onClose={() => setConfirm(null)}
        />
      )}
      {confirm?.kind === "enable" && (
        <ConfirmDialog
          title="Enable staff"
          description={`Re-enable ${confirm.staff.fullName}?`}
          confirmLabel="Enable"
          onConfirm={() => enable.mutateAsync(confirm.staff.id).then(() => undefined)}
          onClose={() => setConfirm(null)}
        />
      )}
      {confirm?.kind === "delete" && (
        <ConfirmDialog
          title="Delete staff"
          description={`Delete ${confirm.staff.fullName}? This soft-deletes the account.`}
          confirmLabel="Delete"
          destructive
          onConfirm={() => remove.mutateAsync(confirm.staff.id).then(() => undefined)}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

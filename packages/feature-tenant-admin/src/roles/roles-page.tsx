"use client";

import * as React from "react";
import { Lock, MoreHorizontal, Pencil, Plus, Search } from "lucide-react";
import { Button, Input } from "@estatify/ui";
import { cn } from "@estatify/utils";
import { getApiErrorMessage, useDeleteRole, useRoles } from "@estatify/api-client";
import type { RoleListItem } from "@estatify/types";
import { ConfirmDialog } from "../tenants/tenant-dialogs";
import { RoleBuilderDialog } from "./role-builder-dialog";

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function RowActions({
  role,
  onEdit,
  onDelete,
}: {
  role: RoleListItem;
  onEdit: () => void;
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
            className="absolute right-0 top-9 z-20 w-44 rounded-lg border border-border bg-popover p-1 shadow-lg"
          >
            <button
              role="menuitem"
              className={item}
              onClick={() => {
                setOpen(false);
                onEdit();
              }}
            >
              <Pencil className="size-3.5" aria-hidden /> {role.isSystem ? "View" : "Edit"}
            </button>
            {!role.isSystem && (
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
            )}
          </div>
        </>
      )}
    </div>
  );
}

export function RolesPage() {
  const { data, isLoading, isError, error } = useRoles();
  const remove = useDeleteRole();
  const [search, setSearch] = React.useState("");
  const [builder, setBuilder] = React.useState<{ open: boolean; roleId: string | null }>({
    open: false,
    roleId: null,
  });
  const [confirm, setConfirm] = React.useState<RoleListItem | null>(null);

  const roles = data ?? [];
  const filtered = search
    ? roles.filter(
        (r) =>
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.description.toLowerCase().includes(search.toLowerCase()),
      )
    : roles;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-h2 font-semibold text-foreground">Roles</h1>
          <p className="mt-1 text-body-sm text-muted-foreground">
            Bundle permissions into roles and assign them to staff.
          </p>
        </div>
        <Button onClick={() => setBuilder({ open: true, roleId: null })}>
          <Plus className="size-4" aria-hidden /> New role
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="p-4">
          <label className="relative flex max-w-sm items-center">
            <Search
              className="pointer-events-none absolute left-3 size-4 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search roles…"
              className="pl-9"
              aria-label="Search roles"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-body-sm">
            <thead>
              <tr className="border-y border-border bg-muted/40 text-left text-caption uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Description</th>
                <th className="px-4 py-3 font-semibold">Members</th>
                <th className="px-4 py-3 font-semibold">Permissions</th>
                <th className="px-4 py-3 font-semibold">Created</th>
                <th className="px-4 py-3 font-semibold">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td colSpan={7} className="px-4 py-4">
                      <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-body-sm text-destructive">
                    {getApiErrorMessage(error, "Could not load roles.")}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <p className="text-body-md font-medium text-foreground">No roles found</p>
                    <p className="mt-1 text-body-sm text-muted-foreground">
                      {search ? "Try a different search." : "Create your first role."}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 font-medium text-foreground">
                        {r.name}
                        {r.isSystem && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-[0.65rem] font-medium text-muted-foreground">
                            <Lock className="size-3" aria-hidden /> System
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{r.description || "—"}</td>
                    <td className="px-4 py-3 tabular-nums text-foreground">{r.membersCount}</td>
                    <td className="px-4 py-3 tabular-nums text-foreground">{r.permissionsCount}</td>
                    <td className="px-4 py-3 text-muted-foreground">{fmtDate(r.createdAt)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{fmtDate(r.updatedAt)}</td>
                    <td className="px-4 py-3">
                      <RowActions
                        role={r}
                        onEdit={() => setBuilder({ open: true, roleId: r.id })}
                        onDelete={() => setConfirm(r)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {builder.open && (
        <RoleBuilderDialog
          roleId={builder.roleId}
          onClose={() => setBuilder({ open: false, roleId: null })}
        />
      )}
      {confirm && (
        <ConfirmDialog
          title="Delete role"
          description={`Delete the "${confirm.name}" role? This can't be done while staff are assigned to it.`}
          confirmLabel="Delete"
          destructive
          onConfirm={() => remove.mutateAsync(confirm.id).then(() => undefined)}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

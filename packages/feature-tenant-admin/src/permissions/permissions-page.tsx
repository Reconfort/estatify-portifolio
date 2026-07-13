"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button, Input } from "@estatify/ui";
import { getApiErrorMessage, usePermissionsList } from "@estatify/api-client";
import { PERMISSIONS_BY_MODULE, type PermissionListQuery } from "@estatify/types";

const PAGE_SIZE = 15;
const MODULES = Object.keys(PERMISSIONS_BY_MODULE);

function useDebounced<T>(value: T, delay = 350): T {
  const [d, setD] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setD(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return d;
}

/** Read-only. Permissions are code-defined and managed through Roles. */
export function PermissionsPage() {
  const [module, setModule] = React.useState("");
  const [searchInput, setSearchInput] = React.useState("");
  const [page, setPage] = React.useState(1);
  const search = useDebounced(searchInput);

  const filterKey = `${module}\0${search}`;
  const [appliedFilter, setAppliedFilter] = React.useState(filterKey);
  if (appliedFilter !== filterKey) {
    setAppliedFilter(filterKey);
    setPage(1);
  }

  const query: PermissionListQuery = {
    page,
    pageSize: PAGE_SIZE,
    order: "asc",
    ...(search ? { search } : {}),
    ...(module ? { module } : {}),
  };
  const { data, isLoading, isError, error } = usePermissionsList(query);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-h2 font-semibold text-foreground">Permissions</h1>
        <p className="mt-1 text-body-sm text-muted-foreground">
          Every capability in the platform. Permissions are managed through roles — assign them on
          the Roles page.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="flex flex-wrap items-center gap-3 p-4">
          <label className="relative flex min-w-56 flex-1 items-center">
            <Search
              className="pointer-events-none absolute left-3 size-4 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search permission or description…"
              className="pl-9"
              aria-label="Search permissions"
            />
          </label>
          <select
            value={module}
            onChange={(e) => setModule(e.target.value)}
            aria-label="Filter by module"
            className="h-10 rounded-lg border border-input bg-background px-3 text-body-sm text-foreground"
          >
            <option value="">All modules</option>
            {MODULES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-body-sm">
            <thead>
              <tr className="border-y border-border bg-muted/40 text-left text-caption uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-semibold">Permission</th>
                <th className="px-4 py-3 font-semibold">Module</th>
                <th className="px-4 py-3 font-semibold">Description</th>
                <th className="px-4 py-3 font-semibold">Assigned roles</th>
                <th className="px-4 py-3 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td colSpan={5} className="px-4 py-4">
                      <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-body-sm text-destructive">
                    {getApiErrorMessage(error, "Could not load permissions.")}
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center">
                    <p className="text-body-md font-medium text-foreground">No permissions found</p>
                    <p className="mt-1 text-body-sm text-muted-foreground">
                      Try a different search or module.
                    </p>
                  </td>
                </tr>
              ) : (
                items.map((p) => (
                  <tr
                    key={p.key}
                    className="border-b border-border last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <code className="rounded bg-secondary px-1.5 py-0.5 text-caption font-medium text-foreground">
                        {p.key}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-foreground">{p.module}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.description}</td>
                    <td className="px-4 py-3">
                      {p.assignedRoles.length === 0 ? (
                        <span className="text-caption text-muted-foreground">—</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {p.assignedRoles.map((r) => (
                            <span
                              key={r}
                              className="inline-flex items-center rounded-md border border-border bg-secondary px-1.5 py-0.5 text-[0.65rem] font-medium text-foreground"
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(p.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
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
    </div>
  );
}

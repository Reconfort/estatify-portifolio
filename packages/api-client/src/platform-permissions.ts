"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { Paginated, PermissionListItem, PermissionListQuery } from "@estatify/types";
import { apiFetch } from "./http";

function toQueryString(query: PermissionListQuery): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
  }
  return params.toString();
}

export const permissionsApi = {
  list: (query: PermissionListQuery) =>
    apiFetch<Paginated<PermissionListItem>>(`/platform/permissions?${toQueryString(query)}`),
};

export const permissionCatalogKeys = {
  list: (query: PermissionListQuery) => ["platform", "permissions", "list", query] as const,
};

export function usePermissionsList(query: PermissionListQuery) {
  return useQuery({
    queryKey: permissionCatalogKeys.list(query),
    queryFn: () => permissionsApi.list(query),
    placeholderData: keepPreviousData,
  });
}

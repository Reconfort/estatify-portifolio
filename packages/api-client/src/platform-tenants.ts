"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateTenantInput,
  Paginated,
  TenantListItem,
  TenantListQuery,
  UpdateTenantInput,
} from "@estatify/types";
import { apiFetch } from "./http";

function toQueryString(query: TenantListQuery): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
  }
  return params.toString();
}

export const tenantsApi = {
  list: (query: TenantListQuery) =>
    apiFetch<Paginated<TenantListItem>>(`/platform/tenants?${toQueryString(query)}`),
  get: (id: string) => apiFetch<TenantListItem>(`/platform/tenants/${id}`),
  create: (body: CreateTenantInput) =>
    apiFetch<TenantListItem>("/platform/tenants", { method: "POST", body }),
  update: (id: string, body: UpdateTenantInput) =>
    apiFetch<TenantListItem>(`/platform/tenants/${id}`, { method: "PATCH", body }),
  suspend: (id: string) =>
    apiFetch<TenantListItem>(`/platform/tenants/${id}/suspend`, { method: "POST" }),
  activate: (id: string) =>
    apiFetch<TenantListItem>(`/platform/tenants/${id}/activate`, { method: "POST" }),
  remove: (id: string) => apiFetch<void>(`/platform/tenants/${id}`, { method: "DELETE" }),
};

export const tenantKeys = {
  all: ["platform", "tenants"] as const,
  list: (query: TenantListQuery) => ["platform", "tenants", "list", query] as const,
};

export function useTenants(query: TenantListQuery) {
  return useQuery({
    queryKey: tenantKeys.list(query),
    queryFn: () => tenantsApi.list(query),
    placeholderData: keepPreviousData, // keep the table populated while paging/filtering
  });
}

function useInvalidateTenants() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: tenantKeys.all });
}

export function useCreateTenant() {
  const invalidate = useInvalidateTenants();
  return useMutation({ mutationFn: tenantsApi.create, onSuccess: invalidate });
}
export function useUpdateTenant() {
  const invalidate = useInvalidateTenants();
  return useMutation({
    mutationFn: (vars: { id: string; body: UpdateTenantInput }) =>
      tenantsApi.update(vars.id, vars.body),
    onSuccess: invalidate,
  });
}
export function useSuspendTenant() {
  const invalidate = useInvalidateTenants();
  return useMutation({ mutationFn: tenantsApi.suspend, onSuccess: invalidate });
}
export function useActivateTenant() {
  const invalidate = useInvalidateTenants();
  return useMutation({ mutationFn: tenantsApi.activate, onSuccess: invalidate });
}
export function useDeleteTenant() {
  const invalidate = useInvalidateTenants();
  return useMutation({ mutationFn: tenantsApi.remove, onSuccess: invalidate });
}

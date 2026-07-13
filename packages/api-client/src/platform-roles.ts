"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateRoleInput, RoleDetail, RoleListItem, UpdateRoleInput } from "@estatify/types";
import { apiFetch } from "./http";

export const rolesApi = {
  list: () => apiFetch<RoleListItem[]>("/platform/roles"),
  get: (id: string) => apiFetch<RoleDetail>(`/platform/roles/${id}`),
  create: (body: CreateRoleInput) =>
    apiFetch<RoleDetail>("/platform/roles", { method: "POST", body }),
  update: (id: string, body: UpdateRoleInput) =>
    apiFetch<RoleDetail>(`/platform/roles/${id}`, { method: "PATCH", body }),
  remove: (id: string) => apiFetch<void>(`/platform/roles/${id}`, { method: "DELETE" }),
};

export const roleKeys = {
  all: ["platform", "roles"] as const,
  detail: (id: string) => ["platform", "roles", "detail", id] as const,
};

export function useRoles() {
  return useQuery({ queryKey: roleKeys.all, queryFn: rolesApi.list });
}

export function useRole(id: string | null) {
  return useQuery({
    queryKey: roleKeys.detail(id ?? ""),
    queryFn: () => rolesApi.get(id as string),
    enabled: Boolean(id),
  });
}

function useInvalidateRoles() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: roleKeys.all });
}

export function useCreateRole() {
  const invalidate = useInvalidateRoles();
  return useMutation({ mutationFn: rolesApi.create, onSuccess: invalidate });
}
export function useUpdateRole() {
  const invalidate = useInvalidateRoles();
  return useMutation({
    mutationFn: (vars: { id: string; body: UpdateRoleInput }) =>
      rolesApi.update(vars.id, vars.body),
    onSuccess: invalidate,
  });
}
export function useDeleteRole() {
  const invalidate = useInvalidateRoles();
  return useMutation({ mutationFn: rolesApi.remove, onSuccess: invalidate });
}

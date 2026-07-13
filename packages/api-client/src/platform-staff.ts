"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateStaffInput,
  Paginated,
  StaffListItem,
  StaffListQuery,
  UpdateStaffInput,
} from "@estatify/types";
import { apiFetch } from "./http";

function toQueryString(query: StaffListQuery): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
  }
  return params.toString();
}

export const staffApi = {
  list: (query: StaffListQuery) =>
    apiFetch<Paginated<StaffListItem>>(`/platform/staff?${toQueryString(query)}`),
  create: (body: CreateStaffInput) =>
    apiFetch<StaffListItem>("/platform/staff", { method: "POST", body }),
  update: (id: string, body: UpdateStaffInput) =>
    apiFetch<StaffListItem>(`/platform/staff/${id}`, { method: "PATCH", body }),
  disable: (id: string) =>
    apiFetch<StaffListItem>(`/platform/staff/${id}/disable`, { method: "POST" }),
  enable: (id: string) =>
    apiFetch<StaffListItem>(`/platform/staff/${id}/enable`, { method: "POST" }),
  remove: (id: string) => apiFetch<void>(`/platform/staff/${id}`, { method: "DELETE" }),
};

export const staffKeys = {
  all: ["platform", "staff"] as const,
  list: (query: StaffListQuery) => ["platform", "staff", "list", query] as const,
};

export function useStaff(query: StaffListQuery) {
  return useQuery({
    queryKey: staffKeys.list(query),
    queryFn: () => staffApi.list(query),
    placeholderData: keepPreviousData,
  });
}

function useInvalidateStaff() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: staffKeys.all });
}

export function useCreateStaff() {
  const invalidate = useInvalidateStaff();
  return useMutation({ mutationFn: staffApi.create, onSuccess: invalidate });
}
export function useUpdateStaff() {
  const invalidate = useInvalidateStaff();
  return useMutation({
    mutationFn: (vars: { id: string; body: UpdateStaffInput }) =>
      staffApi.update(vars.id, vars.body),
    onSuccess: invalidate,
  });
}
export function useDisableStaff() {
  const invalidate = useInvalidateStaff();
  return useMutation({ mutationFn: staffApi.disable, onSuccess: invalidate });
}
export function useEnableStaff() {
  const invalidate = useInvalidateStaff();
  return useMutation({ mutationFn: staffApi.enable, onSuccess: invalidate });
}
export function useDeleteStaff() {
  const invalidate = useInvalidateStaff();
  return useMutation({ mutationFn: staffApi.remove, onSuccess: invalidate });
}

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  DraftConfiguration,
  PublishedConfiguration,
  UpdateAgencyProfileInput,
  UpdateBrandIdentityInput,
  UpdateSeoConfigurationInput,
  UpdateWebsiteSettingsInput,
} from "@estatify/types";
import { apiFetch } from "./http";

export const configurationApi = {
  getDraft: () => apiFetch<DraftConfiguration>("/workspace/configuration"),
  updateProfile: (body: UpdateAgencyProfileInput) =>
    apiFetch<DraftConfiguration>("/workspace/configuration/profile", { method: "PATCH", body }),
  updateBrand: (body: UpdateBrandIdentityInput) =>
    apiFetch<DraftConfiguration>("/workspace/configuration/brand", { method: "PATCH", body }),
  updateWebsite: (body: UpdateWebsiteSettingsInput) =>
    apiFetch<DraftConfiguration>("/workspace/configuration/website", { method: "PATCH", body }),
  updateSeo: (body: UpdateSeoConfigurationInput) =>
    apiFetch<DraftConfiguration>("/workspace/configuration/seo", { method: "PATCH", body }),
  publish: () =>
    apiFetch<DraftConfiguration>("/workspace/configuration/publish", { method: "POST" }),
  getPublishedByHost: (host: string) =>
    apiFetch<PublishedConfiguration>(`/public/configuration?host=${encodeURIComponent(host)}`, {
      auth: false,
    }),
};

export const configurationKeys = {
  all: ["workspace", "configuration"] as const,
  draft: () => ["workspace", "configuration", "draft"] as const,
  published: (host: string) => ["workspace", "configuration", "published", host] as const,
};

export function useDraftConfiguration(enabled = true) {
  return useQuery({
    queryKey: configurationKeys.draft(),
    queryFn: configurationApi.getDraft,
    enabled,
  });
}

function useInvalidateConfiguration() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: configurationKeys.all });
}

export function useUpdateAgencyProfile() {
  const invalidate = useInvalidateConfiguration();
  return useMutation({
    mutationFn: configurationApi.updateProfile,
    onSuccess: invalidate,
  });
}

export function useUpdateBrandIdentity() {
  const invalidate = useInvalidateConfiguration();
  return useMutation({
    mutationFn: configurationApi.updateBrand,
    onSuccess: invalidate,
  });
}

export function useUpdateWebsiteSettings() {
  const invalidate = useInvalidateConfiguration();
  return useMutation({
    mutationFn: configurationApi.updateWebsite,
    onSuccess: invalidate,
  });
}

export function useUpdateSeoConfiguration() {
  const invalidate = useInvalidateConfiguration();
  return useMutation({
    mutationFn: configurationApi.updateSeo,
    onSuccess: invalidate,
  });
}

export function usePublishConfiguration() {
  const invalidate = useInvalidateConfiguration();
  return useMutation({
    mutationFn: configurationApi.publish,
    onSuccess: invalidate,
  });
}

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SaveOnboardingPreferencesInput, TenantPreferences } from "@estatify/types";
import { apiFetch } from "./http";
import { authKeys } from "./hooks";

export const onboardingApi = {
  get: () => apiFetch<TenantPreferences>("/workspace/onboarding"),
  save: (body: SaveOnboardingPreferencesInput) =>
    apiFetch<TenantPreferences>("/workspace/onboarding", { method: "PUT", body }),
};

export const onboardingKeys = {
  all: ["workspace", "onboarding"] as const,
  preferences: () => ["workspace", "onboarding", "preferences"] as const,
};

export function useOnboardingPreferences(enabled = true) {
  return useQuery({
    queryKey: onboardingKeys.preferences(),
    queryFn: onboardingApi.get,
    enabled,
  });
}

export function useSaveOnboardingPreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: onboardingApi.save,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: onboardingKeys.all });
      void qc.invalidateQueries({ queryKey: authKeys.me });
    },
  });
}

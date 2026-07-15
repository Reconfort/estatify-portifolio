import { z } from "zod";

/** Real-estate onboarding goals — multi-select after email verification. */
export const onboardingGoalSchema = z.enum([
  "list_properties",
  "capture_leads",
  "launch_website",
  "manage_team",
  "crm_pipeline",
  "analytics",
  "schedule_viewings",
  "client_portal",
]);

export type OnboardingGoal = z.infer<typeof onboardingGoalSchema>;

export const ONBOARDING_GOAL_OPTIONS: ReadonlyArray<{ id: OnboardingGoal; label: string }> = [
  { id: "list_properties", label: "List properties online" },
  { id: "capture_leads", label: "Capture & manage leads" },
  { id: "launch_website", label: "Launch a branded website" },
  { id: "manage_team", label: "Manage agents & team" },
  { id: "crm_pipeline", label: "CRM & lead pipeline" },
  { id: "analytics", label: "Analytics & reporting" },
  { id: "schedule_viewings", label: "Schedule property viewings" },
  { id: "client_portal", label: "Client self-service portal" },
];

export const saveOnboardingPreferencesSchema = z.object({
  goals: z.array(onboardingGoalSchema).min(1, "Select at least one goal").max(8),
});

export type SaveOnboardingPreferencesInput = z.infer<typeof saveOnboardingPreferencesSchema>;

export const tenantPreferencesSchema = z.object({
  goals: z.array(onboardingGoalSchema),
  completedAt: z.string().datetime().nullable(),
});

export type TenantPreferences = z.infer<typeof tenantPreferencesSchema>;

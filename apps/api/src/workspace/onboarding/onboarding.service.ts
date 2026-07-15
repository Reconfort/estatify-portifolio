import { Injectable } from "@nestjs/common";
import {
  onboardingGoalSchema,
  saveOnboardingPreferencesSchema,
  tenantPreferencesSchema,
  type SaveOnboardingPreferencesInput,
  type TenantPreferences,
} from "@estatify/types";
import { OnboardingRepository } from "./onboarding.repository";

@Injectable()
export class OnboardingService {
  constructor(private readonly repo: OnboardingRepository) {}

  async get(tenantId: string): Promise<TenantPreferences> {
    const row = await this.repo.getOrCreate(tenantId);
    return this.toDto(row);
  }

  async save(
    tenantId: string,
    userId: string,
    input: SaveOnboardingPreferencesInput,
  ): Promise<TenantPreferences> {
    const parsed = saveOnboardingPreferencesSchema.parse(input);
    const row = await this.repo.save(tenantId, userId, parsed.goals, true);
    return this.toDto(row);
  }

  private toDto(row: { goals: unknown; completedAt: Date | null }): TenantPreferences {
    const goalsRaw = Array.isArray(row.goals) ? row.goals : [];
    const goals = goalsRaw.filter((g): g is string => typeof g === "string");
    const validGoals = goals.filter((g) => onboardingGoalSchema.safeParse(g).success);

    return tenantPreferencesSchema.parse({
      goals: validGoals,
      completedAt: row.completedAt?.toISOString() ?? null,
    });
  }
}

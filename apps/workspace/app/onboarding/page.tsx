"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@estatify/auth";
import { getApiErrorMessage, useSaveOnboardingPreferences } from "@estatify/api-client";
import {
  ONBOARDING_GOAL_OPTIONS,
  type OnboardingGoal,
  type SaveOnboardingPreferencesInput,
} from "@estatify/types";
import { AuthBrand, Button } from "@estatify/ui";
import { cn } from "@estatify/utils";
import { ChevronLeft, Loader2, Plus } from "lucide-react";
import { marketingHomeUrl } from "@/lib/marketing-urls";

export default function OnboardingPage() {
  const router = useRouter();
  const session = useSession();
  const save = useSaveOnboardingPreferences();
  const [selected, setSelected] = React.useState<Set<OnboardingGoal>>(new Set());
  const [error, setError] = React.useState<string | null>(null);

  const toggle = (goal: OnboardingGoal) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(goal)) next.delete(goal);
      else next.add(goal);
      return next;
    });
  };

  const onContinue = async () => {
    if (selected.size === 0) {
      setError("Select at least one goal to continue.");
      return;
    }
    setError(null);
    const body: SaveOnboardingPreferencesInput = { goals: [...selected] };
    try {
      await save.mutateAsync(body);
      await session.reload();
      router.replace("/dashboard");
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-4 py-6 sm:px-6">
      <header className="mb-10 flex items-center justify-between gap-4">
        <AuthBrand href={marketingHomeUrl()} logoSrc="/assets/logo-gp.svg" />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center pb-12">
        <div className="mb-8 max-w-xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            What can we help you do?
          </h1>
          <p className="mt-3 text-body-md text-muted-foreground">
            Select all that apply. We&apos;ll tailor your workspace setup.
          </p>
        </div>

        <div className="relative w-full max-w-xl">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="absolute -left-12 top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:flex"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap gap-3">
              {ONBOARDING_GOAL_OPTIONS.map((option) => {
                const active = selected.has(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggle(option.id)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-body-sm font-medium transition-colors",
                      active
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-muted/40 text-foreground hover:border-primary/30 hover:bg-muted/70",
                    )}
                  >
                    <Plus
                      className={cn("size-4 shrink-0 transition-transform", active && "rotate-45")}
                      aria-hidden
                    />
                    {option.label}
                  </button>
                );
              })}
            </div>

            {error ? (
              <p
                className="mt-4 text-center text-caption font-medium text-destructive"
                role="alert"
              >
                {error}
              </p>
            ) : null}

            <Button
              type="button"
              size="lg"
              className="mt-8 w-full"
              disabled={save.isPending}
              onClick={() => void onContinue()}
            >
              {save.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Saving…
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthBrand, Button } from "@estatify/ui";
import { resolveCheckoutPlan } from "@/lib/checkout";
import { workspaceSignUpUrl } from "@/lib/workspace-urls";
import { PaymentFormPanel } from "./payment-form-panel";
import { PlanSummaryPanel } from "./plan-summary-panel";

/**
 * Two-pane checkout shell — Shopify-style structure, Estatify branding.
 * Payment provider wiring is intentionally deferred.
 */
export function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = resolveCheckoutPlan(searchParams.get("plan"));

  React.useEffect(() => {
    if (!plan) router.replace("/#pricing");
  }, [plan, router]);

  if (!plan) {
    return (
      <div className="relative z-10 flex min-h-dvh items-center justify-center">
        <p className="text-body-sm text-muted-foreground">Redirecting…</p>
      </div>
    );
  }

  return (
    <div className="relative z-10 mx-auto flex min-h-dvh max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-8 flex items-center justify-between gap-4">
        <AuthBrand href="/" logoSrc="/assets/logo-gp.svg" />
        <Button href={workspaceSignUpUrl()} variant="outline" size="sm">
          Skip for now
        </Button>
      </header>

      <main className="flex flex-1 items-center justify-center pb-10">
        <div className="w-full max-w-5xl overflow-hidden rounded-lg border border-border bg-card shadow-lg lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <PlanSummaryPanel plan={plan} />
          <PaymentFormPanel plan={plan} />
        </div>
      </main>
    </div>
  );
}

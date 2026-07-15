"use client";

import * as React from "react";
import { ChevronLeftIcon, LockIcon } from "@estatify/ui/icons";
import { Button, Input, Label } from "@estatify/ui";
import type { CheckoutPlan } from "@/lib/checkout";

/**
 * Payment form shell — structure mirrors a hosted checkout (card + billing).
 * Submission is disabled until a payment provider is integrated.
 */
export function PaymentFormPanel({ plan }: { plan: CheckoutPlan }) {
  const [submitted, setSubmitted] = React.useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex h-full flex-col bg-card px-6 py-8 text-foreground sm:px-8 lg:px-10 lg:py-10">
      <a
        href="/#pricing"
        className="mb-6 inline-flex w-fit items-center gap-2 text-body-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeftIcon className="size-4" aria-hidden />
        Back to pricing
      </a>

      {plan.promoBanner ? (
        <div className="mb-6 rounded-lg border border-primary/15 bg-primary/5 px-4 py-3">
          <p className="text-body-sm font-semibold text-foreground">{plan.promoBanner.title}</p>
          <p className="mt-1 text-caption text-muted-foreground">{plan.promoBanner.body}</p>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-5" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="card-number">Card number</Label>
          <div className="relative">
            <Input
              id="card-number"
              name="cardNumber"
              placeholder="1234 1234 1234 1234"
              autoComplete="cc-number"
              disabled
              className="pr-10"
            />
            <LockIcon
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="card-expiry">Expiry (MM/YY)</Label>
            <Input
              id="card-expiry"
              name="expiry"
              placeholder="MM/YY"
              autoComplete="cc-exp"
              disabled
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="card-cvc">CVV</Label>
            <Input id="card-cvc" name="cvc" placeholder="CVV" autoComplete="cc-csc" disabled />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="first-name">First name</Label>
            <Input id="first-name" name="firstName" autoComplete="given-name" disabled />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="last-name">Last name</Label>
            <Input id="last-name" name="lastName" autoComplete="family-name" disabled />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="address">Address</Label>
          <Input id="address" name="address" autoComplete="street-address" disabled />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="country">Country / region</Label>
            <Input id="country" name="country" defaultValue="Rwanda" disabled />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" autoComplete="address-level2" disabled />
          </div>
        </div>

        <div className="mt-2 space-y-3">
          <Button type="submit" size="lg" className="w-full" disabled>
            {plan.ctaLabel} — {plan.price}
            {plan.cadence}
          </Button>

          {submitted ? (
            <p className="text-center text-caption font-medium text-primary" role="status">
              Payment integration coming soon. Use Workspace sign-up to get started today.
            </p>
          ) : (
            <p className="text-center text-caption text-muted-foreground">
              Payment processing will be enabled in a future release.
            </p>
          )}

          <p className="text-center text-[0.7rem] leading-relaxed text-muted-foreground">
            {plan.legal}
          </p>
        </div>
      </form>
    </div>
  );
}

"use client";

import { cn } from "@estatify/utils";
import type { CheckoutPlan } from "@/lib/checkout";

export function PlanSummaryPanel({ plan }: { plan: CheckoutPlan }) {
  return (
    <div className="flex h-full flex-col justify-between bg-neutral-950 px-8 py-10 text-white lg:px-10 lg:py-12">
      <div className="space-y-8">
        <div>
          <p className="text-caption font-medium tracking-wide text-white/60 uppercase">
            {plan.name} plan
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {plan.headline}
          </h1>
        </div>

        <ol className="space-y-0">
          {plan.timeline.map((step, index) => {
            const isLast = index === plan.timeline.length - 1;
            return (
              <li key={step.label} className="relative flex gap-4 pb-8">
                {!isLast ? (
                  <span
                    className="absolute top-3 left-[7px] h-[calc(100%-4px)] w-px bg-white/20"
                    aria-hidden
                  />
                ) : null}
                <span
                  className={cn(
                    "relative z-10 mt-1.5 size-3.5 shrink-0 rounded-full border-2",
                    index === 0 ? "border-accent bg-accent" : "border-white/40 bg-neutral-950",
                  )}
                  aria-hidden
                />
                <div className="min-w-0 pt-0.5">
                  <p className="text-body-sm font-medium text-white/70">{step.label}</p>
                  <p className="mt-0.5 text-body-md font-semibold text-white">
                    {step.value}
                    {step.compareAt ? (
                      <span className="ml-2 font-normal text-white/45 line-through">
                        {step.compareAt}
                      </span>
                    ) : null}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <p className="text-caption text-white/50">
        Secure checkout · Estatify billing · No charge during trial
      </p>
    </div>
  );
}

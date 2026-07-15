/**
 * Checkout plan definitions — UI scaffold only.
 * Payment provider integration (Stripe, etc.) lands in a later milestone.
 */

export type CheckoutPlanId = "growth";

export interface CheckoutTimelineStep {
  label: string;
  value: string;
  /** Optional struck-through compare price (e.g. full monthly rate). */
  compareAt?: string;
}

export interface CheckoutPlan {
  id: CheckoutPlanId;
  name: string;
  headline: string;
  price: string;
  cadence: string;
  trialDays: number;
  timeline: readonly CheckoutTimelineStep[];
  ctaLabel: string;
  legal: string;
  /** Shown in the optional promo banner on the payment pane. */
  promoBanner?: { title: string; body: string };
}

export const checkoutPlans: Record<CheckoutPlanId, CheckoutPlan> = {
  growth: {
    id: "growth",
    name: "Growth",
    headline: "Start for free, stay for Growth",
    price: "$49",
    cadence: "/mo",
    trialDays: 14,
    timeline: [
      { label: "Today", value: "14-day free trial" },
      { label: "After trial", value: "$49/mo", compareAt: undefined },
      { label: "Always", value: "Cancel anytime" },
    ],
    ctaLabel: "Start trial",
    legal:
      "After your 14-day trial, you will be charged $49/mo plus applicable taxes. Cancel anytime from Workspace billing settings.",
    promoBanner: {
      title: "Includes custom domain setup",
      body: "Connect your agency domain during onboarding. DNS guidance is included with Growth.",
    },
  },
};

export function checkoutUrl(plan: CheckoutPlanId): string {
  return `/checkout?plan=${plan}`;
}

export function resolveCheckoutPlan(raw: string | null | undefined): CheckoutPlan | null {
  if (raw === "growth") return checkoutPlans.growth;
  return null;
}

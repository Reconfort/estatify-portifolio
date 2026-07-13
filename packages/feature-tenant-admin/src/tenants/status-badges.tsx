import { cn } from "@estatify/utils";
import type { TenantPlan, TenantStatusValue } from "@estatify/types";

const STATUS_STYLES: Record<TenantStatusValue, string> = {
  active: "bg-success/12 text-success",
  suspended: "bg-destructive/12 text-destructive",
  pending: "bg-warning/15 text-warning-foreground",
};

export function StatusBadge({ status }: { status: TenantStatusValue }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-caption font-semibold capitalize",
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

export function PlanBadge({ plan }: { plan: TenantPlan }) {
  return (
    <span className="inline-flex items-center rounded-md border border-border bg-secondary px-2 py-0.5 text-caption font-medium capitalize text-foreground">
      {plan}
    </span>
  );
}

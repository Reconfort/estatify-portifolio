import * as React from "react";
import { cn } from "@estatify/utils";

/** Form label — token-only, pairs with the form controls via htmlFor. */
export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control -- htmlFor supplied by callers
    <label
      data-slot="label"
      className={cn(
        "text-label font-medium text-foreground select-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}

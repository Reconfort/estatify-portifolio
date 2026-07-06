import * as React from "react";
import { ChevronDownIcon } from "../icons";
import { cn } from "@estatify/utils";
import { controlClasses } from "./input";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: readonly SelectOption[];
  /** Shown as the disabled empty option, e.g. "Select a topic". */
  placeholder?: string | undefined;
}

/**
 * Select — styled native select (keyboard/mobile behavior for free).
 * Swap the internals for a Radix-based listbox later without changing the API.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className, options, placeholder, ...props }, ref) {
    return (
      <span className="relative block">
        <select
          ref={ref}
          data-slot="select"
          className={cn(controlClasses, "appearance-none pr-10", className)}
          {...props}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled ?? false}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          aria-hidden
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />
      </span>
    );
  },
);

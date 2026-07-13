"use client";

import * as React from "react";
import { cn } from "@estatify/utils";
import { EyeIcon, EyeOffIcon } from "../icons";
import { controlClasses, Input } from "./input";

export type PasswordInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

/**
 * PasswordInput — shared password control with show/hide toggle.
 * Drop-in companion to `Input`; use via Field (type="password") or alone.
 */
export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ className, disabled, ...props }, ref) {
    const [visible, setVisible] = React.useState(false);

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={visible ? "text" : "password"}
          disabled={disabled}
          className={cn("pr-11", className)}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className={cn(
            "absolute top-1/2 right-2.5 -translate-y-1/2 rounded-sm p-1.5 text-muted-foreground focus:outline-none ring-0",
            "hover:bg-accent hover:text-foreground hover:border-accent",
            "disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          {visible ? (
            <EyeOffIcon className="size-4" aria-hidden />
          ) : (
            <EyeIcon className="size-4" aria-hidden />
          )}
        </button>
      </div>
    );
  },
);

/** Re-export for callers that need the shared chrome class. */
export { controlClasses };

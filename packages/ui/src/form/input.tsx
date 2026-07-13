import * as React from "react";
import { cn } from "@estatify/utils";

/** Shared control chrome for input, textarea, and select. */
export const controlClasses = cn(
  "w-full rounded-sm border border-input bg-background px-3.5 py-2.5 text-body-sm text-foreground focus:outline-none ring-0",
  "placeholder:text-muted-foreground/60 hover:border-accent focus:border-accent",
  "transition-[border-color,box-shadow] duration-150",
  "disabled:cursor-not-allowed disabled:opacity-60",
  "aria-invalid:border-destructive aria-invalid:focus-visible:outline-destructive",
);

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, type = "text", ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(controlClasses, className)}
      {...props}
    />
  );
});

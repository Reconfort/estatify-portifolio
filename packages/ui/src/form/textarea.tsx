import * as React from "react";
import { cn } from "@estatify/utils";
import { controlClasses } from "./input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, rows = 4, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      data-slot="textarea"
      className={cn(
        controlClasses,
        "min-h-20 resize-y focus:outline-none ring-0 hover:border-accent focus:border-accent",
        className,
      )}
      {...props}
    />
  );
});

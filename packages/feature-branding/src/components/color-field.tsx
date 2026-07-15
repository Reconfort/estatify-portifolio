"use client";

import * as React from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useController } from "react-hook-form";
import { cn } from "@estatify/utils";

export function ColorField<T extends FieldValues>({
  control,
  name,
  label,
}: {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
}) {
  const { field, fieldState } = useController({ control, name });
  const value = typeof field.value === "string" ? field.value : "#000000";

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={field.name} className="text-body-sm font-medium text-foreground">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={field.name}
          type="color"
          value={value}
          onChange={(e) => field.onChange(e.target.value)}
          onBlur={field.onBlur}
          className="size-10 shrink-0 cursor-pointer rounded-lg border border-border bg-transparent p-0.5"
          aria-invalid={fieldState.invalid}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => field.onChange(e.target.value)}
          onBlur={field.onBlur}
          className={cn(
            "h-10 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 font-mono text-body-sm text-foreground outline-none",
            "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
            fieldState.invalid && "border-destructive",
          )}
          spellCheck={false}
        />
        <span
          className="size-10 shrink-0 rounded-lg border border-border"
          style={{ backgroundColor: value }}
          aria-hidden
        />
      </div>
      {fieldState.error ? (
        <p className="text-caption text-destructive">{fieldState.error.message}</p>
      ) : null}
    </div>
  );
}

"use client";

import * as React from "react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { cn } from "@estatify/utils";
import { Input } from "./input";
import { Label } from "./label";
import { Select, type SelectOption } from "./select";
import { Textarea } from "./textarea";

type TextLikeType = "text" | "email" | "password" | "tel" | "number" | "date" | "url";

interface FieldBaseProps<TValues extends FieldValues> {
  /** react-hook-form control — from useZodForm(schema). */
  control: Control<TValues>;
  name: FieldPath<TValues>;
  label: string;
  placeholder?: string | undefined;
  /** Secondary helper text under the control (hidden while an error shows). */
  hint?: string | undefined;
  autoComplete?: string | undefined;
  disabled?: boolean | undefined;
  className?: string | undefined;
}

export type FieldProps<TValues extends FieldValues> = FieldBaseProps<TValues> &
  (
    | { type: TextLikeType }
    | { type: "textarea"; rows?: number | undefined }
    | { type: "select"; options: readonly SelectOption[] }
  );

/**
 * Field — THE form field for the platform. One component, every control:
 *
 *   <Field control={form.control} name="email" type="email" label="Email" />
 *   <Field control={form.control} name="topic" type="select" label="Topic" options={topics} />
 *   <Field control={form.control} name="message" type="textarea" label="Message" />
 *
 * Wires label ↔ control ↔ error message with correct ids, aria-invalid and
 * aria-describedby automatically. Validation comes from the Zod schema bound
 * via useZodForm — never from rules written here.
 */
export function Field<TValues extends FieldValues>(props: FieldProps<TValues>) {
  const { control, name, label, placeholder, hint, autoComplete, disabled, className } = props;
  const id = React.useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const invalid = Boolean(fieldState.error);
        const describedBy = invalid ? errorId : hint ? hintId : undefined;
        const shared = {
          id,
          placeholder,
          disabled,
          "aria-invalid": invalid || undefined,
          ...(describedBy ? { "aria-describedby": describedBy } : {}),
          ...(autoComplete ? { autoComplete } : {}),
        } as const;

        return (
          <div className={cn("flex flex-col gap-1.5", className)}>
            <Label htmlFor={id}>{label}</Label>

            {props.type === "textarea" ? (
              <Textarea {...shared} {...field} rows={props.rows ?? 4} />
            ) : props.type === "select" ? (
              <Select {...shared} {...field} options={props.options} placeholder={placeholder} />
            ) : (
              <Input {...shared} {...field} type={props.type} />
            )}

            {invalid ? (
              <p id={errorId} role="alert" className="text-caption font-medium text-destructive">
                {fieldState.error?.message}
              </p>
            ) : hint ? (
              <p id={hintId} className="text-caption text-muted-foreground">
                {hint}
              </p>
            ) : null}
          </div>
        );
      }}
    />
  );
}

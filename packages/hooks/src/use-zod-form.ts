"use client";

import { useForm, type UseFormProps, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

/**
 * useZodForm — the single way to create a form on the platform.
 *
 * Binds a Zod schema (from @estatify/schemas) to react-hook-form so every
 * form in every app gets identical validation behavior in one line:
 *
 *   const form = useZodForm(signUpSchema);
 *   <Field control={form.control} name="email" type="email" label="Email" />
 *
 * Validation runs on blur first, then re-validates on change once a field
 * has errored — the least noisy pattern for users.
 */
export function useZodForm<TSchema extends z.ZodType>(
  schema: TSchema,
  options?: Omit<UseFormProps<z.infer<TSchema>>, "resolver">,
): UseFormReturn<z.infer<TSchema>> {
  return useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema as never),
    mode: "onTouched",
    ...options,
  });
}

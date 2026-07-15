import type { ZodType } from "zod";

/** Deep partial for PATCH payloads (Zod deepPartial shapes). */
export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

/** Deep-merge plain objects (arrays replaced, not merged). */
export function deepMerge<T extends Record<string, unknown>>(base: T, patch: DeepPartial<T>): T {
  const out = { ...base };
  const source = patch as Partial<T>;
  for (const key of Object.keys(source) as (keyof T)[]) {
    const value = source[key];
    if (value === undefined) continue;
    const current = out[key];
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      current &&
      typeof current === "object" &&
      !Array.isArray(current)
    ) {
      out[key] = deepMerge(
        current as Record<string, unknown>,
        value as Record<string, unknown>,
      ) as T[keyof T];
    } else {
      out[key] = value as T[keyof T];
    }
  }
  return out;
}

export function parseConfigSection<T>(schema: ZodType<T>, raw: unknown, fallback: T): T {
  const parsed = schema.safeParse(raw);
  return parsed.success ? parsed.data : fallback;
}

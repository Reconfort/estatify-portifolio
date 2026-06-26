/**
 * Class-name composition helper (shadcn/ui convention).
 *
 * Dependency-free for now so the foundation builds with zero extra installs.
 * RECOMMENDED upgrade once shadcn/ui is added: replace the body with
 * `clsx` + `tailwind-merge` for conflict-aware merging:
 *
 *   import { clsx, type ClassValue } from "clsx";
 *   import { twMerge } from "tailwind-merge";
 *   export const cn = (...i: ClassValue[]) => twMerge(clsx(i));
 *
 * The current implementation handles strings, arrays, and conditional objects
 * but does NOT de-dupe conflicting Tailwind classes (e.g. `px-2 px-4`).
 */

export type ClassValue =
  | string
  | number
  | null
  | boolean
  | undefined
  | ClassValue[]
  | Record<string, boolean | null | undefined>;

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  const walk = (value: ClassValue) => {
    if (!value) return;
    if (typeof value === "string" || typeof value === "number") {
      out.push(String(value));
    } else if (Array.isArray(value)) {
      value.forEach(walk);
    } else if (typeof value === "object") {
      for (const [key, on] of Object.entries(value)) if (on) out.push(key);
    }
  };
  inputs.forEach(walk);
  return out.join(" ");
}

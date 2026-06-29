import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * The single class-name composition helper for the whole platform.
 * clsx resolves conditionals; tailwind-merge de-dupes conflicting Tailwind
 * utilities (e.g. `px-2 px-4` -> `px-4`). Every component uses THIS — never a
 * local copy. Imported as `import { cn } from "@estatify/utils"`.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export type { ClassValue };

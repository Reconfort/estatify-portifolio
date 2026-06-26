/**
 * WCAG 2.x contrast utilities — the safety net for white-label theming.
 *
 * When a tenant picks an arbitrary brand color we CANNOT statically guarantee
 * legible text. These functions compute the relative luminance and contrast
 * ratio at runtime so we can pick the correct foreground (ink vs white) and
 * warn when a tenant color is unusable as an action surface.
 */

export type RGB = { r: number; g: number; b: number };
export type HSL = { h: number; s: number; l: number };

const INK = "#0e1211"; // neutral-950
const WHITE = "#ffffff";

/** WCAG AA threshold for normal-size text. */
export const WCAG_AA = 4.5;
/** WCAG AA threshold for large text (>=18.66px bold / 24px regular) and UI. */
export const WCAG_AA_LARGE = 3;

export function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const to = (n: number) => Math.round(clamp(n, 0, 255)).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Relative luminance per WCAG 2.1. */
export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** Contrast ratio between two hex colors (1..21). */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Pick the foreground (ink or white) with the higher contrast against `bg`.
 * This is what guarantees readable text on ANY tenant brand color.
 */
export function bestForeground(bg: string): { color: string; ratio: number } {
  const onInk = contrastRatio(bg, INK);
  const onWhite = contrastRatio(bg, WHITE);
  return onInk >= onWhite
    ? { color: INK, ratio: onInk }
    : { color: WHITE, ratio: onWhite };
}

/** True if `bg` can carry readable normal text with its best foreground. */
export function isAccessibleSurface(bg: string, threshold = WCAG_AA): boolean {
  return bestForeground(bg).ratio >= threshold;
}

export function hexToHsl(hex: string): HSL {
  let { r, g, b } = hexToRgb(hex);
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { h, s: s * 100, l: l * 100 };
}

export function hslToHex({ h, s, l }: HSL): string {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return rgbToHex({ r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 });
}

export { INK, WHITE };

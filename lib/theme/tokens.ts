/**
 * Typed token source-of-truth for JS/TS consumers (charts, canvas, emails,
 * PDF export, design-token export pipelines). These MIRROR the CSS variables
 * in globals.css — CSS is authoritative for styling; this file is for code
 * that cannot read CSS custom properties (e.g. a Recharts color array).
 *
 * Keep in sync with app/globals.css. A single-source codegen step can be added
 * later; for now the values are colocated and unit-tested via the contrast check.
 */

export const colors = {
  green: {
    50: "#f0faf4", 100: "#dcf3e5", 200: "#bbe7cd", 300: "#8ad4ac", 400: "#52b883",
    500: "#2e9d66", 600: "#1e7a4f", 700: "#1a6342", 800: "#184e36", 900: "#14402d", 950: "#0a2419",
  },
  lime: {
    50: "#f7fce8", 100: "#ecf9c8", 200: "#daf398", 300: "#c2e95e", 400: "#a4e636",
    500: "#8bc91f", 600: "#6b9f12", 700: "#517910", 800: "#406013", 900: "#365015", 950: "#1b2c05",
  },
  neutral: {
    0: "#ffffff", 50: "#f8faf9", 100: "#f1f4f3", 200: "#e4e9e7", 300: "#cfd6d3", 400: "#9ca8a3",
    500: "#6b7873", 600: "#4d5a55", 700: "#3a4541", 800: "#28302d", 900: "#1a201e", 950: "#0e1211",
  },
  success: { 50: "#ecfdf3", 500: "#22a35a", 600: "#15803d", 700: "#126c34" },
  warning: { 50: "#fffaeb", 400: "#fbbf24", 500: "#f59e0b", 600: "#b45309" },
  error: { 50: "#fef2f2", 500: "#ef4444", 600: "#dc2626", 700: "#b91c1c" },
  info: { 50: "#eff6ff", 500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8" },
} as const;

/** Chart series in render order (light mode). */
export const chartSeries = [
  colors.green[600],
  colors.lime[500],
  colors.info[600],
  colors.warning[500],
  colors.neutral[400],
] as const;

/** 4px base spacing scale (matches Tailwind v4 dynamic spacing). */
export const spacing = {
  0: "0px", 1: "0.25rem", 2: "0.5rem", 3: "0.75rem", 4: "1rem", 5: "1.25rem", 6: "1.5rem",
  8: "2rem", 10: "2.5rem", 12: "3rem", 16: "4rem", 20: "5rem", 24: "6rem", 32: "8rem",
  40: "10rem", 48: "12rem", 64: "16rem", 80: "20rem", 96: "24rem", 128: "32rem",
} as const;

export const radius = {
  xs: "0.25rem", sm: "0.375rem", md: "0.5rem", lg: "0.75rem",
  xl: "1rem", "2xl": "1.5rem", "3xl": "2rem", full: "9999px",
} as const;

export const fontSize = {
  "display-2xl": { size: "4.5rem", lineHeight: "1.05", tracking: "-0.02em", weight: 700 },
  "display-xl": { size: "3.75rem", lineHeight: "1.07", tracking: "-0.02em", weight: 700 },
  "display-lg": { size: "3rem", lineHeight: "1.1", tracking: "-0.02em", weight: 700 },
  "display-md": { size: "2.25rem", lineHeight: "1.15", tracking: "-0.01em", weight: 600 },
  h1: { size: "2rem", lineHeight: "1.2", tracking: "-0.01em", weight: 600 },
  h2: { size: "1.625rem", lineHeight: "1.25", tracking: "-0.01em", weight: 600 },
  h3: { size: "1.375rem", lineHeight: "1.3", weight: 600 },
  h4: { size: "1.125rem", lineHeight: "1.4", weight: 600 },
  h5: { size: "1rem", lineHeight: "1.5", weight: 600 },
  h6: { size: "0.875rem", lineHeight: "1.5", weight: 600 },
  "body-xl": { size: "1.25rem", lineHeight: "1.6" },
  "body-lg": { size: "1.125rem", lineHeight: "1.6" },
  "body-md": { size: "1rem", lineHeight: "1.6" },
  "body-sm": { size: "0.875rem", lineHeight: "1.55" },
  caption: { size: "0.75rem", lineHeight: "1.4" },
  overline: { size: "0.75rem", lineHeight: "1.3", tracking: "0.08em", weight: 600 },
  label: { size: "0.875rem", lineHeight: "1.4", weight: 500 },
} as const;

/** Responsive breakpoints (min-width). Matches Tailwind v4 defaults + 3xl. */
export const breakpoints = {
  sm: "640px",   // large phone / small tablet
  md: "768px",   // tablet
  lg: "1024px",  // laptop
  xl: "1280px",  // desktop
  "2xl": "1536px", // large desktop
  "3xl": "1920px", // ultra-wide
} as const;

export type ColorScaleName = keyof typeof colors;
export type RadiusToken = keyof typeof radius;
export type FontSizeToken = keyof typeof fontSize;
export type Breakpoint = keyof typeof breakpoints;

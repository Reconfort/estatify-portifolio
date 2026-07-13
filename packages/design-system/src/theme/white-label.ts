/**
 * White-label theming engine.
 *
 * A tenant supplies a brand color (and optionally accent, radius, mode). We:
 *   1. generate a full 50..950 scale from it,
 *   2. resolve an accessible on-color for every tinted surface (WCAG-safe),
 *   3. emit CSS-variable overrides for the SEMANTIC layer only.
 *
 * Primitives in globals.css are never touched, so platform UI stays stable.
 * Use `tenantThemeToCssText` for SSR injection (no FOUC); `applyTenantTheme`
 * for client-side live preview in the tenant theme editor.
 */

import { bestForeground, hexToHsl, hslToHex, isAccessibleSurface, type HSL } from "./contrast";

export type ThemeMode = "light" | "dark";

export interface TenantThemeConfig {
  /** Tenant brand color in hex. Becomes the action/primary color. */
  brandColor: string;
  /** Optional secondary highlight. Defaults to Estatify lime. */
  accentColor?: string;
  /** Base corner radius in px applied to --radius-* scaling. Default 8. */
  radiusBase?: number;
  /** Default color mode for the tenant site. */
  mode?: ThemeMode;
  /** Optional font-family string for --font-sans. */
  fontFamily?: string;
}

export type ColorScale = Record<
  "50" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | "950",
  string
>;

/** Lightness targets per scale step — tuned to read as a balanced ramp. */
const SCALE_LIGHTNESS: Record<keyof ColorScale, number> = {
  "50": 96,
  "100": 91,
  "200": 82,
  "300": 70,
  "400": 58,
  "500": 48,
  "600": 40,
  "700": 33,
  "800": 26,
  "900": 20,
  "950": 12,
};

/**
 * Build a 50..950 scale from a single brand hex by anchoring hue/saturation
 * and walking lightness. The input color is snapped to the nearest step so the
 * tenant's exact brand appears verbatim in the scale.
 */
export function generateScale(baseHex: string): ColorScale {
  const base = hexToHsl(baseHex);
  // Find which step the base lightness is closest to, and pin it there.
  const steps = Object.keys(SCALE_LIGHTNESS) as (keyof ColorScale)[];
  let nearest = steps[0];
  let min = Infinity;
  for (const step of steps) {
    const d = Math.abs(SCALE_LIGHTNESS[step] - base.l);
    if (d < min) {
      min = d;
      nearest = step;
    }
  }
  const scale = {} as ColorScale;
  for (const step of steps) {
    if (step === nearest) {
      scale[step] = normalizeHex(baseHex);
      continue;
    }
    // Lighter steps desaturate slightly; darker steps deepen — avoids muddiness.
    const targetL = SCALE_LIGHTNESS[step];
    const satAdj =
      targetL > base.l
        ? Math.max(base.s - (targetL - base.l) * 0.3, 8)
        : Math.min(base.s + (base.l - targetL) * 0.15, 100);
    const hsl: HSL = { h: base.h, s: satAdj, l: targetL };
    scale[step] = hslToHex(hsl);
  }
  return scale;
}

function normalizeHex(hex: string): string {
  const h = hex.replace("#", "").trim().toLowerCase();
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  return `#${full}`;
}

export interface ResolvedTenantTheme {
  /** CSS custom properties to set on the theme root (light surfaces). */
  light: Record<string, string>;
  /** CSS custom properties for the `.dark` scope. */
  dark: Record<string, string>;
  /** Diagnostics — surfaced in the tenant editor to flag risky colors. */
  warnings: string[];
  scales: { primary: ColorScale; accent: ColorScale };
}

const DEFAULT_ACCENT = "#a4e636";

/**
 * Resolve a tenant config into accessible semantic variable maps.
 * Foreground colors are computed (ink vs white) so text is always legible.
 */
export function resolveTenantTheme(config: TenantThemeConfig): ResolvedTenantTheme {
  const warnings: string[] = [];
  const primary = generateScale(config.brandColor);
  const accent = generateScale(config.accentColor ?? DEFAULT_ACCENT);

  // Action surface uses step 600 in light, 400 in dark.
  const lightAction = primary["600"];
  const darkAction = primary["400"];

  if (!isAccessibleSurface(lightAction)) {
    warnings.push(
      `Brand color ${config.brandColor} is too light for an action surface — ` +
        `its 600 step (${lightAction}) cannot hold legible text. Consider a deeper brand color.`,
    );
  }

  const radius = config.radiusBase ?? 8;
  const r = (px: number) => `${px / 16}rem`;

  const light: Record<string, string> = {
    "--primary": lightAction,
    "--primary-foreground": bestForeground(lightAction).color,
    "--primary-hover": primary["700"],
    "--accent": accent["400"],
    "--accent-foreground": bestForeground(accent["400"]).color,
    "--ring": lightAction,
    "--sidebar-primary": lightAction,
    "--sidebar-primary-foreground": bestForeground(lightAction).color,
    "--sidebar-ring": lightAction,
    "--chart-1": lightAction,
    "--chart-2": accent["500"],
    // radius scale — lg is the product max; xl/2xl/3xl alias to it
    "--radius-xs": r(radius * 0.5),
    "--radius-sm": r(radius * 0.75),
    "--radius-md": r(radius),
    "--radius-lg": r(radius * 1.5),
    "--radius-xl": r(radius * 1.5),
    "--radius-2xl": r(radius * 1.5),
    "--radius-3xl": r(radius * 1.5),
  };
  if (config.fontFamily) light["--font-sans"] = config.fontFamily;

  const dark: Record<string, string> = {
    "--primary": darkAction,
    "--primary-foreground": bestForeground(darkAction).color,
    "--primary-hover": primary["300"],
    "--accent": accent["400"],
    "--accent-foreground": bestForeground(accent["400"]).color,
    "--ring": darkAction,
    "--sidebar-primary": darkAction,
    "--sidebar-primary-foreground": bestForeground(darkAction).color,
    "--sidebar-ring": darkAction,
    "--chart-1": darkAction,
    "--chart-2": accent["400"],
  };

  return { light, dark, warnings, scales: { primary, accent } };
}

/** Live-apply a tenant theme to a DOM element (client-only, theme editor). */
export function applyTenantTheme(
  config: TenantThemeConfig,
  target: HTMLElement = document.documentElement,
): ResolvedTenantTheme {
  const resolved = resolveTenantTheme(config);
  const vars =
    target.classList.contains("dark") || config.mode === "dark"
      ? { ...resolved.light, ...resolved.dark }
      : resolved.light;
  for (const [key, value] of Object.entries(vars)) {
    target.style.setProperty(key, value);
  }
  return resolved;
}

/**
 * Serialize a tenant theme to CSS text for SSR injection in <head>.
 * Scope it to the tenant root (e.g. `[data-tenant="acme"]`) for multi-tenant
 * pages, or `:root` for a dedicated tenant site. Prevents flash of wrong brand.
 */
export function tenantThemeToCssText(config: TenantThemeConfig, selector = ":root"): string {
  const { light, dark } = resolveTenantTheme(config);
  const block = (vars: Record<string, string>) =>
    Object.entries(vars)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join("\n");
  return [
    `${selector} {\n${block(light)}\n}`,
    `${selector}.dark, .dark ${selector} {\n${block(dark)}\n}`,
  ].join("\n\n");
}

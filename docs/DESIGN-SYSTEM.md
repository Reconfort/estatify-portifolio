# Estatify Design System — Foundation

Token-first, white-label-ready foundation for the Estatify platform. Built on
Tailwind CSS v4 (CSS-first), React 19, Next.js 16, TypeScript.

This document covers what was built in the foundation pass: the token
architecture, the color model, accessibility rules, the white-label theming
engine, responsive breakpoints, and motion guidelines. Components are intentionally
out of scope for this pass — they sit on top of this layer.

---

## 1. The one decision that shapes everything: color

The brand color **lime `#A4E636`** has a relative luminance of ~0.65 — almost as
bright as white. That makes it unusable as a primary *action* color, because text
on top of it can't pass WCAG contrast with white:

| Foreground on lime `#A4E636` | Ratio | Verdict |
| --- | --- | --- |
| White text | **1.51:1** | ✗ Fails (need 4.5:1) |
| Ink `#0e1211` | **12.53:1** | ✓ AAA |

So the system uses a **two-anchor model**:

- **Primary / action** = **Estatify Green** (deep, low-luminance). White text on
  the action surface (`green-600`) is **5.31:1 (AA)**; hover (`green-700`) is **7.22:1 (AAA)**.
- **Accent / brand-pop** = **Lime**. It only ever carries **ink** text. Used for
  highlights, CTAs-with-dark-text, badges, focus moments, and marketing hero accents.

This keeps the brand identity (lime) front-and-center while making the working UI
trustworthy and legible — the Stripe/Linear/Vercel pattern of a confident,
low-luminance action color.

---

## 2. Token architecture (three tiers)

```
PRIMITIVES        Semantic            Tailwind utilities
--green-600   ->  --primary       ->  bg-primary / text-primary
--lime-400    ->  --accent        ->  bg-accent  / text-accent-foreground
--neutral-200 ->  --border        ->  border-border
```

1. **Primitives** (`--green-*`, `--lime-*`, `--neutral-*`, status scales) —
   raw values. **Never reference these directly in components.** They are
   tenant-invariant: white-labeling never changes them.
2. **Semantic** (`--primary`, `--background`, `--muted-foreground`, …) —
   role-based. Components use *only* these. This is the layer tenants override.
   Names follow **shadcn/ui** so its components drop in unchanged.
3. **Theme map** (`@theme inline { … }`) — exposes semantic tokens + raw scales to
   Tailwind utilities. `inline` keeps the `var()` reference live so dark mode and
   tenant overrides cascade without rebuilding CSS.

All of this lives in [`app/globals.css`](../app/globals.css). For code that can't
read CSS variables (charts, canvas, PDF/email export) there's a typed mirror in
[`lib/theme/tokens.ts`](../lib/theme/tokens.ts).

### Why semantic-only in components

If a component hardcodes `bg-[#1e7a4f]` or even `bg-brand-600`, white-labeling
breaks for that element. Using `bg-primary` means a tenant override flows through
automatically. The project constitution forbids hardcoded colors — this is the
mechanism that enforces it.

---

## 3. Color reference

| Role | Light | Dark | Foreground rule |
| --- | --- | --- | --- |
| `primary` (action) | `green-600` | `green-400` | resolved on-color (white in light, ink in dark) |
| `accent` (lime) | `lime-400` | `lime-400` | **ink only** |
| `background` | `neutral-0` | `neutral-950` | `foreground` |
| `card` / `popover` | `neutral-0` | `neutral-900` | — |
| `muted-foreground` | `neutral-500` (4.61:1) | `neutral-400` | — |
| `destructive` | `error-600` | `error-500` | white / ink |
| `success` | `success-600` | `success-500` | white / ink |
| `warning` | `warning-500` | `warning-400` | **ink** |
| `info` | `info-600` | `info-500` | white / ink |
| `border` | `neutral-200` | white @12% | — |
| `ring` | `green-600` | `green-400` | focus only |

Dashboards also get `--chart-1..5` and a full `--sidebar-*` surface set.

---

## 4. Typography

Primary typeface **Rubik** (loaded via `next/font` in `app/layout.tsx`, exposed as
`--font-rubik` → `--font-sans`). Fallback: Inter, system-ui.

Scale (use as Tailwind utilities, e.g. `text-display-lg`, `text-h2`, `text-body-md`):

`display-2xl · display-xl · display-lg · display-md · h1–h6 · body-xl/lg/md/sm · caption · overline · label`

Each token pairs size + line-height + tracking + weight, so a single class sets
all four. Display/heading sizes use negative tracking for a tighter, premium feel.

---

## 5. Spacing, radius, shadow

- **Spacing**: 4px base. Tailwind v4's dynamic spacing already covers the full
  requested ramp (`0,1,2,4,6,8,12,16,20,24,32,40,48,64,80,96,128`) — no custom
  config needed. Mirror values in `tokens.ts`.
- **Radius**: `xs(4) · sm(6) · md(8) · lg(12) · xl(16) · 2xl(24) · 3xl(32) · full`.
  Soft, modern corners. Tenant `radiusBase` rescales the whole ramp.
- **Shadow**: `xs → 2xl`, Untitled-UI-style — low spread, slate-tinted, layered.

---

## 6. Accessibility rules (non-negotiable)

1. **Body text ≥ 4.5:1, large text/UI ≥ 3:1.** Verified for every default pairing
   (see the contrast check in §9).
2. **Never put white text on lime or warning.** Use `accent-foreground` /
   `warning-foreground` (ink), which the tokens enforce.
3. **Foregrounds are resolved, not assumed.** For any tinted surface — including
   arbitrary tenant brand colors — the on-color is computed
   (`bestForeground`) to guarantee contrast.
4. **Visible focus.** `:focus-visible` draws a 2px `--ring` outline with offset.
   Don't remove outlines; restyle via `--ring`.
5. **Reduced motion.** A global `prefers-reduced-motion` block neutralizes
   animation/transition durations.
6. **Color is never the only signal.** Status must pair color with icon/label
   (enforced at the component layer).

---

## 7. White-label theming engine

A tenant supplies a brand color (optionally accent, radius, mode). The engine in
[`lib/theme/white-label.ts`](../lib/theme/white-label.ts):

1. `generateScale(hex)` — builds a 50…950 ramp from one color, pinning the input
   to its nearest step so the tenant's exact brand appears verbatim.
2. `resolveTenantTheme(config)` — produces accessible `light` + `dark` semantic
   variable maps, computing on-colors via WCAG contrast and emitting **warnings**
   when a brand color is too light to be a safe action surface.
3. Apply it two ways:
   - **SSR (no flash):** `tenantThemeToCssText(config, selector)` → inject in
     `<head>` or a scoped `[data-tenant]` block.
   - **Live preview:** `applyTenantTheme(config, el)` → sets CSS vars on the DOM
     (use in the tenant theme editor).

Only the **semantic** layer is overridden; primitives and platform chrome are
untouched. This is what lets one codebase serve thousands of white-label sites
without per-tenant CSS forks.

```ts
import { tenantThemeToCssText } from "@/lib/theme/white-label";

const css = tenantThemeToCssText(
  { brandColor: "#7C3AED", radiusBase: 12, mode: "light" },
  '[data-tenant="acme"]'
);
// -> inject `css` for that tenant's pages
```

**Honest limitation:** arbitrary tenant colors cannot be *statically* guaranteed
WCAG-compliant. The engine resolves a safe foreground at runtime and warns on
risky inputs, but the long-term hardening options are (a) constrain tenants to a
vetted palette, or (b) auto-darken a too-light brand to its nearest accessible
step. Pick one before onboarding paying tenants at scale.

---

## 8. Responsive breakpoints & motion

**Breakpoints** (min-width, mobile-first): `sm 640 · md 768 · lg 1024 · xl 1280 ·
2xl 1536 · 3xl 1920`. Design mobile-first; layer up. Mirrored in `tokens.ts`.

**Motion** ([`lib/theme/motion.ts`](../lib/theme/motion.ts)) — durations
(`fast 120ms · base 200ms · slow 320ms`) and easings mirror the CSS vars, so CSS
transitions and Framer Motion feel identical. Ready-made variants: `fadeIn`,
`fadeUp`, `fadeDown`, `scaleIn`, `pageTransition`, `drawer/modal/dropdownTransition`,
`staggerContainer`. Variants are plain objects (zero dependency); pass them to
`<motion.*>` once `framer-motion` is installed. Principle: fast, smooth, natural —
springs reserved for delight, never blocking functional UI.

---

## 9. Verification

- **Contrast:** every default pairing is checked programmatically (15 pairings,
  including the deliberate "white-on-lime fails" guard). Re-run before shipping
  palette changes.
- **Build/type-check:** `npm run build` and `npx tsc --noEmit` must pass.

---

## 10. What's next (not in this pass)

`cn()` upgrade to `clsx` + `tailwind-merge` when shadcn/ui lands · core component
contracts (Button, Input, Select, …) consuming only semantic tokens · real-estate
components (PropertyCard, AgentCard, LeadPipeline) · marketplace block system
(Header/Hero/Feature/CTA/Footer blocks, all themeable) · a token codegen step so
`globals.css` and `tokens.ts` derive from one source.

---

## 11. Component library decision — shadcn/ui only (Untitled UI descoped)

The original foundation brief listed "shadcn/ui + **Untitled UI**." Untitled UI is
a commercial, licensed Figma/React kit; it was never added to the repo and pulling
it in requires a license we do not hold. **Decision: the design system standardizes
on shadcn/ui alone.** shadcn is fully wired (`packages/ui/components.json`,
new-york style, `@estatify/*` aliases, tokens sourced from
`packages/design-system/src/styles/tokens.css`).

What this means in practice:

- Untitled UI's *influence* stays where it already is — the shadow ramp in §5 keeps
  the "Untitled-UI-style" low-spread, layered look, expressed purely through our own
  tokens. No third-party code or license is involved.
- Components are built on shadcn primitives + Radix, styled exclusively via the
  semantic token layer (§2), so nothing is coupled to a vendor kit.
- If Untitled UI is licensed later, it can be layered on top without rework: its
  components would consume the same semantic tokens. Re-open this decision then.

> Note: §2 and §7 above reference legacy paths (`app/globals.css`, `lib/theme/*`)
> from before the design system moved into `packages/design-system/`. The
> canonical locations are now `packages/design-system/src/styles/tokens.css` and
> `packages/design-system/src/theme/*`. Doc paths to be reconciled in a docs pass.

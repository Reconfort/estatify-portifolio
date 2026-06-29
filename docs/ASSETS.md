# Estatify Asset & Media Architecture

Every asset has one owner, one import path, and an optimization story. This
document is the enforcement standard. It complements [ARCHITECTURE.md](./ARCHITECTURE.md).

## Ownership map (where does an asset go?)

| Asset kind | Home | Import |
| --- | --- | --- |
| Platform branding (logos, favicons, OG/social, official illustrations) | `packages/branding` | `@estatify/branding` |
| Reusable non-branded media (default avatar, placeholders, empty/loading states) | `packages/media` | `@estatify/media` |
| Icons | `packages/ui/src/icons.ts` | `@estatify/ui/icons` |
| Image component | `packages/ui/src/app-image.tsx` | `@estatify/ui/image` |
| Fonts, tokens, themes, motion | `packages/design-system` | `@estatify/design-system/*` |
| App-specific assets (this app only) | `apps/<app>/public` | `/path` (same app only) |
| Tenant uploads (property photos, agency logos, PDFs) | **Object storage (R2/S3/GCS)** | URL in DB — never Git |

Decision rule before adding any asset: **determine owner → check it doesn't
already exist → reuse → place in the correct package → export via index → import
via alias → optimize.** No generic `packages/assets`. No duplicate assets across
apps — if an app asset becomes shared, move it into `branding` or `media`.

## Icons

Apps import icons **only** from `@estatify/ui/icons`, never from a library
directly. The barrel re-exports the icons we use from lucide under Estatify names
(`ListingsIcon`, `LeadsIcon`, …); the underlying library can be swapped without
touching app code. Add an icon by re-exporting it in `icons.ts`.

```tsx
import { ListingsIcon } from "@estatify/ui/icons"; // ✅
import { LayoutGrid } from "lucide-react";          // ❌ never in apps/features
```

> Design choice: a **curated re-export**, not hand-wrapped components. Wrapping
> 1000+ icons by hand is unmaintainable and breaks tree-shaking; the barrel gives
> the same abstraction boundary at near-zero cost.

## Images

Never use raw `<img>` or raw `next/image` in apps. Use the shared abstraction:

```tsx
import { AppImage } from "@estatify/ui/image";

<AppImage src="/assets/hero.jpg" alt="" fill priority sizes="100vw" />
```

`AppImage` wraps `next/image` and adds fade-in on load (skipped for `priority`),
an error fallback (`fallbackSrc`), and passes through every next/image feature
(responsive `sizes`, lazy, `fill`, blur). Apps never implement optimization
themselves. Prefer WebP/AVIF, always set `alt` (`""` if decorative) and `sizes`.

## Fonts

Initialized **once** in `packages/design-system/src/fonts.ts` and consumed by
every app's root layout. Apps never call `next/font` themselves.

```tsx
import { fontVariables } from "@estatify/design-system/fonts";
<html className={fontVariables}> // wires --font-rubik / --font-geist-mono
```

## Tenant assets

Tenant uploads (property images, agency logos, floor plans, documents) **never**
enter Git. They go to object storage (Cloudflare R2 / S3 / GCS); only metadata +
URLs live in the database, served via CDN. This keeps the repo small and supports
versioned, per-tenant, white-label delivery without architectural change.

## Boundaries & imports

- Import only through workspace aliases — never deep relative paths
  (`../../../assets/...` is banned).
- `branding` and `media` are `scope:shared, type:ui`; any app or feature may
  import them. App `public/` assets are private to that app.
- Naming is descriptive: `EstatifyLogo`, `PropertyPlaceholder`, `DefaultAvatar`
  — never `logo2`, `image1`, `hero-new`.

## Activation note

`@estatify/branding` and `@estatify/media` are new workspaces — run `npm install`
once to link them before importing. They ship as skeletons; add real assets and
re-export them from each package's `src/index.ts`.

# Estatify — Foundation Scaffold (run locally)

Companion to [ARCHITECTURE.md](./ARCHITECTURE.md). Execute on a machine with
network access. Commands are canonical; **verify exact flags against the
`@nx/next` version you install** (Nx generator flags shift between majors).

Prereqs: **Node 20+**, npm (or pnpm), git clean working tree.

---

## Phase 1 — Wrap Nx around the existing app (non-destructive)

`nx init` adds Nx to the current repo *in place*. The existing Next app keeps
working; you gain caching, the project graph, and task running immediately.

```bash
# from repo root (the existing flat Next app)
git checkout -b chore/nx-foundation
npx nx@latest init          # detects Next.js, adds nx.json, infers tasks
npx nx graph                # sanity: one app node appears
```

Then add the plugins the foundation needs:

```bash
npm i -D @nx/next @nx/nest @nx/eslint @nx/eslint-plugin @nx/js prettier
# pin @nx/* to the SAME version as the installed `nx`
```

> The existing app stays at the root for now. It is migrated into `apps/marketing`
> in Phase 2, Step 5 — as a discrete, reviewable commit, not a big-bang move.

---

## Phase 2 — Generate apps and libraries

```bash
# --- Apps -------------------------------------------------------------------
npx nx g @nx/next:app apps/workspace --style=css --appDir=true --src=false
npx nx g @nx/next:app apps/platform  --style=css --appDir=true --src=false
npx nx g @nx/next:app apps/sites     --style=css --appDir=true --src=false
npx nx g @nx/nest:app apps/api

# --- Shared libraries (type:ui / data-access / util) ------------------------
npx nx g @nx/js:lib packages/design-system --bundler=none
npx nx g @nx/js:lib packages/ui            --bundler=none
npx nx g @nx/js:lib packages/providers     --bundler=none
npx nx g @nx/js:lib packages/hooks         --bundler=none
npx nx g @nx/js:lib packages/auth          --bundler=none
npx nx g @nx/js:lib packages/api-client    --bundler=none
npx nx g @nx/js:lib packages/types         --bundler=none
npx nx g @nx/js:lib packages/config        --bundler=none
npx nx g @nx/js:lib packages/utils         --bundler=none
npx nx g @nx/js:lib packages/database      --bundler=none

# --- Feature libraries (type:feature) — one per domain ----------------------
npx nx g @nx/js:lib packages/feature-property        --bundler=none
npx nx g @nx/js:lib packages/feature-lead            --bundler=none
npx nx g @nx/js:lib packages/feature-agent           --bundler=none
npx nx g @nx/js:lib packages/feature-branding        --bundler=none
npx nx g @nx/js:lib packages/feature-analytics       --bundler=none
npx nx g @nx/js:lib packages/feature-billing         --bundler=none
npx nx g @nx/js:lib packages/feature-tenant-runtime  --bundler=none
npx nx g @nx/js:lib packages/feature-tenant-admin    --bundler=none
npx nx g @nx/js:lib packages/feature-templates       --bundler=none
npx nx g @nx/js:lib packages/feature-subscriptions   --bundler=none
```

**Step 5 — migrate the existing app into `apps/marketing`** (separate commit):

```bash
npx nx g @nx/next:app apps/marketing --style=css --appDir=true --src=false
# move existing app/ + public/ content into apps/marketing/, delete root app shell,
# update imports to @estatify/* aliases, then:
npx nx build marketing
```

Move the design tokens we already built into the design-system library:

```bash
# app/globals.css                -> packages/design-system/src/styles/globals.css
# lib/theme/{tokens,contrast,white-label,motion}.ts -> packages/design-system/src/theme/
# lib/utils.ts                   -> packages/utils/src/cn.ts
```

---

## Root configs (hand-authored)

### `tsconfig.base.json` — path aliases (single import surface)

```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "baseUrl": ".",
    "paths": {
      "@estatify/design-system": ["packages/design-system/src/index.ts"],
      "@estatify/ui": ["packages/ui/src/index.ts"],
      "@estatify/providers": ["packages/providers/src/index.ts"],
      "@estatify/hooks": ["packages/hooks/src/index.ts"],
      "@estatify/auth": ["packages/auth/src/index.ts"],
      "@estatify/api-client": ["packages/api-client/src/index.ts"],
      "@estatify/types": ["packages/types/src/index.ts"],
      "@estatify/config": ["packages/config/src/index.ts"],
      "@estatify/utils": ["packages/utils/src/index.ts"],
      "@estatify/database": ["packages/database/src/index.ts"],
      "@estatify/feature-property": ["packages/feature-property/src/index.ts"],
      "@estatify/feature-lead": ["packages/feature-lead/src/index.ts"],
      "@estatify/feature-agent": ["packages/feature-agent/src/index.ts"],
      "@estatify/feature-branding": ["packages/feature-branding/src/index.ts"],
      "@estatify/feature-analytics": ["packages/feature-analytics/src/index.ts"],
      "@estatify/feature-billing": ["packages/feature-billing/src/index.ts"],
      "@estatify/feature-tenant-runtime": ["packages/feature-tenant-runtime/src/index.ts"],
      "@estatify/feature-tenant-admin": ["packages/feature-tenant-admin/src/index.ts"],
      "@estatify/feature-templates": ["packages/feature-templates/src/index.ts"],
      "@estatify/feature-subscriptions": ["packages/feature-subscriptions/src/index.ts"]
    }
  }
}
```

> `strict` + the four extra flags enforce the spec's "strict TS, no `any`." Turn
> them on at the foundation — retrofitting them across hundreds of files later is
> far more expensive.

### `nx.json` — core knobs

```jsonc
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "namedInputs": {
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "production": ["default", "!{projectRoot}/**/*.spec.ts", "!{projectRoot}/**/*.test.ts"]
  },
  "targetDefaults": {
    "build":     { "cache": true, "dependsOn": ["^build"], "inputs": ["production", "^production"] },
    "lint":      { "cache": true },
    "typecheck": { "cache": true },
    "test":      { "cache": true }
  }
}
```

### Project tags (set in each project's `project.json`)

Tags drive the boundary rules in ARCHITECTURE.md ADR-006.

| Project | `tags` |
| --- | --- |
| apps/marketing | `scope:marketing`, `type:app` |
| apps/workspace | `scope:workspace`, `type:app` |
| apps/platform | `scope:platform`, `type:app` |
| apps/sites | `scope:sites`, `type:app` |
| apps/api | `scope:api`, `type:app` |
| design-system, ui, providers | `scope:shared`, `type:ui` |
| hooks, utils, types, config | `scope:shared`, `type:util` |
| auth, api-client | `scope:shared`, `type:data-access` |
| database | `scope:api`, `type:data-access` |
| feature-property, feature-agent, feature-analytics | `scope:shared`, `type:feature` |
| feature-lead, feature-branding, feature-billing | `scope:workspace`, `type:feature` |
| feature-tenant-runtime | `scope:sites`, `type:feature` |
| feature-tenant-admin, feature-templates, feature-subscriptions | `scope:platform`, `type:feature` |

> `feature-templates` is consumed by both `platform` and `sites`. If you keep it
> `scope:platform`, `sites` can't import it. Either promote it to `scope:shared`
> or split the shared read-model into a `scope:shared` lib. Decide before wiring.

### ESLint — module boundaries (root flat config)

```js
// eslint.config.mjs (excerpt)
import nx from "@nx/eslint-plugin";

export default [
  ...nx.configs["flat/base"],
  ...nx.configs["flat/typescript"],
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@nx/enforce-module-boundaries": ["error", {
        enforceBuildableLibDependency: true,
        allow: [],
        depConstraints: [
          { sourceTag: "scope:marketing", onlyDependOnLibsWithTags: ["scope:marketing", "scope:shared"] },
          { sourceTag: "scope:workspace", onlyDependOnLibsWithTags: ["scope:workspace", "scope:shared"] },
          { sourceTag: "scope:platform",  onlyDependOnLibsWithTags: ["scope:platform", "scope:shared"] },
          { sourceTag: "scope:sites",     onlyDependOnLibsWithTags: ["scope:sites", "scope:shared"] },
          { sourceTag: "scope:api",       onlyDependOnLibsWithTags: ["scope:api", "scope:shared"] },
          { sourceTag: "scope:shared",    onlyDependOnLibsWithTags: ["scope:shared"] },
          { sourceTag: "type:app",         onlyDependOnLibsWithTags: ["type:feature", "type:ui", "type:data-access", "type:util"] },
          { sourceTag: "type:feature",     onlyDependOnLibsWithTags: ["type:feature", "type:ui", "type:data-access", "type:util"] },
          { sourceTag: "type:ui",          onlyDependOnLibsWithTags: ["type:ui", "type:util"] },
          { sourceTag: "type:data-access", onlyDependOnLibsWithTags: ["type:data-access", "type:util"] },
          { sourceTag: "type:util",        onlyDependOnLibsWithTags: ["type:util"] }
        ]
      }]
    }
  }
];
```

### Prettier — `.prettierrc`

```json
{ "semi": true, "singleQuote": false, "printWidth": 100, "trailingComma": "all" }
```

---

## Phase 3 — Design system + shadcn/ui

```bash
# Tailwind v4 is already configured; reuse the design-system globals.css.
# Initialize shadcn against packages/ui, pointing at design-system tokens.
npx shadcn@latest init        # in packages/ui — set components dir + tokens path
```

Components reference **semantic tokens only** (`bg-primary`,
`text-accent-foreground`). Verify dark mode by toggling `.dark` on `<html>` in
each app shell (already supported by the token layer).

---

## Phase 4 — Providers, auth, layouts

- `packages/providers`: `QueryClientProvider` (TanStack Query), `ThemeProvider`,
  `TenantProvider` (reads `x-tenant-id` for `sites`). Apps wrap their root layout.
- `packages/auth`: session/token handling + RBAC guard primitives (client). Server
  enforcement lives in `apps/api`.
- `packages/config`: zod-validated env, imported at each app's boot — fail fast.

---

## Phase 5 — Verify (the only source of "it works")

```bash
npx nx graph                          # structure matches ARCHITECTURE.md
npx nx run-many -t lint               # boundary violations fail
npx nx run-many -t typecheck
npx nx run-many -t build              # each app builds independently
npx nx affected -t build --base=main  # affected graph works
```

**Boundary smoke test** — prove enforcement is real: add
`import { prisma } from "@estatify/database"` inside `apps/workspace`, run
`npx nx lint workspace`, confirm it **errors**, then revert.

Do not start business features until all of the above is green.

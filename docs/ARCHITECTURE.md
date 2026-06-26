# Estatify Platform Architecture — Foundation (Phase 0)

Status: **Proposed / awaiting local execution**
Owner: Platform Engineering
Last updated: 2026-06-26

This document is the architectural contract for the Estatify platform foundation.
It is intentionally a decision record, not a tutorial. It locks the structural
choices, justifies them against the 5–10 year scale target (1M+ users, 100k+
agencies, millions of properties, thousands of branded sites, hundreds of devs),
and gives the **exact, runnable scaffold** to execute on a developer machine.

> **Why no code was committed in this pass.** Nx scaffolding (`create-nx-workspace`,
> `nx generate`, `npm install`, shadcn CLI) requires registry access that the
> authoring sandbox does not have. Every command and config below is authored to
> be copy-paste runnable locally; the verification steps in §12 must be run on a
> machine with network access. No build/lint result in this document is claimed
> as "passed" — those are yours to confirm.

---

## 0. Decisions locked

| # | Decision | Choice |
| --- | --- | --- |
| D1 | Monorepo tool | **Nx**, adopted incrementally via `nx init` around the existing app |
| D2 | App topology | **5 apps**: `marketing`, `workspace`, `platform`, `api`, `sites` |
| D3 | Backend home | **`apps/api` (NestJS)** in-monorepo; shares contracts with frontends |
| D4 | Tenant website serving | **Single multi-tenant runtime** (`apps/sites`), host→tenant→theme→template→render |
| D5 | Tenant data isolation | **Shared Postgres + Row-Level Security** (tenant_id), escalation path to dedicated DB for enterprise tenants |
| D6 | Feature code | **One buildable library per feature domain** — not a single `features` package |
| D7 | Existing flat app | **Wrapped, not rewritten** — `nx init` first, migrate into `apps/marketing` as a discrete step |
| D8 | Design system | Existing token engine folds into **`packages/design-system`**; dark mode is already day-one |

---

## ADR-001 — Monorepo tooling: Nx, incrementally adopted

**Context.** Hundreds of developers, multiple deployables, heavy code sharing,
and a hard requirement to *enforce* architectural boundaries (the spec's "never
duplicate code," "feature-first," "single responsibility").

**Decision.** Use **Nx**. Adopt it with `nx init` over the existing repository
rather than scaffolding a fresh workspace and porting — per D7.

**Why Nx over Turborepo.** Both are valid; the deciding factor is *enforcement*.
Turborepo gives task orchestration and caching but no built-in module-boundary
enforcement — boundaries become tribal knowledge. Nx ships
`@nx/enforce-module-boundaries`, project tagging, an affected-graph, and
generators that keep 100s of developers on rails. At this org size, machine-
enforced boundaries are worth Nx's extra configuration weight and steeper
learning curve. That weight is the real cost; budget for an Nx champion on the
platform team and be deliberate about Nx Cloud (caching/CI) adoption.

**Consequences.**
- ✅ Enforced boundaries, affected-only CI, consistent generators, single dependency graph.
- ⚠️ More configuration surface; team must learn Nx tags and executors.
- ⚠️ Next.js 16 makes **Turbopack the default bundler** and requires **Node 20+**.
  `@nx/next` infers build/dev/start tasks from each app's Next config — pin
  `@nx/next` to the exact `nx` version you install.

---

## ADR-002 — Application topology (5 apps)

The spec's three apps cannot serve the product: nothing renders the published
branded tenant websites, and the security requirements have no server home. The
foundation therefore defines **five** apps.

```
apps/
├── marketing/   Next.js  — public site: estatify.com (landing, pricing, docs, blog, auth entry, SEO)
├── workspace/   Next.js  — customer SaaS: workspace.estatify.com (auth-gated dashboard)
├── platform/    Next.js  — internal admin: platform.estatify.com (Estatify staff only)
├── api/         NestJS   — the single backend: api.estatify.com (REST/RPC, the only DB writer)
└── sites/       Next.js  — multi-tenant WEBSITE RUNTIME: serves every tenant domain
```

**Domain → app routing**

| Host | App | Audience |
| --- | --- | --- |
| `estatify.com` | marketing | public / prospects |
| `workspace.estatify.com` | workspace | authenticated agency staff |
| `platform.estatify.com` | platform | Estatify employees |
| `api.estatify.com` | api | service-to-service + app clients |
| `coolagency.com`, `homes.rw`, `abc.estatify.com` | **sites** | the tenant's public visitors |

**Why separate apps, not one app with route groups.** Independent deploy
cadence, blast-radius isolation (a marketing deploy can't take down the
dashboard), distinct auth surfaces (public vs staff vs visitor), and separate
performance budgets. Shared logic lives in `packages/*`, so separation costs no
duplication.

---

## ADR-003 — Multi-tenancy: one runtime, isolated data (the core decision)

This is the highest-leverage decision in the platform. It has two halves:
**how tenant sites are served**, and **how tenant data is isolated**.

### 3a. Serving model — single runtime (Shopify/Webflow pattern)

One `apps/sites` deployment serves all tenant domains. There is **no deploy per
tenant**. Every request flows through middleware:

```
Request → host header → resolve tenant (cache) → load theme + template + data → render
```

```ts
// apps/sites/middleware.ts  (sketch — Next.js 16 middleware, runs at the edge)
import { NextResponse, type NextRequest } from "next/server";
import { resolveTenantByHost } from "@estatify/feature-tenant-runtime/server";

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host")?.split(":")[0] ?? "";
  const tenant = await resolveTenantByHost(host); // Redis/edge-cached, ~O(1)
  if (!tenant) return NextResponse.rewrite(new URL("/404", req.url));

  const res = NextResponse.next();
  res.headers.set("x-tenant-id", tenant.id);   // downstream RSC reads this
  res.headers.set("x-tenant-status", tenant.status);
  return res;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
```

**Domain handling.** Two classes: `*.estatify.com` subdomains (wildcard DNS,
zero-config) and custom domains (`coolagency.com`, via tenant-provided CNAME +
automated TLS through the hosting provider). The tenant lookup table maps both.

**Theming.** A tenant's brand renders through the white-label engine already
built (`packages/design-system`): `tenantThemeToCssText(config)` is injected
per-tenant at render time, so one runtime produces thousands of distinct brands
with no per-tenant CSS files.

**Templates.** Pages are **data-driven block trees** (Header/Hero/Feature/
Property/Testimonial/CTA/Footer blocks), not bespoke React per tenant. The
template marketplace is a catalog of block compositions. This is what makes
"thousands of websites" a data problem, not a code problem.

**Caching.** Per-tenant ISR keyed by `tenant.id` + path, with **on-demand
revalidation** triggered when a tenant publishes (webhook from `api` → `sites`
revalidate). Tenant resolution is cached in Redis with short TTL + publish-time
invalidation. Never render a tenant site without a cache layer in front of the
tenant lookup — it is on the hot path of every request.

### 3b. Data isolation — shared Postgres + Row-Level Security

| Option | Isolation | Cost at 100k tenants | Verdict |
| --- | --- | --- | --- |
| Shared DB, `tenant_id` + **RLS** | Strong (DB-enforced) | One schema, normal migrations | ✅ **Default** |
| Schema-per-tenant | Stronger | 100k schemas; migrations become an ops nightmare | ✗ |
| Database-per-tenant | Strongest | Unsustainable at this count | Enterprise-tier only |

**Decision.** Shared database with a `tenant_id` on every tenant-scoped table and
**Postgres Row-Level Security** policies. The app sets the current tenant per
request/connection (`SET app.current_tenant = '<id>'`), and RLS guarantees a
query can never read across tenants **even if application code has a bug**. App-
level `WHERE tenant_id = ?` is defense-in-depth, not the primary control.

```sql
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON properties
  USING (tenant_id = current_setting('app.current_tenant')::uuid);
```

Enforced centrally in a Prisma extension / NestJS interceptor that reads the
authenticated tenant and sets the GUC before any query runs. **Escalation path:**
isolate the largest enterprise tenants into a dedicated database later by routing
on `tenant_id` — the RLS model makes that migration additive, not a rewrite.

**Hard rule:** `packages/database` (Prisma) is importable **only by `apps/api`**.
No frontend ever imports the Prisma client. Frontends use `packages/api-client`.
This is enforced by module boundaries (ADR-006).

---

## ADR-004 — Library taxonomy: one library per feature domain

**Reject** a single `packages/features`. At hundreds of developers it becomes a
merge-conflict and ownership bottleneck and defeats Nx boundaries. **Adopt** one
buildable library per feature domain, each independently tagged, owned
(CODEOWNERS), and testable.

```
packages/
├── design-system/     type:ui     scope:shared   tokens + theme engine (folds in existing work)
├── ui/                type:ui     scope:shared   shadcn/ui primitives (presentational only)
├── providers/         type:ui     scope:shared   React context providers (Query, Theme, Tenant)
├── hooks/             type:util   scope:shared   cross-cutting React hooks
├── auth/              type:data-access scope:shared  session/token, guards, RBAC primitives (client side)
├── api-client/        type:data-access scope:shared  typed client + TanStack Query hooks
├── types/             type:util   scope:shared   shared DTO/contract types (the API boundary)
├── config/            type:util   scope:shared   env schema (zod), runtime config
├── utils/             type:util   scope:shared   pure helpers
├── database/          type:data-access scope:api  Prisma schema + client — API-ONLY
└── feature-*/         type:feature                one per domain (see below)
```

**Feature libraries** (each owns the full vertical slice, internal structure per
the spec: `components/ hooks/ types/ schemas/ services/ constants/ utils/`):

| Library | Scope | Consumed by |
| --- | --- | --- |
| `feature-property` | shared | workspace, sites |
| `feature-lead` | workspace | workspace |
| `feature-agent` | shared | workspace, sites |
| `feature-branding` | workspace | workspace |
| `feature-analytics` | shared | workspace, platform |
| `feature-billing` | workspace | workspace |
| `feature-tenant-runtime` | sites | sites (host resolution, block rendering) |
| `feature-tenant-admin` | platform | platform |
| `feature-templates` | platform | platform, sites |
| `feature-subscriptions` | platform | platform |

Granularity rule: a feature library = a **domain bounded context**, not a single
screen. Split when ownership or deploy/test boundaries demand it, not before
(KISS / avoid premature abstraction).

---

## ADR-005 — Library *types* and the separation it enforces

Every library is one of five types; the type dictates what it may contain and
what it may import:

- **type:ui** — presentation only. No data fetching, no business logic. (`ui`, `design-system`, `providers`)
- **type:feature** — composes ui + data-access into a domain experience. The only place business UI logic lives.
- **type:data-access** — server/client data and state. (`api-client`, `auth`, `database`)
- **type:util** — pure, dependency-light helpers and types. (`utils`, `types`, `config`, `hooks`)
- **type:app** — deployable; composes features. Thin.

This is the structural answer to the spec's "separate presentation / logic /
data / state" and "no giant components."

---

## ADR-006 — Module boundaries (machine-enforced)

Two-dimensional tags — **scope** (who owns it) and **type** (what it is) — drive
`@nx/enforce-module-boundaries`. The rules below are the enforcement contract.

```jsonc
// eslint config (root) — @nx/enforce-module-boundaries
{
  "depConstraints": [
    // scope: an app's libs may only use their own scope + shared
    { "sourceTag": "scope:marketing", "onlyDependOnLibsWithTags": ["scope:marketing", "scope:shared"] },
    { "sourceTag": "scope:workspace", "onlyDependOnLibsWithTags": ["scope:workspace", "scope:shared"] },
    { "sourceTag": "scope:platform",  "onlyDependOnLibsWithTags": ["scope:platform", "scope:shared"] },
    { "sourceTag": "scope:sites",     "onlyDependOnLibsWithTags": ["scope:sites", "scope:shared"] },
    { "sourceTag": "scope:api",       "onlyDependOnLibsWithTags": ["scope:api", "scope:shared"] },
    { "sourceTag": "scope:shared",    "onlyDependOnLibsWithTags": ["scope:shared"] },

    // type: layered dependency direction
    { "sourceTag": "type:app",         "onlyDependOnLibsWithTags": ["type:feature", "type:ui", "type:data-access", "type:util"] },
    { "sourceTag": "type:feature",     "onlyDependOnLibsWithTags": ["type:feature", "type:ui", "type:data-access", "type:util"] },
    { "sourceTag": "type:ui",          "onlyDependOnLibsWithTags": ["type:ui", "type:util"] },
    { "sourceTag": "type:data-access", "onlyDependOnLibsWithTags": ["type:data-access", "type:util"] },
    { "sourceTag": "type:util",        "onlyDependOnLibsWithTags": ["type:util"] }
  ]
}
```

Key invariants this buys you, automatically failing CI on violation:
- A **frontend can never import `database`** (Prisma) — wrong scope + wrong layer.
- A **ui library can never fetch data** — `type:ui` can't depend on `type:data-access`.
- **No cross-app coupling** — `scope:workspace` code can't reach into `scope:platform`.
- Shared code stays genuinely shared (`scope:shared` depends only on shared).

---

## ADR-007 — Design system placement & dark mode

The existing token foundation (`app/globals.css`, `lib/theme/*`, the white-label
engine, the WCAG two-anchor color model — deep green action color, lime as
ink-only accent) moves into **`packages/design-system`** essentially unchanged.
Dark mode already works via the class strategy and the `.dark` semantic layer, so
"dark mode from day one" is satisfied by construction.

`packages/ui` hosts shadcn/ui primitives, configured (`components.json`) to read
the design-system tokens — components reference **only** semantic tokens
(`bg-primary`, `text-accent-foreground`), never raw values. `feature-*` libraries
compose `ui` + `api-client`; apps compose features.

---

## ADR-008 — Security seams (placed now, implemented later)

The spec's security requirements map to specific homes so they are not
afterthoughts:

| Concern | Home |
| --- | --- |
| Authentication | `apps/api` (issues sessions/tokens) + `packages/auth` (client guards) |
| Authorization / RBAC | `packages/auth` primitives; enforced in `apps/api` interceptors |
| Tenant isolation | Postgres RLS + `apps/api` per-request tenant GUC (ADR-003b) |
| Validation / sanitization | `zod` schemas in `packages/types` (shared client+server) |
| Rate limiting | `apps/api` (per-tenant + per-IP); edge throttling on `sites` |
| Secrets / env | `packages/config` (zod-validated env, fail-fast at boot) |

Validation contract: one zod schema in `packages/types` is the single source of
truth for a DTO, imported by both `api` (server validation) and the frontends
(form validation via React Hook Form). No duplicated interfaces — satisfies the
spec's "no duplicated interfaces" and "validate everything."

---

## State management (per spec, placed)

- **Server state → TanStack Query**, centralized in `packages/api-client` as typed
  hooks (`useProperties`, `useLeads`…). Apps never call `fetch` directly.
- **Client UI state → Zustand**, in the owning `feature-*` library (or `packages/
  hooks` if cross-cutting). Never mirror server data into Zustand — query cache is
  the source of truth. This is the structural guard against the spec's "never
  duplicate state."

---

## §11 — Runnable scaffold (execute locally)

See [SCAFFOLD.md](./SCAFFOLD.md) for the exact command sequence, hand-authored
root configs (`nx.json`, `tsconfig.base.json`, ESLint boundaries), the project
tags table, and the incremental migration path for the existing app.

---

## §12 — Verification checklist (run on your machine)

1. `node -v` → 20+ (Next 16 requirement).
2. `npx nx graph` → visually confirm the dependency graph matches this document.
3. `npx nx run-many -t lint` → boundary violations fail here.
4. `npx nx run-many -t typecheck` → strict TS, no `any`.
5. `npx nx run-many -t build` → every app builds independently.
6. `npx nx affected -t build --base=main` → affected-graph works.
7. Confirm a deliberate bad import (frontend → `@estatify/database`) **fails** lint.

---

## §13 — Deliberately deferred (not in foundation)

Business features (CRUD, dashboards), the template-marketplace block catalog,
billing integration, the RLS policy set for every table, CI pipeline wiring, and
Nx Cloud setup. These sit on top of this foundation and must not start until §12
passes.

---

## Open risks

1. **White-label WCAG guarantee is still soft** (carried from the design-system
   pass) — constrain tenant palettes or auto-darken before paid onboarding.
2. **Tenant resolution is on every `sites` request** — the Redis/edge cache is
   load-bearing; design its invalidation before launch, not after.
3. **Nx learning curve** — without an Nx owner, boundary configs rot. Assign one.
4. **`apps/api` + frontends in one repo** can blur the deploy story — keep
   pipelines per-project (Nx affected) so a frontend change never redeploys the API.
```

Sources: [Next.js Plugin for Nx](https://nx.dev/docs/technologies/react/next), [Add Nx to an Existing Project](https://nx.dev/docs/getting-started/start-with-existing-project), [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16)

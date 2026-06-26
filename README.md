# Estatify

Multi-tenant real estate SaaS platform. Nx + npm-workspaces monorepo.
Next.js 16 · React 19 · TypeScript · Tailwind v4 · NestJS.

Architecture: [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) ·
Scaffold/commands: [`docs/SCAFFOLD.md`](./docs/SCAFFOLD.md) ·
Design system: [`docs/DESIGN-SYSTEM.md`](./docs/DESIGN-SYSTEM.md)

## Structure

```
apps/
├── marketing/   estatify.com               public site
├── workspace/   workspace.estatify.com     customer SaaS
├── platform/    platform.estatify.com      internal admin
├── sites/       *.tenant domains           multi-tenant website runtime
└── api/         api.estatify.com           NestJS — single backend / only DB writer

packages/
├── design-system/  tokens + white-label theme engine (type:ui, scope:shared)
├── ui/             shadcn/ui primitives
├── providers/  hooks/  utils/  types/  config/   shared foundations
├── auth/  api-client/                              data-access (shared)
├── database/                                       Prisma — API-only
└── feature-*/                                      one library per domain
```

Module boundaries (scope + type tags) are enforced by ESLint — see ARCHITECTURE.md ADR-006.

## First-time setup (run locally — required)

This tree was authored without a network connection, so dependencies are **not
installed** and nothing has been build-verified. Bring it to life:

```bash
node -v                 # must be 20+
npm install             # installs workspaces; regenerates package-lock.json

# align Nx + plugins to a single matching version, then let Nx wire inference:
npx nx@latest init      # adopts the existing layout; confirm detected projects
npx nx report           # pin nx + @nx/* to the same version in package.json

npm run graph           # visual dependency graph — confirm it matches the docs
npm run lint            # boundary violations fail here
npm run typecheck
npm run build           # each app builds independently
```

Per-app dev: `npm run dev:marketing` · `dev:workspace` · `dev:platform` ·
`dev:sites` · `dev:api`.

## Known follow-ups (see end of ARCHITECTURE.md)

- `nx`/`@nx/*` are pinned to `latest` in `package.json` — replace with the exact
  resolved version after `npm install` (`npx nx report`).
- Tailwind v4 cross-package scanning uses an `@source` directive in each app's
  `globals.css`; verify class detection after the first `npm run build`.
- Feature/UI packages are documented stubs (`export {}`) — real domain code lands
  on top of this foundation, not before `npm run lint/build` is green.

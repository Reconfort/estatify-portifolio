# Runbook — Auth & Multi-Tenancy (local bring-up)

Everything below runs on YOUR machine (the authoring sandbox has no registry
access or native build, so nothing here has been executed — these are the exact
steps + the verification that closes Milestone 2's exit criteria).

## 1. Install + infrastructure

```bash
pnpm install                      # generates pnpm-lock.yaml, installs husky
docker compose up -d              # Postgres (+ estatify_app role), Redis, Mailpit
cp .env.example .env              # defaults already point at the compose services
```

Mailpit UI (captured dev emails): http://localhost:8025

## 2. Database: migrate, apply RLS, seed

```bash
# 2a. Base schema (runs as the OWNER via DATABASE_DIRECT_URL)
pnpm --filter @estatify/database exec prisma migrate dev --name init

# 2b. RLS policies — create an empty migration, paste rls.sql into it, apply
pnpm --filter @estatify/database exec prisma migrate dev --create-only --name enable_rls
cat packages/database/prisma/rls.sql \
  >> packages/database/prisma/migrations/*_enable_rls/migration.sql
pnpm --filter @estatify/database exec prisma migrate dev

# 2c. Generate client + seed two isolated tenants
pnpm --filter @estatify/database run prisma:generate
pnpm --filter @estatify/database run seed
```

Seed logins (password `Password123!`): `owner@acme.test`, `owner@globex.test`,
and platform admin `staff@estatify.com`.

## 3. Run the API

```bash
pnpm dev:api        # http://localhost:4000  (health: GET /health)
```

Interactive API docs (Swagger UI): **http://localhost:4000/docs** ·
OpenAPI JSON: **http://localhost:4000/docs/json**. The schemas are generated from
the same zod definitions in `@estatify/types` that validate requests, so the docs
can't drift from the contract. Use the **Authorize** button (bearer `access-token`)
to try authenticated endpoints like `/auth/me`.

## 4. Verify exit criteria

```bash
# Criterion 1 — secure sign-in (register → me → login → refresh → logout)
pnpm --filter @estatify/api test -- auth

# Criterion 3 — isolation: RLS blocks cross-tenant access even with app filters removed
pnpm --filter @estatify/api run test:isolation
```

Smoke test by hand:

```bash
# Register an agency (creates tenant + agency + owner in one transaction)
curl -i -X POST localhost:4000/auth/register -H 'content-type: application/json' \
  -d '{"email":"you@acme.test","password":"correct horse battery","agencyName":"Acme","slug":"acme-hq"}'
# -> 201, JSON body has accessToken + user.activeTenant; Set-Cookie: refresh_token=...; HttpOnly

# Authenticated identity
curl localhost:4000/auth/me -H "Authorization: Bearer <accessToken>"
```

## 5. The invariant that makes isolation real

`DATABASE_URL` MUST use the `estatify_app` role (non-superuser). If you point the
API at the `postgres` superuser, RLS is bypassed and the isolation test will
FALSELY pass. The compose `init.sql` creates `estatify_app` for exactly this
reason; `DATABASE_DIRECT_URL` (owner) is used only for migrations.

## 6. Endpoints delivered

| Method | Path                        | Auth   | Purpose                               |
| ------ | --------------------------- | ------ | ------------------------------------- |
| POST   | `/auth/register`            | public | new agency + owner, auto-login        |
| POST   | `/auth/login`               | public | credentials → tokens                  |
| POST   | `/auth/refresh`             | cookie | rotate refresh, new access            |
| POST   | `/auth/logout`              | cookie | revoke session                        |
| GET    | `/auth/me`                  | bearer | current user + tenant context         |
| GET    | `/auth/verify-email`        | public | consume verification token            |
| POST   | `/auth/resend-verification` | public | new verification email                |
| POST   | `/auth/forgot-password`     | public | email reset link (always 200)         |
| POST   | `/auth/reset-password`      | public | set new password, revoke all sessions |

Frontend (workspace/platform auth UI + protected routes) is the next phase
(P6–P8) — the API above is what it will consume via `@estatify/api-client`.

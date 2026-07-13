-- =============================================================================
-- ROW-LEVEL SECURITY POLICIES  (exit criterion 3: no cross-tenant access)
-- =============================================================================
-- Apply as a dedicated Prisma migration AFTER the initial schema migration:
--
--   pnpm --filter @estatify/database exec prisma migrate dev --create-only --name enable_rls
--   # then paste this file's contents into the generated migration.sql and run:
--   pnpm --filter @estatify/database exec prisma migrate dev
--
-- INVARIANTS THAT MAKE THIS REAL:
--   1. The API connects as `estatify_app` (NOSUPERUSER, NOBYPASSRLS). A superuser
--      would bypass every policy below — see packages/database/docker/init.sql.
--   2. FORCE ROW LEVEL SECURITY subjects even the table OWNER to the policy, so a
--      stray owner-role query can't leak either.
--   3. The API sets `app.current_tenant` per request via SET LOCAL inside a
--      transaction (packages/database/src/tenant.ts). current_setting(..., true)
--      returns NULL when unset, so an unscoped query matches ZERO rows rather
--      than erroring — fail-closed.

-- ---- Agency ----------------------------------------------------------------
ALTER TABLE "Agency" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Agency" FORCE  ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "Agency"
  USING ("tenantId" = current_setting('app.current_tenant', true)::uuid)
  WITH CHECK ("tenantId" = current_setting('app.current_tenant', true)::uuid);

-- ---- Membership ------------------------------------------------------------
-- Two policies (permissive = OR'd):
--   tenant_isolation (FOR ALL): reads AND writes are confined to the current
--     tenant. This is what lets a tenant admin list "members of MY tenant" and
--     blocks writing memberships into another tenant.
--   member_self_read (FOR SELECT only): a user may always read THEIR OWN
--     membership rows across tenants (needed to build the tenant switcher /
--     /auth/me). It is SELECT-only on purpose — a self WITH CHECK would let a
--     user insert themselves into any tenant (privilege escalation).
ALTER TABLE "Membership" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Membership" FORCE  ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "Membership"
  FOR ALL
  USING ("tenantId" = current_setting('app.current_tenant', true)::uuid)
  WITH CHECK ("tenantId" = current_setting('app.current_tenant', true)::uuid);
CREATE POLICY member_self_read ON "Membership"
  FOR SELECT
  USING ("userId" = current_setting('app.current_user', true)::uuid);

-- ---- Invite ----------------------------------------------------------------
ALTER TABLE "Invite" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Invite" FORCE  ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "Invite"
  USING ("tenantId" = current_setting('app.current_tenant', true)::uuid)
  WITH CHECK ("tenantId" = current_setting('app.current_tenant', true)::uuid);

-- Every future tenant-scoped table (Property, Lead, ...) MUST add the same three
-- statements. A table without them is a data leak. Enforce this in code review
-- and in the isolation test suite (a table with a `tenantId` column but no RLS
-- policy should fail the check).

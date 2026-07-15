-- =============================================================================
-- ROW-LEVEL SECURITY POLICIES  (exit criterion 3: no cross-tenant access)
-- =============================================================================
-- Apply as a dedicated Prisma migration AFTER the initial schema migration.
--
-- INVARIANTS THAT MAKE THIS REAL:
--   1. The API connects as `estatify_app` (NOSUPERUSER, NOBYPASSRLS).
--   2. FORCE ROW LEVEL SECURITY subjects even the table OWNER to the policy.
--   3. The API sets `app.current_tenant` / `app.current_user` per request via
--      set_config(..., is_local => true) inside a transaction.
--   4. GUCs are cast with NULLIF(..., '')::uuid so an unset OR empty setting
--      becomes NULL (fail-closed) instead of throwing 22P02 on ''::uuid.
--      That matters for withUser() which binds only app.current_user.

-- ---- Agency ----------------------------------------------------------------
ALTER TABLE "Agency" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Agency" FORCE  ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "Agency"
  USING ("tenantId" = NULLIF(current_setting('app.current_tenant', true), '')::uuid)
  WITH CHECK ("tenantId" = NULLIF(current_setting('app.current_tenant', true), '')::uuid);

-- ---- Membership ------------------------------------------------------------
ALTER TABLE "Membership" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Membership" FORCE  ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "Membership"
  FOR ALL
  USING ("tenantId" = NULLIF(current_setting('app.current_tenant', true), '')::uuid)
  WITH CHECK ("tenantId" = NULLIF(current_setting('app.current_tenant', true), '')::uuid);
CREATE POLICY member_self_read ON "Membership"
  FOR SELECT
  USING ("userId" = NULLIF(current_setting('app.current_user', true), '')::uuid);

-- ---- Invite ----------------------------------------------------------------
ALTER TABLE "Invite" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Invite" FORCE  ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "Invite"
  USING ("tenantId" = NULLIF(current_setting('app.current_tenant', true), '')::uuid)
  WITH CHECK ("tenantId" = NULLIF(current_setting('app.current_tenant', true), '')::uuid);

-- =============================================================================
-- PLATFORM BYPASS  (Access Management — admins read/write across ALL tenants)
-- =============================================================================
-- Permissive policies are OR'd, so these ADD a second way a row is visible:
-- when `app.platform = 'on'`. That GUC is set ONLY inside withPlatform(), which
-- is only called from services behind PlatformGuard (authenticated + authorized
-- platform staff). Normal tenant requests never set it, so tenant isolation is
-- unchanged for customers. Apply as its own migration alongside the above.
CREATE POLICY platform_bypass ON "Agency" FOR ALL
  USING (current_setting('app.platform', true) = 'on')
  WITH CHECK (current_setting('app.platform', true) = 'on');
CREATE POLICY platform_bypass ON "Membership" FOR ALL
  USING (current_setting('app.platform', true) = 'on')
  WITH CHECK (current_setting('app.platform', true) = 'on');
CREATE POLICY platform_bypass ON "Invite" FOR ALL
  USING (current_setting('app.platform', true) = 'on')
  WITH CHECK (current_setting('app.platform', true) = 'on');

-- ---- AgencyConfiguration ---------------------------------------------------
ALTER TABLE "AgencyConfiguration" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AgencyConfiguration" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "AgencyConfiguration"
  USING ("tenantId" = NULLIF(current_setting('app.current_tenant', true), '')::uuid)
  WITH CHECK ("tenantId" = NULLIF(current_setting('app.current_tenant', true), '')::uuid);

-- ---- MediaAsset ------------------------------------------------------------
ALTER TABLE "MediaAsset" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MediaAsset" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "MediaAsset"
  USING ("tenantId" = NULLIF(current_setting('app.current_tenant', true), '')::uuid)
  WITH CHECK ("tenantId" = NULLIF(current_setting('app.current_tenant', true), '')::uuid);

CREATE POLICY platform_bypass ON "AgencyConfiguration" FOR ALL
  USING (current_setting('app.platform', true) = 'on')
  WITH CHECK (current_setting('app.platform', true) = 'on');
CREATE POLICY platform_bypass ON "MediaAsset" FOR ALL
  USING (current_setting('app.platform', true) = 'on')
  WITH CHECK (current_setting('app.platform', true) = 'on');

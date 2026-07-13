-- Fix: current_setting(..., true) can yield '' (empty string) rather than NULL.
-- Casting ''::uuid throws (22P02) and breaks login/refresh when only
-- app.current_user is bound (membership self-read via withUser).
-- NULLIF makes unset/empty GUCs evaluate to NULL → policy fails closed, no error.

DROP POLICY IF EXISTS tenant_isolation ON "Agency";
CREATE POLICY tenant_isolation ON "Agency"
  USING ("tenantId" = NULLIF(current_setting('app.current_tenant', true), '')::uuid)
  WITH CHECK ("tenantId" = NULLIF(current_setting('app.current_tenant', true), '')::uuid);

DROP POLICY IF EXISTS tenant_isolation ON "Membership";
DROP POLICY IF EXISTS member_self_read ON "Membership";
CREATE POLICY tenant_isolation ON "Membership"
  FOR ALL
  USING ("tenantId" = NULLIF(current_setting('app.current_tenant', true), '')::uuid)
  WITH CHECK ("tenantId" = NULLIF(current_setting('app.current_tenant', true), '')::uuid);
CREATE POLICY member_self_read ON "Membership"
  FOR SELECT
  USING ("userId" = NULLIF(current_setting('app.current_user', true), '')::uuid);

DROP POLICY IF EXISTS tenant_isolation ON "Invite";
CREATE POLICY tenant_isolation ON "Invite"
  USING ("tenantId" = NULLIF(current_setting('app.current_tenant', true), '')::uuid)
  WITH CHECK ("tenantId" = NULLIF(current_setting('app.current_tenant', true), '')::uuid);

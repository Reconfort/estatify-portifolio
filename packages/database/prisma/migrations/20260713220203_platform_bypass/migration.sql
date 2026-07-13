-- Platform-bypass RLS policies (Access Management admins read/write across all
-- tenants). Permissive → OR'd with tenant_isolation; only active when
-- app.platform = 'on', which is set solely inside withPlatform() behind
-- PlatformGuard.
CREATE POLICY platform_bypass ON "Agency" FOR ALL
  USING (current_setting('app.platform', true) = 'on')
  WITH CHECK (current_setting('app.platform', true) = 'on');
CREATE POLICY platform_bypass ON "Membership" FOR ALL
  USING (current_setting('app.platform', true) = 'on')
  WITH CHECK (current_setting('app.platform', true) = 'on');
CREATE POLICY platform_bypass ON "Invite" FOR ALL
  USING (current_setting('app.platform', true) = 'on')
  WITH CHECK (current_setting('app.platform', true) = 'on');

-- CreateTable
CREATE TABLE "TenantPreference" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "goals" JSONB NOT NULL DEFAULT '[]',
    "completedAt" TIMESTAMP(3),
    "completedBy" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TenantPreference_tenantId_key" ON "TenantPreference"("tenantId");

-- CreateIndex
CREATE INDEX "TenantPreference_tenantId_idx" ON "TenantPreference"("tenantId");

-- AddForeignKey
ALTER TABLE "TenantPreference" ADD CONSTRAINT "TenantPreference_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ---- RLS: TenantPreference -------------------------------------------------
ALTER TABLE "TenantPreference" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TenantPreference" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "TenantPreference"
  USING ("tenantId" = NULLIF(current_setting('app.current_tenant', true), '')::uuid)
  WITH CHECK ("tenantId" = NULLIF(current_setting('app.current_tenant', true), '')::uuid);

CREATE POLICY platform_bypass ON "TenantPreference" FOR ALL
  USING (current_setting('app.platform', true) = 'on')
  WITH CHECK (current_setting('app.platform', true) = 'on');

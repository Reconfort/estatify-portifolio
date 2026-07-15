-- CreateEnum
CREATE TYPE "MediaCategory" AS ENUM ('logo', 'favicon', 'hero', 'company', 'gallery', 'document');

-- CreateTable
CREATE TABLE "AgencyConfiguration" (
    "id" UUID NOT NULL,
    "agencyId" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "draftProfile" JSONB NOT NULL DEFAULT '{}',
    "draftBrand" JSONB NOT NULL DEFAULT '{}',
    "draftWebsite" JSONB NOT NULL DEFAULT '{}',
    "draftSeo" JSONB NOT NULL DEFAULT '{}',
    "publishedProfile" JSONB NOT NULL DEFAULT '{}',
    "publishedBrand" JSONB NOT NULL DEFAULT '{}',
    "publishedWebsite" JSONB NOT NULL DEFAULT '{}',
    "publishedSeo" JSONB NOT NULL DEFAULT '{}',
    "templateId" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgencyConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "agencyId" UUID NOT NULL,
    "category" "MediaCategory" NOT NULL,
    "storageKey" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "uploadedBy" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AgencyConfiguration_agencyId_key" ON "AgencyConfiguration"("agencyId");

-- CreateIndex
CREATE INDEX "AgencyConfiguration_tenantId_idx" ON "AgencyConfiguration"("tenantId");

-- CreateIndex
CREATE INDEX "MediaAsset_tenantId_idx" ON "MediaAsset"("tenantId");

-- CreateIndex
CREATE INDEX "MediaAsset_agencyId_idx" ON "MediaAsset"("agencyId");

-- CreateIndex
CREATE INDEX "MediaAsset_category_idx" ON "MediaAsset"("category");

-- AddForeignKey
ALTER TABLE "AgencyConfiguration" ADD CONSTRAINT "AgencyConfiguration_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ---- RLS: AgencyConfiguration ----------------------------------------------
ALTER TABLE "AgencyConfiguration" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AgencyConfiguration" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "AgencyConfiguration"
  USING ("tenantId" = NULLIF(current_setting('app.current_tenant', true), '')::uuid)
  WITH CHECK ("tenantId" = NULLIF(current_setting('app.current_tenant', true), '')::uuid);

-- ---- RLS: MediaAsset -------------------------------------------------------
ALTER TABLE "MediaAsset" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MediaAsset" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "MediaAsset"
  USING ("tenantId" = NULLIF(current_setting('app.current_tenant', true), '')::uuid)
  WITH CHECK ("tenantId" = NULLIF(current_setting('app.current_tenant', true), '')::uuid);

-- ---- Platform bypass (Access Management) -----------------------------------
CREATE POLICY platform_bypass ON "AgencyConfiguration" FOR ALL
  USING (current_setting('app.platform', true) = 'on')
  WITH CHECK (current_setting('app.platform', true) = 'on');
CREATE POLICY platform_bypass ON "MediaAsset" FOR ALL
  USING (current_setting('app.platform', true) = 'on')
  WITH CHECK (current_setting('app.platform', true) = 'on');

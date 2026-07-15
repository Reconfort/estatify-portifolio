-- AlterTable
ALTER TABLE "AgencyConfiguration" ADD COLUMN "draftComposition" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "AgencyConfiguration" ADD COLUMN "publishedComposition" JSONB NOT NULL DEFAULT '{}';

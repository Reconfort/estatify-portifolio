import { z } from "zod";

export const mediaCategorySchema = z.enum([
  "logo",
  "favicon",
  "hero",
  "company",
  "gallery",
  "document",
]);

export type MediaCategory = z.infer<typeof mediaCategorySchema>;

export const mediaAssetSchema = z.object({
  id: z.string().uuid(),
  category: mediaCategorySchema,
  url: z.string().url(),
  fileName: z.string(),
  mimeType: z.string(),
  fileSize: z.number().int().nonnegative(),
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
  uploadedBy: z.string().uuid(),
  createdAt: z.string().datetime(),
});

export type MediaAssetItem = z.infer<typeof mediaAssetSchema>;

export const mediaListQuerySchema = z.object({
  category: mediaCategorySchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(24),
});

export type MediaListQuery = z.infer<typeof mediaListQuerySchema>;

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "application/pdf",
] as const;

export const createMediaUploadSchema = z.object({
  category: mediaCategorySchema,
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.enum(allowedMimeTypes),
  fileSize: z.coerce
    .number()
    .int()
    .positive()
    .max(10 * 1024 * 1024),
  width: z.coerce.number().int().positive().optional(),
  height: z.coerce.number().int().positive().optional(),
});

export type CreateMediaUploadInput = z.infer<typeof createMediaUploadSchema>;

export const mediaUploadResponseSchema = z.object({
  assetId: z.string().uuid(),
  uploadUrl: z.string().url(),
  publicUrl: z.string().url(),
  storageKey: z.string(),
  expiresIn: z.number().int().positive(),
});

export type MediaUploadResponse = z.infer<typeof mediaUploadResponseSchema>;

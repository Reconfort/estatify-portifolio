import { Injectable, NotFoundException, ServiceUnavailableException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import type {
  CreateMediaUploadInput,
  MediaAssetItem,
  MediaListQuery,
  MediaUploadResponse,
  Paginated,
} from "@estatify/types";
import { PrismaService } from "../../prisma/prisma.service";
import { ObjectStorageService } from "./object-storage.service";

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: ObjectStorageService,
  ) {}

  async list(tenantId: string, query: MediaListQuery): Promise<Paginated<MediaAssetItem>> {
    const agency = await this.requireAgency(tenantId);
    const { page, pageSize, category } = query;

    return this.prisma.withTenant(tenantId, async (tx) => {
      const where = {
        agencyId: agency.id,
        ...(category ? { category } : {}),
      };
      const [rows, total] = await Promise.all([
        tx.mediaAsset.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        tx.mediaAsset.count({ where }),
      ]);

      return {
        items: rows.map((r) => this.toItem(r)),
        total,
        page,
        pageSize,
      };
    });
  }

  async createUpload(
    tenantId: string,
    userId: string,
    input: CreateMediaUploadInput,
  ): Promise<MediaUploadResponse> {
    if (!this.storage.isEnabled()) {
      throw new ServiceUnavailableException("Object storage is not configured");
    }

    const agency = await this.requireAgency(tenantId);
    const assetId = randomUUID();
    const ext = input.fileName.includes(".") ? input.fileName.split(".").pop() : "bin";
    const storageKey = `tenants/${tenantId}/${input.category}/${assetId}.${ext}`;
    const publicUrl = this.storage.buildPublicUrl(storageKey);
    const uploadUrl = await this.storage.createUploadUrl(storageKey, input.mimeType);

    await this.prisma.withTenant(tenantId, async (tx) => {
      await tx.mediaAsset.create({
        data: {
          id: assetId,
          tenantId,
          agencyId: agency.id,
          category: input.category,
          storageKey,
          url: publicUrl,
          fileName: input.fileName,
          mimeType: input.mimeType,
          fileSize: input.fileSize,
          width: input.width ?? null,
          height: input.height ?? null,
          uploadedBy: userId,
        },
      });
    });

    return {
      assetId,
      uploadUrl,
      publicUrl,
      storageKey,
      expiresIn: 900,
    };
  }

  async remove(tenantId: string, assetId: string): Promise<void> {
    const agency = await this.requireAgency(tenantId);

    const asset = await this.prisma.withTenant(tenantId, async (tx) => {
      const row = await tx.mediaAsset.findFirst({
        where: { id: assetId, agencyId: agency.id },
      });
      if (!row) throw new NotFoundException("Media asset not found");
      await tx.mediaAsset.delete({ where: { id: assetId } });
      return row;
    });

    await this.storage.deleteObject(asset.storageKey);
  }

  private async requireAgency(tenantId: string) {
    const agency = await this.prisma.withTenant(tenantId, async (tx) =>
      tx.agency.findUnique({ where: { tenantId } }),
    );
    if (!agency) throw new NotFoundException("Agency not found");
    return agency;
  }

  private toItem(row: {
    id: string;
    category: string;
    url: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
    width: number | null;
    height: number | null;
    uploadedBy: string;
    createdAt: Date;
  }): MediaAssetItem {
    return {
      id: row.id,
      category: row.category as MediaAssetItem["category"],
      url: row.url,
      fileName: row.fileName,
      mimeType: row.mimeType,
      fileSize: row.fileSize,
      width: row.width,
      height: row.height,
      uploadedBy: row.uploadedBy,
      createdAt: row.createdAt.toISOString(),
    };
  }
}

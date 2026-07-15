import { Injectable, Logger, ServiceUnavailableException } from "@nestjs/common";
import { PutObjectCommand, S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "../../config/env";

@Injectable()
export class ObjectStorageService {
  private readonly logger = new Logger(ObjectStorageService.name);
  private readonly client: S3Client | null;
  private readonly enabled: boolean;

  constructor() {
    this.enabled = Boolean(env.STORAGE_ENDPOINT && env.STORAGE_BUCKET);
    if (this.enabled) {
      this.client = new S3Client({
        endpoint: env.STORAGE_ENDPOINT,
        region: env.STORAGE_REGION,
        credentials: {
          accessKeyId: env.STORAGE_ACCESS_KEY ?? "",
          secretAccessKey: env.STORAGE_SECRET_KEY ?? "",
        },
        forcePathStyle: env.STORAGE_FORCE_PATH_STYLE,
      });
    } else {
      this.client = null;
      this.logger.warn(
        "Object storage not configured — media uploads disabled. Set STORAGE_* env vars.",
      );
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  buildPublicUrl(storageKey: string): string {
    const base = env.STORAGE_PUBLIC_URL?.replace(/\/$/, "") ?? "";
    return `${base}/${storageKey}`;
  }

  async createUploadUrl(storageKey: string, mimeType: string, expiresIn = 900): Promise<string> {
    if (!this.client) throw new ServiceUnavailableException("Object storage is not configured");

    const command = new PutObjectCommand({
      Bucket: env.STORAGE_BUCKET,
      Key: storageKey,
      ContentType: mimeType,
    });
    return getSignedUrl(this.client, command, { expiresIn });
  }

  async deleteObject(storageKey: string): Promise<void> {
    if (!this.client) return;
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: env.STORAGE_BUCKET,
        Key: storageKey,
      }),
    );
  }
}

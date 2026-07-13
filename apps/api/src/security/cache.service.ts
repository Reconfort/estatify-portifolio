import { Injectable, Logger, type OnModuleDestroy } from "@nestjs/common";
import Redis from "ioredis";
import { env } from "../config/env";

/**
 * Small KV cache used by the authorization hot path. Uses Redis when REDIS_URL
 * is set (required for immediate, cross-instance revocation); otherwise falls
 * back to an in-process map (single-instance dev only). A short TTL bounds any
 * cache/DB divergence; invalidation is write-through (delete), so the next read
 * re-hydrates from the DB source of truth.
 */
@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private readonly redis: Redis | null;
  private readonly mem = new Map<string, { value: string; expiresAt: number }>();

  constructor() {
    if (env.REDIS_URL) {
      this.redis = new Redis(env.REDIS_URL, { lazyConnect: false, maxRetriesPerRequest: 2 });
      this.redis.on("error", (e: Error) => this.logger.error(`redis error: ${e.message}`));
    } else {
      this.redis = null;
      this.logger.warn(
        "REDIS_URL not set — using in-process cache. OK for single-instance dev; " +
          "multi-instance revocation requires Redis.",
      );
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.redis) return this.redis.get(key);
    const hit = this.mem.get(key);
    if (!hit) return null;
    if (hit.expiresAt < Date.now()) {
      this.mem.delete(key);
      return null;
    }
    return hit.value;
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    if (this.redis) {
      await this.redis.set(key, value, "EX", ttlSeconds);
      return;
    }
    this.mem.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
  }

  async del(key: string): Promise<void> {
    if (this.redis) {
      await this.redis.del(key);
      return;
    }
    this.mem.delete(key);
  }

  async onModuleDestroy(): Promise<void> {
    await this.redis?.quit();
  }
}

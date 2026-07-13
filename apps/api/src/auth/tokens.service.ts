import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { createHash, randomBytes } from "node:crypto";
import type { AccessTokenPayload } from "@estatify/types";
import { env } from "../config/env";

/** Parse a short duration string ("15m", "1h", "30s", "7d") into seconds. */
export function parseDurationSeconds(ttl: string): number {
  const m = /^(\d+)\s*([smhd])$/.exec(ttl.trim());
  if (!m) return Number(ttl) || 900;
  const n = Number(m[1]);
  return n * { s: 1, m: 60, h: 3600, d: 86400 }[m[2] as "s" | "m" | "h" | "d"];
}

@Injectable()
export class TokensService {
  constructor(private readonly jwt: JwtService) {}

  /** Sign a short-lived access JWT. */
  signAccess(payload: Pick<AccessTokenPayload, "sub" | "tid" | "role">): {
    token: string;
    expiresIn: number;
  } {
    const token = this.jwt.sign({ ...payload, typ: "access" });
    return { token, expiresIn: parseDurationSeconds(env.JWT_ACCESS_TTL) };
  }

  /** Opaque refresh token (never a JWT) — high-entropy, stored only as a hash. */
  generateRefreshToken(): string {
    return randomBytes(32).toString("base64url");
  }

  /** sha-256 for at-rest storage of refresh/verification/reset tokens. */
  hashToken(raw: string): string {
    return createHash("sha256").update(raw).digest("hex");
  }

  refreshExpiry(): Date {
    return new Date(Date.now() + env.REFRESH_TTL_DAYS * 86_400_000);
  }
}

import { Injectable } from "@nestjs/common";
import argon2 from "argon2";

/** argon2id password hashing (M2-D3). */
@Injectable()
export class PasswordService {
  private readonly options = { type: argon2.argon2id } as const;

  hash(plain: string): Promise<string> {
    return argon2.hash(plain, this.options);
  }

  async verify(hash: string, plain: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plain);
    } catch {
      return false;
    }
  }
}

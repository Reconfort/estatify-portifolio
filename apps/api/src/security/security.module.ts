import { Global, Module } from "@nestjs/common";
import { CacheService } from "./cache.service";
import { AccountStateService } from "./account-state.service";

/**
 * Global security services: the KV cache + the authoritative account/tenant
 * state used by the per-request SessionValidationGuard and by revocation paths.
 */
@Global()
@Module({
  providers: [CacheService, AccountStateService],
  exports: [CacheService, AccountStateService],
})
export class SecurityModule {}

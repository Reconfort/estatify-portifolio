import {
  Injectable,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { AccessTokenPayload } from "@estatify/types";
import { IS_PUBLIC_KEY } from "../../common/decorators";
import { AccountStateService } from "../../security/account-state.service";

/**
 * Per-request authorization validation (runs right after JwtAuthGuard).
 * Even though the access token is a valid, unexpired JWT, we re-check the
 * authoritative account/tenant state (Redis-cached) on EVERY request so that a
 * suspension takes effect immediately — not when the token expires:
 *
 *   1. the user still exists,
 *   2. the user is ACTIVE (and, for staff, the StaffProfile is active),
 *   3. the token's session version matches the current one (bumped on suspend),
 *   4. the active tenant is ACTIVE.
 *
 * Any failure ⇒ 401. Combined with rejecting refresh, a suspended session's
 * next request 401s, refresh is refused, and the client clears + redirects.
 */
@Injectable()
export class SessionValidationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly accounts: AccountStateService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;

    const req = ctx.switchToHttp().getRequest();
    const user = req.user as AccessTokenPayload | undefined;
    if (!user) return true; // non-public + no user can't happen post-JwtAuthGuard, but stay safe

    const state = await this.accounts.getUserAuthState(user.sub);
    if (!state) throw new UnauthorizedException("Account not found");
    if (state.status !== "active") throw new UnauthorizedException("Account suspended");
    if (state.isPlatformStaff && !state.staffActive) {
      throw new UnauthorizedException("Account disabled");
    }
    if (typeof user.ver === "number" && user.ver !== state.tokenVersion) {
      throw new UnauthorizedException("Session revoked");
    }

    if (user.tid) {
      const tenantStatus = await this.accounts.getTenantStatus(user.tid);
      if (tenantStatus !== "active") throw new UnauthorizedException("Workspace suspended");
    }

    return true;
  }
}

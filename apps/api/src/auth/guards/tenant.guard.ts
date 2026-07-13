import { Injectable, type CanActivate, type ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../../common/decorators";
import type { AccessTokenPayload } from "@estatify/types";

/**
 * Binds the request to its tenant. The active tenant is carried IN the
 * short-lived access JWT (`tid`), issued at login/refresh after membership is
 * verified. We trust it for the token's 15-min lifetime and re-verify membership
 * on refresh — avoiding a DB hit on every request. `req.tenantId` is then used
 * by services to open a withTenant() transaction that sets the RLS GUC.
 */
@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;

    const req = ctx.switchToHttp().getRequest();
    const user = req.user as AccessTokenPayload | undefined;
    req.tenantId = user?.tid ?? null;
    return true;
  }
}

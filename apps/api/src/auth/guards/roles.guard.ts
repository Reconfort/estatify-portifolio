import {
  ForbiddenException,
  Injectable,
  type CanActivate,
  type ExecutionContext,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { AccessTokenPayload, MembershipRole } from "@estatify/types";
import { ROLES_KEY } from "../../common/decorators";

/**
 * Enforces @Roles(...) on a route. No decorator ⇒ any authenticated user passes.
 * Tenant roles only; platform-staff routes use a separate check.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<MembershipRole[] | undefined>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const user = ctx.switchToHttp().getRequest().user as AccessTokenPayload | undefined;
    if (!user?.role || !required.includes(user.role)) {
      throw new ForbiddenException("Insufficient role for this action");
    }
    return true;
  }
}

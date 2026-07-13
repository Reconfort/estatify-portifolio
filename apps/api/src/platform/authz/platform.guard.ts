import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { AccessTokenPayload } from "@estatify/types";
import { PERMISSIONS_KEY } from "./permissions.decorator";
import { StaffAccessService } from "./staff-access.service";

/**
 * The single authorization gate for every Access Management endpoint.
 *   1. Requires an authenticated user (JwtAuthGuard already ran globally).
 *   2. Requires that user to be an ACTIVE platform staff member.
 *   3. Enforces the route's @RequirePermissions(...) against their role's perms.
 * Attaches `req.staff` (the permission set) for handlers to use.
 *
 * This is the real enforcement point — frontend permission checks are cosmetic.
 */
@Injectable()
export class PlatformGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly staff: StaffAccessService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user as AccessTokenPayload | undefined;
    if (!user) throw new UnauthorizedException();

    const context = await this.staff.getContext(user.sub);
    if (!context) throw new ForbiddenException("Platform access required");
    req.staff = context;

    const required =
      this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
        ctx.getHandler(),
        ctx.getClass(),
      ]) ?? [];
    const missing = required.filter((p) => !context.permissions.has(p));
    if (missing.length > 0) {
      throw new ForbiddenException(`Missing permission(s): ${missing.join(", ")}`);
    }
    return true;
  }
}

import { createParamDecorator, SetMetadata, type ExecutionContext } from "@nestjs/common";
import type { AccessTokenPayload, MembershipRole } from "@estatify/types";

/** Marks a route as not requiring authentication (JwtAuthGuard skips it). */
export const IS_PUBLIC_KEY = "isPublic";
export const Public = (): MethodDecorator & ClassDecorator => SetMetadata(IS_PUBLIC_KEY, true);

/** Restricts a route to the listed tenant roles (RolesGuard enforces). */
export const ROLES_KEY = "roles";
export const Roles = (...roles: MembershipRole[]): MethodDecorator & ClassDecorator =>
  SetMetadata(ROLES_KEY, roles);

/** Injects the validated access-token payload (req.user). */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AccessTokenPayload => {
    return ctx.switchToHttp().getRequest().user;
  },
);

/** Injects the resolved tenant id for the request (set by TenantGuard). */
export const TenantId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | null => {
    return ctx.switchToHttp().getRequest().tenantId ?? null;
  },
);

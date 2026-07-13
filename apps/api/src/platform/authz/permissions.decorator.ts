import { SetMetadata, createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { PermissionKey } from "@estatify/types";
import type { StaffContext } from "./staff-access.service";

/** Attach required permission keys to a platform route. Enforced by PlatformGuard. */
export const PERMISSIONS_KEY = "required_permissions";
export const RequirePermissions = (
  ...permissions: PermissionKey[]
): MethodDecorator & ClassDecorator => SetMetadata(PERMISSIONS_KEY, permissions);

/** Injects the resolved staff context (permission set + role) for the request. */
export const CurrentStaff = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): StaffContext => {
    return ctx.switchToHttp().getRequest().staff;
  },
);

import { Module } from "@nestjs/common";
import { StaffAccessService } from "./authz/staff-access.service";
import { PlatformGuard } from "./authz/platform.guard";
import { TenantsController } from "./tenants/tenants.controller";
import { TenantsService } from "./tenants/tenants.service";
import { StaffController } from "./staff/staff.controller";
import { StaffService } from "./staff/staff.service";
import { RolesController } from "./roles/roles.controller";
import { RolesService } from "./roles/roles.service";
import { PermissionsController } from "./permissions/permissions.controller";
import { PermissionsService } from "./permissions/permissions.service";

/** Access Management backend — authorization primitives + all four modules. */
@Module({
  controllers: [TenantsController, StaffController, RolesController, PermissionsController],
  providers: [
    StaffAccessService,
    PlatformGuard,
    TenantsService,
    StaffService,
    RolesService,
    PermissionsService,
  ],
  exports: [StaffAccessService, PlatformGuard],
})
export class PlatformModule {}

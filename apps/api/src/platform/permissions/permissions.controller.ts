import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  permissionListQuerySchema,
  type Paginated,
  type PermissionListItem,
} from "@estatify/types";
import { PlatformGuard } from "../authz/platform.guard";
import { RequirePermissions } from "../authz/permissions.decorator";
import { PermissionsService } from "./permissions.service";

class PermissionListQueryDto extends createZodDto(permissionListQuerySchema) {}

@ApiTags("platform · permissions")
@ApiBearerAuth("access-token")
@UseGuards(PlatformGuard)
@Controller("platform/permissions")
export class PermissionsController {
  constructor(private readonly permissions: PermissionsService) {}

  @Get()
  @RequirePermissions("permission.view")
  @ApiOperation({ summary: "List permissions with the roles that hold them (read-only)" })
  list(@Query() query: PermissionListQueryDto): Promise<Paginated<PermissionListItem>> {
    return this.permissions.list(query);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { RoleDetail, RoleListItem } from "@estatify/types";
import { PlatformGuard } from "../authz/platform.guard";
import { RequirePermissions } from "../authz/permissions.decorator";
import { RolesService } from "./roles.service";
import { CreateRoleDto, UpdateRoleDto } from "./dto";

@ApiTags("platform · roles")
@ApiBearerAuth("access-token")
@UseGuards(PlatformGuard)
@Controller("platform/roles")
export class RolesController {
  constructor(private readonly roles: RolesService) {}

  @Get()
  @RequirePermissions("role.view")
  @ApiOperation({ summary: "List roles (with member + permission counts)" })
  list(): Promise<RoleListItem[]> {
    return this.roles.list();
  }

  @Get(":id")
  @RequirePermissions("role.view")
  @ApiOperation({ summary: "Get a role with its assigned permission keys" })
  getOne(@Param("id", ParseUUIDPipe) id: string): Promise<RoleDetail> {
    return this.roles.getDetail(id);
  }

  @Post()
  @RequirePermissions("role.create")
  @ApiOperation({ summary: "Create a role with permissions" })
  create(@Body() body: CreateRoleDto): Promise<RoleDetail> {
    return this.roles.create(body);
  }

  @Patch(":id")
  @RequirePermissions("role.update")
  @ApiOperation({ summary: "Update a role and its permissions" })
  update(@Param("id", ParseUUIDPipe) id: string, @Body() body: UpdateRoleDto): Promise<RoleDetail> {
    return this.roles.update(id, body);
  }

  @Delete(":id")
  @HttpCode(204)
  @RequirePermissions("role.delete")
  @ApiOperation({ summary: "Delete a role (soft; blocked for system roles / roles with members)" })
  async remove(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    await this.roles.remove(id);
  }
}

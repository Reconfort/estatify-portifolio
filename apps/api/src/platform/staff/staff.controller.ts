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
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Paginated, StaffListItem } from "@estatify/types";
import { PlatformGuard } from "../authz/platform.guard";
import { RequirePermissions } from "../authz/permissions.decorator";
import { StaffService } from "./staff.service";
import { CreateStaffDto, StaffListQueryDto, UpdateStaffDto } from "./dto";

@ApiTags("platform · staff")
@ApiBearerAuth("access-token")
@UseGuards(PlatformGuard)
@Controller("platform/staff")
export class StaffController {
  constructor(private readonly staff: StaffService) {}

  @Get()
  @RequirePermissions("staff.view")
  @ApiOperation({ summary: "List platform staff (server-driven)" })
  list(@Query() query: StaffListQueryDto): Promise<Paginated<StaffListItem>> {
    return this.staff.list(query);
  }

  @Post()
  @RequirePermissions("staff.create")
  @ApiOperation({ summary: "Create a staff member" })
  create(@Body() body: CreateStaffDto): Promise<StaffListItem> {
    return this.staff.create(body);
  }

  @Patch(":id")
  @RequirePermissions("staff.update")
  @ApiOperation({ summary: "Update a staff member" })
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: UpdateStaffDto,
  ): Promise<StaffListItem> {
    return this.staff.update(id, body);
  }

  @Post(":id/disable")
  @HttpCode(200)
  @RequirePermissions("staff.disable")
  @ApiOperation({ summary: "Disable a staff member" })
  disable(@Param("id", ParseUUIDPipe) id: string): Promise<StaffListItem> {
    return this.staff.setStatus(id, "disabled");
  }

  @Post(":id/enable")
  @HttpCode(200)
  @RequirePermissions("staff.disable")
  @ApiOperation({ summary: "Enable a staff member" })
  enable(@Param("id", ParseUUIDPipe) id: string): Promise<StaffListItem> {
    return this.staff.setStatus(id, "active");
  }

  @Delete(":id")
  @HttpCode(204)
  @RequirePermissions("staff.delete")
  @ApiOperation({ summary: "Soft-delete a staff member" })
  async remove(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    await this.staff.softDelete(id);
  }
}

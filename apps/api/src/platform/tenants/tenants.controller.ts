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
import type { Paginated, TenantListItem } from "@estatify/types";
import { PlatformGuard } from "../authz/platform.guard";
import { RequirePermissions } from "../authz/permissions.decorator";
import { TenantsService } from "./tenants.service";
import { CreateTenantDto, TenantListQueryDto, UpdateTenantDto } from "./dto";

@ApiTags("platform · tenants")
@ApiBearerAuth("access-token")
@UseGuards(PlatformGuard)
@Controller("platform/tenants")
export class TenantsController {
  constructor(private readonly tenants: TenantsService) {}

  @Get()
  @RequirePermissions("tenant.view")
  @ApiOperation({ summary: "List tenants (server-driven search/sort/filter/pagination)" })
  list(@Query() query: TenantListQueryDto): Promise<Paginated<TenantListItem>> {
    return this.tenants.list(query);
  }

  @Get(":id")
  @RequirePermissions("tenant.view")
  @ApiOperation({ summary: "Get a tenant" })
  getOne(@Param("id", ParseUUIDPipe) id: string): Promise<TenantListItem> {
    return this.tenants.getById(id);
  }

  @Post()
  @RequirePermissions("tenant.create")
  @ApiOperation({ summary: "Create a tenant (agency + owner)" })
  create(@Body() body: CreateTenantDto): Promise<TenantListItem> {
    return this.tenants.create(body);
  }

  @Patch(":id")
  @RequirePermissions("tenant.update")
  @ApiOperation({ summary: "Update a tenant" })
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: UpdateTenantDto,
  ): Promise<TenantListItem> {
    return this.tenants.update(id, body);
  }

  @Post(":id/suspend")
  @HttpCode(200)
  @RequirePermissions("tenant.suspend")
  @ApiOperation({ summary: "Suspend a tenant" })
  suspend(@Param("id", ParseUUIDPipe) id: string): Promise<TenantListItem> {
    return this.tenants.setStatus(id, "suspended");
  }

  @Post(":id/activate")
  @HttpCode(200)
  @RequirePermissions("tenant.suspend")
  @ApiOperation({ summary: "Activate a tenant" })
  activate(@Param("id", ParseUUIDPipe) id: string): Promise<TenantListItem> {
    return this.tenants.setStatus(id, "active");
  }

  @Delete(":id")
  @HttpCode(204)
  @RequirePermissions("tenant.delete")
  @ApiOperation({ summary: "Soft-delete a tenant" })
  async remove(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    await this.tenants.softDelete(id);
  }
}

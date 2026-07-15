import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { MediaAssetItem, MediaUploadResponse, Paginated } from "@estatify/types";
import { CurrentUser, Roles, TenantId } from "../../common/decorators";
import type { AccessTokenPayload } from "@estatify/types";
import { UnauthorizedException } from "@nestjs/common";
import { MediaService } from "./media.service";
import { CreateMediaUploadDto, MediaListQueryDto } from "../configuration/dto";

@ApiTags("workspace · media")
@ApiBearerAuth("access-token")
@Controller("workspace/media")
export class MediaController {
  constructor(private readonly media: MediaService) {}

  @Get()
  @ApiOperation({ summary: "List media assets for the active agency" })
  list(
    @TenantId() tenantId: string | null,
    @Query() query: MediaListQueryDto,
  ): Promise<Paginated<MediaAssetItem>> {
    return this.media.list(this.requireTenant(tenantId), query);
  }

  @Post("upload-url")
  @Roles("owner", "admin")
  @ApiOperation({ summary: "Create a presigned upload URL and media record" })
  createUpload(
    @TenantId() tenantId: string | null,
    @CurrentUser() user: AccessTokenPayload,
    @Body() body: CreateMediaUploadDto,
  ): Promise<MediaUploadResponse> {
    return this.media.createUpload(this.requireTenant(tenantId), user.sub, body);
  }

  @Delete(":id")
  @HttpCode(204)
  @Roles("owner", "admin")
  @ApiOperation({ summary: "Delete a media asset" })
  async remove(
    @TenantId() tenantId: string | null,
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.media.remove(this.requireTenant(tenantId), id);
  }

  private requireTenant(tenantId: string | null): string {
    if (!tenantId) throw new UnauthorizedException("Tenant context required");
    return tenantId;
  }
}

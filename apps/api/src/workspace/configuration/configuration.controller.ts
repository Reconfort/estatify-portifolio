import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { DraftConfiguration } from "@estatify/types";
import { Roles } from "../../common/decorators";
import { TenantId } from "../../common/decorators";
import { ConfigurationService } from "./configuration.service";
import {
  UpdateAgencyProfileDto,
  UpdateBrandIdentityDto,
  UpdateSeoConfigurationDto,
  UpdateWebsiteSettingsDto,
} from "./dto";

@ApiTags("workspace · configuration")
@ApiBearerAuth("access-token")
@Controller("workspace/configuration")
export class ConfigurationController {
  constructor(private readonly config: ConfigurationService) {}

  @Get()
  @ApiOperation({ summary: "Get full draft configuration (editor)" })
  getDraft(@TenantId() tenantId: string | null): Promise<DraftConfiguration> {
    return this.config.getDraft(this.requireTenant(tenantId));
  }

  @Get("profile")
  @ApiOperation({ summary: "Get agency profile (draft)" })
  async getProfile(@TenantId() tenantId: string | null) {
    const draft = await this.config.getDraft(this.requireTenant(tenantId));
    return draft.profile;
  }

  @Patch("profile")
  @Roles("owner", "admin")
  @ApiOperation({ summary: "Update agency profile (draft)" })
  updateProfile(
    @TenantId() tenantId: string | null,
    @Body() body: UpdateAgencyProfileDto,
  ): Promise<DraftConfiguration> {
    return this.config.updateProfile(this.requireTenant(tenantId), body);
  }

  @Get("brand")
  @ApiOperation({ summary: "Get brand identity tokens (draft)" })
  async getBrand(@TenantId() tenantId: string | null) {
    const draft = await this.config.getDraft(this.requireTenant(tenantId));
    return draft.brand;
  }

  @Patch("brand")
  @Roles("owner", "admin")
  @ApiOperation({ summary: "Update brand identity tokens (draft)" })
  updateBrand(
    @TenantId() tenantId: string | null,
    @Body() body: UpdateBrandIdentityDto,
  ): Promise<DraftConfiguration> {
    return this.config.updateBrand(this.requireTenant(tenantId), body);
  }

  @Get("website")
  @ApiOperation({ summary: "Get website settings (draft)" })
  async getWebsite(@TenantId() tenantId: string | null) {
    const draft = await this.config.getDraft(this.requireTenant(tenantId));
    return draft.website;
  }

  @Patch("website")
  @Roles("owner", "admin")
  @ApiOperation({ summary: "Update website settings (draft)" })
  updateWebsite(
    @TenantId() tenantId: string | null,
    @Body() body: UpdateWebsiteSettingsDto,
  ): Promise<DraftConfiguration> {
    return this.config.updateWebsite(this.requireTenant(tenantId), body);
  }

  @Get("seo")
  @ApiOperation({ summary: "Get SEO configuration (draft)" })
  async getSeo(@TenantId() tenantId: string | null) {
    const draft = await this.config.getDraft(this.requireTenant(tenantId));
    return draft.seo;
  }

  @Patch("seo")
  @Roles("owner", "admin")
  @ApiOperation({ summary: "Update SEO configuration (draft)" })
  updateSeo(
    @TenantId() tenantId: string | null,
    @Body() body: UpdateSeoConfigurationDto,
  ): Promise<DraftConfiguration> {
    return this.config.updateSeo(this.requireTenant(tenantId), body);
  }

  @Post("publish")
  @HttpCode(200)
  @Roles("owner", "admin")
  @ApiOperation({ summary: "Publish draft configuration to the live website" })
  publish(@TenantId() tenantId: string | null): Promise<DraftConfiguration> {
    return this.config.publish(this.requireTenant(tenantId));
  }

  private requireTenant(tenantId: string | null): string {
    if (!tenantId) throw new UnauthorizedException("Tenant context required");
    return tenantId;
  }
}

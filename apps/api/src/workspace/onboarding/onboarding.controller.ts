import { Body, Controller, Get, Put, UnauthorizedException } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { TenantPreferences } from "@estatify/types";
import { CurrentUser, Roles, TenantId } from "../../common/decorators";
import type { AccessTokenPayload } from "@estatify/types";
import { createZodDto } from "nestjs-zod";
import { saveOnboardingPreferencesSchema } from "@estatify/types";
import { OnboardingService } from "./onboarding.service";

class SaveOnboardingDto extends createZodDto(saveOnboardingPreferencesSchema) {}

@ApiTags("workspace · onboarding")
@ApiBearerAuth("access-token")
@Controller("workspace/onboarding")
export class OnboardingController {
  constructor(private readonly onboarding: OnboardingService) {}

  @Get()
  @ApiOperation({ summary: "Get tenant onboarding preferences" })
  get(@TenantId() tenantId: string | null): Promise<TenantPreferences> {
    return this.onboarding.get(this.requireTenant(tenantId));
  }

  @Put()
  @Roles("owner", "admin")
  @ApiOperation({ summary: "Save onboarding goals and mark setup complete" })
  save(
    @TenantId() tenantId: string | null,
    @CurrentUser() user: AccessTokenPayload,
    @Body() body: SaveOnboardingDto,
  ): Promise<TenantPreferences> {
    return this.onboarding.save(this.requireTenant(tenantId), user.sub, body);
  }

  private requireTenant(tenantId: string | null): string {
    if (!tenantId) throw new UnauthorizedException("Tenant context required");
    return tenantId;
  }
}

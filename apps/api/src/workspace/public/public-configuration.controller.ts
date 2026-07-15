import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import type { PublishedConfiguration } from "@estatify/types";
import { Public } from "../../common/decorators";
import { ConfigurationService } from "../configuration/configuration.service";

@ApiTags("public · configuration")
@Controller("public/configuration")
export class PublicConfigurationController {
  constructor(private readonly config: ConfigurationService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: "Published website configuration by host (templates consume this only)",
  })
  getByHost(@Query("host") host: string): Promise<PublishedConfiguration> {
    return this.config.getPublishedByHost(host);
  }
}

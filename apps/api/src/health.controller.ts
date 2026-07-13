import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Public } from "./common/decorators";

@ApiTags("health")
@Controller("health")
export class HealthController {
  @Public()
  @Get()
  @ApiOperation({ summary: "Liveness probe" })
  @ApiOkResponse({
    schema: {
      type: "object",
      properties: {
        status: { type: "string", example: "ok" },
        service: { type: "string", example: "estatify-api" },
      },
    },
  })
  check(): { status: "ok"; service: "estatify-api" } {
    return { status: "ok", service: "estatify-api" };
  }
}

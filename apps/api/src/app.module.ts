import { Module } from "@nestjs/common";
import { APP_GUARD, APP_PIPE } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { ZodValidationPipe } from "nestjs-zod";
import { HealthController } from "./health.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { SecurityModule } from "./security/security.module";
import { MailModule } from "./mail/mail.module";
import { AuthModule } from "./auth/auth.module";
import { PlatformModule } from "./platform/platform.module";
import { WorkspaceModule } from "./workspace/workspace.module";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { SessionValidationGuard } from "./auth/guards/session-validation.guard";
import { TenantGuard } from "./auth/guards/tenant.guard";
import { RolesGuard } from "./auth/guards/roles.guard";

/**
 * Global guard order (Nest runs APP_GUARDs in registration order):
 *   1. ThrottlerGuard          — rate limiting (per IP)
 *   2. JwtAuthGuard            — authentication (skips @Public routes)
 *   3. SessionValidationGuard  — per-request account/tenant/version validation
 *                                (immediate revocation on suspend/disable)
 *   4. TenantGuard             — binds req.tenantId from the token
 *   5. RolesGuard              — enforces @Roles(...)
 */
@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    PrismaModule,
    SecurityModule,
    MailModule,
    AuthModule,
    PlatformModule,
    WorkspaceModule,
  ],
  controllers: [HealthController],
  providers: [
    // Global validation from zod DTOs (createZodDto) — same schemas Swagger reads.
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: SessionValidationGuard },
    { provide: APP_GUARD, useClass: TenantGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}

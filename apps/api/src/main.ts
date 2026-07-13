import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { patchNestJsSwagger } from "nestjs-zod";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { env } from "./config/env";

/**
 * Estatify API — the single backend and only database writer.
 * Owns auth, RBAC, per-request tenant isolation (Postgres RLS), and rate limiting.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableShutdownHooks();

  // Trust the proxy so req.ip is the real client IP behind a load balancer.
  app.getHttpAdapter().getInstance().set("trust proxy", 1);

  // Credentialed CORS for the workspace + platform frontends (refresh cookie).
  app.enableCors({
    origin: [env.APP_WORKSPACE_URL, env.APP_PLATFORM_URL],
    credentials: true,
  });

  // --- OpenAPI / Swagger ----------------------------------------------------
  // nestjs-zod's patchNestJsSwagger() deep-imports a Nest 11 swagger private path
  // that package "exports" block. Webpack rewrites that import (see webpack.config.js);
  // if the rewrite is missing, skip the patch so the API still boots.
  try {
    patchNestJsSwagger();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (!message.includes("PACKAGE_PATH_NOT_EXPORTED")) throw err;
    // Docs still work; zod DTO schemas just won't auto-expand in OpenAPI.
  }
  const openApiConfig = new DocumentBuilder()
    .setTitle("Estatify API")
    .setDescription(
      "Authentication & multi-tenancy API for the Estatify platform.\n\n" +
        "**Auth model:** short-lived access JWT (send as `Authorization: Bearer`) " +
        "plus a rotating refresh token delivered as an httpOnly cookie. " +
        "Every request resolves to a tenant; Postgres RLS enforces isolation.",
    )
    .setVersion("0.1.0")
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT", description: "Access token" },
      "access-token",
    )
    .addCookieAuth("refresh_token", { type: "apiKey", in: "cookie" }, "refresh-cookie")
    .addTag("auth", "Registration, login, sessions, email verification, password reset")
    .addTag("health", "Liveness/readiness probe")
    .build();

  const document = SwaggerModule.createDocument(app, openApiConfig);
  SwaggerModule.setup("docs", app, document, {
    swaggerOptions: { persistAuthorization: true },
    jsonDocumentUrl: "docs/json",
  });

  await app.listen(env.PORT);
}

void bootstrap();

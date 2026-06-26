import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

/**
 * Estatify API — the single backend and only database writer.
 * Owns auth, RBAC, per-request tenant isolation (Postgres RLS), and rate limiting.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(process.env.PORT ?? 4000);
}

void bootstrap();

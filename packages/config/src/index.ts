/**
 * @estatify/config
 * zod-validated environment + runtime config. Fail-fast at boot.
 *
 * Tags: scope:shared,type:util
 *
 * Usage (per app):
 *   import { createEnv } from "@estatify/config";
 *   import { z } from "zod";
 *
 *   export const env = createEnv({
 *     server: z.object({ STRIPE_SECRET_KEY: z.string().min(1) }),
 *     client: z.object({ NEXT_PUBLIC_MAPS_KEY: z.string().min(1) }),
 *     runtimeEnv: {
 *       STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
 *       NEXT_PUBLIC_MAPS_KEY: process.env.NEXT_PUBLIC_MAPS_KEY,
 *     },
 *   });
 *
 * Or, for shared vars only:
 *   import { env } from "@estatify/config";
 */
export {
  createEnv,
  env,
  baseServerSchema,
  baseClientSchema,
  type CreatedEnv,
  type Env,
  type ZodShape,
} from "./env";

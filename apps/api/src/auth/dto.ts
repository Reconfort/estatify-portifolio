import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import {
  authTokensSchema,
  authUserSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "@estatify/types";

/**
 * Nest DTO classes derived from the shared zod schemas (@estatify/types).
 * `createZodDto` makes them (a) validate at runtime via the global
 * ZodValidationPipe and (b) render as OpenAPI schemas in Swagger — one source of
 * truth for validation, types, and docs.
 */

// ---- request bodies --------------------------------------------------------
export class RegisterDto extends createZodDto(registerSchema) {}
export class LoginDto extends createZodDto(loginSchema) {}
export class ForgotPasswordDto extends createZodDto(forgotPasswordSchema) {}
export class ResetPasswordDto extends createZodDto(resetPasswordSchema) {}
export class ResendVerificationDto extends createZodDto(resendVerificationSchema) {}
export class VerifyEmailQueryDto extends createZodDto(verifyEmailSchema) {}

// ---- responses -------------------------------------------------------------
export class AuthTokensDto extends createZodDto(authTokensSchema) {}
export class AuthUserDto extends createZodDto(authUserSchema) {}
export class MessageDto extends createZodDto(z.object({ message: z.string() })) {}
export class VerifiedDto extends createZodDto(z.object({ verified: z.literal(true) })) {}

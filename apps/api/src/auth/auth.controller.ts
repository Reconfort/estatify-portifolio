import { Body, Controller, Get, HttpCode, Post, Query, Req, Res } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiConflictResponse,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiNoContentResponse,
} from "@nestjs/swagger";
import type { Request, Response } from "express";
import type { AccessTokenPayload, AuthTokens, AuthUser } from "@estatify/types";
import { env } from "../config/env";
import { CurrentUser, Public } from "../common/decorators";
import { AuthService, type IssuedAuth, type RequestContext } from "./auth.service";
import {
  AuthTokensDto,
  AuthUserDto,
  ForgotPasswordDto,
  LoginDto,
  MessageDto,
  RegisterDto,
  ResendVerificationDto,
  ResetPasswordDto,
  VerifiedDto,
  VerifyEmailQueryDto,
} from "./dto";

const REFRESH_COOKIE = "refresh_token";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post("register")
  @ApiOperation({
    summary: "Register a new agency",
    description:
      "Creates a tenant + agency + owner membership in one transaction, sends a " +
      "verification email, and signs the user in. The refresh token is returned as " +
      "an httpOnly cookie; the access token is in the response body.",
  })
  @ApiCreatedResponse({ description: "Agency created and signed in", type: AuthTokensDto })
  @ApiConflictResponse({ description: "Email already in use, or subdomain taken" })
  @ApiBadRequestResponse({ description: "Validation failed" })
  async register(
    @Body() body: RegisterDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthTokens> {
    return this.finish(await this.auth.register(body, this.ctx(req)), res);
  }

  @Public()
  @Post("login")
  @HttpCode(200)
  @ApiOperation({ summary: "Sign in with email + password" })
  @ApiOkResponse({ description: "Signed in", type: AuthTokensDto })
  @ApiUnauthorizedResponse({ description: "Invalid email or password" })
  @ApiForbiddenResponse({ description: "Correct credentials but wrong portal for this account" })
  async login(
    @Body() body: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthTokens> {
    return this.finish(await this.auth.login(body, this.ctx(req)), res);
  }

  @Public()
  @Post("refresh")
  @HttpCode(200)
  @ApiCookieAuth("refresh-cookie")
  @ApiOperation({
    summary: "Rotate the refresh token",
    description:
      "Reads the httpOnly refresh cookie, revokes it, and issues a fresh access " +
      "token + rotated refresh cookie. Reusing a rotated token revokes the whole " +
      "session family (theft detection).",
  })
  @ApiOkResponse({ description: "New tokens issued", type: AuthTokensDto })
  @ApiUnauthorizedResponse({ description: "Missing, invalid, expired, or reused refresh token" })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthTokens> {
    return this.finish(await this.auth.refresh(req.cookies?.[REFRESH_COOKIE], this.ctx(req)), res);
  }

  @Public()
  @Post("logout")
  @HttpCode(204)
  @ApiCookieAuth("refresh-cookie")
  @ApiOperation({ summary: "Revoke the current session and clear the refresh cookie" })
  @ApiNoContentResponse({ description: "Logged out" })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    await this.auth.logout(req.cookies?.[REFRESH_COOKIE]);
    this.clearRefreshCookie(res);
  }

  @Get("me")
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Current user + tenant context" })
  @ApiOkResponse({ description: "The authenticated user", type: AuthUserDto })
  @ApiUnauthorizedResponse({ description: "Missing or invalid access token" })
  me(@CurrentUser() user: AccessTokenPayload): Promise<AuthUser> {
    return this.auth.me(user.sub, user.tid);
  }

  @Public()
  @Post("forgot-password")
  @HttpCode(200)
  @ApiOperation({
    summary: "Request a password reset link",
    description: "Always returns 200 — the response never reveals whether an account exists.",
  })
  @ApiOkResponse({ type: MessageDto })
  async forgot(@Body() body: ForgotPasswordDto): Promise<{ message: string }> {
    await this.auth.forgotPassword(body);
    return { message: "If an account exists for that email, a reset link is on its way." };
  }

  @Public()
  @Post("reset-password")
  @HttpCode(200)
  @ApiOperation({
    summary: "Set a new password with a reset token",
    description: "Consumes the reset token and revokes ALL existing sessions for the user.",
  })
  @ApiOkResponse({ type: MessageDto })
  @ApiBadRequestResponse({ description: "Invalid or expired reset link" })
  async reset(@Body() body: ResetPasswordDto): Promise<{ message: string }> {
    await this.auth.resetPassword(body);
    return { message: "Password updated. Please sign in." };
  }

  @Public()
  @Get("verify-email")
  @ApiOperation({ summary: "Verify an email address with a token" })
  @ApiOkResponse({ type: VerifiedDto })
  @ApiBadRequestResponse({ description: "Invalid or expired verification link" })
  verify(@Query() query: VerifyEmailQueryDto): Promise<{ verified: true }> {
    return this.auth.verifyEmail(query);
  }

  @Public()
  @Post("resend-verification")
  @HttpCode(200)
  @ApiOperation({
    summary: "Resend the verification email",
    description: "Always returns 200 — never reveals whether the account exists or is verified.",
  })
  @ApiOkResponse({ type: MessageDto })
  async resend(@Body() body: ResendVerificationDto): Promise<{ message: string }> {
    await this.auth.resendVerification(body.email);
    return { message: "If your email needs verification, a new link is on its way." };
  }

  // -------------------------------------------------------------- helpers
  private ctx(req: Request): RequestContext {
    return { ip: req.ip, userAgent: req.headers["user-agent"] };
  }

  private finish(issued: IssuedAuth, res: Response): AuthTokens {
    this.setRefreshCookie(res, issued.refresh.token, issued.refresh.expiresAt);
    return issued.tokens;
  }

  private setRefreshCookie(res: Response, token: string, expiresAt: Date): void {
    res.cookie(REFRESH_COOKIE, token, {
      httpOnly: true,
      secure: env.COOKIE_SECURE,
      sameSite: "lax",
      domain: env.COOKIE_DOMAIN || undefined,
      path: "/",
      expires: expiresAt,
    });
  }

  private clearRefreshCookie(res: Response): void {
    res.clearCookie(REFRESH_COOKIE, {
      httpOnly: true,
      secure: env.COOKIE_SECURE,
      sameSite: "lax",
      domain: env.COOKIE_DOMAIN || undefined,
      path: "/",
    });
  }
}

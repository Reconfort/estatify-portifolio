import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import type {
  AuthTokens,
  AuthUser,
  ForgotPasswordInput,
  LoginInput,
  MembershipRole,
  RegisterInput,
  ResetPasswordInput,
  TenantMembershipView,
  VerifyEmailInput,
} from "@estatify/types";
import { ROLE_RANK } from "@estatify/types";
import { PrismaService } from "../prisma/prisma.service";
import { MailService } from "../mail/mail.service";
import { env } from "../config/env";
import { PasswordService } from "./password.service";
import { TokensService } from "./tokens.service";

export interface RequestContext {
  ip?: string;
  userAgent?: string;
}

/** Result of a token-issuing action: body for the client + the raw refresh token
 * (which the controller sets as an httpOnly cookie — never in the body). */
export interface IssuedAuth {
  tokens: AuthTokens;
  refresh: { token: string; expiresAt: Date };
}

const VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const RESET_TTL_MS = 60 * 60 * 1000; // 1h

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly passwords: PasswordService,
    private readonly tokens: TokensService,
    private readonly mail: MailService,
  ) {}

  // ---------------------------------------------------------------- register
  async register(input: RegisterInput, ctx: RequestContext): Promise<IssuedAuth> {
    const existing = await this.prisma.client.user.findUnique({
      where: { email: input.email },
      select: { id: true },
    });
    if (existing) throw new ConflictException("Email is already in use");

    const slugTaken = await this.prisma.client.tenant.findUnique({
      where: { slug: input.slug },
      select: { id: true },
    });
    if (slugTaken) throw new ConflictException("That subdomain is taken");

    const passwordHash = await this.passwords.hash(input.password);
    const tenantId = randomUUID();
    const userId = randomUUID();

    // One atomic transaction. The GUC is set to the NEW tenant so the RLS
    // WITH CHECK on Agency/Membership inserts is satisfied.
    await this.prisma.withTenant(
      tenantId,
      async (tx) => {
        await tx.tenant.create({ data: { id: tenantId, slug: input.slug, status: "active" } });
        await tx.user.create({
          data: { id: userId, email: input.email, passwordHash, emailVerified: false },
        });
        await tx.agency.create({ data: { tenantId, name: input.agencyName } });
        await tx.membership.create({ data: { tenantId, userId, role: "owner" } });
      },
      { userId },
    );

    await this.sendVerification(userId, input.email).catch((e) =>
      this.logger.error(`verification email failed for ${input.email}: ${e}`),
    );

    const user = await this.prisma.client.user.findUniqueOrThrow({ where: { id: userId } });
    return this.issue(user, tenantId, ctx);
  }

  // ------------------------------------------------------------------- login
  async login(input: LoginInput, ctx: RequestContext): Promise<IssuedAuth> {
    const user = await this.prisma.client.user.findUnique({ where: { email: input.email } });
    if (!user) {
      // Burn comparable time so response latency doesn't reveal account existence.
      await this.passwords.hash(input.password);
      throw new UnauthorizedException("Invalid email or password");
    }
    const ok = await this.passwords.verify(user.passwordHash, input.password);
    if (!ok) throw new UnauthorizedException("Invalid email or password");

    // Portal seam — never issue a session for the wrong product surface.
    if (input.portal === "workspace" && user.isPlatformStaff) {
      throw new ForbiddenException(
        "This account is for the Platform portal. Sign in at platform.estatify.africa.",
      );
    }
    if (input.portal === "platform" && !user.isPlatformStaff) {
      throw new ForbiddenException(
        "This account is for Workspace. Sign in at workspace.estatify.africa.",
      );
    }

    const memberships = await this.loadMemberships(user.id);
    const activeTenantId = this.pickActive(memberships);
    return this.issue(user, activeTenantId, ctx);
  }

  // ----------------------------------------------------------------- refresh
  async refresh(rawToken: string | undefined, ctx: RequestContext): Promise<IssuedAuth> {
    if (!rawToken) throw new UnauthorizedException("Missing refresh token");
    const tokenHash = this.tokens.hashToken(rawToken);
    const session = await this.prisma.client.session.findUnique({
      where: { refreshTokenHash: tokenHash },
    });
    if (!session) throw new UnauthorizedException("Invalid session");

    // Reuse of an already-rotated (revoked) token ⇒ theft ⇒ nuke the whole family.
    if (session.revokedAt) {
      await this.prisma.client.session.updateMany({
        where: { familyId: session.familyId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      throw new UnauthorizedException("Session reuse detected — please sign in again");
    }
    if (session.expiresAt.getTime() < Date.now()) {
      await this.prisma.client.session.update({
        where: { id: session.id },
        data: { revokedAt: new Date() },
      });
      throw new UnauthorizedException("Session expired");
    }

    await this.prisma.client.session.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    });
    const user = await this.prisma.client.user.findUniqueOrThrow({ where: { id: session.userId } });
    const tenantId = session.tenantId && session.tenantId.length > 0 ? session.tenantId : null;
    return this.issue(user, tenantId, ctx, session.familyId);
  }

  // ------------------------------------------------------------------ logout
  async logout(rawToken: string | undefined): Promise<void> {
    if (!rawToken) return;
    await this.prisma.client.session.updateMany({
      where: { refreshTokenHash: this.tokens.hashToken(rawToken), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  // --------------------------------------------------------------------- me
  me(userId: string, activeTenantId: string | null): Promise<AuthUser> {
    return this.buildAuthUser(userId, activeTenantId ?? undefined);
  }

  // ---------------------------------------------------------- verify email
  async verifyEmail(input: VerifyEmailInput): Promise<{ verified: true }> {
    const rec = await this.prisma.client.verificationToken.findUnique({
      where: { tokenHash: this.tokens.hashToken(input.token) },
    });
    if (!rec || rec.consumedAt || rec.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException("Invalid or expired verification link");
    }
    await this.prisma.client.$transaction([
      this.prisma.client.user.update({ where: { id: rec.userId }, data: { emailVerified: true } }),
      this.prisma.client.verificationToken.update({
        where: { id: rec.id },
        data: { consumedAt: new Date() },
      }),
    ]);
    return { verified: true };
  }

  async resendVerification(email: string): Promise<void> {
    const user = await this.prisma.client.user.findUnique({ where: { email } });
    if (user && !user.emailVerified) await this.sendVerification(user.id, user.email);
    // Always resolve — never reveal whether the account exists.
  }

  // ------------------------------------------------------- forgot / reset
  async forgotPassword(input: ForgotPasswordInput): Promise<void> {
    const user = await this.prisma.client.user.findUnique({ where: { email: input.email } });
    if (user) {
      const raw = this.tokens.generateRefreshToken();
      await this.prisma.client.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash: this.tokens.hashToken(raw),
          expiresAt: new Date(Date.now() + RESET_TTL_MS),
        },
      });
      const url = `${env.APP_WORKSPACE_URL}/reset-password?token=${raw}`;
      await this.mail
        .sendPasswordResetEmail(user.email, url)
        .catch((e) => this.logger.error(`reset email failed: ${e}`));
    }
    // Always resolve with 200 — no account enumeration.
  }

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    const rec = await this.prisma.client.passwordResetToken.findUnique({
      where: { tokenHash: this.tokens.hashToken(input.token) },
    });
    if (!rec || rec.consumedAt || rec.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException("Invalid or expired reset link");
    }
    const passwordHash = await this.passwords.hash(input.password);
    await this.prisma.client.$transaction([
      this.prisma.client.user.update({ where: { id: rec.userId }, data: { passwordHash } }),
      // Revoke ALL sessions — a password reset invalidates every existing login.
      this.prisma.client.session.updateMany({
        where: { userId: rec.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
      this.prisma.client.passwordResetToken.update({
        where: { id: rec.id },
        data: { consumedAt: new Date() },
      }),
    ]);
  }

  // -------------------------------------------------------------- internals
  private async sendVerification(userId: string, email: string): Promise<void> {
    const raw = this.tokens.generateRefreshToken();
    await this.prisma.client.verificationToken.create({
      data: {
        userId,
        tokenHash: this.tokens.hashToken(raw),
        expiresAt: new Date(Date.now() + VERIFICATION_TTL_MS),
      },
    });
    const url = `${env.APP_WORKSPACE_URL}/verify-email?token=${raw}`;
    await this.mail.sendVerificationEmail(email, url);
  }

  private async loadMemberships(
    userId: string,
  ): Promise<Array<{ tenantId: string; slug: string; role: MembershipRole }>> {
    const rows = await this.prisma.withUser(userId, (tx) =>
      tx.membership.findMany({
        where: { userId },
        select: { tenantId: true, role: true, tenant: { select: { slug: true } } },
        orderBy: { createdAt: "asc" },
      }),
    );
    return rows.map((r) => ({
      tenantId: r.tenantId,
      slug: r.tenant.slug,
      role: r.role as MembershipRole,
    }));
  }

  private pickActive(
    memberships: Array<{ tenantId: string; role: MembershipRole }>,
  ): string | null {
    if (memberships.length === 0) return null;
    const [top] = [...memberships].sort((a, b) => ROLE_RANK[b.role] - ROLE_RANK[a.role]);
    return top?.tenantId ?? null;
  }

  private async buildAuthUser(userId: string, activeTenantId?: string): Promise<AuthUser> {
    const user = await this.prisma.client.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();

    const memberships = await this.loadMemberships(userId);
    const requested = activeTenantId && activeTenantId.length > 0 ? activeTenantId : undefined;
    const active = requested ?? this.pickActive(memberships);

    let agencyName: string | null = null;
    if (active) {
      const agency = await this.prisma.withTenant(
        active,
        (tx) => tx.agency.findUnique({ where: { tenantId: active }, select: { name: true } }),
        { userId },
      );
      agencyName = agency?.name ?? null;
    }

    const views: TenantMembershipView[] = memberships.map((m) => ({
      tenantId: m.tenantId,
      slug: m.slug,
      role: m.role,
      agencyName: m.tenantId === active ? agencyName : null,
    }));

    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      isPlatformStaff: user.isPlatformStaff,
      platformRole: user.platformRole,
      activeTenant: views.find((v) => v.tenantId === active) ?? null,
      memberships: views,
    };
  }

  private async issue(
    user: { id: string },
    activeTenantId: string | null,
    ctx: RequestContext,
    familyId?: string,
  ): Promise<IssuedAuth> {
    const authUser = await this.buildAuthUser(user.id, activeTenantId ?? undefined);
    const tid = authUser.activeTenant?.tenantId ?? null;
    const role = authUser.activeTenant?.role ?? null;

    const access = this.tokens.signAccess({ sub: user.id, tid, role });
    const raw = this.tokens.generateRefreshToken();
    const expiresAt = this.tokens.refreshExpiry();

    await this.prisma.client.session.create({
      data: {
        userId: user.id,
        tenantId: tid,
        refreshTokenHash: this.tokens.hashToken(raw),
        familyId: familyId ?? randomUUID(),
        userAgent: ctx.userAgent ?? null,
        ip: ctx.ip ?? null,
        expiresAt,
      },
    });

    return {
      tokens: { accessToken: access.token, expiresIn: access.expiresIn, user: authUser },
      refresh: { token: raw, expiresAt },
    };
  }
}

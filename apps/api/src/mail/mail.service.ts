import { Injectable, Logger } from "@nestjs/common";
import nodemailer, { type Transporter } from "nodemailer";
import { env } from "../config/env";

/**
 * MailPort — provider-agnostic transactional email. Dev uses SMTP (Mailpit);
 * prod swaps to SendGrid/Resend by config without touching call sites.
 *
 * Only two emails exist in this milestone: verify + reset. Both are security
 * emails, so links carry single-use, hashed-at-rest tokens (see AuthService).
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter | null;

  constructor() {
    this.transporter =
      env.MAIL_PROVIDER === "smtp"
        ? nodemailer.createTransport({
            host: env.SMTP_HOST,
            port: env.SMTP_PORT,
            secure: false,
          })
        : null; // sendgrid/resend adapters wired at deploy time (see §CONFIRM-4)
  }

  async sendVerificationEmail(to: string, verifyUrl: string): Promise<void> {
    await this.send(
      to,
      "Verify your Estatify email",
      `<p>Welcome to Estatify.</p>
       <p>Confirm your email to finish setting up your workspace:</p>
       <p><a href="${verifyUrl}">Verify email</a></p>
       <p>This link expires in 24 hours. If you didn't sign up, ignore this email.</p>`,
    );
  }

  async sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
    await this.send(
      to,
      "Reset your Estatify password",
      `<p>We received a request to reset your password.</p>
       <p><a href="${resetUrl}">Reset password</a></p>
       <p>This link expires in 1 hour and can be used once. If you didn't request
       this, you can safely ignore it — your password won't change.</p>`,
    );
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    if (!this.transporter) {
      // No transport configured (e.g. prod provider not yet wired). Never throw
      // in the request path over email — log loudly so it's caught in ops.
      this.logger.warn(
        `MAIL[${env.MAIL_PROVIDER}] not configured — would send "${subject}" to ${to}`,
      );
      return;
    }
    await this.transporter.sendMail({ from: env.MAIL_FROM, to, subject, html });
    this.logger.log(`sent "${subject}" to ${to}`);
  }
}

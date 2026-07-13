import type {
  AuthTokens,
  AuthUser,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from "@estatify/types";
import { apiFetch } from "./http";

/** Typed wrappers over every /auth endpoint. Apps never call fetch directly. */
export const authApi = {
  register: (body: RegisterInput) =>
    apiFetch<AuthTokens>("/auth/register", { method: "POST", body, auth: false }),

  login: (body: LoginInput) =>
    apiFetch<AuthTokens>("/auth/login", { method: "POST", body, auth: false }),

  logout: () => apiFetch<void>("/auth/logout", { method: "POST", auth: false }),

  refresh: () => apiFetch<AuthTokens>("/auth/refresh", { method: "POST", auth: false }),

  me: () => apiFetch<AuthUser>("/auth/me", { method: "GET" }),

  forgotPassword: (body: ForgotPasswordInput) =>
    apiFetch<{ message: string }>("/auth/forgot-password", { method: "POST", body, auth: false }),

  resetPassword: (body: ResetPasswordInput) =>
    apiFetch<{ message: string }>("/auth/reset-password", { method: "POST", body, auth: false }),

  verifyEmail: (token: string) =>
    apiFetch<{ verified: true }>(`/auth/verify-email?token=${encodeURIComponent(token)}`, {
      method: "GET",
      auth: false,
    }),

  resendVerification: (email: string) =>
    apiFetch<{ message: string }>("/auth/resend-verification", {
      method: "POST",
      body: { email },
      auth: false,
    }),
};

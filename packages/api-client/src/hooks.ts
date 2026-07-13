"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "./endpoints";
import { clearAccessToken, setAccessToken } from "./token-store";

/** Thin TanStack Query wrappers. Components call session.setAuth after login/register.
 * Server state is never mirrored into Zustand. */

export const authKeys = {
  me: ["auth", "me"] as const,
};

export const useLogin = () =>
  useMutation({
    mutationFn: authApi.login,
    onSuccess: (tokens) => setAccessToken(tokens.accessToken),
  });

export const useRegister = () =>
  useMutation({
    mutationFn: authApi.register,
    onSuccess: (tokens) => setAccessToken(tokens.accessToken),
  });

export const useForgotPassword = () => useMutation({ mutationFn: authApi.forgotPassword });
export const useResetPassword = () => useMutation({ mutationFn: authApi.resetPassword });
export const useResendVerification = () =>
  useMutation({ mutationFn: (email: string) => authApi.resendVerification(email) });
export const useVerifyEmail = () =>
  useMutation({ mutationFn: (token: string) => authApi.verifyEmail(token) });

export const useLogout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clearAccessToken();
      qc.removeQueries({ queryKey: authKeys.me });
    },
  });
};

export const useMe = (enabled = true) =>
  useQuery({ queryKey: authKeys.me, queryFn: authApi.me, enabled, retry: false });

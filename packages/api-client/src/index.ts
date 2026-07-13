/**
 * @estatify/api-client
 * Typed API client + TanStack Query hooks. The only place apps fetch server state.
 *
 * Tags: scope:shared,type:data-access
 */
export { API_URL } from "./config";
export { apiFetch, refreshOnce } from "./http";
export { authApi } from "./endpoints";
export { ApiError, getApiErrorMessage, type FieldErrors } from "./errors";
export { getAccessToken, setAccessToken, clearAccessToken } from "./token-store";
export {
  authKeys,
  useLogin,
  useRegister,
  useForgotPassword,
  useResetPassword,
  useResendVerification,
  useVerifyEmail,
  useLogout,
  useMe,
} from "./hooks";

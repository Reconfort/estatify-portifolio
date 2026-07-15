/**
 * @estatify/api-client
 * Typed API client + TanStack Query hooks. The only place apps fetch server state.
 *
 * Tags: scope:shared,type:data-access
 */
export { API_URL } from "./config";
export { apiFetch, refreshOnce, AUTH_EXPIRED_EVENT } from "./http";
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
export {
  tenantsApi,
  tenantKeys,
  useTenants,
  useCreateTenant,
  useUpdateTenant,
  useSuspendTenant,
  useActivateTenant,
  useDeleteTenant,
} from "./platform-tenants";
export {
  staffApi,
  staffKeys,
  useStaff,
  useCreateStaff,
  useUpdateStaff,
  useDisableStaff,
  useEnableStaff,
  useDeleteStaff,
} from "./platform-staff";
export {
  rolesApi,
  roleKeys,
  useRoles,
  useRole,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from "./platform-roles";
export { permissionsApi, permissionCatalogKeys, usePermissionsList } from "./platform-permissions";
export {
  configurationApi,
  configurationKeys,
  useDraftConfiguration,
  useUpdateAgencyProfile,
  useUpdateBrandIdentity,
  useUpdateWebsiteSettings,
  useUpdateSeoConfiguration,
  usePublishConfiguration,
} from "./workspace-configuration";
export {
  mediaApi,
  mediaKeys,
  uploadToPresignedUrl,
  useMedia,
  useCreateMediaUpload,
  useDeleteMedia,
} from "./workspace-media";
export {
  onboardingApi,
  onboardingKeys,
  useOnboardingPreferences,
  useSaveOnboardingPreferences,
} from "./workspace-onboarding";

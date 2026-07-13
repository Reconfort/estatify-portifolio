import { z } from "zod";

/**
 * Access Management contracts — the single source of truth shared by the NestJS
 * API and the platform admin UI. Covers the permission catalog, the server-driven
 * list envelope, and DTOs for Tenants / Platform Staff / Roles / Permissions.
 *
 * The PERMISSION CATALOG is code-defined here and synced to the DB on seed. That
 * is why permissions are read-only in the product: they are a property of the
 * software, not user data. Roles compose them.
 */

// ---------------------------------------------------------------------------
// Permission catalog
// ---------------------------------------------------------------------------
export interface PermissionDef {
  key: string;
  module: string;
  action: string;
  description: string;
}

export const PERMISSION_CATALOG = [
  // Tenants
  { key: "tenant.view", module: "Tenants", action: "view", description: "View tenants" },
  { key: "tenant.create", module: "Tenants", action: "create", description: "Create tenants" },
  { key: "tenant.update", module: "Tenants", action: "update", description: "Edit tenants" },
  { key: "tenant.delete", module: "Tenants", action: "delete", description: "Delete tenants" },
  {
    key: "tenant.suspend",
    module: "Tenants",
    action: "suspend",
    description: "Suspend / activate tenants",
  },
  {
    key: "tenant.impersonate",
    module: "Tenants",
    action: "impersonate",
    description: "Impersonate a tenant owner",
  },
  // Platform Staff
  { key: "staff.view", module: "Platform Staff", action: "view", description: "View staff" },
  { key: "staff.create", module: "Platform Staff", action: "create", description: "Create staff" },
  { key: "staff.update", module: "Platform Staff", action: "update", description: "Edit staff" },
  { key: "staff.delete", module: "Platform Staff", action: "delete", description: "Delete staff" },
  {
    key: "staff.disable",
    module: "Platform Staff",
    action: "disable",
    description: "Disable / enable staff",
  },
  // Roles
  { key: "role.view", module: "Roles", action: "view", description: "View roles" },
  { key: "role.create", module: "Roles", action: "create", description: "Create roles" },
  {
    key: "role.update",
    module: "Roles",
    action: "update",
    description: "Edit roles & permissions",
  },
  { key: "role.delete", module: "Roles", action: "delete", description: "Delete roles" },
  // Permissions
  {
    key: "permission.view",
    module: "Permissions",
    action: "view",
    description: "View permissions",
  },
  // Billing
  { key: "billing.view", module: "Billing", action: "view", description: "View billing" },
  { key: "billing.refund", module: "Billing", action: "refund", description: "Issue refunds" },
  { key: "billing.invoice", module: "Billing", action: "invoice", description: "Manage invoices" },
  // Support
  { key: "support.view", module: "Support", action: "view", description: "View support tickets" },
  { key: "support.reply", module: "Support", action: "reply", description: "Reply to tickets" },
  { key: "support.close", module: "Support", action: "close", description: "Close tickets" },
  // Analytics
  { key: "analytics.view", module: "Analytics", action: "view", description: "View analytics" },
  // Feature Flags
  { key: "flag.view", module: "Feature Flags", action: "view", description: "View feature flags" },
  {
    key: "flag.manage",
    module: "Feature Flags",
    action: "manage",
    description: "Manage feature flags",
  },
] as const satisfies readonly PermissionDef[];

export type PermissionKey = (typeof PERMISSION_CATALOG)[number]["key"];
export const ALL_PERMISSION_KEYS: PermissionKey[] = PERMISSION_CATALOG.map((p) => p.key);

/** Permission keys grouped by module — drives the GitHub-style role builder. */
export const PERMISSIONS_BY_MODULE: Record<string, PermissionDef[]> = PERMISSION_CATALOG.reduce(
  (acc, p) => {
    const group = acc[p.module] ?? [];
    group.push(p);
    acc[p.module] = group;
    return acc;
  },
  {} as Record<string, PermissionDef[]>,
);

/** Seed roles. "*" means all permissions (Super Admin is a system role). */
export const DEFAULT_ROLES: Array<{
  name: string;
  description: string;
  isSystem: boolean;
  permissions: PermissionKey[] | "*";
}> = [
  { name: "Super Admin", description: "Full platform access", isSystem: true, permissions: "*" },
  {
    name: "Platform Admin",
    description: "Manages tenants, staff and roles",
    isSystem: false,
    permissions: [
      "tenant.view",
      "tenant.create",
      "tenant.update",
      "tenant.suspend",
      "staff.view",
      "staff.create",
      "staff.update",
      "staff.disable",
      "role.view",
      "role.create",
      "role.update",
      "permission.view",
      "analytics.view",
    ],
  },
  {
    name: "Support",
    description: "Handles customer support",
    isSystem: false,
    permissions: ["tenant.view", "support.view", "support.reply", "support.close", "staff.view"],
  },
  {
    name: "Finance",
    description: "Billing and invoices",
    isSystem: false,
    permissions: [
      "tenant.view",
      "billing.view",
      "billing.refund",
      "billing.invoice",
      "analytics.view",
    ],
  },
  {
    name: "Customer Success",
    description: "Tenant health and retention",
    isSystem: false,
    permissions: ["tenant.view", "support.view", "support.reply", "analytics.view"],
  },
  {
    name: "Developer",
    description: "Feature flags and diagnostics",
    isSystem: false,
    permissions: ["tenant.view", "flag.view", "flag.manage", "analytics.view"],
  },
  {
    name: "Marketing",
    description: "Campaign analytics",
    isSystem: false,
    permissions: ["analytics.view"],
  },
  {
    name: "Viewer",
    description: "Read-only across the platform",
    isSystem: false,
    permissions: ["tenant.view", "staff.view", "role.view", "permission.view", "analytics.view"],
  },
];

// ---------------------------------------------------------------------------
// Server-driven list envelope (search / sort / filter / pagination)
// ---------------------------------------------------------------------------
export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().max(200).optional(),
  sort: z.string().max(40).optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
});
export type ListQuery = z.infer<typeof listQuerySchema>;

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ---------------------------------------------------------------------------
// Enums shared with Prisma
// ---------------------------------------------------------------------------
export const tenantPlanSchema = z.enum(["free", "starter", "growth", "scale", "enterprise"]);
export type TenantPlan = z.infer<typeof tenantPlanSchema>;

export const tenantStatusSchema = z.enum(["active", "suspended", "pending"]);
export type TenantStatusValue = z.infer<typeof tenantStatusSchema>;

export const staffDepartmentSchema = z.enum([
  "engineering",
  "support",
  "finance",
  "customer_success",
  "marketing",
  "operations",
  "executive",
]);
export type StaffDepartment = z.infer<typeof staffDepartmentSchema>;

export const staffStatusSchema = z.enum(["active", "disabled", "invited"]);
export type StaffStatus = z.infer<typeof staffStatusSchema>;

// ---------------------------------------------------------------------------
// Tenants
// ---------------------------------------------------------------------------
export interface TenantListItem {
  id: string;
  agencyName: string;
  slug: string;
  ownerName: string | null;
  ownerEmail: string | null;
  plan: TenantPlan;
  status: TenantStatusValue;
  propertiesCount: number;
  agentsCount: number;
  website: string | null;
  lastActiveAt: string | null;
  createdAt: string;
}

export const tenantListQuerySchema = listQuerySchema.extend({
  status: tenantStatusSchema.optional(),
  plan: tenantPlanSchema.optional(),
});
export type TenantListQuery = z.infer<typeof tenantListQuerySchema>;

export const createTenantSchema = z.object({
  agencyName: z.string().trim().min(2, "Agency name is too short").max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .max(40)
    .regex(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/, "Lowercase letters, numbers and hyphens only"),
  ownerEmail: z.string().trim().toLowerCase().email(),
  ownerName: z.string().trim().min(1).max(120).optional(),
  plan: tenantPlanSchema.default("free"),
});
export type CreateTenantInput = z.infer<typeof createTenantSchema>;

export const updateTenantSchema = z.object({
  agencyName: z.string().trim().min(2).max(120).optional(),
  plan: tenantPlanSchema.optional(),
  status: tenantStatusSchema.optional(),
});
export type UpdateTenantInput = z.infer<typeof updateTenantSchema>;

// ---------------------------------------------------------------------------
// Platform Staff
// ---------------------------------------------------------------------------
export interface StaffListItem {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  department: StaffDepartment;
  roleId: string | null;
  roleName: string | null;
  status: StaffStatus;
  twoFactorEnabled: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export const staffListQuerySchema = listQuerySchema.extend({
  department: staffDepartmentSchema.optional(),
  status: staffStatusSchema.optional(),
});
export type StaffListQuery = z.infer<typeof staffListQuerySchema>;

export const createStaffSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email(),
  department: staffDepartmentSchema,
  roleId: z.string().uuid(),
  password: z.string().min(12).max(128).optional(),
});
export type CreateStaffInput = z.infer<typeof createStaffSchema>;

export const updateStaffSchema = z.object({
  fullName: z.string().trim().min(2).max(120).optional(),
  department: staffDepartmentSchema.optional(),
  roleId: z.string().uuid().optional(),
  status: staffStatusSchema.optional(),
});
export type UpdateStaffInput = z.infer<typeof updateStaffSchema>;

// ---------------------------------------------------------------------------
// Roles
// ---------------------------------------------------------------------------
export interface RoleListItem {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  permissionsCount: number;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface RoleDetail extends RoleListItem {
  permissionKeys: string[];
}

export const createRoleSchema = z.object({
  name: z.string().trim().min(2, "Role name is too short").max(60),
  description: z.string().trim().max(280).default(""),
  permissionKeys: z.array(z.string()).default([]),
});
export type CreateRoleInput = z.infer<typeof createRoleSchema>;

export const updateRoleSchema = z.object({
  name: z.string().trim().min(2).max(60).optional(),
  description: z.string().trim().max(280).optional(),
  permissionKeys: z.array(z.string()).optional(),
});
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;

// ---------------------------------------------------------------------------
// Permissions (read-only)
// ---------------------------------------------------------------------------
export interface PermissionListItem {
  key: string;
  module: string;
  action: string;
  description: string;
  assignedRoles: string[];
  createdAt: string;
}
export const permissionListQuerySchema = listQuerySchema.extend({
  module: z.string().max(40).optional(),
});
export type PermissionListQuery = z.infer<typeof permissionListQuerySchema>;

// ---------------------------------------------------------------------------
// Navigation (Access Management tree) — shared so sidebar + routes stay in sync
// ---------------------------------------------------------------------------
export const ACCESS_MANAGEMENT_NAV = [
  { label: "Tenants", href: "/tenants", permission: "tenant.view" },
  { label: "Platform Staff", href: "/staff", permission: "staff.view" },
  { label: "Roles", href: "/roles", permission: "role.view" },
  { label: "Permissions", href: "/permissions", permission: "permission.view" },
] as const;

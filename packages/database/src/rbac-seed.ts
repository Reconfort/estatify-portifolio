/**
 * RBAC catalog sync. Idempotent — safe to run on every boot/deploy.
 *  - Permissions: upserted from @estatify/types PERMISSION_CATALOG (the code is
 *    the source of truth; permissions are read-only in the product).
 *  - Default roles: created only if absent, so re-running never clobbers roles
 *    an admin has edited.
 *
 * Run standalone:  pnpm --filter @estatify/database run rbac:sync
 */
import { ALL_PERMISSION_KEYS, DEFAULT_ROLES, PERMISSION_CATALOG } from "@estatify/types";
import type { StaffDepartment } from "@estatify/types";
import { prisma } from "./client";

export async function syncRbac(): Promise<void> {
  for (const p of PERMISSION_CATALOG) {
    await prisma.permission.upsert({
      where: { key: p.key },
      update: { module: p.module, action: p.action, description: p.description },
      create: { key: p.key, module: p.module, action: p.action, description: p.description },
    });
  }

  const perms = await prisma.permission.findMany({ select: { id: true, key: true } });
  const idByKey = new Map(perms.map((p) => [p.key, p.id]));

  for (const r of DEFAULT_ROLES) {
    if (await prisma.role.findUnique({ where: { name: r.name }, select: { id: true } })) continue;
    const keys = r.permissions === "*" ? ALL_PERMISSION_KEYS : r.permissions;
    const role = await prisma.role.create({
      data: { name: r.name, description: r.description, isSystem: r.isSystem },
    });
    await prisma.rolePermission.createMany({
      data: keys
        .map((k) => idByKey.get(k))
        .filter((id): id is string => Boolean(id))
        .map((permissionId) => ({ roleId: role.id, permissionId })),
      skipDuplicates: true,
    });
  }
}

/** Attach (or update) a StaffProfile for an existing platform user. */
export async function attachStaff(opts: {
  email: string;
  fullName: string;
  roleName: string;
  department?: StaffDepartment;
}): Promise<void> {
  const user = await prisma.user.findUnique({ where: { email: opts.email }, select: { id: true } });
  if (!user) return;
  const role = await prisma.role.findUnique({
    where: { name: opts.roleName },
    select: { id: true },
  });
  await prisma.staffProfile.upsert({
    where: { userId: user.id },
    update: {
      fullName: opts.fullName,
      roleId: role?.id ?? null,
      status: "active",
      deletedAt: null,
    },
    create: {
      userId: user.id,
      fullName: opts.fullName,
      roleId: role?.id ?? null,
      department: opts.department ?? "executive",
      status: "active",
    },
  });
}

// Standalone entry (not triggered when imported by seed.ts).
if (process.argv[1]?.endsWith("rbac-seed.ts")) {
  syncRbac()
    .then(async () => {
      console.log(`synced ${PERMISSION_CATALOG.length} permissions + default roles`);
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}

/**
 * Dev seed — two isolated tenants + an owner each, plus a platform admin.
 * Deliberately creates TWO tenants so the cross-tenant isolation test has real
 * data on both sides. Run: pnpm --filter @estatify/database run seed
 *
 * Tenant-scoped inserts (Agency, Membership) go through withTenant() because RLS
 * is FORCEd — even seeding must set the tenant GUC.
 */
import argon2 from "argon2";
import { prisma } from "./client";
import { withTenant } from "./tenant";
import { attachStaff, syncRbac } from "./rbac-seed";

async function createTenant(slug: string, agencyName: string, ownerEmail: string) {
  const passwordHash = await argon2.hash("Password123!", { type: argon2.argon2id });

  const existing = await prisma.tenant.findUnique({ where: { slug } });
  if (existing) {
    console.log(`tenant ${slug} already exists (${existing.id}) — skipping`);
    return existing;
  }

  const tenant = await prisma.tenant.create({
    data: { slug, status: "active" },
  });

  const user = await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {},
    create: { email: ownerEmail, passwordHash, emailVerified: true },
  });

  await withTenant(prisma, tenant.id, async (tx) => {
    await tx.agency.create({ data: { tenantId: tenant.id, name: agencyName } });
    await tx.membership.create({
      data: { tenantId: tenant.id, userId: user.id, role: "owner" },
    });
  });

  console.log(`seeded tenant ${slug} (${tenant.id}) owner=${ownerEmail}`);
  return tenant;
}

async function main() {
  // RBAC catalog first — roles must exist before we attach staff to them.
  await syncRbac();
  console.log("synced permission catalog + default roles");

  await createTenant("acme", "Acme Realty", "owner@acme.test");
  await createTenant("globex", "Globex Homes", "owner@globex.test");

  const platformHash = await argon2.hash("Password123!", { type: argon2.argon2id });
  await prisma.user.upsert({
    where: { email: "staff@estatify.com" },
    update: { isPlatformStaff: true, platformRole: "superadmin", emailVerified: true },
    create: {
      email: "staff@estatify.com",
      passwordHash: platformHash,
      emailVerified: true,
      isPlatformStaff: true,
      platformRole: "superadmin",
    },
  });
  await attachStaff({
    email: "staff@estatify.com",
    fullName: "Estatify Admin",
    roleName: "Super Admin",
    department: "executive",
  });
  console.log("seeded platform superadmin staff@estatify.com (Super Admin)");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

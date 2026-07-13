/**
 * EXIT CRITERION 3 — "No tenant can access another tenant's data."
 *
 * This is the headline proof of the milestone. It talks to the DATABASE directly
 * (no HTTP) so it isolates the RLS layer from application code. Requires the dev
 * stack running and migrations + RLS applied:
 *
 *   docker compose up -d
 *   pnpm --filter @estatify/database exec prisma migrate deploy
 *   # ensure prisma/rls.sql has been applied as a migration
 *   pnpm --filter @estatify/api exec jest --config test/jest-e2e.json rls-isolation
 *
 * CRITICAL: DATABASE_URL must point at the NON-superuser `estatify_app` role, or
 * RLS is bypassed and this suite would falsely pass.
 */
import { randomUUID } from "node:crypto";
import { prisma, withTenant } from "@estatify/database";

const DUMMY_HASH = "$argon2id$v=19$m=65536,t=3,p=4$dummy$dummy"; // shape only; not verified here

async function makeTenant(slug: string, agencyName: string, ownerEmail: string) {
  const tenantId = randomUUID();
  const userId = randomUUID();
  await withTenant(
    tenantId,
    async (tx) => {
      await tx.tenant.create({ data: { id: tenantId, slug, status: "active" } });
      await tx.user.create({ data: { id: userId, email: ownerEmail, passwordHash: DUMMY_HASH } });
      await tx.agency.create({ data: { tenantId, name: agencyName } });
      await tx.membership.create({ data: { tenantId, userId, role: "owner" } });
    },
    { userId },
  );
  return { tenantId, userId };
}

describe("RLS tenant isolation", () => {
  const suffix = randomUUID().slice(0, 8);
  let a: { tenantId: string; userId: string };
  let b: { tenantId: string; userId: string };

  beforeAll(async () => {
    a = await makeTenant(`acme-${suffix}`, "Acme Realty", `a-${suffix}@test.local`);
    b = await makeTenant(`globex-${suffix}`, "Globex Homes", `b-${suffix}@test.local`);
  });

  afterAll(async () => {
    // Cleanup runs without a tenant GUC; Tenant is not RLS-scoped, and cascade
    // deletes remove the scoped children.
    await prisma.tenant.deleteMany({ where: { id: { in: [a.tenantId, b.tenantId] } } });
    await prisma.user.deleteMany({ where: { id: { in: [a.userId, b.userId] } } });
    await prisma.$disconnect();
  });

  it("scopes reads to the active tenant", async () => {
    const seenByA = await withTenant(a.tenantId, (tx) => tx.agency.findMany());
    expect(seenByA).toHaveLength(1);
    expect(seenByA[0].tenantId).toBe(a.tenantId);
  });

  it("cannot read another tenant's row even by explicit id", async () => {
    const bAgencyFromA = await withTenant(a.tenantId, (tx) =>
      tx.agency.findFirst({ where: { tenantId: b.tenantId } }),
    );
    expect(bAgencyFromA).toBeNull();
  });

  it("RLS — not application code — is the control (no GUC ⇒ zero rows)", async () => {
    // Deliberately query WITHOUT withTenant(): no app.current_tenant is set, so
    // current_setting(..., true) is NULL and the policy matches nothing.
    const leaked = await prisma.agency.findMany();
    expect(leaked).toHaveLength(0);
  });

  it("blocks cross-tenant writes", async () => {
    const updated = await withTenant(a.tenantId, (tx) =>
      tx.agency.updateMany({ where: { tenantId: b.tenantId }, data: { name: "HACKED" } }),
    );
    expect(updated.count).toBe(0);

    const bStillIntact = await withTenant(b.tenantId, (tx) =>
      tx.agency.findFirst({ where: { tenantId: b.tenantId } }),
    );
    expect(bStillIntact?.name).toBe("Globex Homes");
  });

  it("lets a user read their OWN memberships across tenants, but not others'", async () => {
    const own = await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_user', ${a.userId}, true)`;
      return tx.membership.findMany();
    });
    expect(own).toHaveLength(1);
    expect(own[0].userId).toBe(a.userId);
  });
});

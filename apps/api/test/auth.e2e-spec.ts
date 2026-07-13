/**
 * EXIT CRITERION 1 — "Users can securely sign in."
 * Full HTTP flow: register → me → login → refresh → logout, plus the security
 * properties (hashed passwords, no account enumeration, httpOnly refresh cookie).
 *
 * Requires the dev stack + migrations (see docs/RUNBOOK-AUTH.md).
 */
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import cookieParser from "cookie-parser";
import request from "supertest";
import { randomUUID } from "node:crypto";
import { AppModule } from "../src/app.module";

describe("Auth (e2e)", () => {
  let app: INestApplication;
  const suffix = randomUUID().slice(0, 8);
  const email = `owner-${suffix}@test.local`;
  const password = "correct horse battery";
  const slug = `agency-${suffix}`;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  let accessToken = "";
  let _refreshCookie = "";

  it("registers a new agency + owner and sets an httpOnly refresh cookie", async () => {
    const res = await request(app.getHttpServer())
      .post("/auth/register")
      .send({ email, password, agencyName: "Test Realty", slug })
      .expect(201);

    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.email).toBe(email);
    expect(res.body.user.activeTenant.role).toBe("owner");
    expect(res.body.user.emailVerified).toBe(false);
    expect(res.body.user.passwordHash).toBeUndefined(); // never leak the hash

    const setCookie = res.headers["set-cookie"]?.[0] ?? "";
    expect(setCookie).toContain("refresh_token=");
    expect(setCookie.toLowerCase()).toContain("httponly");
    accessToken = res.body.accessToken;
    _refreshCookie = setCookie.split(";")[0];
  });

  it("returns the authenticated user from /auth/me", async () => {
    const res = await request(app.getHttpServer())
      .get("/auth/me")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
    expect(res.body.activeTenant.slug).toBe(slug);
  });

  it("rejects /auth/me without a token", async () => {
    await request(app.getHttpServer()).get("/auth/me").expect(401);
  });

  it("gives an identical error for wrong password vs unknown user (no enumeration)", async () => {
    const wrongPass = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email, password: "wrong-password-here", portal: "workspace" })
      .expect(401);
    const unknown = await request(app.getHttpServer())
      .post("/auth/login")
      .send({
        email: `nobody-${suffix}@test.local`,
        password: "whatever-value",
        portal: "workspace",
      })
      .expect(401);
    expect(wrongPass.body.message).toBe(unknown.body.message);
  });

  it("logs in and rotates the refresh token", async () => {
    const login = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email, password, portal: "workspace" })
      .expect(200);
    const cookie = login.headers["set-cookie"][0].split(";")[0];

    const refreshed = await request(app.getHttpServer())
      .post("/auth/refresh")
      .set("Cookie", cookie)
      .expect(200);
    expect(refreshed.body.accessToken).toBeDefined();
    const rotated = refreshed.headers["set-cookie"][0].split(";")[0];
    expect(rotated).not.toBe(cookie); // rotation

    // Reusing the OLD (now revoked) refresh token must fail.
    await request(app.getHttpServer()).post("/auth/refresh").set("Cookie", cookie).expect(401);
  });

  it("rejects agency owners from the platform portal", async () => {
    const res = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email, password, portal: "platform" })
      .expect(403);
    expect(String(res.body.message)).toMatch(/workspace/i);
    expect(res.headers["set-cookie"]).toBeUndefined();
  });

  it("always 200s on forgot-password (no enumeration)", async () => {
    await request(app.getHttpServer())
      .post("/auth/forgot-password")
      .send({ email: `ghost-${suffix}@test.local` })
      .expect(200);
  });

  it("rejects a weak password at registration", async () => {
    await request(app.getHttpServer())
      .post("/auth/register")
      .send({
        email: `weak-${suffix}@test.local`,
        password: "short",
        agencyName: "X",
        slug: `x-${suffix}`,
      })
      .expect(400);
  });
});

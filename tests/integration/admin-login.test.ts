import { beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/jwt";
import { makeRequest, uniqueIp } from "../helpers/request";

vi.mock("@/lib/prisma", async () => {
  const { createPrismaMock } = await import("../helpers/prisma-mock");
  return { default: createPrismaMock() };
});

vi.mock("next/headers", async () => {
  const { vi: vitest } = await import("vitest");
  const store = { set: vitest.fn(), get: vitest.fn(), delete: vitest.fn() };
  return { cookies: vitest.fn(async () => store) };
});

import realPrisma from "@/lib/prisma";
import type { PrismaMock } from "../helpers/prisma-mock";
import { cookies } from "next/headers";
import { POST } from "@/app/api/admin/login/route";

// The module is mocked above; this cast exposes the mock's loose signatures so
// fixtures need not satisfy full Prisma row types.
const prisma = realPrisma as unknown as PrismaMock;


const PASSWORD = "correct-horse-battery";
let passwordHash: string;

const ADMIN = {
  id: 1,
  email: "admin@example.com",
  name: "Admin",
};

/** Posts credentials from a caller that has not been throttled before. */
function login(
  body: unknown,
  ip: string = uniqueIp(),
  options: { rawBody?: string } = {},
) {
  return makeRequest("https://example.com/api/admin/login", {
    headers: { "x-forwarded-for": ip },
    body: options.rawBody ? undefined : body,
    rawBody: options.rawBody,
  });
}

async function cookieStore() {
  return (await cookies()) as unknown as { set: ReturnType<typeof vi.fn> };
}

beforeAll(async () => {
  passwordHash = await bcrypt.hash(PASSWORD, 10);
});

beforeEach(async () => {
  vi.clearAllMocks();
  prisma.user.findUnique.mockResolvedValue(null);
});

describe("POST /api/admin/login — input validation", () => {
  test.each([
    [{}, "an empty body"],
    [{ email: "admin@example.com" }, "a missing password"],
    [{ password: PASSWORD }, "a missing email"],
    [{ email: "", password: "" }, "blank credentials"],
  ])("returns 400 for %j (%s)", async (body, _label) => {
    const res = await POST(login(body));
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      error: "Email and password are required",
    });
  });

  test("returns 500 when the body is not valid JSON", async () => {
    const res = await POST(login(null, uniqueIp(), { rawBody: "{not json" }));
    expect(res.status).toBe(500);
  });
});

describe("POST /api/admin/login — credentials", () => {
  test("rejects an unknown email", async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const res = await POST(login({ email: "nobody@example.com", password: PASSWORD }));

    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({ error: "Invalid credentials" });
  });

  test("rejects a wrong password", async () => {
    prisma.user.findUnique.mockResolvedValue({
      ...ADMIN,
      password: passwordHash,
    });

    const res = await POST(
      login({ email: ADMIN.email, password: "wrong-password" }),
    );

    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({ error: "Invalid credentials" });
  });

  test("gives the same answer for an unknown user and a bad password", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    const unknown = await (await POST(login({ email: "a@b.c", password: PASSWORD }))).json();

    prisma.user.findUnique.mockResolvedValue({
      ...ADMIN,
      password: passwordHash,
    });
    const badPassword = await (
      await POST(login({ email: ADMIN.email, password: "nope" }))
    ).json();

    // No user-enumeration signal in the response body.
    expect(unknown).toEqual(badPassword);
  });

  test("never sets a cookie on a failed attempt", async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await POST(login({ email: "nobody@example.com", password: PASSWORD }));

    const store = await cookieStore();
    expect(store.set).not.toHaveBeenCalled();
  });

  test("accepts correct credentials", async () => {
    prisma.user.findUnique.mockResolvedValue({
      ...ADMIN,
      password: passwordHash,
    });

    const res = await POST(login({ email: ADMIN.email, password: PASSWORD }));

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ success: true });
  });

  test("looks the user up by the submitted email", async () => {
    prisma.user.findUnique.mockResolvedValue({
      ...ADMIN,
      password: passwordHash,
    });

    await POST(login({ email: ADMIN.email, password: PASSWORD }));

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: ADMIN.email },
    });
  });
});

describe("POST /api/admin/login — session cookie", () => {
  beforeEach(() => {
    prisma.user.findUnique.mockResolvedValue({
      ...ADMIN,
      password: passwordHash,
    });
  });

  test("issues an httpOnly, lax, seven-day admin-token", async () => {
    await POST(login({ email: ADMIN.email, password: PASSWORD }));

    const store = await cookieStore();
    const [name, , options] = store.set.mock.calls[0];

    expect(name).toBe("admin-token");
    expect(options).toMatchObject({
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
  });

  test("the token carries the authenticated user's id and email", async () => {
    await POST(login({ email: ADMIN.email, password: PASSWORD }));

    const store = await cookieStore();
    const [, token] = store.set.mock.calls[0];

    expect(verifyToken(token)).toMatchObject({
      userId: ADMIN.id,
      email: ADMIN.email,
    });
  });

  test("the token is not the raw password or hash", async () => {
    await POST(login({ email: ADMIN.email, password: PASSWORD }));

    const store = await cookieStore();
    const [, token] = store.set.mock.calls[0];

    expect(token).not.toContain(PASSWORD);
    expect(token).not.toContain(passwordHash);
  });
});

describe("POST /api/admin/login — brute-force throttling", () => {
  test("blocks the sixth attempt from one address within a minute", async () => {
    const ip = uniqueIp();
    prisma.user.findUnique.mockResolvedValue(null);

    for (let attempt = 1; attempt <= 5; attempt++) {
      const res = await POST(login({ email: "a@b.c", password: PASSWORD }, ip));
      expect(res.status).toBe(401);
    }

    const blocked = await POST(login({ email: "a@b.c", password: PASSWORD }, ip));
    expect(blocked.status).toBe(429);
  });

  test("the throttled response tells the caller when to retry", async () => {
    const ip = uniqueIp();
    prisma.user.findUnique.mockResolvedValue(null);

    for (let attempt = 1; attempt <= 5; attempt++) {
      await POST(login({ email: "a@b.c", password: PASSWORD }, ip));
    }
    const blocked = await POST(login({ email: "a@b.c", password: PASSWORD }, ip));

    expect(blocked.headers.get("Retry-After")).toBeTruthy();
    await expect(blocked.json()).resolves.toMatchObject({
      error: "Too many login attempts. Please try again later.",
    });
  });

  test("throttles per address, so one attacker cannot lock out everyone", async () => {
    const attacker = uniqueIp();
    prisma.user.findUnique.mockResolvedValue(null);

    for (let attempt = 1; attempt <= 6; attempt++) {
      await POST(login({ email: "a@b.c", password: PASSWORD }, attacker));
    }

    prisma.user.findUnique.mockResolvedValue({
      ...ADMIN,
      password: passwordHash,
    });
    const legitimate = await POST(
      login({ email: ADMIN.email, password: PASSWORD }, uniqueIp()),
    );

    expect(legitimate.status).toBe(200);
  });

  test("throttles before reaching the database", async () => {
    const ip = uniqueIp();
    prisma.user.findUnique.mockResolvedValue(null);

    for (let attempt = 1; attempt <= 5; attempt++) {
      await POST(login({ email: "a@b.c", password: PASSWORD }, ip));
    }
    const callsBefore = prisma.user.findUnique.mock.calls.length;

    await POST(login({ email: "a@b.c", password: PASSWORD }, ip));

    // A refused request must not cost a query or a bcrypt comparison.
    expect(prisma.user.findUnique.mock.calls.length).toBe(callsBefore);
  });

  test("is not keyed on the submitted email", async () => {
    const ip = uniqueIp();
    prisma.user.findUnique.mockResolvedValue(null);

    // Rotating the email must not buy the attacker a fresh budget.
    for (let attempt = 1; attempt <= 5; attempt++) {
      await POST(login({ email: `user${attempt}@example.com`, password: PASSWORD }, ip));
    }
    const blocked = await POST(
      login({ email: "user6@example.com", password: PASSWORD }, ip),
    );

    expect(blocked.status).toBe(429);
  });
});

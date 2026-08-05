import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("@/lib/prisma", async () => {
  const { createPrismaMock } = await import("../helpers/prisma-mock");
  return { default: createPrismaMock() };
});

vi.mock("next/headers", async () => {
  const { vi: vitest } = await import("vitest");
  const store = { get: vitest.fn(), set: vitest.fn(), delete: vitest.fn() };
  return { cookies: vitest.fn(async () => store) };
});

import realPrisma from "@/lib/prisma";
import type { PrismaMock } from "../helpers/prisma-mock";
import { cookies } from "next/headers";
import { getAdminUser, getUser } from "@/lib/auth";
import { signToken } from "@/lib/jwt";

// The module is mocked above; this cast exposes the mock's loose signatures so
// fixtures need not satisfy full Prisma row types.
const prisma = realPrisma as unknown as PrismaMock;


const ADMIN = { id: 1, email: "admin@example.com", name: "Admin" };

async function cookieStore() {
  return (await cookies()) as unknown as { get: ReturnType<typeof vi.fn> };
}

/** Makes the cookie jar answer with `value` for `name`, and nothing else. */
async function setCookie(name: string, value: string | undefined) {
  const store = await cookieStore();
  store.get.mockImplementation((requested: string) =>
    requested === name && value !== undefined ? { value } : undefined,
  );
}

beforeEach(async () => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
  (await cookieStore()).get.mockReturnValue(undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe.each([
  ["getAdminUser", getAdminUser, "admin-token"],
  ["getUser", getUser, "user-token"],
])("%s", (_name, resolve, cookieName) => {
  test("returns null when the cookie is absent", async () => {
    await expect(resolve()).resolves.toBeNull();
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  test("returns null for a token that does not verify", async () => {
    await setCookie(cookieName, "not-a-real-token");

    await expect(resolve()).resolves.toBeNull();
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  test("returns null when the token is valid but the user is gone", async () => {
    await setCookie(cookieName, signToken({ userId: 1, email: ADMIN.email }));
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(resolve()).resolves.toBeNull();
  });

  test("resolves the user for a valid token", async () => {
    await setCookie(cookieName, signToken({ userId: 1, email: ADMIN.email }));
    prisma.user.findUnique.mockResolvedValue(ADMIN);

    await expect(resolve()).resolves.toEqual(ADMIN);
  });

  test("looks the user up by the id inside the token, not the email", async () => {
    await setCookie(cookieName, signToken({ userId: 42, email: ADMIN.email }));
    prisma.user.findUnique.mockResolvedValue(ADMIN);

    await resolve();

    expect(prisma.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 42 } }),
    );
  });

  test("never selects the password hash", async () => {
    await setCookie(cookieName, signToken({ userId: 1, email: ADMIN.email }));
    prisma.user.findUnique.mockResolvedValue(ADMIN);

    await resolve();

    const { select } = prisma.user.findUnique.mock.calls[0][0];
    expect(select).toEqual({ id: true, email: true, name: true });
    expect(select).not.toHaveProperty("password");
  });

  test("fails closed when the database is unreachable", async () => {
    await setCookie(cookieName, signToken({ userId: 1, email: ADMIN.email }));
    prisma.user.findUnique.mockRejectedValue(new Error("boom"));

    await expect(resolve()).resolves.toBeNull();
    expect(console.error).toHaveBeenCalled();
  });

  test("ignores the other role's cookie", async () => {
    const otherCookie =
      cookieName === "admin-token" ? "user-token" : "admin-token";
    await setCookie(otherCookie, signToken({ userId: 1, email: ADMIN.email }));
    prisma.user.findUnique.mockResolvedValue(ADMIN);

    await expect(resolve()).resolves.toBeNull();
  });

  test("fails closed when JWT_SECRET is missing", async () => {
    await setCookie(cookieName, "some.token.value");
    const original = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;

    try {
      // A thrown configuration error must not be mistaken for a valid session.
      await expect(resolve()).resolves.toBeNull();
    } finally {
      process.env.JWT_SECRET = original;
    }
  });
});

import { beforeEach, describe, expect, test, vi } from "vitest";
import { makeRequest } from "../helpers/request";

vi.mock("next/headers", async () => {
  const { vi: vitest } = await import("vitest");
  const store = { get: vitest.fn(), set: vitest.fn(), delete: vitest.fn() };
  return { cookies: vitest.fn(async () => store) };
});

import { cookies } from "next/headers";
import { POST as logout } from "@/app/api/admin/logout/route";
import { POST as legacyAuth } from "@/app/api/auth/route";

async function cookieStore() {
  return (await cookies()) as unknown as { delete: ReturnType<typeof vi.fn> };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/admin/logout", () => {
  test("clears the admin session cookie", async () => {
    await logout();

    const store = await cookieStore();
    expect(store.delete).toHaveBeenCalledWith("admin-token");
  });

  test("reports success", async () => {
    const res = await logout();

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ success: true });
  });
});

describe("POST /api/auth (legacy stub)", () => {
  const url = "https://example.com/api/auth";

  test.each([
    [{ email: "", password: "" }, "Email and password are required"],
    [{ email: "bad-email", password: "hunter2!" }, "Invalid email format"],
    [{ email: "a@b.c", password: "12345" }, "Password must be at least 6 characters"],
  ])("rejects %j with 400", async (body, error) => {
    const res = await legacyAuth(makeRequest(url, { body }));

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error });
  });

  test("returns a placeholder token for valid input", async () => {
    const res = await legacyAuth(
      makeRequest(url, { body: { email: "a@b.c", password: "hunter2!" } }),
    );

    // This endpoint is a leftover stub: it authenticates nobody and issues a
    // string that /lib/jwt would never accept. Real login is /api/admin/login.
    await expect(res.json()).resolves.toEqual({
      data: { token: "fake token" },
    });
  });

  test("grants no session cookie", async () => {
    const res = await legacyAuth(
      makeRequest(url, { body: { email: "a@b.c", password: "hunter2!" } }),
    );

    expect(res.headers.get("set-cookie")).toBeNull();
  });
});

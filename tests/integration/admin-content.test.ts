import { beforeEach, describe, expect, test, vi } from "vitest";
import { makeRequest } from "../helpers/request";

vi.mock("@/lib/prisma", async () => {
  const { createPrismaMock } = await import("../helpers/prisma-mock");
  return { default: createPrismaMock() };
});

vi.mock("@/lib/auth", async () => {
  const { vi: vitest } = await import("vitest");
  return { getAdminUser: vitest.fn(), getUser: vitest.fn() };
});

import realPrisma from "@/lib/prisma";
import type { PrismaMock } from "../helpers/prisma-mock";
import { getAdminUser } from "@/lib/auth";
import { GET, PUT } from "@/app/api/admin/content/[key]/route";
import { DEFAULT_HEADER } from "@/lib/content-defaults";

// The module is mocked above; this cast exposes the mock's loose signatures so
// fixtures need not satisfy full Prisma row types.
const prisma = realPrisma as unknown as PrismaMock;


const ADMIN = { id: 1, email: "admin@example.com", name: "Admin" };
const url = "https://example.com/api/admin/content/header";
const keyParams = (key: string) => ({ params: Promise.resolve({ key }) });

const ALLOWED_KEYS = ["header", "hero", "infobox", "footer", "tags"];

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.mocked(getAdminUser).mockResolvedValue(ADMIN);
  prisma.siteContent.findUnique.mockResolvedValue(null);
});

describe("authorization", () => {
  test("GET returns 401 when signed out", async () => {
    vi.mocked(getAdminUser).mockResolvedValue(null);

    const res = await GET(makeRequest(url), keyParams("header"));

    expect(res.status).toBe(401);
  });

  test("PUT returns 401 when signed out", async () => {
    vi.mocked(getAdminUser).mockResolvedValue(null);

    const res = await PUT(makeRequest(url, { body: { a: 1 } }), keyParams("header"));

    expect(res.status).toBe(401);
    expect(prisma.siteContent.upsert).not.toHaveBeenCalled();
  });
});

describe("content key allowlist", () => {
  test.each(ALLOWED_KEYS)("accepts the known key %s", async (key) => {
    const res = await GET(makeRequest(url), keyParams(key));
    expect(res.status).toBe(200);
  });

  test.each([
    ["unknown"],
    ["__proto__"],
    ["../../etc/passwd"],
    [""],
  ])("rejects the unknown key %s with 404", async (key) => {
    const res = await GET(makeRequest(url), keyParams(key));
    expect(res.status).toBe(404);
    await expect(res.json()).resolves.toEqual({ error: "Unknown content key" });
  });

  test("refuses to write to an unknown key", async () => {
    const res = await PUT(
      makeRequest(url, { body: { evil: true } }),
      keyParams("unknown"),
    );

    expect(res.status).toBe(404);
    expect(prisma.siteContent.upsert).not.toHaveBeenCalled();
  });
});

describe("GET /api/admin/content/[key]", () => {
  test("returns the effective content, defaults included", async () => {
    const res = await GET(makeRequest(url), keyParams("header"));

    await expect(res.json()).resolves.toEqual(DEFAULT_HEADER);
  });

  test("merges stored values over the defaults", async () => {
    prisma.siteContent.findUnique.mockResolvedValue({
      key: "header",
      data: { availability: "Booked" },
    });

    const res = await GET(makeRequest(url), keyParams("header"));
    const body = await res.json();

    expect(body.availability).toBe("Booked");
    expect(body.email).toBe(DEFAULT_HEADER.email);
  });
});

describe("PUT /api/admin/content/[key]", () => {
  beforeEach(() => {
    prisma.siteContent.upsert.mockImplementation(
      async ({ update }: { update: { data: unknown } }) => ({
        key: "header",
        data: update.data,
      }),
    );
  });

  test("saves an object payload", async () => {
    const payload = { email: "new@example.com", location: "Addis Ababa" };

    const res = await PUT(makeRequest(url, { body: payload }), keyParams("header"));

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual(payload);
  });

  test("upserts under the requested key", async () => {
    await PUT(makeRequest(url, { body: { a: 1 } }), keyParams("footer"));

    expect(prisma.siteContent.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { key: "footer" } }),
    );
  });

  test.each([
    ["[1,2,3]", "an array"],
    ["null", "null"],
    ['"a string"', "a bare string"],
    ["42", "a number"],
  ])("rejects the payload %s (%s) with 400", async (rawBody) => {
    const res = await PUT(makeRequest(url, { rawBody }), keyParams("header"));

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      error: "Content payload must be an object",
    });
    expect(prisma.siteContent.upsert).not.toHaveBeenCalled();
  });

  test("returns 500 when the body is not valid JSON", async () => {
    const res = await PUT(makeRequest(url, { rawBody: "{oops" }), keyParams("header"));

    expect(res.status).toBe(500);
  });

  test("returns 500 when the write fails", async () => {
    prisma.siteContent.upsert.mockRejectedValue(new Error("boom"));

    const res = await PUT(makeRequest(url, { body: { a: 1 } }), keyParams("header"));

    expect(res.status).toBe(500);
  });
});

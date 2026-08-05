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
import { GET, POST } from "@/app/api/admin/sections/route";
import {
  DELETE as DELETE_BY_ID,
  GET as GET_BY_ID,
  PUT as PUT_BY_ID,
} from "@/app/api/admin/sections/[id]/route";

// The module is mocked above; this cast exposes the mock's loose signatures so
// fixtures need not satisfy full Prisma row types.
const prisma = realPrisma as unknown as PrismaMock;


const ADMIN = { id: 1, email: "admin@example.com", name: "Admin" };
const url = "https://example.com/api/admin/sections";

const SECTION = {
  id: 5,
  key: "early-life",
  title: "Early life",
  level: 2,
  body: "<p>text</p>",
  order: 10,
  inToc: true,
  published: true,
  special: "",
};

const idParams = (id: string) => ({ params: Promise.resolve({ id }) });

function signedIn() {
  vi.mocked(getAdminUser).mockResolvedValue(ADMIN);
}

function signedOut() {
  vi.mocked(getAdminUser).mockResolvedValue(null);
}

beforeEach(() => {
  vi.clearAllMocks();
  signedIn();
});

describe("authorization", () => {
  const unauthenticatedCalls: [string, () => Promise<Response>][] = [
    ["GET /sections", () => GET()],
    ["POST /sections", () => POST(makeRequest(url, { body: { title: "x" } }))],
    ["GET /sections/[id]", () => GET_BY_ID(makeRequest(url), idParams("5"))],
    [
      "PUT /sections/[id]",
      () => PUT_BY_ID(makeRequest(url, { body: { title: "x", key: "x" } }), idParams("5")),
    ],
    [
      "DELETE /sections/[id]",
      () => DELETE_BY_ID(makeRequest(url, { method: "DELETE" }), idParams("5")),
    ],
  ];

  test.each(unauthenticatedCalls)("%s returns 401 when signed out", async (_name, call) => {
    signedOut();
    const res = await call();
    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({ error: "Unauthorized" });
  });

  test.each(unauthenticatedCalls)(
    "%s touches no data when signed out",
    async (_name, call) => {
      signedOut();
      await call();
      expect(prisma.articleSection.create).not.toHaveBeenCalled();
      expect(prisma.articleSection.update).not.toHaveBeenCalled();
      expect(prisma.articleSection.delete).not.toHaveBeenCalled();
      expect(prisma.articleSection.findMany).not.toHaveBeenCalled();
    },
  );
});

describe("GET /api/admin/sections", () => {
  test("returns sections ordered for the editor", async () => {
    prisma.articleSection.findMany.mockResolvedValue([SECTION]);

    const res = await GET();

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual([SECTION]);
    expect(prisma.articleSection.findMany).toHaveBeenCalledWith({
      orderBy: { order: "asc" },
    });
  });
});

describe("POST /api/admin/sections", () => {
  beforeEach(() => {
    prisma.articleSection.findUnique.mockResolvedValue(null);
    prisma.articleSection.findFirst.mockResolvedValue(null);
    prisma.articleSection.create.mockImplementation(
      async ({ data }: { data: object }) => ({ id: 99, ...data }),
    );
  });

  test.each([[{}], [{ title: "" }], [{ title: "   " }]])(
    "rejects the payload %j with 400",
    async (body) => {
      const res = await POST(makeRequest(url, { body }));
      expect(res.status).toBe(400);
      await expect(res.json()).resolves.toEqual({ error: "Title is required" });
    },
  );

  test("creates a section and returns 201", async () => {
    const res = await POST(
      makeRequest(url, { body: { title: "Career", body: "<p>hi</p>" } }),
    );

    expect(res.status).toBe(201);
    expect(prisma.articleSection.create).toHaveBeenCalled();
  });

  test("derives the key from the title when none is supplied", async () => {
    await POST(makeRequest(url, { body: { title: "Early Life & Work" } }));

    const { data } = prisma.articleSection.create.mock.calls[0][0];
    expect(data.key).toBe("early-life-work");
  });

  test("prefers an explicit key over the derived one", async () => {
    await POST(makeRequest(url, { body: { title: "Career", key: "custom-key" } }));

    const { data } = prisma.articleSection.create.mock.calls[0][0];
    expect(data.key).toBe("custom-key");
  });

  test("rejects a title that slugifies to nothing", async () => {
    const res = await POST(makeRequest(url, { body: { title: "!!!" } }));

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      error: "A valid key or title is required",
    });
  });

  test("refuses a duplicate key", async () => {
    prisma.articleSection.findUnique.mockResolvedValue(SECTION);

    const res = await POST(makeRequest(url, { body: { title: "Early life" } }));

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toMatchObject({
      error: expect.stringContaining("already exists"),
    });
    expect(prisma.articleSection.create).not.toHaveBeenCalled();
  });

  test("appends after the current last section", async () => {
    prisma.articleSection.findFirst.mockResolvedValue({
      ...SECTION,
      order: 40,
    });

    await POST(makeRequest(url, { body: { title: "Career" } }));

    const { data } = prisma.articleSection.create.mock.calls[0][0];
    expect(data.order).toBe(50);
  });

  test("starts the ordering at 10 when there are no sections yet", async () => {
    await POST(makeRequest(url, { body: { title: "Career" } }));

    const { data } = prisma.articleSection.create.mock.calls[0][0];
    expect(data.order).toBe(10);
  });

  test("honours an explicit numeric order", async () => {
    await POST(makeRequest(url, { body: { title: "Career", order: 5 } }));

    const { data } = prisma.articleSection.create.mock.calls[0][0];
    expect(data.order).toBe(5);
  });

  test.each([
    [3, 3],
    [2, 2],
    ["3", 3],
    [4, 2],
    [undefined, 2],
    ["nonsense", 2],
  ])("clamps heading level %s to %i", async (input, expected) => {
    await POST(makeRequest(url, { body: { title: "Career", level: input } }));

    const { data } = prisma.articleSection.create.mock.calls[0][0];
    expect(data.level).toBe(expected);
  });

  test("defaults body, inToc, published and special", async () => {
    await POST(makeRequest(url, { body: { title: "Career" } }));

    const { data } = prisma.articleSection.create.mock.calls[0][0];
    expect(data).toMatchObject({
      body: "",
      inToc: true,
      published: true,
      special: "",
    });
  });

  test("returns 500 when the database write fails", async () => {
    prisma.articleSection.create.mockRejectedValue(new Error("boom"));

    const res = await POST(makeRequest(url, { body: { title: "Career" } }));

    expect(res.status).toBe(500);
  });
});

describe("GET /api/admin/sections/[id]", () => {
  test("returns the section", async () => {
    prisma.articleSection.findUnique.mockResolvedValue(SECTION);

    const res = await GET_BY_ID(makeRequest(url), idParams("5"));

    expect(res.status).toBe(200);
    expect(prisma.articleSection.findUnique).toHaveBeenCalledWith({
      where: { id: 5 },
    });
  });

  test("returns 404 when it does not exist", async () => {
    prisma.articleSection.findUnique.mockResolvedValue(null);

    const res = await GET_BY_ID(makeRequest(url), idParams("404"));

    expect(res.status).toBe(404);
  });
});

describe("PUT /api/admin/sections/[id]", () => {
  beforeEach(() => {
    prisma.articleSection.findUnique.mockResolvedValue(null);
    prisma.articleSection.update.mockResolvedValue(SECTION);
  });

  test.each([
    [{ title: "", key: "k" }, "a blank title"],
    [{ title: "t", key: "" }, "a blank key"],
    [{}, "neither field"],
  ])("returns 400 for %j (%s)", async (body, _label) => {
    const res = await PUT_BY_ID(makeRequest(url, { body }), idParams("5"));

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      error: "Title and key are required",
    });
  });

  test("updates the section", async () => {
    const res = await PUT_BY_ID(
      makeRequest(url, { body: { title: "Updated", key: "early-life" } }),
      idParams("5"),
    );

    expect(res.status).toBe(200);
    expect(prisma.articleSection.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 5 } }),
    );
  });

  test("allows a section to keep its own key", async () => {
    prisma.articleSection.findUnique.mockResolvedValue(SECTION);

    const res = await PUT_BY_ID(
      makeRequest(url, { body: { title: "Updated", key: "early-life" } }),
      idParams("5"),
    );

    expect(res.status).toBe(200);
  });

  test("refuses a key already taken by another section", async () => {
    prisma.articleSection.findUnique.mockResolvedValue({
      ...SECTION,
      id: 6,
    });

    const res = await PUT_BY_ID(
      makeRequest(url, { body: { title: "Updated", key: "early-life" } }),
      idParams("5"),
    );

    expect(res.status).toBe(400);
    expect(prisma.articleSection.update).not.toHaveBeenCalled();
  });

  test("returns 500 when the update fails", async () => {
    prisma.articleSection.update.mockRejectedValue(new Error("boom"));

    const res = await PUT_BY_ID(
      makeRequest(url, { body: { title: "Updated", key: "k" } }),
      idParams("5"),
    );

    expect(res.status).toBe(500);
  });
});

describe("DELETE /api/admin/sections/[id]", () => {
  test("deletes the section", async () => {
    prisma.articleSection.delete.mockResolvedValue(SECTION);

    const res = await DELETE_BY_ID(
      makeRequest(url, { method: "DELETE" }),
      idParams("5"),
    );

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ success: true });
    expect(prisma.articleSection.delete).toHaveBeenCalledWith({
      where: { id: 5 },
    });
  });

  test("returns 500 when the delete fails", async () => {
    prisma.articleSection.delete.mockRejectedValue(new Error("boom"));

    const res = await DELETE_BY_ID(
      makeRequest(url, { method: "DELETE" }),
      idParams("5"),
    );

    expect(res.status).toBe(500);
  });
});

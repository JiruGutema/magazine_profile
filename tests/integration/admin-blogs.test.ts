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
import { GET, POST } from "@/app/api/admin/blogs/route";
import {
  DELETE as DELETE_BY_ID,
  GET as GET_BY_ID,
  PUT as PUT_BY_ID,
} from "@/app/api/admin/blogs/[id]/route";

// The module is mocked above; this cast exposes the mock's loose signatures so
// fixtures need not satisfy full Prisma row types.
const prisma = realPrisma as unknown as PrismaMock;


const ADMIN = { id: 1, email: "admin@example.com", name: "Admin" };
const url = "https://example.com/api/admin/blogs";
const idParams = (id: string) => ({ params: Promise.resolve({ id }) });

const POST_ROW = {
  id: 4,
  title: "A post",
  slug: "a-post",
  excerpt: "Summary",
  content: "# Body",
  author: "Jiru",
  readTime: 4,
  tags: "next,prisma",
  coverImage: null as string | null,
  publishedAt: new Date("2026-01-01T00:00:00.000Z"),
};

/** Every field the create/update handlers insist on. */
const COMPLETE_BODY = {
  title: "A post",
  excerpt: "Summary",
  content: "# Body",
  author: "Jiru",
  readTime: 4,
  tags: "next,prisma",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.mocked(getAdminUser).mockResolvedValue(ADMIN);
  prisma.blogPost.findUnique.mockResolvedValue(null);
  prisma.blogPost.create.mockImplementation(
    async ({ data }: { data: object }) => ({ id: 99, ...data }),
  );
  prisma.blogPost.update.mockResolvedValue(POST_ROW);
  prisma.blogPost.delete.mockResolvedValue(POST_ROW);
});

describe("authorization", () => {
  const calls: [string, () => Promise<Response>][] = [
    ["GET /blogs", () => GET()],
    ["POST /blogs", () => POST(makeRequest(url, { body: COMPLETE_BODY }))],
    ["GET /blogs/[id]", () => GET_BY_ID(makeRequest(url), idParams("4"))],
    [
      "PUT /blogs/[id]",
      () => PUT_BY_ID(makeRequest(url, { body: COMPLETE_BODY }), idParams("4")),
    ],
    [
      "DELETE /blogs/[id]",
      () => DELETE_BY_ID(makeRequest(url, { method: "DELETE" }), idParams("4")),
    ],
  ];

  test.each(calls)("%s returns 401 when signed out", async (_name, call) => {
    vi.mocked(getAdminUser).mockResolvedValue(null);

    const res = await call();

    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({ error: "Unauthorized" });
    expect(prisma.blogPost.create).not.toHaveBeenCalled();
    expect(prisma.blogPost.update).not.toHaveBeenCalled();
    expect(prisma.blogPost.delete).not.toHaveBeenCalled();
  });
});

describe("GET /api/admin/blogs", () => {
  test("lists posts newest first without their bodies", async () => {
    prisma.blogPost.findMany.mockResolvedValue([POST_ROW]);

    const res = await GET();

    expect(res.status).toBe(200);
    const { orderBy, select } = prisma.blogPost.findMany.mock.calls[0][0];
    expect(orderBy).toEqual({ publishedAt: "desc" });
    expect(select).not.toHaveProperty("content");
  });

  test("returns 500 when the query fails", async () => {
    prisma.blogPost.findMany.mockRejectedValue(new Error("boom"));

    expect((await GET()).status).toBe(500);
  });
});

describe("POST /api/admin/blogs", () => {
  test.each([
    ["title"],
    ["excerpt"],
    ["content"],
    ["author"],
    ["readTime"],
    ["tags"],
  ])("rejects a payload missing %s", async (field) => {
    const body: Record<string, unknown> = { ...COMPLETE_BODY };
    delete body[field];

    const res = await POST(makeRequest(url, { body }));

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "Missing required fields" });
    expect(prisma.blogPost.create).not.toHaveBeenCalled();
  });

  test("creates the post and returns 201", async () => {
    const res = await POST(makeRequest(url, { body: COMPLETE_BODY }));

    expect(res.status).toBe(201);
  });

  test("derives the slug from the title", async () => {
    await POST(
      makeRequest(url, { body: { ...COMPLETE_BODY, title: "Hello World Again" } }),
    );

    const { data } = prisma.blogPost.create.mock.calls[0][0];
    expect(data.slug).toBe("hello-world-again");
  });

  test("refuses a duplicate slug", async () => {
    prisma.blogPost.findUnique.mockResolvedValue(POST_ROW);

    const res = await POST(makeRequest(url, { body: COMPLETE_BODY }));

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      error: "A post with this slug already exists",
    });
    expect(prisma.blogPost.create).not.toHaveBeenCalled();
  });

  test("stores an absent cover image as null", async () => {
    await POST(makeRequest(url, { body: COMPLETE_BODY }));

    const { data } = prisma.blogPost.create.mock.calls[0][0];
    expect(data.coverImage).toBeNull();
  });

  test("keeps a supplied cover image", async () => {
    await POST(
      makeRequest(url, {
        body: { ...COMPLETE_BODY, coverImage: "/images/cover.png" },
      }),
    );

    const { data } = prisma.blogPost.create.mock.calls[0][0];
    expect(data.coverImage).toBe("/images/cover.png");
  });

  test("returns 500 when the write fails", async () => {
    prisma.blogPost.create.mockRejectedValue(new Error("boom"));

    const res = await POST(makeRequest(url, { body: COMPLETE_BODY }));

    expect(res.status).toBe(500);
  });
});

describe("GET /api/admin/blogs/[id]", () => {
  test("returns the post", async () => {
    prisma.blogPost.findUnique.mockResolvedValue(POST_ROW);

    const res = await GET_BY_ID(makeRequest(url), idParams("4"));

    expect(res.status).toBe(200);
    expect(prisma.blogPost.findUnique).toHaveBeenCalledWith({ where: { id: 4 } });
  });

  test("returns 404 when missing", async () => {
    prisma.blogPost.findUnique.mockResolvedValue(null);

    expect((await GET_BY_ID(makeRequest(url), idParams("404"))).status).toBe(404);
  });
});

describe("PUT /api/admin/blogs/[id]", () => {
  test("rejects an incomplete payload", async () => {
    const res = await PUT_BY_ID(
      makeRequest(url, { body: { title: "only a title" } }),
      idParams("4"),
    );

    expect(res.status).toBe(400);
    expect(prisma.blogPost.update).not.toHaveBeenCalled();
  });

  test("updates the post", async () => {
    const res = await PUT_BY_ID(
      makeRequest(url, { body: COMPLETE_BODY }),
      idParams("4"),
    );

    expect(res.status).toBe(200);
    expect(prisma.blogPost.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 4 } }),
    );
  });

  test("leaves the slug alone so published links keep working", async () => {
    await PUT_BY_ID(
      makeRequest(url, { body: { ...COMPLETE_BODY, title: "A New Title" } }),
      idParams("4"),
    );

    const { data } = prisma.blogPost.update.mock.calls[0][0];
    expect(data).not.toHaveProperty("slug");
  });

  test("returns 500 when the update fails", async () => {
    prisma.blogPost.update.mockRejectedValue(new Error("boom"));

    const res = await PUT_BY_ID(
      makeRequest(url, { body: COMPLETE_BODY }),
      idParams("4"),
    );

    expect(res.status).toBe(500);
  });
});

describe("DELETE /api/admin/blogs/[id]", () => {
  test("deletes the post", async () => {
    const res = await DELETE_BY_ID(
      makeRequest(url, { method: "DELETE" }),
      idParams("4"),
    );

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ success: true });
    expect(prisma.blogPost.delete).toHaveBeenCalledWith({ where: { id: 4 } });
  });

  test("returns 500 when the delete fails", async () => {
    prisma.blogPost.delete.mockRejectedValue(new Error("boom"));

    const res = await DELETE_BY_ID(
      makeRequest(url, { method: "DELETE" }),
      idParams("4"),
    );

    expect(res.status).toBe(500);
  });
});

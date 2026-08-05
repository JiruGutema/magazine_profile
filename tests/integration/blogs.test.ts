import { beforeEach, describe, expect, test, vi } from "vitest";
import { freshClientHeaders, makeRequest, uniqueIp } from "../helpers/request";

vi.mock("@/lib/prisma", async () => {
  const { createPrismaMock } = await import("../helpers/prisma-mock");
  return { default: createPrismaMock() };
});

import realPrisma from "@/lib/prisma";
import type { PrismaMock } from "../helpers/prisma-mock";
import { GET as listBlogs } from "@/app/api/blogs/route";
import { GET as getBlogBySlug } from "@/app/api/blogs/[slug]/route";
import { PATCH as legacyLike } from "@/app/api/blogs/like/[id]/route";
import { PATCH as legacyDislike } from "@/app/api/blogs/dislike/[id]/route";

// The module is mocked above; this cast exposes the mock's loose signatures so
// fixtures need not satisfy full Prisma row types.
const prisma = realPrisma as unknown as PrismaMock;


const ROW = {
  id: 1,
  title: "A post",
  excerpt: "Summary",
  content: "# Body",
  author: "Jiru",
  publishedAt: new Date("2026-01-01T00:00:00.000Z"),
  readTime: 4,
  tags: "next, prisma , testing",
  likes: 3,
  dislikes: 1,
  slug: "a-post",
  coverImage: null as string | null,
};

const slugParams = (slug: string) => ({ params: Promise.resolve({ slug }) });
const idParams = (id: string) => ({ params: Promise.resolve({ id }) });

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/blogs", () => {
  test("returns posts newest first", async () => {
    prisma.blogPost.findMany.mockResolvedValue([ROW]);

    const res = await listBlogs();

    await expect(res.json()).resolves.toMatchObject({
      data: [expect.objectContaining({ slug: "a-post" })],
    });
    expect(prisma.blogPost.findMany).toHaveBeenCalledWith({
      orderBy: { publishedAt: "desc" },
    });
  });

  test("returns an empty list when there are no posts", async () => {
    prisma.blogPost.findMany.mockResolvedValue([]);

    await expect((await listBlogs()).json()).resolves.toEqual({ data: [] });
  });
});

describe("GET /api/blogs/[slug]", () => {
  test("returns 404 for an unknown slug", async () => {
    prisma.blogPost.findFirst.mockResolvedValue(null);

    const res = await getBlogBySlug(makeRequest("https://x/api"), slugParams("nope"));

    expect(res.status).toBe(404);
    await expect(res.json()).resolves.toEqual({ error: "blog not found!" });
  });

  test("returns 400 when the slug is empty", async () => {
    const res = await getBlogBySlug(makeRequest("https://x/api"), slugParams(""));

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      error: "blog slug is required!",
    });
    expect(prisma.blogPost.findFirst).not.toHaveBeenCalled();
  });

  test("looks the post up by slug", async () => {
    prisma.blogPost.findFirst.mockResolvedValue(ROW);

    await getBlogBySlug(makeRequest("https://x/api"), slugParams("a-post"));

    expect(prisma.blogPost.findFirst).toHaveBeenCalledWith({
      where: { slug: "a-post" },
    });
  });

  test("splits the stored tag string into a trimmed array", async () => {
    prisma.blogPost.findFirst.mockResolvedValue(ROW);

    const res = await getBlogBySlug(makeRequest("https://x/api"), slugParams("a-post"));
    const { data } = await res.json();

    expect(data.tags).toEqual(["next", "prisma", "testing"]);
  });

  test("omits the cover image when the column is null", async () => {
    prisma.blogPost.findFirst.mockResolvedValue(ROW);

    const res = await getBlogBySlug(makeRequest("https://x/api"), slugParams("a-post"));
    const { data } = await res.json();

    expect(data.coverImage).toBeUndefined();
  });

  test("includes the cover image when present", async () => {
    prisma.blogPost.findFirst.mockResolvedValue({
      ...ROW,
      coverImage: "/images/cover.png",
    });

    const res = await getBlogBySlug(makeRequest("https://x/api"), slugParams("a-post"));
    const { data } = await res.json();

    expect(data.coverImage).toBe("/images/cover.png");
  });

  test("exposes the reaction counts", async () => {
    prisma.blogPost.findFirst.mockResolvedValue(ROW);

    const res = await getBlogBySlug(makeRequest("https://x/api"), slugParams("a-post"));
    const { data } = await res.json();

    expect(data).toMatchObject({ likes: 3, dislikes: 1 });
  });
});

describe("legacy PATCH /api/blogs/like|dislike/[id]", () => {
  const handlers: [string, typeof legacyLike][] = [
    ["like", legacyLike],
    ["dislike", legacyDislike],
  ];

  test.each(handlers)("%s rejects a non-numeric id", async (_name, handler) => {
    const res = await handler(
      makeRequest("https://x/api", { method: "PATCH" }),
      idParams("abc"),
    );

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "Invalid blog id" });
  });

  test.each(handlers)(
    "%s forwards a valid id to the secured reaction handler",
    async (name, handler) => {
      prisma.blogPost.findUnique.mockResolvedValue({
        ...ROW,
        likes: 0,
        dislikes: 0,
      });
      prisma.blogPostReaction.count.mockResolvedValue(0);
      prisma.blogPostReaction.findFirst.mockResolvedValue(null);
      prisma.blogPostReaction.create.mockResolvedValue({ id: 1 });
      prisma.blogPost.update.mockResolvedValue({
        ...ROW,
        likes: name === "like" ? 1 : 0,
        dislikes: name === "dislike" ? 1 : 0,
      });

      const res = await handler(
        makeRequest("https://x/api", {
          method: "PATCH",
          headers: freshClientHeaders(),
        }),
        idParams("1"),
      );

      expect(res.status).toBe(200);
      await expect(res.json()).resolves.toMatchObject({
        success: true,
        userReaction: name,
      });
    },
  );

  test.each(handlers)("%s returns 404 for a missing post", async (_name, handler) => {
    prisma.blogPost.findUnique.mockResolvedValue(null);

    const res = await handler(
      makeRequest("https://x/api", {
        method: "PATCH",
        headers: { "x-forwarded-for": uniqueIp() },
      }),
      idParams("999"),
    );

    expect(res.status).toBe(404);
  });
});

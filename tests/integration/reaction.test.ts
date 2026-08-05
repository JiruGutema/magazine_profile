import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  makeRequest,
  uniqueIdentity,
  uniqueIp,
} from "../helpers/request";

vi.mock("@/lib/prisma", async () => {
  const { createPrismaMock } = await import("../helpers/prisma-mock");
  return { default: createPrismaMock() };
});

import realPrisma from "@/lib/prisma";
import type { PrismaMock } from "../helpers/prisma-mock";
import { GET, POST } from "@/app/api/blogs/reaction/route";

// The module is mocked above; this cast exposes the mock's loose signatures so
// fixtures need not satisfy full Prisma row types.
const prisma = realPrisma as unknown as PrismaMock;


const POST_ID = 1;
const BASE_POST = {
  id: POST_ID,
  title: "A post",
  likes: 10,
  dislikes: 4,
};

type ReactionType = "like" | "dislike";

interface Scenario {
  likes?: number;
  dislikes?: number;
  /** The caller's existing reaction, if any. */
  existing?: ReactionType | null;
  /** How many reactions this IP already left on this post. */
  ipReactionCount?: number;
}

function setupPost({
  likes = BASE_POST.likes,
  dislikes = BASE_POST.dislikes,
  existing = null,
  ipReactionCount = 0,
}: Scenario = {}) {
  prisma.blogPost.findUnique.mockResolvedValue({
    ...BASE_POST,
    likes,
    dislikes,
  });
  prisma.blogPostReaction.count.mockResolvedValue(ipReactionCount);
  prisma.blogPostReaction.findFirst.mockResolvedValue(
    existing ? { id: 77, postId: POST_ID, reaction: existing } : null,
  );
  prisma.blogPostReaction.create.mockResolvedValue({ id: 77 });
  prisma.blogPostReaction.update.mockResolvedValue({ id: 77 });
  prisma.blogPostReaction.delete.mockResolvedValue({ id: 77 });
  // Echo the written counts back so the response reflects the delta applied.
  prisma.blogPost.update.mockImplementation(
    async ({ data }: { data: { likes: number; dislikes: number } }) => ({
      ...BASE_POST,
      ...data,
    }),
  );
}

/** A POST from a client that no other test has used, so nothing throttles it. */
function react(action: string, overrides: { ip?: string; postId?: unknown } = {}) {
  const identity = uniqueIdentity();
  // `in` rather than `??` so an explicit null postId reaches the route.
  const postId = "postId" in overrides ? overrides.postId : POST_ID;
  return makeRequest("https://example.com/api/blogs/reaction", {
    headers: {
      "x-forwarded-for": overrides.ip ?? uniqueIp(),
      "user-agent": "vitest",
    },
    body: {
      postId,
      action,
      userId: identity.userId,
      fingerprint: identity.fingerprint,
    },
  });
}

function readState(query: string) {
  return makeRequest(`https://example.com/api/blogs/reaction?${query}`, {
    headers: { "user-agent": "vitest" },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
  setupPost();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("GET /api/blogs/reaction", () => {
  test("returns 400 without a postId", async () => {
    const res = await GET(readState(""));
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "Missing postId" });
  });

  test("returns 400 for a non-numeric postId", async () => {
    const res = await GET(readState("postId=abc"));
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "Invalid postId" });
  });

  test("returns 404 when the post does not exist", async () => {
    prisma.blogPost.findUnique.mockResolvedValue(null);

    const res = await GET(readState("postId=999"));

    expect(res.status).toBe(404);
  });

  test("reports the counts and a null reaction for a first-time visitor", async () => {
    const res = await GET(readState("postId=1"));

    await expect(res.json()).resolves.toMatchObject({
      success: true,
      postId: POST_ID,
      userReaction: null,
      likes: 10,
      dislikes: 4,
    });
  });

  test("reports the visitor's existing reaction", async () => {
    setupPost({ existing: "like" });

    const res = await GET(readState("postId=1&userId=known-user-id-123456"));

    await expect(res.json()).resolves.toMatchObject({ userReaction: "like" });
  });

  test("returns 500 when the lookup fails", async () => {
    prisma.blogPost.findUnique.mockRejectedValue(new Error("boom"));

    const res = await GET(readState("postId=1"));

    expect(res.status).toBe(500);
  });
});

describe("POST /api/blogs/reaction — request validation", () => {
  test.each([
    ["abc", "a non-numeric id"],
    [0, "zero"],
    [-3, "a negative id"],
    [null, "null"],
  ])("returns 400 for postId %s (%s)", async (postId, _label) => {
    const res = await POST(react("like", { postId }));

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "Invalid post ID" });
  });

  test.each(["", "unknown", "LIKE", "delete", "drop_table"])(
    "returns 400 for the action %s",
    async (action) => {
      const res = await POST(react(action));

      expect(res.status).toBe(400);
      await expect(res.json()).resolves.toEqual({ error: "Invalid action" });
    },
  );

  test("accepts a postId sent as a string", async () => {
    const res = await POST(react("like", { postId: "1" }));
    expect(res.status).toBe(200);
  });

  test("rejects bad input before consulting the database", async () => {
    await POST(react("nonsense"));
    expect(prisma.blogPost.findUnique).not.toHaveBeenCalled();
  });

  test("returns 404 for a post that does not exist", async () => {
    prisma.blogPost.findUnique.mockResolvedValue(null);

    const res = await POST(react("like"));

    expect(res.status).toBe(404);
  });
});

describe("POST /api/blogs/reaction — state transitions", () => {
  interface Case {
    action: string;
    existing: ReactionType | null;
    likes: number;
    dislikes: number;
    reaction: ReactionType | null;
  }

  const cases: Case[] = [
    // from no reaction
    { action: "like", existing: null, likes: 11, dislikes: 4, reaction: "like" },
    { action: "dislike", existing: null, likes: 10, dislikes: 5, reaction: "dislike" },
    { action: "unlike", existing: null, likes: 10, dislikes: 4, reaction: null },
    { action: "undislike", existing: null, likes: 10, dislikes: 4, reaction: null },
    { action: "switch_to_like", existing: null, likes: 11, dislikes: 4, reaction: "like" },
    { action: "switch_to_dislike", existing: null, likes: 10, dislikes: 5, reaction: "dislike" },

    // from an existing like
    { action: "like", existing: "like", likes: 10, dislikes: 4, reaction: "like" },
    { action: "dislike", existing: "like", likes: 9, dislikes: 5, reaction: "dislike" },
    { action: "unlike", existing: "like", likes: 9, dislikes: 4, reaction: null },
    { action: "undislike", existing: "like", likes: 9, dislikes: 4, reaction: null },
    { action: "switch_to_like", existing: "like", likes: 10, dislikes: 4, reaction: "like" },
    { action: "switch_to_dislike", existing: "like", likes: 9, dislikes: 5, reaction: "dislike" },

    // from an existing dislike
    { action: "like", existing: "dislike", likes: 11, dislikes: 3, reaction: "like" },
    { action: "dislike", existing: "dislike", likes: 10, dislikes: 4, reaction: "dislike" },
    { action: "unlike", existing: "dislike", likes: 10, dislikes: 3, reaction: null },
    { action: "undislike", existing: "dislike", likes: 10, dislikes: 3, reaction: null },
    { action: "switch_to_like", existing: "dislike", likes: 11, dislikes: 3, reaction: "like" },
    { action: "switch_to_dislike", existing: "dislike", likes: 10, dislikes: 4, reaction: "dislike" },
  ];

  test.each(cases)(
    "$action with an existing $existing yields $likes/$dislikes and $reaction",
    async ({ action, existing, likes, dislikes, reaction }) => {
      setupPost({ existing });

      const res = await POST(react(action));

      expect(res.status).toBe(200);
      await expect(res.json()).resolves.toMatchObject({
        success: true,
        likes,
        dislikes,
        userReaction: reaction,
      });
    },
  );

  test("repeating a like is a no-op rather than an increment", async () => {
    setupPost({ existing: "like" });

    await POST(react("like"));

    expect(prisma.blogPostReaction.create).not.toHaveBeenCalled();
    expect(prisma.blogPostReaction.delete).not.toHaveBeenCalled();
  });

  test("removing a reaction deletes the row", async () => {
    setupPost({ existing: "like" });

    await POST(react("unlike"));

    expect(prisma.blogPostReaction.delete).toHaveBeenCalledWith({
      where: { id: 77 },
    });
  });

  test("a first reaction creates a row carrying the hashed identity keys", async () => {
    await POST(react("like"));

    const { data } = prisma.blogPostReaction.create.mock.calls[0][0];
    expect(data).toMatchObject({ postId: POST_ID, reaction: "like" });
    expect(data.userKey).toMatch(/^[a-f0-9]{64}$/);
    expect(data.deviceKey).toMatch(/^[a-f0-9]{64}$/);
  });

  test("runs the whole transition inside one transaction", async () => {
    await POST(react("like"));
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
  });
});

describe("POST /api/blogs/reaction — count clamping", () => {
  test("never drives likes below zero", async () => {
    setupPost({ likes: 0, existing: "like" });

    const res = await POST(react("unlike"));

    await expect(res.json()).resolves.toMatchObject({ likes: 0 });
  });

  test("never drives dislikes below zero", async () => {
    setupPost({ dislikes: 0, existing: "dislike" });

    const res = await POST(react("undislike"));

    await expect(res.json()).resolves.toMatchObject({ dislikes: 0 });
  });
});

describe("POST /api/blogs/reaction — visitor cookie", () => {
  test("returns the visitor id so the browser can keep using it", async () => {
    const res = await POST(react("like"));
    const body = await res.json();

    expect(body.userId).toBeTruthy();
    expect(res.cookies.get("blog_uid")?.value).toBe(body.userId);
  });

  test("the cookie is readable by the client script that sends it back", async () => {
    const res = await POST(react("like"));

    expect(res.cookies.get("blog_uid")).toMatchObject({
      httpOnly: false,
      sameSite: "lax",
      path: "/",
    });
  });
});

describe("POST /api/blogs/reaction — abuse controls", () => {
  test("refuses a new identity once the network has flooded one article", async () => {
    setupPost({ existing: null, ipReactionCount: 5 });

    const res = await POST(react("like"));

    expect(res.status).toBe(429);
    await expect(res.json()).resolves.toMatchObject({
      error: "Maximum reactions from this network for this article reached.",
    });
  });

  test("still lets an established visitor change their own reaction", async () => {
    setupPost({ existing: "like", ipReactionCount: 50 });

    const res = await POST(react("switch_to_dislike"));

    expect(res.status).toBe(200);
  });

  test("does not apply the network cap to localhost", async () => {
    setupPost({ existing: null, ipReactionCount: 50 });

    const res = await POST(react("like", { ip: "127.0.0.1" }));

    expect(res.status).toBe(200);
  });

  test("enforces a cooldown between two immediate reactions from one address", async () => {
    const ip = uniqueIp();

    const first = await POST(react("like", { ip }));
    const second = await POST(react("like", { ip }));

    expect(first.status).toBe(200);
    expect(second.status).toBe(429);
    expect(second.headers.get("Retry-After")).toBeTruthy();
  });

  test("caps how many reactions one address can burst through", async () => {
    vi.useFakeTimers();
    try {
      const ip = uniqueIp();
      const statuses: number[] = [];

      // Space requests past the 300ms cooldown but inside the 10s burst window,
      // and vary the visitor id so the per-user cap is not the binding limit.
      for (let i = 0; i < 7; i++) {
        statuses.push((await POST(react("like", { ip }))).status);
        vi.advanceTimersByTime(400);
      }

      expect(statuses.slice(0, 6)).toEqual(Array(6).fill(200));
      expect(statuses[6]).toBe(429);
    } finally {
      vi.useRealTimers();
    }
  });

  test("returns 500 when the transaction fails", async () => {
    vi.mocked(prisma.$transaction).mockRejectedValue(new Error("deadlock"));

    const res = await POST(react("like"));

    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({
      error: "Failed to process reaction",
    });
  });
});

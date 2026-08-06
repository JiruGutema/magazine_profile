import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { rateLimiter } from "@/lib/rate-limit";
import { validateAndExtractIdentity } from "@/lib/reaction-security";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawPostId = searchParams.get("postId");
    const clientUserId = searchParams.get("userId");

    if (!rawPostId) {
      return NextResponse.json({ error: "Missing postId" }, { status: 400 });
    }

    const postId = parseInt(rawPostId, 10);
    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid postId" }, { status: 400 });
    }

    const post = await prisma.blogPost.findUnique({
      where: { id: postId },
      select: { id: true, likes: true, dislikes: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const identity = validateAndExtractIdentity(
      req,
      postId,
      clientUserId,
      searchParams.get("fingerprint"),
    );

    // Look up existing user reaction by userId OR deviceKey
    const existing = await prisma.blogPostReaction.findFirst({
      where: {
        postId: postId,
        OR: [
          { userId: identity.userId },
          { deviceKey: identity.deviceKey },
        ],
      },
    });

    return NextResponse.json({
      success: true,
      postId: post.id,
      userReaction: existing ? (existing.reaction as "like" | "dislike") : null,
      likes: post.likes,
      dislikes: post.dislikes,
    });
  } catch (error) {
    console.error("Failed to fetch reaction state:", error);
    return NextResponse.json(
      { error: "Failed to fetch reaction state" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawPostId = body.postId;
    const postId =
      typeof rawPostId === "string"
        ? parseInt(rawPostId, 10)
        : Number(rawPostId);
    const { action, userId: rawUserId, fingerprint: rawFingerprint } = body;

    if (isNaN(postId) || postId <= 0) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const validActions = [
      "like",
      "dislike",
      "unlike",
      "undislike",
      "switch_to_like",
      "switch_to_dislike",
    ];
    if (!validActions.includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Extract validated client identity (IP, userId, fingerprint, keys)
    const identity = validateAndExtractIdentity(
      req,
      postId,
      rawUserId,
      rawFingerprint,
    );

    // ── Multi-Layer Rate Limiting ──────────────────────────────────────────

    // 1. IP Cooldown (minimum 300ms between requests)
    const cooldownCheck = rateLimiter.check(
      "ip_cooldown",
      identity.ip,
      1,
      300,
      300,
    );
    if (!cooldownCheck.allowed) {
      return NextResponse.json(
        { error: cooldownCheck.reason, retryAfter: cooldownCheck.retryAfterSeconds },
        {
          status: 429,
          headers: {
            "Retry-After": String(cooldownCheck.retryAfterSeconds),
          },
        },
      );
    }

    // 2. IP Burst limit (max 6 reactions per 10 seconds)
    const ipBurstCheck = rateLimiter.check(
      "ip_burst",
      identity.ip,
      6,
      10 * 1000,
    );
    if (!ipBurstCheck.allowed) {
      return NextResponse.json(
        { error: ipBurstCheck.reason, retryAfter: ipBurstCheck.retryAfterSeconds },
        {
          status: 429,
          headers: {
            "Retry-After": String(ipBurstCheck.retryAfterSeconds),
            "X-RateLimit-Remaining": "0",
          },
        },
      );
    }

    // 3. IP Minute limit (max 25 reactions per 60 seconds)
    const ipMinuteCheck = rateLimiter.check(
      "ip_minute",
      identity.ip,
      25,
      60 * 1000,
    );
    if (!ipMinuteCheck.allowed) {
      return NextResponse.json(
        { error: ipMinuteCheck.reason, retryAfter: ipMinuteCheck.retryAfterSeconds },
        {
          status: 429,
          headers: {
            "Retry-After": String(ipMinuteCheck.retryAfterSeconds),
            "X-RateLimit-Remaining": "0",
          },
        },
      );
    }

    // 4. IP Daily limit (max 150 reactions per 24 hours)
    const ipDailyCheck = rateLimiter.check(
      "ip_daily",
      identity.ip,
      150,
      24 * 60 * 60 * 1000,
    );
    if (!ipDailyCheck.allowed) {
      return NextResponse.json(
        {
          error: "Daily reaction limit reached from this network.",
          retryAfter: ipDailyCheck.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(ipDailyCheck.retryAfterSeconds),
            "X-RateLimit-Remaining": "0",
          },
        },
      );
    }

    // 5. User ID Burst limit (max 5 reactions per 10 seconds per client UUID)
    const userBurstCheck = rateLimiter.check(
      "user_burst",
      identity.userId,
      5,
      10 * 1000,
    );
    if (!userBurstCheck.allowed) {
      return NextResponse.json(
        { error: userBurstCheck.reason, retryAfter: userBurstCheck.retryAfterSeconds },
        {
          status: 429,
          headers: {
            "Retry-After": String(userBurstCheck.retryAfterSeconds),
            "X-RateLimit-Remaining": "0",
          },
        },
      );
    }

    // 6. Fingerprint limit (max 15 reactions per minute per browser fingerprint)
    const fpCheck = rateLimiter.check(
      "fingerprint",
      identity.fingerprint,
      15,
      60 * 1000,
    );
    if (!fpCheck.allowed) {
      return NextResponse.json(
        { error: fpCheck.reason, retryAfter: fpCheck.retryAfterSeconds },
        {
          status: 429,
          headers: {
            "Retry-After": String(fpCheck.retryAfterSeconds),
            "X-RateLimit-Remaining": "0",
          },
        },
      );
    }

    // ── Check if Post Exists ───────────────────────────────────────────────
    const post = await prisma.blogPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // ── Anti-Infinite Randomization Protection ──────────────────────────────
    // Check how many different userIds from this IP have reacted to THIS specific post.
    // Legitimate shared IPs (e.g., home/office) might have a few, but a bot rotating userIds will hit this quickly.
    const ipPostReactionsCount = await prisma.blogPostReaction.count({
      where: {
        postId: postId,
        ipAddress: identity.ip,
      },
    });

    // Check if this specific user already has a reaction record
    const existing = await prisma.blogPostReaction.findFirst({
      where: {
        postId: postId,
        OR: [
          { userId: identity.userId },
          { deviceKey: identity.deviceKey },
        ],
      },
    });

    // If no existing reaction for this user, but IP already created > 5 reactions on this single post
    if (!existing && ipPostReactionsCount >= 5 && identity.ip !== "127.0.0.1") {
      return NextResponse.json(
        {
          error: "Maximum reactions from this network for this article reached.",
        },
        { status: 429 },
      );
    }

    // ── Execute State Transition in Transaction ───────────────────────────
    const result = await prisma.$transaction(async (tx) => {
      let finalReaction: "like" | "dislike" | null = null;
      let likesDelta = 0;
      let dislikesDelta = 0;

      const currentType = existing?.reaction as "like" | "dislike" | undefined;

      if (action === "like") {
        if (!currentType) {
          // Create like
          await tx.blogPostReaction.create({
            data: {
              postId: postId,
              userId: identity.userId,
              userKey: identity.userKey,
              deviceKey: identity.deviceKey,
              fingerprint: identity.fingerprint,
              ipAddress: identity.ip,
              userAgent: identity.userAgent,
              reaction: "like",
            },
          });
          likesDelta = 1;
          finalReaction = "like";
        } else if (currentType === "dislike") {
          // Switch dislike -> like
          await tx.blogPostReaction.update({
            where: { id: existing!.id },
            data: {
              userId: identity.userId,
              userKey: identity.userKey,
              deviceKey: identity.deviceKey,
              fingerprint: identity.fingerprint,
              ipAddress: identity.ip,
              userAgent: identity.userAgent,
              reaction: "like",
            },
          });
          likesDelta = 1;
          dislikesDelta = -1;
          finalReaction = "like";
        } else {
          // Already liked -> idempotent no-op
          finalReaction = "like";
        }
      } else if (action === "dislike") {
        if (!currentType) {
          // Create dislike
          await tx.blogPostReaction.create({
            data: {
              postId: postId,
              userId: identity.userId,
              userKey: identity.userKey,
              deviceKey: identity.deviceKey,
              fingerprint: identity.fingerprint,
              ipAddress: identity.ip,
              userAgent: identity.userAgent,
              reaction: "dislike",
            },
          });
          dislikesDelta = 1;
          finalReaction = "dislike";
        } else if (currentType === "like") {
          // Switch like -> dislike
          await tx.blogPostReaction.update({
            where: { id: existing!.id },
            data: {
              userId: identity.userId,
              userKey: identity.userKey,
              deviceKey: identity.deviceKey,
              fingerprint: identity.fingerprint,
              ipAddress: identity.ip,
              userAgent: identity.userAgent,
              reaction: "dislike",
            },
          });
          likesDelta = -1;
          dislikesDelta = 1;
          finalReaction = "dislike";
        } else {
          // Already disliked -> idempotent no-op
          finalReaction = "dislike";
        }
      } else if (action === "unlike") {
        if (currentType === "like") {
          await tx.blogPostReaction.delete({
            where: { id: existing!.id },
          });
          likesDelta = -1;
          finalReaction = null;
        } else if (currentType === "dislike") {
          // If was dislike, delete it as well
          await tx.blogPostReaction.delete({
            where: { id: existing!.id },
          });
          dislikesDelta = -1;
          finalReaction = null;
        } else {
          finalReaction = null;
        }
      } else if (action === "undislike") {
        if (currentType === "dislike") {
          await tx.blogPostReaction.delete({
            where: { id: existing!.id },
          });
          dislikesDelta = -1;
          finalReaction = null;
        } else if (currentType === "like") {
          await tx.blogPostReaction.delete({
            where: { id: existing!.id },
          });
          likesDelta = -1;
          finalReaction = null;
        } else {
          finalReaction = null;
        }
      } else if (action === "switch_to_like") {
        if (existing) {
          if (currentType === "dislike") {
            likesDelta = 1;
            dislikesDelta = -1;
          } else if (currentType === "like") {
            // No change
          }
          await tx.blogPostReaction.update({
            where: { id: existing.id },
            data: {
              userId: identity.userId,
              userKey: identity.userKey,
              deviceKey: identity.deviceKey,
              fingerprint: identity.fingerprint,
              ipAddress: identity.ip,
              userAgent: identity.userAgent,
              reaction: "like",
            },
          });
          finalReaction = "like";
        } else {
          await tx.blogPostReaction.create({
            data: {
              postId: postId,
              userId: identity.userId,
              userKey: identity.userKey,
              deviceKey: identity.deviceKey,
              fingerprint: identity.fingerprint,
              ipAddress: identity.ip,
              userAgent: identity.userAgent,
              reaction: "like",
            },
          });
          likesDelta = 1;
          finalReaction = "like";
        }
      } else if (action === "switch_to_dislike") {
        if (existing) {
          if (currentType === "like") {
            likesDelta = -1;
            dislikesDelta = 1;
          } else if (currentType === "dislike") {
            // No change
          }
          await tx.blogPostReaction.update({
            where: { id: existing.id },
            data: {
              userId: identity.userId,
              userKey: identity.userKey,
              deviceKey: identity.deviceKey,
              fingerprint: identity.fingerprint,
              ipAddress: identity.ip,
              userAgent: identity.userAgent,
              reaction: "dislike",
            },
          });
          finalReaction = "dislike";
        } else {
          await tx.blogPostReaction.create({
            data: {
              postId: postId,
              userId: identity.userId,
              userKey: identity.userKey,
              deviceKey: identity.deviceKey,
              fingerprint: identity.fingerprint,
              ipAddress: identity.ip,
              userAgent: identity.userAgent,
              reaction: "dislike",
            },
          });
          dislikesDelta = 1;
          finalReaction = "dislike";
        }
      }

      // Compute new counts ensuring non-negative
      const targetLikes = Math.max(0, post.likes + likesDelta);
      const targetDislikes = Math.max(0, post.dislikes + dislikesDelta);

      const updated = await tx.blogPost.update({
        where: { id: postId },
        data: {
          likes: targetLikes,
          dislikes: targetDislikes,
        },
      });

      return {
        updated,
        finalReaction,
      };
    });

    const response = NextResponse.json({
      success: true,
      userReaction: result.finalReaction,
      likes: result.updated.likes,
      dislikes: result.updated.dislikes,
      userId: identity.userId,
    });

    // Set a cookie with the visitor ID
    response.cookies.set("blog_uid", identity.userId, {
      httpOnly: false,
      sameSite: "lax",
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Reaction update error:", error);
    return NextResponse.json(
      { error: "Failed to process reaction" },
      { status: 500 },
    );
  }
}

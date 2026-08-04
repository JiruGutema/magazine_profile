import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const postId =
      typeof body.postId === "string"
        ? parseInt(body.postId, 10)
        : Number(body.postId);
    const { action } = body;

    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const post = await prisma.blogPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    let likesUpdate = post.likes;
    let dislikesUpdate = post.dislikes;

    if (action === "like") {
      likesUpdate += 1;
    } else if (action === "unlike") {
      likesUpdate = Math.max(0, likesUpdate - 1);
    } else if (action === "dislike") {
      dislikesUpdate += 1;
    } else if (action === "undislike") {
      dislikesUpdate = Math.max(0, dislikesUpdate - 1);
    } else if (action === "switch_to_like") {
      dislikesUpdate = Math.max(0, dislikesUpdate - 1);
      likesUpdate += 1;
    } else if (action === "switch_to_dislike") {
      likesUpdate = Math.max(0, likesUpdate - 1);
      dislikesUpdate += 1;
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const updated = await prisma.blogPost.update({
      where: { id: postId },
      data: {
        likes: likesUpdate,
        dislikes: dislikesUpdate,
      },
    });

    return NextResponse.json({
      success: true,
      likes: updated.likes,
      dislikes: updated.dislikes,
    });
  } catch (error) {
    console.error("Reaction update error:", error);
    return NextResponse.json(
      { error: "Failed to update reaction" },
      { status: 500 },
    );
  }
}

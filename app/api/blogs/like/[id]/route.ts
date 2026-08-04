import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function PATCH(
  _req: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  const { id } = await props.params;
  const blogId = parseInt(id, 10);
  if (isNaN(blogId)) {
    return NextResponse.json({ error: "Invalid blog id" }, { status: 400 });
  }

  const exist = await prisma.blogPost.findUnique({
    where: { id: blogId },
  });
  if (!exist) {
    return NextResponse.json(
      { error: "Blog post not found" },
      { status: 404 },
    );
  }

  const post = await prisma.blogPost.update({
    where: { id: blogId },
    data: { likes: { increment: 1 } },
  });

  return NextResponse.json(post);
}

import type { NextRequest } from "next/server";
import type { BlogPost } from "@/lib/types";
import prisma from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  props: { params: Promise<{ slug: string }> },
) {
  const { slug } = await props.params;
  if (!slug) {
    return Response.json({ error: "blog slug is required!" }, { status: 400 });
  }
  const res = await prisma.blogPost.findFirst({
    where: { slug: slug },
  });
  if (!res) {
    return Response.json({ error: "blog not found!" }, { status: 404 });
  }
  const blog: BlogPost = {
    id: res.id,
    title: res.title,
    excerpt: res.excerpt,
    content: res.content,
    author: res.author,
    publishedAt: res.publishedAt,
    readTime: res.readTime,
    tags: res.tags.split(",").map((tag) => tag.trim()),
    likes: res.likes,
    slug: res.slug,
    dislikes: res.dislikes,
    coverImage: res.coverImage ? res.coverImage : undefined,
  };
  return Response.json({ data: blog });
}

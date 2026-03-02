import prisma from "@/lib/prisma";

export async function GET() {
  const res = await prisma.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
  });
  return Response.json({ data: res });
}

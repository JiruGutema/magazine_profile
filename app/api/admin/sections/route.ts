import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";

export async function GET() {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sections = await prisma.articleSection.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(sections);
}

export async function POST(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const title = (data.title ?? "").trim();
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const key = (data.key ?? "").trim() || generateSlug(title);
    if (!key) {
      return NextResponse.json(
        { error: "A valid key or title is required" },
        { status: 400 },
      );
    }

    const existing = await prisma.articleSection.findUnique({ where: { key } });
    if (existing) {
      return NextResponse.json(
        { error: `A section with key "${key}" already exists` },
        { status: 400 },
      );
    }

    const last = await prisma.articleSection.findFirst({
      orderBy: { order: "desc" },
    });

    const section = await prisma.articleSection.create({
      data: {
        key,
        title,
        level: Number(data.level) === 3 ? 3 : 2,
        body: data.body ?? "",
        order: typeof data.order === "number" ? data.order : (last?.order ?? 0) + 10,
        inToc: data.inToc ?? true,
        published: data.published ?? true,
        special: data.special ?? "",
      },
    });

    return NextResponse.json(section, { status: 201 });
  } catch (error) {
    console.error("Failed to create section:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const section = await prisma.articleSection.findUnique({
    where: { id: parseInt(id) },
  });
  if (!section) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 });
  }
  return NextResponse.json(section);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await request.json();
    const title = (data.title ?? "").trim();
    const key = (data.key ?? "").trim();
    if (!title || !key) {
      return NextResponse.json(
        { error: "Title and key are required" },
        { status: 400 },
      );
    }

    // Enforce key uniqueness across other rows.
    const clash = await prisma.articleSection.findUnique({ where: { key } });
    if (clash && clash.id !== parseInt(id)) {
      return NextResponse.json(
        { error: `A section with key "${key}" already exists` },
        { status: 400 },
      );
    }

    const section = await prisma.articleSection.update({
      where: { id: parseInt(id) },
      data: {
        key,
        title,
        level: Number(data.level) === 3 ? 3 : 2,
        body: data.body ?? "",
        order: typeof data.order === "number" ? data.order : 0,
        inToc: data.inToc ?? true,
        published: data.published ?? true,
        special: data.special ?? "",
      },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error("Failed to update section:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.articleSection.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete section:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

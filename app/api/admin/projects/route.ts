import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";

export async function GET() {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { id: "asc" }],
  });
  return NextResponse.json(projects);
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

    const last = await prisma.project.findFirst({ orderBy: { order: "desc" } });

    const project = await prisma.project.create({
      data: {
        title,
        description: data.description ?? "",
        note: data.note ?? "",
        technologies: data.technologies ?? "",
        details: data.details ?? "",
        liveDemoLink: data.liveDemoLink ?? "",
        githubLink: data.githubLink ?? "",
        featured: data.featured ?? true,
        order:
          typeof data.order === "number" ? data.order : (last?.order ?? 0) + 10,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

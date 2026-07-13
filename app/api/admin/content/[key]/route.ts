import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";
import { getContent } from "@/lib/content";
import type { SiteContentKey } from "@/lib/content-types";

const ALLOWED_KEYS: SiteContentKey[] = [
  "header",
  "hero",
  "infobox",
  "footer",
  "tags",
];

function isAllowed(key: string): key is SiteContentKey {
  return (ALLOWED_KEYS as string[]).includes(key);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key } = await params;
  if (!isAllowed(key)) {
    return NextResponse.json({ error: "Unknown content key" }, { status: 404 });
  }

  // getContent merges the stored data over defaults, so the editor always
  // opens with the current effective content even before the first save.
  const data = await getContent(key);
  return NextResponse.json(data);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key } = await params;
  if (!isAllowed(key)) {
    return NextResponse.json({ error: "Unknown content key" }, { status: 404 });
  }

  try {
    const data = await request.json();
    if (data === null || typeof data !== "object" || Array.isArray(data)) {
      return NextResponse.json(
        { error: "Content payload must be an object" },
        { status: 400 },
      );
    }

    const saved = await prisma.siteContent.upsert({
      where: { key },
      create: { key, data },
      update: { data },
    });

    return NextResponse.json(saved.data);
  } catch (error) {
    console.error(`Failed to save content "${key}":`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

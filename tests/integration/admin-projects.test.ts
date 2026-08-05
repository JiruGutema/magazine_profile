import { beforeEach, describe, expect, test, vi } from "vitest";
import { makeRequest } from "../helpers/request";

vi.mock("@/lib/prisma", async () => {
  const { createPrismaMock } = await import("../helpers/prisma-mock");
  return { default: createPrismaMock() };
});

vi.mock("@/lib/auth", async () => {
  const { vi: vitest } = await import("vitest");
  return { getAdminUser: vitest.fn(), getUser: vitest.fn() };
});

import realPrisma from "@/lib/prisma";
import type { PrismaMock } from "../helpers/prisma-mock";
import { getAdminUser } from "@/lib/auth";
import { IMAGE_URL_ERROR } from "@/lib/project-image";
import { GET, POST } from "@/app/api/admin/projects/route";
import {
  DELETE as DELETE_BY_ID,
  GET as GET_BY_ID,
  PUT as PUT_BY_ID,
} from "@/app/api/admin/projects/[id]/route";

// The module is mocked above; this cast exposes the mock's loose signatures so
// fixtures need not satisfy full Prisma row types.
const prisma = realPrisma as unknown as PrismaMock;


const ADMIN = { id: 1, email: "admin@example.com", name: "Admin" };
const url = "https://example.com/api/admin/projects";
const idParams = (id: string) => ({ params: Promise.resolve({ id }) });

const PROJECT = {
  id: 3,
  title: "Portfolio",
  description: "A site",
  note: "",
  technologies: "Next.js",
  details: "",
  liveDemoLink: "",
  githubLink: "",
  imageUrl: "",
  imageCaption: "",
  featured: true,
  order: 10,
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.mocked(getAdminUser).mockResolvedValue(ADMIN);
  prisma.project.findFirst.mockResolvedValue(null);
  prisma.project.create.mockImplementation(
    async ({ data }: { data: object }) => ({ id: 99, ...data }),
  );
  prisma.project.update.mockResolvedValue(PROJECT);
  prisma.project.delete.mockResolvedValue(PROJECT);
});

describe("authorization", () => {
  const calls: [string, () => Promise<Response>][] = [
    ["GET /projects", () => GET()],
    ["POST /projects", () => POST(makeRequest(url, { body: { title: "x" } }))],
    ["GET /projects/[id]", () => GET_BY_ID(makeRequest(url), idParams("3"))],
    [
      "PUT /projects/[id]",
      () => PUT_BY_ID(makeRequest(url, { body: { title: "x" } }), idParams("3")),
    ],
    [
      "DELETE /projects/[id]",
      () => DELETE_BY_ID(makeRequest(url, { method: "DELETE" }), idParams("3")),
    ],
  ];

  test.each(calls)("%s returns 401 when signed out", async (_name, call) => {
    vi.mocked(getAdminUser).mockResolvedValue(null);

    const res = await call();

    expect(res.status).toBe(401);
    expect(prisma.project.create).not.toHaveBeenCalled();
    expect(prisma.project.update).not.toHaveBeenCalled();
    expect(prisma.project.delete).not.toHaveBeenCalled();
  });
});

describe("GET /api/admin/projects", () => {
  test("lists projects in display order", async () => {
    prisma.project.findMany.mockResolvedValue([PROJECT]);

    const res = await GET();

    expect(res.status).toBe(200);
    expect(prisma.project.findMany).toHaveBeenCalledWith({
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });
  });
});

describe("POST /api/admin/projects", () => {
  test.each([[{}], [{ title: "  " }]])("rejects %j without a title", async (body) => {
    const res = await POST(makeRequest(url, { body }));

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "Title is required" });
  });

  test("creates a project and returns 201", async () => {
    const res = await POST(makeRequest(url, { body: { title: "New" } }));

    expect(res.status).toBe(201);
    expect(prisma.project.create).toHaveBeenCalled();
  });

  test.each([
    ["javascript:alert(1)"],
    ["data:text/html,<script>alert(1)</script>"],
    ["mailto:someone@example.com"],
  ])("rejects the unsafe image URL %s", async (imageUrl) => {
    const res = await POST(makeRequest(url, { body: { title: "New", imageUrl } }));

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: IMAGE_URL_ERROR });
    expect(prisma.project.create).not.toHaveBeenCalled();
  });

  test.each([
    ["https://cdn.example.com/a.png"],
    ["/images/a.png"],
    [""],
  ])("accepts the image URL %s", async (imageUrl) => {
    const res = await POST(makeRequest(url, { body: { title: "New", imageUrl } }));

    expect(res.status).toBe(201);
    const { data } = prisma.project.create.mock.calls[0][0];
    expect(data.imageUrl).toBe(imageUrl);
  });

  test("appends after the current last project", async () => {
    prisma.project.findFirst.mockResolvedValue({ ...PROJECT, order: 70 });

    await POST(makeRequest(url, { body: { title: "New" } }));

    const { data } = prisma.project.create.mock.calls[0][0];
    expect(data.order).toBe(80);
  });

  test("starts ordering at 10 for the first project", async () => {
    await POST(makeRequest(url, { body: { title: "New" } }));

    const { data } = prisma.project.create.mock.calls[0][0];
    expect(data.order).toBe(10);
  });

  test("defaults the optional text fields to empty and featured to true", async () => {
    await POST(makeRequest(url, { body: { title: "New" } }));

    const { data } = prisma.project.create.mock.calls[0][0];
    expect(data).toMatchObject({
      description: "",
      note: "",
      technologies: "",
      details: "",
      liveDemoLink: "",
      githubLink: "",
      imageCaption: "",
      featured: true,
    });
  });

  test("returns 500 when the write fails", async () => {
    prisma.project.create.mockRejectedValue(new Error("boom"));

    const res = await POST(makeRequest(url, { body: { title: "New" } }));

    expect(res.status).toBe(500);
  });
});

describe("GET /api/admin/projects/[id]", () => {
  test("returns the project", async () => {
    prisma.project.findUnique.mockResolvedValue(PROJECT);

    const res = await GET_BY_ID(makeRequest(url), idParams("3"));

    expect(res.status).toBe(200);
    expect(prisma.project.findUnique).toHaveBeenCalledWith({ where: { id: 3 } });
  });

  test("returns 404 when missing", async () => {
    prisma.project.findUnique.mockResolvedValue(null);

    const res = await GET_BY_ID(makeRequest(url), idParams("404"));

    expect(res.status).toBe(404);
  });
});

describe("PUT /api/admin/projects/[id]", () => {
  test("rejects a blank title", async () => {
    const res = await PUT_BY_ID(
      makeRequest(url, { body: { title: "" } }),
      idParams("3"),
    );

    expect(res.status).toBe(400);
  });

  test("rejects an unsafe image URL", async () => {
    const res = await PUT_BY_ID(
      makeRequest(url, { body: { title: "x", imageUrl: "javascript:alert(1)" } }),
      idParams("3"),
    );

    expect(res.status).toBe(400);
    expect(prisma.project.update).not.toHaveBeenCalled();
  });

  test("updates the project", async () => {
    const res = await PUT_BY_ID(
      makeRequest(url, { body: { title: "Renamed" } }),
      idParams("3"),
    );

    expect(res.status).toBe(200);
    expect(prisma.project.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 3 } }),
    );
  });

  test("returns 500 when the update fails", async () => {
    prisma.project.update.mockRejectedValue(new Error("boom"));

    const res = await PUT_BY_ID(
      makeRequest(url, { body: { title: "Renamed" } }),
      idParams("3"),
    );

    expect(res.status).toBe(500);
  });
});

describe("DELETE /api/admin/projects/[id]", () => {
  test("deletes the project", async () => {
    const res = await DELETE_BY_ID(
      makeRequest(url, { method: "DELETE" }),
      idParams("3"),
    );

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ success: true });
    expect(prisma.project.delete).toHaveBeenCalledWith({ where: { id: 3 } });
  });

  test("returns 500 when the delete fails", async () => {
    prisma.project.delete.mockRejectedValue(new Error("boom"));

    const res = await DELETE_BY_ID(
      makeRequest(url, { method: "DELETE" }),
      idParams("3"),
    );

    expect(res.status).toBe(500);
  });
});

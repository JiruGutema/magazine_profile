import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("@/lib/prisma", async () => {
  const { createPrismaMock } = await import("../helpers/prisma-mock");
  return { default: createPrismaMock() };
});

import realPrisma from "@/lib/prisma";
import type { PrismaMock } from "../helpers/prisma-mock";
import { getContent, getProjects, getSections } from "@/lib/content";
import {
  DEFAULT_HEADER,
  DEFAULT_PROJECTS,
  DEFAULT_SECTIONS,
} from "@/lib/content-defaults";

// The module is mocked above; this cast exposes the mock's loose signatures so
// fixtures need not satisfy full Prisma row types.
const prisma = realPrisma as unknown as PrismaMock;


/**
 * These getters exist so the public site never renders blank: an empty or
 * unreachable database must fall back to the bundled defaults.
 */

beforeEach(() => {
  vi.clearAllMocks();
  // The fallback paths log deliberately; keep the test output readable.
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getContent", () => {
  test("returns the bundled default when the row is missing", async () => {
    prisma.siteContent.findUnique.mockResolvedValue(null);

    await expect(getContent("header")).resolves.toEqual(DEFAULT_HEADER);
  });

  test("returns the bundled default when the database throws", async () => {
    prisma.siteContent.findUnique.mockRejectedValue(
      new Error("connection refused"),
    );

    await expect(getContent("header")).resolves.toEqual(DEFAULT_HEADER);
  });

  test("logs the failure rather than swallowing it", async () => {
    prisma.siteContent.findUnique.mockRejectedValue(new Error("boom"));

    await getContent("header");

    expect(console.error).toHaveBeenCalled();
  });

  test("prefers stored values over defaults", async () => {
    prisma.siteContent.findUnique.mockResolvedValue({
      key: "header",
      data: { location: "Nairobi, Kenya" },
    });

    const header = await getContent("header");

    expect(header.location).toBe("Nairobi, Kenya");
  });

  test("merges partial stored data over the defaults", async () => {
    prisma.siteContent.findUnique.mockResolvedValue({
      key: "header",
      data: { location: "Nairobi, Kenya" },
    });

    const header = await getContent("header");

    // Fields the admin has never saved keep working after a schema addition.
    expect(header.email).toBe(DEFAULT_HEADER.email);
    expect(header.timezone).toBe(DEFAULT_HEADER.timezone);
  });

  test("queries by the requested key", async () => {
    prisma.siteContent.findUnique.mockResolvedValue(null);

    await getContent("footer");

    expect(prisma.siteContent.findUnique).toHaveBeenCalledWith({
      where: { key: "footer" },
    });
  });
});

describe("getSections", () => {
  test("falls back to the default sections when the table is empty", async () => {
    prisma.articleSection.findMany.mockResolvedValue([]);

    const sections = await getSections();

    expect(sections.length).toBeGreaterThan(0);
    expect(sections).toHaveLength(
      DEFAULT_SECTIONS.filter((s) => s.published).length,
    );
  });

  test("omits unpublished sections from the defaults", async () => {
    prisma.articleSection.findMany.mockResolvedValue([]);

    const keys = (await getSections()).map((s) => s.key);
    const unpublished = DEFAULT_SECTIONS.filter((s) => !s.published);

    for (const section of unpublished) {
      expect(keys).not.toContain(section.key);
    }
  });

  test("falls back when the database throws", async () => {
    prisma.articleSection.findMany.mockRejectedValue(new Error("boom"));

    await expect(getSections()).resolves.not.toHaveLength(0);
  });

  test("asks only for published rows, ordered", async () => {
    prisma.articleSection.findMany.mockResolvedValue([]);

    await getSections();

    expect(prisma.articleSection.findMany).toHaveBeenCalledWith({
      where: { published: true },
      orderBy: { order: "asc" },
    });
  });

  test("maps stored rows to the view shape", async () => {
    prisma.articleSection.findMany.mockResolvedValue([
      {
        id: 1,
        key: "career",
        title: "Career",
        level: 2,
        body: "<p>x</p>",
        order: 10,
        inToc: true,
        published: true,
        special: "",
      },
    ]);

    await expect(getSections()).resolves.toEqual([
      {
        key: "career",
        title: "Career",
        level: 2,
        body: "<p>x</p>",
        order: 10,
        inToc: true,
        special: "",
      },
    ]);
  });
});

describe("getProjects", () => {
  const row = {
    id: 1,
    title: "Portfolio",
    description: "A site",
    note: "",
    technologies: "Next.js, Prisma , TypeScript",
    details: "one\ntwo\n\nthree",
    liveDemoLink: "https://example.com",
    githubLink: "https://github.com/x/y",
    imageUrl: "/images/shot.png",
    imageCaption: "Shot",
    featured: true,
    order: 10,
  };

  test("splits the comma-separated technologies", async () => {
    prisma.project.findMany.mockResolvedValue([row]);

    const [project] = await getProjects();

    expect(project.technologies).toEqual(["Next.js", "Prisma", "TypeScript"]);
  });

  test("splits details on newlines and drops blank lines", async () => {
    prisma.project.findMany.mockResolvedValue([row]);

    const [project] = await getProjects();

    expect(project.details).toEqual(["one", "two", "three"]);
  });

  test("keeps a safe image URL", async () => {
    prisma.project.findMany.mockResolvedValue([row]);

    const [project] = await getProjects();

    expect(project.imageUrl).toBe("/images/shot.png");
  });

  test("drops a dangerous image URL from a hand-edited row", async () => {
    prisma.project.findMany.mockResolvedValue([
      { ...row, imageUrl: "javascript:alert(1)" },
    ]);

    const [project] = await getProjects();

    expect(project.imageUrl).toBe("");
  });

  test("returns every project by default", async () => {
    prisma.project.findMany.mockResolvedValue([
      row,
      { ...row, id: 2, featured: false },
    ]);

    await expect(getProjects()).resolves.toHaveLength(2);
  });

  test("filters to featured projects on request", async () => {
    prisma.project.findMany.mockResolvedValue([
      row,
      { ...row, id: 2, featured: false },
    ]);

    const featured = await getProjects({ featuredOnly: true });

    expect(featured).toHaveLength(1);
    expect(featured[0].featured).toBe(true);
  });

  test("falls back to the default projects when the table is empty", async () => {
    prisma.project.findMany.mockResolvedValue([]);

    await expect(getProjects()).resolves.toHaveLength(DEFAULT_PROJECTS.length);
  });

  test("falls back when the database throws", async () => {
    prisma.project.findMany.mockRejectedValue(new Error("boom"));

    await expect(getProjects()).resolves.toHaveLength(DEFAULT_PROJECTS.length);
  });

  test("still honours featuredOnly on the fallback path", async () => {
    prisma.project.findMany.mockRejectedValue(new Error("boom"));

    const featured = await getProjects({ featuredOnly: true });

    expect(featured.every((p) => p.featured)).toBe(true);
  });

  test("orders by explicit order then id", async () => {
    prisma.project.findMany.mockResolvedValue([row]);

    await getProjects();

    expect(prisma.project.findMany).toHaveBeenCalledWith({
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });
  });
});

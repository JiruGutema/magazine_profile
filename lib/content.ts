import prisma from "@/lib/prisma";
import {
  DEFAULT_FOOTER,
  DEFAULT_HEADER,
  DEFAULT_HERO,
  DEFAULT_INFOBOX,
  DEFAULT_PROJECTS,
  DEFAULT_SECTIONS,
  DEFAULT_TAGS,
} from "@/lib/content-defaults";
import type { SiteContentKey, SiteContentMap } from "@/lib/content-types";
import { sanitizeImageUrl } from "@/lib/project-image";

/**
 * Server-side content getters. Each falls back to the defaults in
 * content-defaults.ts when the database is empty or unreachable, so the public
 * site never renders blank even before the seed script has run.
 */

const DEFAULTS: SiteContentMap = {
  header: DEFAULT_HEADER,
  hero: DEFAULT_HERO,
  infobox: DEFAULT_INFOBOX,
  footer: DEFAULT_FOOTER,
  tags: DEFAULT_TAGS,
};

export async function getContent<K extends SiteContentKey>(
  key: K,
): Promise<SiteContentMap[K]> {
  try {
    const row = await prisma.siteContent.findUnique({ where: { key } });
    if (!row) return DEFAULTS[key];
    // Shallow-merge over defaults so newly added fields keep sensible values.
    return { ...DEFAULTS[key], ...(row.data as object) } as SiteContentMap[K];
  } catch (error) {
    console.error(`Failed to load site content "${key}":`, error);
    return DEFAULTS[key];
  }
}

export interface SectionView {
  key: string;
  title: string;
  level: number;
  body: string;
  order: number;
  inToc: boolean;
  special: string;
}

export async function getSections(): Promise<SectionView[]> {
  try {
    const rows = await prisma.articleSection.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    if (rows.length === 0) return defaultSectionViews();
    return rows.map((r) => ({
      key: r.key,
      title: r.title,
      level: r.level,
      body: r.body,
      order: r.order,
      inToc: r.inToc,
      special: r.special,
    }));
  } catch (error) {
    console.error("Failed to load article sections:", error);
    return defaultSectionViews();
  }
}

function defaultSectionViews(): SectionView[] {
  return DEFAULT_SECTIONS.filter((s) => s.published).map((s) => ({
    key: s.key,
    title: s.title,
    level: s.level,
    body: s.body,
    order: s.order,
    inToc: s.inToc,
    special: s.special,
  }));
}

export interface ProjectView {
  id: number;
  title: string;
  description: string;
  note: string;
  technologies: string[];
  details: string[];
  liveDemoLink: string;
  githubLink: string;
  imageUrl: string;
  imageCaption: string;
  featured: boolean;
  order: number;
}

const splitList = (value: string, sep: string): string[] =>
  value
    .split(sep)
    .map((part) => part.trim())
    .filter(Boolean);

export async function getProjects(options?: {
  featuredOnly?: boolean;
}): Promise<ProjectView[]> {
  try {
    const rows = await prisma.project.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });
    const source =
      rows.length > 0
        ? rows.map((r) => ({
            id: r.id,
            title: r.title,
            description: r.description,
            note: r.note,
            technologies: splitList(r.technologies, ","),
            details: splitList(r.details, "\n"),
            liveDemoLink: r.liveDemoLink,
            githubLink: r.githubLink,
            imageUrl: sanitizeImageUrl(r.imageUrl),
            imageCaption: r.imageCaption,
            featured: r.featured,
            order: r.order,
          }))
        : defaultProjectViews();
    return options?.featuredOnly ? source.filter((p) => p.featured) : source;
  } catch (error) {
    console.error("Failed to load projects:", error);
    const source = defaultProjectViews();
    return options?.featuredOnly ? source.filter((p) => p.featured) : source;
  }
}

function defaultProjectViews(): ProjectView[] {
  return DEFAULT_PROJECTS.map((p, i) => ({
    id: i + 1,
    title: p.title,
    description: p.description,
    note: p.note,
    technologies: splitList(p.technologies, ","),
    details: splitList(p.details, "\n"),
    liveDemoLink: p.liveDemoLink,
    githubLink: p.githubLink,
    imageUrl: sanitizeImageUrl(p.imageUrl),
    imageCaption: p.imageCaption,
    featured: p.featured,
    order: p.order,
  }));
}

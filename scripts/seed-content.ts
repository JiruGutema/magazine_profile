import "dotenv/config";
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

/**
 * Seeds the content tables from the defaults. Safe to re-run:
 *  - SiteContent + ArticleSection are upserted by key
 *  - Projects are only inserted when the table is empty (pass --force to reset)
 */
async function main() {
  const force = process.argv.includes("--force");

  const content: Record<string, unknown> = {
    header: DEFAULT_HEADER,
    hero: DEFAULT_HERO,
    infobox: DEFAULT_INFOBOX,
    footer: DEFAULT_FOOTER,
    tags: DEFAULT_TAGS,
  };

  for (const [key, data] of Object.entries(content)) {
    await prisma.siteContent.upsert({
      where: { key },
      create: { key, data: data as object },
      update: { data: data as object },
    });
  }
  console.log(`Seeded ${Object.keys(content).length} site content blocks.`);

  for (const section of DEFAULT_SECTIONS) {
    await prisma.articleSection.upsert({
      where: { key: section.key },
      create: section,
      update: section,
    });
  }
  console.log(`Seeded ${DEFAULT_SECTIONS.length} article sections.`);

  const projectCount = await prisma.project.count();
  if (force) {
    await prisma.project.deleteMany();
  }
  if (force || projectCount === 0) {
    await prisma.project.createMany({ data: DEFAULT_PROJECTS });
    console.log(`Seeded ${DEFAULT_PROJECTS.length} projects.`);
  } else {
    console.log(
      `Skipped projects (${projectCount} already present; pass --force to reset).`,
    );
  }

  console.log("Content seed complete.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

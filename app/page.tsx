import { Infobox } from "@/components/profile/Infobox";
import { Toc, type TocItem } from "@/components/profile/Toc";
import { Html } from "@/components/common/Html";
import { ProjectsTable } from "@/components/portfolio/Projects-Table";
import {
  getContent,
  getProjects,
  getSections,
  type SectionView,
} from "@/lib/content";

export const dynamic = "force-dynamic";

function buildToc(sections: SectionView[]): TocItem[] {
  const items: TocItem[] = [];
  for (const section of sections) {
    if (!section.inToc) continue;
    const item: TocItem = { id: section.key, label: section.title };
    if (section.level >= 3 && items.length > 0) {
      const parent = items[items.length - 1];
      parent.children = parent.children ? [...parent.children, item] : [item];
    } else {
      items.push(item);
    }
  }
  return items;
}

export default async function PortfolioPage() {
  const [hero, infobox, tags, sections, featured] = await Promise.all([
    getContent("hero"),
    getContent("infobox"),
    getContent("tags"),
    getSections(),
    getProjects({ featuredOnly: true }),
  ]);

  const toc = buildToc(sections);

  return (
    <>
      <div className="firstHeading-wrap">
        <h1 className="firstHeading">
          <i>{hero.name}</i>
        </h1>
        {hero.goodArticle && (
          <span className="ga-star" title="This is a good article.">
            ★
          </span>
        )}
      </div>
      <div className="siteSub">{hero.tagline}</div>
      <div className="contentSub" />

      <Infobox data={infobox} />

      <Html html={hero.leadHtml} />

      {toc.length > 0 && <Toc items={toc} />}

      {sections.map((section) => (
        <section key={section.key}>
          {section.level >= 3 ? (
            <h3 id={section.key}>{section.title}</h3>
          ) : (
            <h2 id={section.key}>{section.title}</h2>
          )}
          {section.body && <Html html={section.body} />}
          {section.special === "projects" && (
            <ProjectsTable
              projects={featured}
              caption="Selected projects by Jiru Gutema"
            />
          )}
        </section>
      ))}

      {tags.items.length > 0 && (
        <div className="catlinks">
          <b>Tags</b>:{" "}
          {tags.items.map((tag, i) => (
            <span key={tag}>
              {i > 0 && <span className="catbar">|</span>}
              <a href="#">{tag}</a>
            </span>
          ))}
        </div>
      )}
    </>
  );
}

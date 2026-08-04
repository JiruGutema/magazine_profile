import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Toc, type TocItem } from "@/components/profile/Toc";
import { WorksTable, type WorkRow } from "@/components/portfolio/Works-Table";
import { getProjects } from "@/lib/content";
import {
  buildWorkEntries,
  describeGroupCounts,
  groupWorkEntries,
  joinProse,
  numberWord,
  topTechnologies,
  type WorkEntry,
  type WorkGroup,
} from "@/lib/works";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "List of works by Jiru Gutema | Software Engineering Portfolio",
  description:
    "A catalog of software works, open-source web applications, browser extensions, and developer tools authored and co-authored by Jiru Gutema.",
  keywords: [
    "Jiru Gutema Projects",
    "Software Engineer Portfolio",
    "Web Applications",
    "Browser Extensions",
    "Open Source",
    "Next.js",
    "FastAPI",
    "Go",
  ],
  openGraph: {
    title: "List of works by Jiru Gutema",
    description:
      "A catalog of software works, open-source web applications, browser extensions, and developer tools authored and co-authored by Jiru Gutema.",
    url: "https://jiru.is-a.dev/projects",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "List of works by Jiru Gutema",
    description:
      "A catalog of software works, open-source web applications, browser extensions, and developer tools authored and co-authored by Jiru Gutema.",
  },
};

const GITHUB_PROFILE = "https://github.com/JiruGutema";

function EditSection() {
  return (
    <span className="editsection">
      <a href="/admin/dashboard" title="Edit this section (requires sign-in)">
        edit
      </a>
    </span>
  );
}

/** Wiki-style floated screenshot; rendered only when the project has one. */
function WorkThumb({ src, caption }: { src: string; caption: string }) {
  return (
    <figure className="thumb work-thumb">
      <div className="thumb-img">
        <Image
          src={src}
          alt={caption}
          width={220}
          height={140}
          className="thumb-photo"
        />
      </div>
      <figcaption className="caption">{caption}</figcaption>
    </figure>
  );
}

function WorkDetail({ entry }: { entry: WorkEntry }) {
  const p = entry.project;
  const hasMeta = p.technologies.length > 0 || p.liveDemoLink || p.githubLink;
  return (
    <section id={entry.anchor} className="work-entry">
      <h3>
        <i>{p.title}</i>
      </h3>
      {p.imageUrl && (
        <WorkThumb src={p.imageUrl} caption={p.imageCaption || p.title} />
      )}
      {p.note && (
        <p className="hatnote">
          <i>Note:</i> {p.note}
        </p>
      )}
      {p.description && <p>{p.description}</p>}
      {p.details.length > 0 && (
        <ul>
          {p.details.map((detail, i) => (
            <li key={i}>{detail}</li>
          ))}
        </ul>
      )}
      {hasMeta && (
        <p className="work-meta">
          {p.technologies.length > 0 && (
            <>
              <b>Technologies</b>: {p.technologies.join(", ")}
            </>
          )}
          {p.technologies.length > 0 && (p.liveDemoLink || p.githubLink) && " · "}
          {p.liveDemoLink && (
            <a className="external" href={p.liveDemoLink}>
              Live demo
            </a>
          )}
          {p.liveDemoLink && p.githubLink && " · "}
          {p.githubLink && (
            <a className="external" href={p.githubLink}>
              Source code
            </a>
          )}
        </p>
      )}
    </section>
  );
}

function buildToc(groups: WorkGroup[]): TocItem[] {
  return [
    { id: "overview", label: "Overview" },
    ...groups.map((group) => ({
      id: group.id,
      label: group.heading,
      children: group.entries.map((entry) => ({
        id: entry.anchor,
        label: entry.project.title,
      })),
    })),
    { id: "see-also", label: "See also" },
    { id: "external-links", label: "External links" },
  ];
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  const entries = buildWorkEntries(projects);
  const groups = groupWorkEntries(entries);
  const techs = topTechnologies(projects, 5);
  const year = new Date().getFullYear();

  const rows: WorkRow[] = entries.map((entry, i) => ({
    no: i + 1,
    title: entry.project.title,
    anchor: entry.anchor,
    typeLabel: entry.typeLabel,
    technologies: entry.project.technologies,
    description: entry.project.description,
    liveDemoLink: entry.project.liveDemoLink,
    githubLink: entry.project.githubLink,
  }));

  return (
    <>
      <div className="firstHeading-wrap">
        <h1 className="firstHeading">
          <i>List of works by Jiru Gutema</i>
        </h1>
      </div>
      <div className="siteSub">
        Web applications, browser extensions and developer tools
      </div>
      <div className="contentSub" />

      <p className="hatnote">
        Main article: <Link href="/">Jiru Gutema</Link>.
      </p>
      <p className="hatnote">
        <i>
          This is a dynamic list and may never be able to satisfy particular
          standards for completeness; new works are added as they are released.
        </i>
      </p>

      <p>
        This is a list of{" "}
        <a href="https://en.wikipedia.org/wiki/Software">software</a> works I
        have authored or co-authored as an Ethiopian software engineer. As of{" "}
        {year}, the list comprises{" "}
        {numberWord(entries.length)} works — {describeGroupCounts(groups)} —
        {techs.length > 0 && <> built with technologies including {joinProse(techs)},</>}{" "}
        spanning personal projects, open-source contributions and group work
        undertaken in academic and professional contexts.
      </p>

      <Toc items={buildToc(groups)} />

      <h2 id="overview">
        Overview <EditSection />
      </h2>
      <p>
        The following table summarises all works on this list. Entries appear
        in curated order; the <b>No.</b>, <b>Title</b> and <b>Type</b> columns
        may be sorted by selecting their headers. Titles link to the
        corresponding section below.
      </p>

      <WorksTable works={rows} caption="Works by Jiru Gutema" />

      {groups.map((group) => (
        <section key={group.id}>
          <h2 id={group.id}>
            {group.heading} <EditSection />
          </h2>
          {group.entries.map((entry) => (
            <WorkDetail key={entry.anchor} entry={entry} />
          ))}
        </section>
      ))}

      <h2 id="see-also">
        See also <EditSection />
      </h2>
      <ul>
        <li>
          <Link href="/">Jiru Gutema</Link> — main biographical article
        </li>
        <li>
          <Link href="/blogs">Writings by Jiru Gutema</Link> — blog posts and
          technical notes
        </li>
      </ul>

      <h2 id="external-links">
        External links <EditSection />
      </h2>
      <ul>
        <li>
          <a className="external" href={GITHUB_PROFILE}>
            JiruGutema on GitHub
          </a>{" "}
          — source repositories for most of the works listed above
        </li>
      </ul>

      <div className="catlinks">
        <b>Categories</b>:{" "}
        <span>
          <a href="/">Works by Jiru Gutema</a>
        </span>
        <span className="catbar">|</span>
        <span>
          <a href="#overview">Lists of software</a>
        </span>
        {groups.map((group) => (
          <span key={group.id}>
            <span className="catbar">|</span>
            <a href={`#${group.id}`}>{group.heading}</a>
          </span>
        ))}
      </div>
    </>
  );
}
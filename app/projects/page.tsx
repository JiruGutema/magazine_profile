import Link from "next/link";
import { ProjectsTable } from "@/components/portfolio/Projects-Table";
import { getProjects } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getProjects();

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

      <p className="hatnote">
        Main article: <Link href="/">Jiru Gutema</Link>.
      </p>

      <p>
        This is a list of{" "}
        <a href="https://en.wikipedia.org/wiki/Software">software</a> projects
        authored or co-authored by <Link href="/">Jiru Gutema</Link>. The list
        comprises personal projects, open-source contributions and group work
        undertaken in academic and professional contexts.
      </p>

      <ProjectsTable projects={projects} caption="Works by Jiru Gutema" />

      <h2 id="details">Project details</h2>

      {projects.map((p) => (
        <section key={p.id} id={`project-${p.id}`}>
          <h3>
            <i>{p.title}</i>
          </h3>
          <p>{p.description}</p>
          {p.note && (
            <p className="hatnote">
              <i>Note:</i> {p.note}
            </p>
          )}
          {p.details.length > 0 && (
            <ul>
              {p.details.map((d, j) => (
                <li key={j}>{d}</li>
              ))}
            </ul>
          )}
          <p style={{ fontSize: 12 }}>
            <b>Technologies</b>: {p.technologies.join(", ")}
            {(p.liveDemoLink || p.githubLink) && " · "}
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
        </section>
      ))}

    </>
  );
}

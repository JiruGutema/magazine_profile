import { projects } from "../../components/data/projects";
import Link from "next/link";

interface Project {
  id: number;
  title: string;
  description: string;
  note?: string;
  technologies: string[];
  details: string[];
  liveDemoLink?: string;
  githubLink?: string;
}

export default function ProjectsPage() {
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
        This is a list of <a href="https://en.wikipedia.org/wiki/Software">software</a>{" "}
        projects authored or co-authored by <Link href="/">Jiru Gutema</Link>. The list
        comprises personal projects, open-source contributions and group work undertaken
        in academic and professional contexts.
      </p>

      <table className="wikitable">
        <caption>Works by Jiru Gutema</caption>
        <thead>
          <tr>
            <th style={{ width: "20%" }}>Title</th>
            <th style={{ width: "22%" }}>Technologies</th>
            <th>Description</th>
            <th style={{ width: "16%" }}>Links</th>
          </tr>
        </thead>
        <tbody>
          {(projects as Project[]).map((p, i) => (
            <tr key={`${p.id}-${i}`}>
              <td><i>{p.title}</i></td>
              <td>{p.technologies.join(", ")}</td>
              <td>{p.description}</td>
              <td>
                {p.liveDemoLink && (
                  <>
                    <a className="external" href={p.liveDemoLink}>Live</a>
                    <br />
                  </>
                )}
                {p.githubLink && (
                  <a className="external" href={p.githubLink}>Source</a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 id="details">
        Project details <span className="editsection"><a href="#">edit</a></span>
      </h2>

      {(projects as Project[]).map((p, i) => (
        <section key={`detail-${p.id}-${i}`} id={`project-${p.id}`}>
          <h3>
            <i>{p.title}</i>
          </h3>
          <p>{p.description}</p>
          {p.note && (
            <p className="hatnote">
              <i>Note:</i> {p.note}
            </p>
          )}
          <ul>
            {p.details.map((d, j) => (
              <li key={j}>{d}</li>
            ))}
          </ul>
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

      <h2 id="seealso">
        See also <span className="editsection"><a href="#">edit</a></span>
      </h2>
      <div className="col2">
        <ul>
          <li><Link href="/">Jiru Gutema</Link></li>
          <li><Link href="/blogs">Writings by Jiru Gutema</Link></li>
        </ul>
      </div>
    </>
  );
}

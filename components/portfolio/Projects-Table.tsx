import type { ProjectView } from "@/lib/content";

interface ProjectsTableProps {
  projects: ProjectView[];
  caption: string;
}

export function ProjectsTable({ projects, caption }: ProjectsTableProps) {
  return (
    <table className="wikitable">
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th style={{ width: "20%" }}>Title</th>
          <th style={{ width: "22%" }}>Technologies</th>
          <th>Description</th>
          <th style={{ width: "16%" }}>Links</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((p) => (
          <tr key={p.id}>
            <td>
              <i>{p.title}</i>
            </td>
            <td>{p.technologies.join(", ")}</td>
            <td>{p.description}</td>
            <td>
              {p.liveDemoLink && (
                <>
                  <a className="external" href={p.liveDemoLink}>
                    Live
                  </a>
                  <br />
                </>
              )}
              {p.githubLink && (
                <a className="external" href={p.githubLink}>
                  Source
                </a>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

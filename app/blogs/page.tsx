import { BlogPost } from "@/lib/types";
import { baseUrl } from "@/lib/utils";
import "dotenv/config";
import Link from "next/link";

export default async function BlogPage() {
  let posts: BlogPost[] = [];

  try {
    const res = await fetch(`${baseUrl}/api/blogs`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch blogs: ${res.status}`);
    const data = await res.json();
    posts = data.data || [];
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    posts = [];
  }

  return (
    <>
      <div className="firstHeading-wrap">
        <h1 className="firstHeading">
          <i>Writings by Jiru Gutema</i>
        </h1>
      </div>
      <div className="siteSub">List of essays, tutorials and notes</div>

      <p className="hatnote">
        Main article: <Link href="/">Jiru Gutema</Link>.
      </p>

      <p>
        This is a chronological list of writings authored by{" "}
        <Link href="/">Jiru Gutema</Link>, covering software development,
        web technologies and programming best practices. The list is ordered by
        publication date, with the most recent entries first.
      </p>

      {posts.length === 0 ? (
        <p>
          <i>
            No writings have been catalogued at this time. Please check back later.
          </i>
        </p>
      ) : (
        <table className="wikitable">
          <caption>Writings by Jiru Gutema</caption>
          <thead>
            <tr>
              <th style={{ width: "26%" }}>Title</th>
              <th style={{ width: "12%" }}>Published</th>
              <th style={{ width: "10%" }}>Read time</th>
              <th>Excerpt</th>
              <th style={{ width: "16%" }}>Tags</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => {
              const tags = Array.isArray(post.tags) ? post.tags : [];
              const date = new Date(post.publishedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });
              return (
                <tr key={post.id}>
                  <td>
                    <Link href={`/blogs/${post.slug}`}>
                      <i>{post.title}</i>
                    </Link>
                  </td>
                  <td>{date}</td>
                  <td>{post.readTime}</td>
                  <td>{post.excerpt}</td>
                  <td>{tags.join(", ")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <h2 id="seealso">
        See also      </h2>
      <div className="col2">
        <ul>
          <li><Link href="/">Jiru Gutema</Link></li>
          <li><Link href="/projects">List of works by Jiru Gutema</Link></li>
        </ul>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import { BlogPost } from "@/lib/types";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Writings by Jiru Gutema | Essays, Tutorials and Notes",
  description:
    "A chronological list of writings, essays, tutorials, and technical notes authored by Jiru Gutema covering software development, web technologies, and systems engineering.",
  keywords: [
    "Jiru Gutema",
    "Blog",
    "Software Engineering Articles",
    "Web Development",
    "Tutorials",
    "Next.js",
    "FastAPI",
  ],
  openGraph: {
    title: "Writings by Jiru Gutema",
    description:
      "A chronological list of writings, essays, tutorials, and technical notes authored by Jiru Gutema covering software development, web technologies, and systems engineering.",
    url: "https://jiru.is-a.dev/blogs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Writings by Jiru Gutema",
    description:
      "A chronological list of writings, essays, tutorials, and technical notes authored by Jiru Gutema covering software development, web technologies, and systems engineering.",
  },
};

export default async function BlogPage() {
  let posts: BlogPost[] = [];

  try {
    const res = await prisma.blogPost.findMany({
      orderBy: { publishedAt: "desc" },
    });
    posts = res.map((p) => ({
      id: p.id,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      author: p.author,
      publishedAt: p.publishedAt,
      readTime: p.readTime,
      tags: p.tags ? p.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      likes: p.likes,
      dislikes: p.dislikes,
      slug: p.slug,
      coverImage: p.coverImage || undefined,
    }));
  } catch (error) {
    console.error("Error fetching blog posts from database:", error);
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
        This is a chronological list of writings I have authored, covering
        software development, web technologies and programming best practices.
        The list is ordered by publication date, with the most recent entries
        first.
      </p>

      {posts.length === 0 ? (
        <p>
          <i>
            No writings have been catalogued at this time. Please check back
            later.
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
              const date = new Date(post.publishedAt).toLocaleDateString(
                "en-GB",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                },
              );
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

    </>
  );
}

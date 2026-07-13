"use client";

import { useEffect, useState } from "react";
import { Button, Card } from "../ui";
import BlogEditor from "../BlogEditor";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  tags: string;
}

export function BlogsPanel() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blogs");
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: number) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
    load();
  };

  if (creating || editingId) {
    return (
      <BlogEditor
        postId={editingId}
        onSave={() => {
          setEditingId(null);
          setCreating(false);
          load();
        }}
        onCancel={() => {
          setEditingId(null);
          setCreating(false);
        }}
      />
    );
  }

  const filtered = query
    ? posts.filter((p) =>
        `${p.title} ${p.excerpt} ${p.tags}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      )
    : posts;

  return (
    <Card
      title="Blog posts"
      sub="Essays, tutorials and notes shown under /blogs."
      actions={
        <Button small variant="primary" onClick={() => setCreating(true)}>
          + New post
        </Button>
      }
    >
      <div style={{ marginBottom: 12 }}>
        <input
          className="admin-input"
          placeholder="Search posts…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="admin-help">Loading posts…</p>
      ) : filtered.length === 0 ? (
        <p className="admin-help">
          {query ? "No posts match your search." : "No posts yet."}
        </p>
      ) : (
        <div className="admin-list">
          {filtered.map((post) => (
            <div className="admin-item" key={post.id}>
              <div className="admin-item-main">
                <div className="admin-item-title">{post.title}</div>
                <div className="admin-item-meta">
                  {post.author} ·{" "}
                  {new Date(post.publishedAt).toLocaleDateString()}
                </div>
              </div>
              <div className="admin-item-actions">
                <Button small onClick={() => setEditingId(post.id)}>
                  Edit
                </Button>
                <Button small variant="danger" onClick={() => remove(post.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

"use client";

import { useState, useEffect } from "react";
import MarkdownRenderer from "@/components/blog/MarkdownRenderer";
import { Button, Card, Field, SaveStatus, TextArea, TextInput, type SaveState } from "./ui";

interface BlogEditorProps {
  postId: number | null;
  onSave: () => void;
  onCancel: () => void;
}

interface BlogForm {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  readTime: string;
  tags: string;
  coverImage: string;
}

const BLANK: BlogForm = {
  title: "",
  excerpt: "",
  content: "",
  author: "",
  readTime: "",
  tags: "",
  coverImage: "",
};

export default function BlogEditor({ postId, onSave, onCancel }: BlogEditorProps) {
  const [form, setForm] = useState<BlogForm>(BLANK);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<SaveState>({ kind: "idle" });
  const [preview, setPreview] = useState(false);
  const isNew = !postId;

  useEffect(() => {
    if (!postId) return;
    setLoading(true);
    fetch(`/api/admin/blogs/${postId}`)
      .then((r) => r.json())
      .then((data) =>
        setForm({
          title: data.title ?? "",
          excerpt: data.excerpt ?? "",
          content: data.content ?? "",
          author: data.author ?? "",
          readTime: data.readTime ?? "",
          tags: data.tags ?? "",
          coverImage: data.coverImage ?? "",
        }),
      )
      .catch((error) => console.error("Failed to fetch post:", error))
      .finally(() => setLoading(false));
  }, [postId]);

  const set = (patch: Partial<BlogForm>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const submit = async () => {
    setState({ kind: "saving" });
    try {
      const url = isNew ? "/api/admin/blogs" : `/api/admin/blogs/${postId}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        setState({ kind: "err", message: e.error || "Failed to save" });
        return;
      }
      setState({ kind: "ok", message: "Saved" });
      onSave();
    } catch {
      setState({ kind: "err", message: "Failed to save" });
    }
  };

  if (loading) return <Card>Loading…</Card>;

  return (
    <Card
      title={isNew ? "New post" : "Edit post"}
      actions={
        <div className="admin-item-actions">
          <Button small onClick={() => setPreview((p) => !p)}>
            {preview ? "Edit" : "Preview"}
          </Button>
          <Button small onClick={onCancel}>
            ← Back
          </Button>
        </div>
      }
    >
      {preview ? (
        <div
          className="vector-body"
          style={{
            border: "1px solid var(--rule-soft)",
            padding: "14px 18px",
            background: "var(--content-bg)",
          }}
        >
          <h1 className="firstHeading">
            <i>{form.title || "Untitled Post"}</i>
          </h1>
          <div className="siteSub">{form.excerpt || "No excerpt provided"}</div>
          {form.content ? (
            <MarkdownRenderer content={form.content} />
          ) : (
            <p className="admin-help">No content yet…</p>
          )}
        </div>
      ) : (
        <>
          <Field label="Title">
            <TextInput value={form.title} onChange={(v) => set({ title: v })} />
          </Field>
          <Field label="Excerpt">
            <TextArea
              value={form.excerpt}
              onChange={(v) => set({ excerpt: v })}
              rows={2}
              mono={false}
            />
          </Field>
          <Field label="Content" help="Markdown supported.">
            <TextArea
              value={form.content}
              onChange={(v) => set({ content: v })}
              rows={18}
            />
          </Field>
          <div className="admin-grid-2">
            <Field label="Author">
              <TextInput
                value={form.author}
                onChange={(v) => set({ author: v })}
              />
            </Field>
            <Field label="Read time" help="e.g. 5">
              <TextInput
                value={form.readTime}
                onChange={(v) => set({ readTime: v })}
              />
            </Field>
          </div>
          <Field label="Tags" help="Comma-separated.">
            <TextInput
              value={form.tags}
              onChange={(v) => set({ tags: v })}
              placeholder="React, Next.js, TypeScript"
            />
          </Field>
          <Field label="Cover image URL" help="Optional.">
            <TextInput
              value={form.coverImage}
              onChange={(v) => set({ coverImage: v })}
            />
          </Field>
        </>
      )}

      <div className="admin-actions">
        <Button variant="primary" onClick={submit}>
          {isNew ? "Create post" : "Save post"}
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
        <SaveStatus state={state} />
      </div>
    </Card>
  );
}

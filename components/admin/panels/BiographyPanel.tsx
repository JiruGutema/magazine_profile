"use client";

import { useEffect, useState } from "react";
import { useContentBlock } from "../useContentBlock";
import { Button, Card, Checkbox, Field, SaveStatus, TextInput } from "../ui";
import { HtmlBodyEditor } from "../HtmlBodyEditor";
import { AdminSection, SectionEditor } from "./SectionEditor";
import type { HeroContent } from "@/lib/content-types";

export function BiographyPanel() {
  return (
    <>
      <HeroEditor />
      <SectionsManager />
    </>
  );
}

function HeroEditor() {
  const { data, setData, state, save } = useContentBlock<HeroContent>("hero");
  if (!data) return <Card>Loading…</Card>;
  const set = (patch: Partial<HeroContent>) => setData({ ...data, ...patch });

  return (
    <Card
      title="Lead & title"
      sub="The article headline, subtitle and opening paragraphs."
    >
      <div className="admin-grid-2">
        <Field label="Name (headline)">
          <TextInput value={data.name} onChange={(v) => set({ name: v })} />
        </Field>
        <Field label="Tagline (subtitle)">
          <TextInput
            value={data.tagline}
            onChange={(v) => set({ tagline: v })}
          />
        </Field>
      </div>
      <Checkbox
        label="Show the “good article” gold star"
        checked={data.goodArticle}
        onChange={(v) => set({ goodArticle: v })}
      />
      <Field
        label="Lead paragraphs"
        help="The opening paragraphs shown beside the infobox."
      >
        <HtmlBodyEditor value={data.leadHtml} onChange={(v) => set({ leadHtml: v })} />
      </Field>
      <div className="admin-actions">
        <Button variant="primary" onClick={() => save(data)}>
          Save lead
        </Button>
        <SaveStatus state={state} />
      </div>
    </Card>
  );
}

function SectionsManager() {
  const [sections, setSections] = useState<AdminSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminSection | null>(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sections");
      const data = await res.json();
      setSections(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load sections:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (section: AdminSection) => {
    if (!confirm(`Delete section “${section.title}”?`)) return;
    await fetch(`/api/admin/sections/${section.id}`, { method: "DELETE" });
    load();
  };

  if (creating || editing) {
    return (
      <SectionEditor
        section={editing}
        onSaved={() => {
          setEditing(null);
          setCreating(false);
          load();
        }}
        onCancel={() => {
          setEditing(null);
          setCreating(false);
        }}
      />
    );
  }

  return (
    <Card
      title="Article sections"
      sub="Each block of the biography, in display order."
      actions={
        <Button small variant="primary" onClick={() => setCreating(true)}>
          + New section
        </Button>
      }
    >
      {loading ? (
        <p className="admin-help">Loading sections…</p>
      ) : sections.length === 0 ? (
        <p className="admin-help">No sections yet.</p>
      ) : (
        <div className="admin-list">
          {sections.map((section) => (
            <div className="admin-item" key={section.id}>
              <div className="admin-item-main">
                <div className="admin-item-title">
                  {section.title}
                  <span className="admin-badge">H{section.level}</span>
                  {section.special === "projects" && (
                    <span className="admin-badge">+ projects table</span>
                  )}
                  {!section.published && (
                    <span className="admin-badge off">hidden</span>
                  )}
                  {!section.inToc && (
                    <span className="admin-badge">not in TOC</span>
                  )}
                </div>
                <div className="admin-item-meta">
                  #{section.order} · key: {section.key}
                </div>
              </div>
              <div className="admin-item-actions">
                <Button small onClick={() => setEditing(section)}>
                  Edit
                </Button>
                <Button small variant="danger" onClick={() => remove(section)}>
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

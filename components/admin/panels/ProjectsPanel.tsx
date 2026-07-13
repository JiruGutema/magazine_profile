"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Field,
  SaveStatus,
  TextArea,
  TextInput,
  type SaveState,
} from "../ui";

interface AdminProject {
  id: number;
  title: string;
  description: string;
  note: string;
  technologies: string;
  details: string;
  liveDemoLink: string;
  githubLink: string;
  featured: boolean;
  order: number;
}

const BLANK: AdminProject = {
  id: 0,
  title: "",
  description: "",
  note: "",
  technologies: "",
  details: "",
  liveDemoLink: "",
  githubLink: "",
  featured: true,
  order: 0,
};

export function ProjectsPanel() {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminProject | null>(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (project: AdminProject) => {
    if (!confirm(`Delete project “${project.title}”?`)) return;
    await fetch(`/api/admin/projects/${project.id}`, { method: "DELETE" });
    load();
  };

  if (creating || editing) {
    return (
      <ProjectEditor
        project={editing}
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
      title="Projects"
      sub="Featured projects appear in the biography table; all appear on /projects."
      actions={
        <Button small variant="primary" onClick={() => setCreating(true)}>
          + New project
        </Button>
      }
    >
      {loading ? (
        <p className="admin-help">Loading projects…</p>
      ) : projects.length === 0 ? (
        <p className="admin-help">No projects yet.</p>
      ) : (
        <div className="admin-list">
          {projects.map((project) => (
            <div className="admin-item" key={project.id}>
              <div className="admin-item-main">
                <div className="admin-item-title">
                  {project.title}
                  {project.featured && (
                    <span className="admin-badge">featured</span>
                  )}
                </div>
                <div className="admin-item-meta">
                  #{project.order} · {project.technologies || "no tech listed"}
                </div>
              </div>
              <div className="admin-item-actions">
                <Button small onClick={() => setEditing(project)}>
                  Edit
                </Button>
                <Button small variant="danger" onClick={() => remove(project)}>
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

function ProjectEditor({
  project,
  onSaved,
  onCancel,
}: {
  project: AdminProject | null;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<AdminProject>(project ?? BLANK);
  const [state, setState] = useState<SaveState>({ kind: "idle" });
  const isNew = !project;
  const set = (patch: Partial<AdminProject>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const submit = async () => {
    setState({ kind: "saving" });
    try {
      const url = isNew
        ? "/api/admin/projects"
        : `/api/admin/projects/${form.id}`;
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
      onSaved();
    } catch {
      setState({ kind: "err", message: "Failed to save" });
    }
  };

  return (
    <Card
      title={isNew ? "New project" : `Editing: ${project?.title}`}
      actions={
        <Button small onClick={onCancel}>
          ← Back
        </Button>
      }
    >
      <Field label="Title">
        <TextInput value={form.title} onChange={(v) => set({ title: v })} />
      </Field>
      <Field label="Description" help="One-line summary shown in the table.">
        <TextArea
          value={form.description}
          onChange={(v) => set({ description: v })}
          rows={2}
          mono={false}
        />
      </Field>
      <Field label="Note" help="Optional caveat shown on the /projects detail.">
        <TextArea
          value={form.note}
          onChange={(v) => set({ note: v })}
          rows={2}
          mono={false}
        />
      </Field>
      <Field label="Technologies" help="Comma-separated.">
        <TextInput
          value={form.technologies}
          onChange={(v) => set({ technologies: v })}
          placeholder="Next.js, PostgreSQL, Prisma"
        />
      </Field>
      <Field label="Details" help="One bullet per line (shown on /projects).">
        <TextArea
          value={form.details}
          onChange={(v) => set({ details: v })}
          rows={6}
          mono={false}
        />
      </Field>
      <div className="admin-grid-2">
        <Field label="Live demo URL">
          <TextInput
            value={form.liveDemoLink}
            onChange={(v) => set({ liveDemoLink: v })}
          />
        </Field>
        <Field label="Source / GitHub URL">
          <TextInput
            value={form.githubLink}
            onChange={(v) => set({ githubLink: v })}
          />
        </Field>
      </div>
      <div className="admin-grid-2">
        <Field label="Order" help="Lower numbers appear first.">
          <TextInput
            type="number"
            value={String(form.order)}
            onChange={(v) => set({ order: Number(v) || 0 })}
          />
        </Field>
        <div style={{ paddingTop: 24 }}>
          <Checkbox
            label="Featured (show in biography table)"
            checked={form.featured}
            onChange={(v) => set({ featured: v })}
          />
        </div>
      </div>

      <div className="admin-actions">
        <Button variant="primary" onClick={submit}>
          {isNew ? "Create project" : "Save project"}
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
        <SaveStatus state={state} />
      </div>
    </Card>
  );
}

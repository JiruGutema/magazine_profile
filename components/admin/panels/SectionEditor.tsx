"use client";

import { useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Field,
  SaveStatus,
  TextInput,
  type SaveState,
} from "../ui";
import { HtmlBodyEditor } from "../HtmlBodyEditor";

export interface AdminSection {
  id: number;
  key: string;
  title: string;
  level: number;
  body: string;
  order: number;
  inToc: boolean;
  published: boolean;
  special: string;
}

const BLANK: AdminSection = {
  id: 0,
  key: "",
  title: "",
  level: 2,
  body: "",
  order: 0,
  inToc: true,
  published: true,
  special: "",
};

export function SectionEditor({
  section,
  onSaved,
  onCancel,
}: {
  section: AdminSection | null;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<AdminSection>(section ?? BLANK);
  const [state, setState] = useState<SaveState>({ kind: "idle" });
  const isNew = !section;

  const set = (patch: Partial<AdminSection>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const submit = async () => {
    setState({ kind: "saving" });
    try {
      const url = isNew
        ? "/api/admin/sections"
        : `/api/admin/sections/${form.id}`;
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
      title={isNew ? "New section" : `Editing: ${section?.title}`}
      actions={
        <Button small onClick={onCancel}>
          ← Back
        </Button>
      }
    >
      <div className="admin-grid-2">
        <Field label="Title">
          <TextInput value={form.title} onChange={(v) => set({ title: v })} />
        </Field>
        <Field
          label="Key / anchor"
          help="Used for #links and the TOC. Lowercase, no spaces."
        >
          <TextInput value={form.key} onChange={(v) => set({ key: v })} />
        </Field>
      </div>

      <div className="admin-grid-2">
        <Field label="Heading level">
          <select
            className="admin-select"
            value={form.level}
            onChange={(e) => set({ level: Number(e.target.value) })}
          >
            <option value={2}>H2 — top-level section</option>
            <option value={3}>H3 — sub-section</option>
          </select>
        </Field>
        <Field label="Order" help="Lower numbers appear first.">
          <TextInput
            type="number"
            value={String(form.order)}
            onChange={(v) => set({ order: Number(v) || 0 })}
          />
        </Field>
      </div>

      <div className="admin-inline" style={{ gap: 18, marginBottom: 6 }}>
        <Checkbox
          label="Show in table of contents"
          checked={form.inToc}
          onChange={(v) => set({ inToc: v })}
        />
        <Checkbox
          label="Published"
          checked={form.published}
          onChange={(v) => set({ published: v })}
        />
      </div>

      <Field
        label="Special behaviour"
        help='Set to "projects" to inject the featured-projects table after this section. Otherwise leave blank.'
      >
        <TextInput
          value={form.special}
          onChange={(v) => set({ special: v })}
          placeholder="(none)"
        />
      </Field>

      <Field
        label="Body"
        help="Rich text for prose; the HTML tab handles wiki blocks like quote boxes and tables."
      >
        <HtmlBodyEditor value={form.body} onChange={(v) => set({ body: v })} />
      </Field>

      <div className="admin-actions">
        <Button variant="primary" onClick={submit}>
          {isNew ? "Create section" : "Save section"}
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
        <SaveStatus state={state} />
      </div>
    </Card>
  );
}

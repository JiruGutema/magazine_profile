"use client";

import { useContentBlock } from "../useContentBlock";
import { Button, Card, Field, SaveStatus, TextInput } from "../ui";
import type { InfoboxContent, InfoboxSection } from "@/lib/content-types";

export function InfoboxPanel() {
  const { data, setData, state, save } =
    useContentBlock<InfoboxContent>("infobox");
  if (!data) return <Card>Loading…</Card>;

  const set = (patch: Partial<InfoboxContent>) => setData({ ...data, ...patch });
  const setSection = (i: number, patch: Partial<InfoboxSection>) =>
    set({
      sections: data.sections.map((s, idx) =>
        idx === i ? { ...s, ...patch } : s,
      ),
    });
  const addSection = () =>
    set({ sections: [...data.sections, { heading: "New section", rows: [] }] });
  const removeSection = (i: number) =>
    set({ sections: data.sections.filter((_, idx) => idx !== i) });

  return (
    <Card
      title="Infobox"
      sub="The bio card floated to the right of the biography lead."
    >
      <div className="admin-grid-2">
        <Field label="Title">
          <TextInput value={data.title} onChange={(v) => set({ title: v })} />
        </Field>
        <Field label="Photo caption">
          <TextInput
            value={data.imageCaption}
            onChange={(v) => set({ imageCaption: v })}
          />
        </Field>
      </div>
      <Field label="Image URL" help="Path under /public, e.g. /images/profile.png">
        <TextInput value={data.image} onChange={(v) => set({ image: v })} />
      </Field>

      {data.sections.map((section, si) => (
        <div
          key={si}
          style={{
            border: "1px solid var(--rule-soft)",
            padding: "10px",
            margin: "0 0 12px",
            background: "var(--content-bg)",
          }}
        >
          <div className="admin-repeat-row" style={{ alignItems: "center" }}>
            <input
              className="admin-input"
              style={{ flex: 1, fontWeight: "bold" }}
              value={section.heading}
              onChange={(e) => setSection(si, { heading: e.target.value })}
            />
            <label className="admin-check" style={{ margin: 0 }}>
              <input
                type="checkbox"
                checked={section.website ?? false}
                onChange={(e) => setSection(si, { website: e.target.checked })}
              />
              links
            </label>
            <Button small variant="danger" onClick={() => removeSection(si)}>
              Remove
            </Button>
          </div>

          <RowsEditor
            rows={section.rows}
            onChange={(rows) => setSection(si, { rows })}
          />
        </div>
      ))}

      <div className="admin-actions">
        <Button small onClick={addSection}>
          + Add section
        </Button>
      </div>

      <div className="admin-actions" style={{ marginTop: 12 }}>
        <Button variant="primary" onClick={() => save(data)}>
          Save infobox
        </Button>
        <SaveStatus state={state} />
      </div>
    </Card>
  );
}

function RowsEditor({
  rows,
  onChange,
}: {
  rows: InfoboxSection["rows"];
  onChange: (rows: InfoboxSection["rows"]) => void;
}) {
  const update = (i: number, patch: Partial<InfoboxSection["rows"][number]>) =>
    onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const remove = (i: number) => onChange(rows.filter((_, idx) => idx !== i));
  const add = () => onChange([...rows, { label: "", value: "" }]);
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div style={{ marginTop: 8 }}>
      {rows.map((row, i) => (
        <div className="admin-repeat-row" key={i}>
          <input
            className="admin-input"
            style={{ flex: "0 0 28%" }}
            placeholder="Label"
            value={row.label}
            onChange={(e) => update(i, { label: e.target.value })}
          />
          <input
            className="admin-input"
            placeholder="Value (HTML allowed)"
            value={row.value}
            onChange={(e) => update(i, { value: e.target.value })}
          />
          <Button small onClick={() => move(i, -1)}>
            ↑
          </Button>
          <Button small onClick={() => move(i, 1)}>
            ↓
          </Button>
          <Button small variant="danger" onClick={() => remove(i)}>
            ✕
          </Button>
        </div>
      ))}
      <Button small onClick={add}>
        + Add row
      </Button>
    </div>
  );
}

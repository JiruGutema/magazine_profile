"use client";

import { useContentBlock } from "../useContentBlock";
import {
  Button,
  Card,
  Field,
  SaveStatus,
  StringListEditor,
  TextArea,
  TextInput,
} from "../ui";
import type {
  FooterContent,
  HeaderContent,
  TagsContent,
} from "@/lib/content-types";

export function HeaderPanel() {
  const { data, setData, state, save } = useContentBlock<HeaderContent>("header");
  if (!data) return <Loading />;
  const set = (patch: Partial<HeaderContent>) => setData({ ...data, ...patch });

  return (
    <Card
      title="Header bar"
      sub="The status strip shown above the navigation tabs."
    >
      <div className="admin-grid-2">
        <Field label="Email">
          <TextInput value={data.email} onChange={(v) => set({ email: v })} />
        </Field>
        <Field label="Location">
          <TextInput
            value={data.location}
            onChange={(v) => set({ location: v })}
          />
        </Field>
        <Field label="Timezone">
          <TextInput
            value={data.timezone}
            onChange={(v) => set({ timezone: v })}
          />
        </Field>
        <Field label="Availability" help="Leave empty to hide the green status.">
          <TextInput
            value={data.availability}
            onChange={(v) => set({ availability: v })}
          />
        </Field>
      </div>
      <div className="admin-actions">
        <Button variant="primary" onClick={() => save(data)}>
          Save header
        </Button>
        <SaveStatus state={state} />
      </div>
    </Card>
  );
}

export function FooterPanel() {
  const { data, setData, state, save } = useContentBlock<FooterContent>("footer");
  if (!data) return <Loading />;
  const set = (patch: Partial<FooterContent>) => setData({ ...data, ...patch });

  const updateLink = (i: number, patch: Partial<FooterContent["links"][number]>) =>
    set({ links: data.links.map((l, idx) => (idx === i ? { ...l, ...patch } : l)) });
  const removeLink = (i: number) =>
    set({ links: data.links.filter((_, idx) => idx !== i) });
  const addLink = () =>
    set({ links: [...data.links, { label: "", href: "", external: false }] });

  return (
    <Card title="Footer" sub="The tagline and the link row at the bottom of every page.">
      <Field
        label="Tagline"
        help="Rendered after “© YEAR Jiru Gutema ·”. Basic HTML allowed."
      >
        <TextArea value={data.tagline} onChange={(v) => set({ tagline: v })} rows={2} />
      </Field>

      <Field label="Links">
        <div>
          {data.links.map((link, i) => (
            <div className="admin-repeat-row" key={i}>
              <input
                className="admin-input"
                style={{ flex: "0 0 30%" }}
                placeholder="Label"
                value={link.label}
                onChange={(e) => updateLink(i, { label: e.target.value })}
              />
              <input
                className="admin-input"
                placeholder="https:// or /path or #anchor"
                value={link.href}
                onChange={(e) => updateLink(i, { href: e.target.value })}
              />
              <label className="admin-check" style={{ margin: 0 }}>
                <input
                  type="checkbox"
                  checked={link.external}
                  onChange={(e) => updateLink(i, { external: e.target.checked })}
                />
                ext
              </label>
              <Button small variant="danger" onClick={() => removeLink(i)}>
                ✕
              </Button>
            </div>
          ))}
          <Button small onClick={addLink}>
            + Add link
          </Button>
        </div>
      </Field>

      <div className="admin-actions">
        <Button variant="primary" onClick={() => save(data)}>
          Save footer
        </Button>
        <SaveStatus state={state} />
      </div>
    </Card>
  );
}

export function TagsPanel() {
  const { data, setData, state, save } = useContentBlock<TagsContent>("tags");
  if (!data) return <Loading />;

  return (
    <Card
      title="Tags"
      sub="The category bar at the very bottom of the biography page."
    >
      <Field label="Tags">
        <StringListEditor
          items={data.items}
          onChange={(items) => setData({ items })}
          placeholder="Tag label"
        />
      </Field>
      <div className="admin-actions">
        <Button variant="primary" onClick={() => save(data)}>
          Save tags
        </Button>
        <SaveStatus state={state} />
      </div>
    </Card>
  );
}

function Loading() {
  return <Card>Loading…</Card>;
}

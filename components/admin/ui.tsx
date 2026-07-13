"use client";

import type { ReactNode } from "react";

export function Field({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: ReactNode;
}) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      {children}
      {help && <p className="admin-help">{help}</p>}
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      className="admin-input"
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function TextArea({
  value,
  onChange,
  rows = 5,
  placeholder,
  mono = true,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  mono?: boolean;
}) {
  return (
    <textarea
      className="admin-textarea"
      style={mono ? undefined : { fontFamily: "var(--sans)", fontSize: 13 }}
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="admin-check">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

type ButtonVariant = "default" | "primary" | "danger";

export function Button({
  children,
  onClick,
  type = "button",
  variant = "default",
  disabled,
  small,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: ButtonVariant;
  disabled?: boolean;
  small?: boolean;
}) {
  const cls = [
    "admin-btn",
    variant !== "default" ? variant : "",
    small ? "sm" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function Card({
  title,
  sub,
  actions,
  children,
}: {
  title?: string;
  sub?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="admin-card">
      {(title || actions) && (
        <div className="admin-card-head">
          <div>
            {title && <div className="admin-card-title">{title}</div>}
            {sub && <div className="admin-card-sub">{sub}</div>}
          </div>
          {actions && <div className="admin-item-actions">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export type SaveState = { kind: "idle" | "saving" | "ok" | "err"; message?: string };

export function SaveStatus({ state }: { state: SaveState }) {
  if (state.kind === "idle") return null;
  if (state.kind === "saving")
    return <span className="admin-status">Saving…</span>;
  if (state.kind === "ok")
    return <span className="admin-status ok">{state.message || "Saved"}</span>;
  return (
    <span className="admin-status err">{state.message || "Failed to save"}</span>
  );
}

/** Repeatable list of plain strings, with add / remove / move controls. */
export function StringListEditor({
  items,
  onChange,
  placeholder,
  textarea,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  textarea?: boolean;
}) {
  const update = (i: number, v: string) =>
    onChange(items.map((it, idx) => (idx === i ? v : it)));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, ""]);
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div>
      {items.map((item, i) => (
        <div className="admin-repeat-row" key={i}>
          {textarea ? (
            <textarea
              className="admin-textarea"
              rows={2}
              value={item}
              placeholder={placeholder}
              onChange={(e) => update(i, e.target.value)}
            />
          ) : (
            <input
              className="admin-input"
              value={item}
              placeholder={placeholder}
              onChange={(e) => update(i, e.target.value)}
            />
          )}
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
        + Add
      </Button>
    </div>
  );
}

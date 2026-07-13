"use client";

import { useState } from "react";
import { Button } from "./ui";
import { RichTextEditor } from "./RichTextEditor";
import { sanitizeHtml } from "@/lib/sanitize";

type Mode = "rich" | "html" | "preview";

/**
 * Markup the rich-text editor cannot represent without losing information
 * (tables, quote boxes, multi-column lists, and the intentional
 * external-link / hatnote classes). When the body contains any of these we
 * default to the HTML tab so Quill never silently strips them.
 */
const NEEDS_HTML =
  /(<table\b|class="(?:external|quotebox|col2|wikitable|catlinks|hatnote|thumb|references|toc|new)")/i;

interface HtmlBodyEditorProps {
  value: string;
  onChange: (html: string) => void;
  rows?: number;
}

export function HtmlBodyEditor({ value, onChange, rows = 12 }: HtmlBodyEditorProps) {
  const [mode, setMode] = useState<Mode>(() =>
    NEEDS_HTML.test(value) ? "html" : "rich",
  );

  const tab = (id: Mode, label: string) => (
    <Button
      small
      variant={mode === id ? "primary" : "default"}
      onClick={() => setMode(id)}
    >
      {label}
    </Button>
  );

  return (
    <div>
      <div className="admin-actions" style={{ marginBottom: 6 }}>
        {tab("rich", "Rich text")}
        {tab("html", "HTML")}
        {tab("preview", "Preview")}
      </div>

      {mode === "rich" && (
        <>
          <RichTextEditor defaultValue={value} onChange={onChange} />
          {NEEDS_HTML.test(value) && (
            <p className="admin-help">
              This content uses advanced markup (a table, quote box or special
              link style). Switch to the HTML tab to edit it without losing that
              formatting.
            </p>
          )}
        </>
      )}

      {mode === "html" && (
        <textarea
          className="admin-textarea"
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {mode === "preview" && (
        <div
          className="vector-body"
          style={{
            border: "1px solid var(--rule-soft)",
            padding: "12px 16px",
            background: "var(--content-bg)",
          }}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(value) }}
        />
      )}
    </div>
  );
}

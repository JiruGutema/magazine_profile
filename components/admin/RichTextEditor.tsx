"use client";

import { useEffect, useRef } from "react";
import type QuillType from "quill";
import "quill/dist/quill.snow.css";

interface RichTextEditorProps {
  /** Initial HTML. The editor is uncontrolled after mount. */
  defaultValue: string;
  onChange: (html: string) => void;
}

const TOOLBAR = [
  [{ header: [2, 3, false] }],
  ["bold", "italic", "underline"],
  ["link", "blockquote"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["clean"],
];

export function RichTextEditor({ defaultValue, onChange }: RichTextEditorProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let quill: QuillType | null = null;

    // Quill is loaded lazily so its `document` access never runs during SSR.
    const editorEl = document.createElement("div");
    host.appendChild(editorEl);

    (async () => {
      const Quill = (await import("quill")).default;
      if (cancelled) return;

      quill = new Quill(editorEl, {
        theme: "snow",
        modules: { toolbar: TOOLBAR },
        placeholder: "Write here…",
      });

      // Seed the initial content, then subscribe — so loading the value does
      // not itself fire onChange and mark the form dirty.
      if (defaultValue) {
        quill.clipboard.dangerouslyPasteHTML(defaultValue);
      }
      quill.on("text-change", () => {
        if (!quill) return;
        const html = quill.root.innerHTML;
        onChangeRef.current(html === "<p><br></p>" ? "" : html);
      });
    })();

    return () => {
      cancelled = true;
      quill = null;
      host.innerHTML = ""; // removes both the toolbar and the editor
    };
    // Mount-once: the editor is uncontrolled; remount (via parent) to reload.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="admin-rte">
      <div ref={hostRef} />
    </div>
  );
}

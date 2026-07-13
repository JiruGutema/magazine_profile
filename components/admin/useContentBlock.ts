"use client";

import { useEffect, useState } from "react";
import type { SaveState } from "./ui";

/**
 * Loads a SiteContent block from the admin API and exposes local editable
 * state plus a save() that PUTs it back. Used by every "chrome" panel.
 */
export function useContentBlock<T>(key: string) {
  const [data, setData] = useState<T | null>(null);
  const [state, setState] = useState<SaveState>({ kind: "idle" });

  useEffect(() => {
    let active = true;
    fetch(`/api/admin/content/${key}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("load"))))
      .then((d) => {
        if (active) setData(d as T);
      })
      .catch(() =>
        setState({ kind: "err", message: "Failed to load content" }),
      );
    return () => {
      active = false;
    };
  }, [key]);

  const save = async (payload: T) => {
    setState({ kind: "saving" });
    try {
      const res = await fetch(`/api/admin/content/${key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        setState({ kind: "err", message: e.error || "Failed to save" });
        return;
      }
      setState({ kind: "ok", message: "Saved" });
    } catch {
      setState({ kind: "err", message: "Failed to save" });
    }
  };

  return { data, setData, state, save };
}

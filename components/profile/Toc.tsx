"use client";

import { useState } from "react";

export interface TocItem {
  id: string;
  label: string;
  children?: TocItem[];
}

export function Toc({ items }: { items: TocItem[] }) {
  const [hidden, setHidden] = useState(false);
  return (
    <div className="toc" id="toc">
      <div className="toc-title">
        Contents
        <span className="toc-toggle">
          [
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setHidden((h) => !h);
            }}
          >
            {hidden ? "show" : "hide"}
          </a>
          ]
        </span>
      </div>
      {!hidden && (
        <ol>
          {items.map((it) => (
            <li key={it.id}>
              <a href={`#${it.id}`}>{it.label}</a>
              {it.children && it.children.length > 0 && (
                <ol>
                  {it.children.map((c) => (
                    <li key={c.id}>
                      <a href={`#${c.id}`}>{c.label}</a>
                    </li>
                  ))}
                </ol>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

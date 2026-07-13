"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { HeaderContent } from "@/lib/content-types";

const TABS = [
  { href: "/", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blogs", label: "Writings" },
];

export function VectorHeader({ data }: { data: HeaderContent }) {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("jg-theme");
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = saved === "dark" || (saved == null && prefers);
    if (dark) document.documentElement.classList.add("dark");
    setIsDark(dark);
  }, []);

  const toggle = () => {
    const dark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("jg-theme", dark ? "dark" : "light");
    setIsDark(dark);
  };

  return (
    <div className="vector-header" id="top">
      <div className="vh-row">
        <div className="vh-tabs">
          <div className="vh-personal">
            <a href={`mailto:${data.email}`}>{data.email}</a>
            <a href="#">{data.location}</a>
            <a href="#">{data.timezone}</a>
            {data.availability && (
              <span style={{ padding: "0 8px", color: "#6a8f3d" }}>
                ● {data.availability}
              </span>
            )}
            <button
              className="theme-toggle"
              onClick={toggle}
              title="Toggle dark mode"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
                </svg>
              )}
            </button>
          </div>
          <div className="vh-tabrow">
            {TABS.map((t, i) => {
              const active = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className={`vh-tab${active ? " active" : ""}`}
                  style={i === 1 ? { marginLeft: "auto" } : undefined}
                >
                  {t.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

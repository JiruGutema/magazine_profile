"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BiographyPanel } from "./panels/BiographyPanel";
import { ProjectsPanel } from "./panels/ProjectsPanel";
import { BlogsPanel } from "./panels/BlogsPanel";
import { InfoboxPanel } from "./panels/InfoboxPanel";
import { HeaderPanel, FooterPanel, TagsPanel } from "./panels/ChromePanels";
import { Button } from "./ui";

interface User {
  id: number;
  email: string;
  name: string | null;
}

const TABS = [
  { id: "biography", label: "Biography", render: () => <BiographyPanel /> },
  { id: "projects", label: "Projects", render: () => <ProjectsPanel /> },
  { id: "blog", label: "Blog", render: () => <BlogsPanel /> },
  { id: "infobox", label: "Infobox", render: () => <InfoboxPanel /> },
  { id: "header", label: "Header", render: () => <HeaderPanel /> },
  { id: "footer", label: "Footer", render: () => <FooterPanel /> },
  { id: "tags", label: "Tags", render: () => <TagsPanel /> },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminConsole({ user }: { user: User }) {
  const [active, setActive] = useState<TabId>("biography");
  const router = useRouter();

  // Honour the site's saved dark-mode choice so the console matches the site.
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (saved === "dark" || (saved == null && prefers)) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const activeTab = TABS.find((t) => t.id === active) ?? TABS[0];

  return (
    <div className="admin-page">
      <div className="admin-topbar">
        <div className="admin-topbar-row">
          <div className="admin-brand">
            <a rel="stylesheet" href="/">
              Jiru Gutema
            </a>
            <small>Content administration</small>
          </div>
          <div className="admin-inline">
            <span className="admin-whoami">
              Signed in as {user.name || user.email}
            </span>
            <Button onClick={logout}>Log out</Button>
          </div>
        </div>
      </div>

      <nav className="admin-tabs" aria-label="Content sections">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`admin-tab${tab.id === active ? " active" : ""}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="admin-main">
        <h1 className="admin-h1">{activeTab.label}</h1>
        <p className="admin-lead">
          Edit this part of the site. Changes go live immediately.
        </p>
        {activeTab.render()}
      </main>
    </div>
  );
}

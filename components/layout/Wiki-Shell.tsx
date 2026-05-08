"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import { VectorHeader } from "./Vector-Header";
import { VectorSidebar } from "./Vector-Sidebar";
import { VectorFooter } from "./Vector-Footer";

export function WikiShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return <>{children}</>;

  return (
    <>
      <VectorHeader />
      <div className="vector-shell">
        <VectorSidebar />
        <div className="vector-body" id="content">
          {children}
        </div>
      </div>
      <VectorFooter />
    </>
  );
}

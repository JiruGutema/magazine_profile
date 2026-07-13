"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import { VectorHeader } from "./Vector-Header";
import { VectorFooter } from "./Vector-Footer";
import type { FooterContent, HeaderContent } from "@/lib/content-types";

interface WikiShellProps {
  children: React.ReactNode;
  header: HeaderContent;
  footer: FooterContent;
}

export function WikiShell({ children, header, footer }: WikiShellProps) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return <>{children}</>;

  return (
    <>
      <VectorHeader data={header} />
      <div className="vector-shell">
        <div className="vector-body" id="content">
          {children}
        </div>
      </div>
      <VectorFooter data={footer} />
    </>
  );
}

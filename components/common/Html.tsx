import type { ElementType } from "react";
import { sanitizeHtml } from "@/lib/sanitize";

interface HtmlProps {
  html: string;
  /** Element to render. Defaults to a block-level <div>. */
  as?: ElementType;
  className?: string;
}

/**
 * Renders trusted, admin-authored HTML. All HTML stored in the database flows
 * through here so sanitization happens at exactly one choke point.
 */
export function Html({ html, as: Tag = "div", className }: HtmlProps) {
  return (
    <Tag
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  );
}

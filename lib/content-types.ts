/**
 * Shared shapes for the DB-driven site content.
 *
 * The "chrome" blocks (header, hero, infobox, footer, tags) are stored
 * as JSON in the `SiteContent` table keyed by `SiteContentKey`. The biography
 * body lives in `ArticleSection` rows and projects in `Project` rows.
 *
 * Values ending in `Html` / `value` may contain a small amount of trusted,
 * admin-authored HTML. They are always passed through `sanitizeHtml` before
 * rendering — see lib/sanitize.ts.
 */

export type SiteContentKey =
  | "header"
  | "hero"
  | "infobox"
  | "footer"
  | "tags";

export interface HeaderContent {
  email: string;
  location: string;
  timezone: string;
  availability: string;
}

export interface HeroContent {
  name: string;
  tagline: string;
  goodArticle: boolean;
  /** Lead paragraphs as sanitized HTML (may contain multiple <p> blocks). */
  leadHtml: string;
}

export interface InfoboxRow {
  label: string;
  /** Cell value; sanitized HTML allowed (links, <br />, <i>). */
  value: string;
}

export interface InfoboxSection {
  heading: string;
  /** When true, value cells get the `ib-website` (break-all) treatment. */
  website?: boolean;
  rows: InfoboxRow[];
}

export interface InfoboxContent {
  title: string;
  image: string;
  imageCaption: string;
  sections: InfoboxSection[];
}

export interface FooterLink {
  label: string;
  href: string;
  external: boolean;
}

export interface FooterContent {
  /** Shown under the auto-generated "last revised" line; sanitized HTML. */
  tagline: string;
  links: FooterLink[];
}

export interface TagsContent {
  items: string[];
}

export interface SectionInput {
  key: string;
  title: string;
  level: number;
  body: string;
  order: number;
  inToc: boolean;
  published: boolean;
  special: string;
}

export interface ProjectInput {
  title: string;
  description: string;
  note: string;
  technologies: string;
  details: string;
  liveDemoLink: string;
  githubLink: string;
  featured: boolean;
  order: number;
}

/** Maps a content key to its payload shape. */
export interface SiteContentMap {
  header: HeaderContent;
  hero: HeroContent;
  infobox: InfoboxContent;
  footer: FooterContent;
  tags: TagsContent;
}

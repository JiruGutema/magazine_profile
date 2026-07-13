/**
 * Conservative allowlist HTML sanitizer.
 *
 * Content is authored only by the authenticated site owner, so this is
 * defense-in-depth rather than a boundary against untrusted input: it strips
 * scripts, inline event handlers and dangerous URL schemes from the small
 * amount of rich HTML stored for article sections, the infobox, the lead, etc.
 *
 * It is intentionally allowlist-based — anything not explicitly permitted is
 * dropped (unknown tags are removed but their text content is kept).
 */

const ALLOWED_TAGS = new Set([
  "a", "b", "strong", "i", "em", "u", "s", "br", "p", "span", "div",
  "ul", "ol", "li", "blockquote", "code", "pre", "sup", "sub", "small",
  "h2", "h3", "h4", "h5", "hr", "abbr", "cite", "mark",
  "table", "thead", "tbody", "tr", "th", "td", "caption", "img",
]);

const ALLOWED_ATTR = new Set([
  "href", "src", "alt", "title", "class", "id",
  "colspan", "rowspan", "target", "rel",
]);

const URL_ATTR = new Set(["href", "src"]);
const VOID_TAGS = new Set(["br", "hr", "img"]);

function isSafeUrl(url: string): boolean {
  const v = url.trim();
  if (v === "") return false;
  if (/^(#|\/|\.{1,2}\/)/.test(v)) return true; // anchors + relative paths
  if (/^(https?:|mailto:|tel:)/i.test(v)) return true;
  return false; // reject javascript:, data:, vbscript:, etc.
}

function sanitizeAttrs(raw: string): string {
  const out: string[] = [];
  const re =
    /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) {
    const name = m[1].toLowerCase();
    if (name.startsWith("on")) continue; // event handlers
    if (!ALLOWED_ATTR.has(name)) continue;
    let value = m[3] ?? m[4] ?? m[5] ?? "";
    if (URL_ATTR.has(name) && !isSafeUrl(value)) continue;
    value = value.replace(/"/g, "&quot;");
    out.push(`${name}="${value}"`);
  }
  return out.length ? " " + out.join(" ") : "";
}

export function sanitizeHtml(input: string | null | undefined): string {
  if (!input) return "";

  let html = input;
  // Drop dangerous elements together with their contents.
  html = html.replace(
    /<(script|style|iframe|object|embed|noscript|template|form|input|button)\b[\s\S]*?<\/\1\s*>/gi,
    "",
  );
  // Drop comments (can hide conditional-comment tricks).
  html = html.replace(/<!--[\s\S]*?-->/g, "");

  return html.replace(
    /<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g,
    (_match, close: string, rawName: string, rawAttrs: string) => {
      const name = rawName.toLowerCase();
      if (!ALLOWED_TAGS.has(name)) return ""; // strip tag, keep inner text
      if (close) return `</${name}>`;
      const attrs = sanitizeAttrs(rawAttrs);
      const selfClose = VOID_TAGS.has(name) ? " /" : "";
      return `<${name}${attrs}${selfClose}>`;
    },
  );
}

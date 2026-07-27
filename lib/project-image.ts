import { isSafeUrl } from "@/lib/sanitize";

/**
 * Validation for the optional project screenshot URL.
 *
 * Two entry points on purpose: writes reject a bad value so the admin sees an
 * error, reads drop it silently so a legacy or hand-edited row can never put a
 * `javascript:`/`data:` URL into an <img src>.
 */

export const IMAGE_URL_ERROR =
  "Image URL must be an http(s) URL or a path starting with /";

/** http(s) URLs and same-origin paths only — no mailto/tel/anchor targets. */
function isImageUrl(url: string): boolean {
  return isSafeUrl(url) && !/^(mailto:|tel:|#)/i.test(url);
}

/** Read path: returns the URL, or "" when absent or unusable. */
export function sanitizeImageUrl(value: string | null | undefined): string {
  const url = (value ?? "").trim();
  return isImageUrl(url) ? url : "";
}

/** Write path: returns the trimmed URL, or null when the value is invalid. */
export function parseImageUrl(value: unknown): string | null {
  if (value === undefined || value === null) return "";
  if (typeof value !== "string") return null;
  const url = value.trim();
  if (url === "") return "";
  return isImageUrl(url) ? url : null;
}

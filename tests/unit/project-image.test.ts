import { describe, expect, test } from "vitest";
import {
  IMAGE_URL_ERROR,
  parseImageUrl,
  sanitizeImageUrl,
} from "@/lib/project-image";

describe("sanitizeImageUrl (read path — drop silently)", () => {
  test.each([
    ["https://cdn.example.com/shot.png"],
    ["http://cdn.example.com/shot.png"],
    ["/images/shot.png"],
    ["./shot.png"],
  ])("keeps the usable URL %s", (url) => {
    expect(sanitizeImageUrl(url)).toBe(url);
  });

  test("trims surrounding whitespace", () => {
    expect(sanitizeImageUrl("  /images/shot.png  ")).toBe("/images/shot.png");
  });

  test.each([
    ["javascript:alert(1)", "script URLs"],
    ["data:image/svg+xml,<svg onload=alert(1)>", "data URLs"],
    ["vbscript:msgbox(1)", "vbscript"],
    ["mailto:someone@example.com", "mailto, which is not an image"],
    ["tel:+251900000000", "tel, which is not an image"],
    ["#anchor", "fragments, which are not images"],
    ["cdn.example.com/shot.png", "scheme-less hostnames"],
    ["", "the empty string"],
  ])("returns empty for %s (%s)", (url) => {
    expect(sanitizeImageUrl(url)).toBe("");
  });

  test.each([[null], [undefined]])("returns empty for %s", (value) => {
    expect(sanitizeImageUrl(value)).toBe("");
  });
});

describe("parseImageUrl (write path — reject loudly)", () => {
  test("returns the trimmed URL when valid", () => {
    expect(parseImageUrl("  https://cdn.example.com/a.png ")).toBe(
      "https://cdn.example.com/a.png",
    );
  });

  test.each([[undefined], [null], [""], ["   "]])(
    "treats %s as 'no image' rather than an error",
    (value) => {
      expect(parseImageUrl(value)).toBe("");
    },
  );

  test.each([
    ["javascript:alert(1)"],
    ["data:text/html,<script>alert(1)</script>"],
    ["mailto:someone@example.com"],
    ["#anchor"],
    ["not a url"],
  ])("returns null (an error) for %s", (value) => {
    expect(parseImageUrl(value)).toBeNull();
  });

  test.each([[42], [true], [{}], [[]]])(
    "returns null for the non-string value %s",
    (value) => {
      expect(parseImageUrl(value)).toBeNull();
    },
  );

  test("exposes an error message for the admin UI", () => {
    expect(IMAGE_URL_ERROR).toMatch(/http\(s\)/);
  });
});

describe("the two entry points agree on what is valid", () => {
  const cases = [
    "https://cdn.example.com/a.png",
    "/images/a.png",
    "javascript:alert(1)",
    "mailto:x@y.z",
  ];

  test.each(cases)("%s is either kept by both or refused by both", (url) => {
    const read = sanitizeImageUrl(url);
    const write = parseImageUrl(url);
    if (read === "") {
      expect(write).toBeNull();
    } else {
      expect(write).toBe(read);
    }
  });
});

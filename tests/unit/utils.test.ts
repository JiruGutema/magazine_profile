import { describe, expect, test } from "vitest";
import { cn, generateSlug } from "@/lib/utils";

describe("generateSlug", () => {
  test.each([
    ["Hello World", "hello-world"],
    ["Already-Slugged", "already-slugged"],
    ["UPPERCASE TITLE", "uppercase-title"],
    ["Trailing spaces   ", "trailing-spaces"],
    ["   Leading spaces", "leading-spaces"],
    ["Multiple   inner   spaces", "multiple-inner-spaces"],
    ["Hyphen -- collapse", "hyphen-collapse"],
    ["C++ & Rust", "c-rust"],
    ["Web applications", "web-applications"],
    ["Version 2.0 release", "version-2-0-release"],
    ["snake_case_title", "snake-case-title"],
  ])("turns %s into %s", (input, expected) => {
    expect(generateSlug(input)).toBe(expected);
  });

  test.each([
    ["", ""],
    ["!!!", ""],
    ["   ", ""],
  ])("returns an empty slug for %s so callers can fall back", (input, expected) => {
    expect(generateSlug(input)).toBe(expected);
  });

  test("drops non-ASCII characters", () => {
    expect(generateSlug("Über café")).toBe("ber-caf");
  });

  test("never produces leading or trailing hyphens", () => {
    for (const title of ["!leading", "trailing!", "!both!", "-dashes-"]) {
      const slug = generateSlug(title);
      expect(slug.startsWith("-")).toBe(false);
      expect(slug.endsWith("-")).toBe(false);
    }
  });

  test("is idempotent", () => {
    const once = generateSlug("Some Mixed Title!");
    expect(generateSlug(once)).toBe(once);
  });
});

describe("cn", () => {
  test("joins class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  test("drops falsy values", () => {
    expect(cn("a", false && "b", undefined, null, "c")).toBe("a c");
  });

  test("lets a later Tailwind utility win over an earlier conflicting one", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  test("keeps non-conflicting utilities together", () => {
    expect(cn("p-2", "m-4")).toBe("p-2 m-4");
  });

  test("accepts arrays and conditional objects", () => {
    expect(cn(["a", "b"], { c: true, d: false })).toBe("a b c");
  });
});

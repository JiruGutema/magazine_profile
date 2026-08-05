import { describe, expect, test } from "vitest";
import type { ProjectView } from "@/lib/content";
import {
  buildWorkEntries,
  describeGroupCounts,
  groupWorkEntries,
  joinProse,
  numberWord,
  topTechnologies,
} from "@/lib/works";

function project(overrides: Partial<ProjectView> = {}): ProjectView {
  return {
    id: 1,
    title: "Untitled",
    description: "",
    note: "",
    technologies: [],
    details: [],
    liveDemoLink: "",
    githubLink: "",
    imageUrl: "",
    imageCaption: "",
    featured: false,
    order: 0,
    ...overrides,
  };
}

describe("buildWorkEntries — type classification", () => {
  test("classifies a browser extension from the title", () => {
    const [entry] = buildWorkEntries([
      project({ title: "Tab Manager Extension" }),
    ]);
    expect(entry.typeLabel).toBe("Browser extension");
  });

  test.each([["add-on"], ["addon"], ["webextension"]])(
    "recognises %s as a browser extension",
    (word) => {
      const [entry] = buildWorkEntries([
        project({ title: "Thing", description: `A ${word} for Firefox` }),
      ]);
      expect(entry.typeLabel).toBe("Browser extension");
    },
  );

  test.each([["Flutter"], ["Dart"], ["Android"], ["Kotlin"], ["Jetpack"]])(
    "classifies %s in the tech list as a mobile application",
    (tech) => {
      const [entry] = buildWorkEntries([
        project({ title: "Thing", technologies: [tech] }),
      ]);
      expect(entry.typeLabel).toBe("Mobile application");
    },
  );

  test.each([["CLI"], ["command-line"], ["npm package"], ["developer tool"]])(
    "classifies %s as a developer tool",
    (word) => {
      const [entry] = buildWorkEntries([
        project({ title: "Thing", description: `A ${word} for builds` }),
      ]);
      expect(entry.typeLabel).toBe("Developer tool");
    },
  );

  test("falls back to web application when nothing matches", () => {
    const [entry] = buildWorkEntries([
      project({ title: "Portfolio", technologies: ["Next.js", "Postgres"] }),
    ]);
    expect(entry.typeLabel).toBe("Web application");
  });

  test("matches on word boundaries, not substrings", () => {
    // "clique" contains "cli" but must not register as a developer tool.
    const [entry] = buildWorkEntries([project({ title: "Clique" })]);
    expect(entry.typeLabel).toBe("Web application");
  });

  test("checks extensions before mobile when both could match", () => {
    const [entry] = buildWorkEntries([
      project({ title: "Android Extension", technologies: ["Kotlin"] }),
    ]);
    expect(entry.typeLabel).toBe("Browser extension");
  });
});

describe("buildWorkEntries — anchors", () => {
  test("derives the anchor from the title", () => {
    const [entry] = buildWorkEntries([project({ title: "My Cool Project" })]);
    expect(entry.anchor).toBe("my-cool-project");
  });

  test("disambiguates duplicate titles with the project id", () => {
    const entries = buildWorkEntries([
      project({ id: 1, title: "Same Name" }),
      project({ id: 2, title: "Same Name" }),
      project({ id: 3, title: "Same Name" }),
    ]);
    expect(entries.map((e) => e.anchor)).toEqual([
      "same-name",
      "same-name-2",
      "same-name-3",
    ]);
  });

  test("produces unique anchors across a mixed list", () => {
    const entries = buildWorkEntries([
      project({ id: 1, title: "Alpha" }),
      project({ id: 2, title: "Alpha" }),
      project({ id: 3, title: "Beta" }),
    ]);
    expect(new Set(entries.map((e) => e.anchor)).size).toBe(3);
  });

  test("falls back to a id-based anchor when the title yields no slug", () => {
    const [entry] = buildWorkEntries([project({ id: 7, title: "!!!" })]);
    expect(entry.anchor).toBe("work-7");
  });

  test("keeps the original project on the entry", () => {
    const input = project({ id: 9, title: "Kept" });
    const [entry] = buildWorkEntries([input]);
    expect(entry.project).toBe(input);
  });

  test("returns an empty list for no projects", () => {
    expect(buildWorkEntries([])).toEqual([]);
  });
});

describe("groupWorkEntries", () => {
  const entries = buildWorkEntries([
    project({ id: 1, title: "Portfolio Site" }),
    project({ id: 2, title: "Blog Engine" }),
    project({ id: 3, title: "Tab Extension" }),
    project({ id: 4, title: "Notes App", technologies: ["Flutter"] }),
  ]);

  test("puts web applications first", () => {
    const groups = groupWorkEntries(entries);
    expect(groups[0].heading).toBe("Web applications");
  });

  test("groups entries under their type", () => {
    const groups = groupWorkEntries(entries);
    const byHeading = Object.fromEntries(
      groups.map((g) => [g.heading, g.entries.length]),
    );
    expect(byHeading).toEqual({
      "Web applications": 2,
      "Browser extensions": 1,
      "Mobile applications": 1,
    });
  });

  test("omits groups with no entries", () => {
    const groups = groupWorkEntries(entries);
    expect(groups.map((g) => g.heading)).not.toContain("Developer tools");
    expect(groups.every((g) => g.entries.length > 0)).toBe(true);
  });

  test("gives each group a slugified id for anchoring", () => {
    const groups = groupWorkEntries(entries);
    expect(groups.map((g) => g.id)).toContain("web-applications");
  });

  test("returns nothing for an empty entry list", () => {
    expect(groupWorkEntries([])).toEqual([]);
  });
});

describe("numberWord", () => {
  test.each([
    [0, "zero"],
    [1, "one"],
    [3, "three"],
    [12, "twelve"],
  ])("spells %i as %s", (n, expected) => {
    expect(numberWord(n)).toBe(expected);
  });

  test("falls back to digits past twelve", () => {
    expect(numberWord(13)).toBe("13");
    expect(numberWord(100)).toBe("100");
  });
});

describe("joinProse", () => {
  test.each([
    [[], ""],
    [["one"], "one"],
    [["one", "two"], "one and two"],
    [["one", "two", "three"], "one, two and three"],
    [["a", "b", "c", "d"], "a, b, c and d"],
  ])("joins %j as %s", (parts, expected) => {
    expect(joinProse(parts)).toBe(expected);
  });
});

describe("describeGroupCounts", () => {
  test("uses the singular label for a group of one", () => {
    const entries = buildWorkEntries([project({ id: 1, title: "Solo Site" })]);
    expect(describeGroupCounts(groupWorkEntries(entries))).toBe(
      "one web application",
    );
  });

  test("uses the plural heading for a group of many", () => {
    const entries = buildWorkEntries([
      project({ id: 1, title: "Site A" }),
      project({ id: 2, title: "Site B" }),
    ]);
    expect(describeGroupCounts(groupWorkEntries(entries))).toBe(
      "two web applications",
    );
  });

  test("joins several groups into a sentence fragment", () => {
    const entries = buildWorkEntries([
      project({ id: 1, title: "Site A" }),
      project({ id: 2, title: "Site B" }),
      project({ id: 3, title: "Tab Extension" }),
      project({ id: 4, title: "Notes", technologies: ["Flutter"] }),
    ]);
    expect(describeGroupCounts(groupWorkEntries(entries))).toBe(
      "two web applications, one browser extension and one mobile application",
    );
  });

  test("returns an empty string when there is nothing to describe", () => {
    expect(describeGroupCounts([])).toBe("");
  });
});

describe("topTechnologies", () => {
  test("orders by frequency", () => {
    const projects = [
      project({ id: 1, technologies: ["TypeScript", "React"] }),
      project({ id: 2, technologies: ["TypeScript", "Postgres"] }),
      project({ id: 3, technologies: ["TypeScript", "React"] }),
    ];
    expect(topTechnologies(projects, 3)).toEqual([
      "TypeScript",
      "React",
      "Postgres",
    ]);
  });

  test("respects the limit", () => {
    const projects = [
      project({ id: 1, technologies: ["A", "B", "C", "D"] }),
    ];
    expect(topTechnologies(projects, 2)).toHaveLength(2);
  });

  test("counts case-insensitively but keeps the first-seen casing", () => {
    const projects = [
      project({ id: 1, technologies: ["TypeScript"] }),
      project({ id: 2, technologies: ["typescript"] }),
      project({ id: 3, technologies: ["React"] }),
    ];
    expect(topTechnologies(projects, 1)).toEqual(["TypeScript"]);
  });

  test("returns an empty list when there are no projects or no technologies", () => {
    expect(topTechnologies([], 5)).toEqual([]);
    expect(topTechnologies([project({ technologies: [] })], 5)).toEqual([]);
  });

  test("returns nothing when the limit is zero", () => {
    const projects = [project({ technologies: ["A"] })];
    expect(topTechnologies(projects, 0)).toEqual([]);
  });
});

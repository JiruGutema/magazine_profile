import type { ProjectView } from "@/lib/content";
import { generateSlug } from "@/lib/utils";

export interface WorkEntry {
  project: ProjectView;
  anchor: string;
  typeLabel: string;
}

export interface WorkGroup {
  id: string;
  heading: string;
  typeLabel: string;
  entries: WorkEntry[];
}

interface WorkTypeRule {
  typeLabel: string;
  heading: string;
  pattern: RegExp;
}

const WORK_TYPE_RULES: WorkTypeRule[] = [
  {
    typeLabel: "Browser extension",
    heading: "Browser extensions",
    pattern: /\bextensions?\b|\badd-?ons?\b|webextension/,
  },
  {
    typeLabel: "Mobile application",
    heading: "Mobile applications",
    pattern: /\bflutter\b|\bdart\b|\bandroid\b|\bkotlin\b|\bjetpack\b|mobile app/,
  },
  {
    typeLabel: "Developer tool",
    heading: "Developer tools",
    pattern: /\bcli\b|command-?line|npm package|developer tool/,
  },
];

const FALLBACK_TYPE: WorkTypeRule = {
  typeLabel: "Web application",
  heading: "Web applications",
  pattern: /(?:)/,
};

/** Section order on the list page; the fallback group leads. */
const DISPLAY_ORDER: WorkTypeRule[] = [FALLBACK_TYPE, ...WORK_TYPE_RULES];

function matchWorkType(project: ProjectView): WorkTypeRule {
  const haystack = [
    project.title,
    project.description,
    project.technologies.join(" "),
  ]
    .join(" ")
    .toLowerCase();
  return (
    WORK_TYPE_RULES.find((rule) => rule.pattern.test(haystack)) ??
    FALLBACK_TYPE
  );
}

export function buildWorkEntries(projects: ProjectView[]): WorkEntry[] {
  const taken = new Set<string>();
  return projects.map((project) => {
    const base = generateSlug(project.title) || `work-${project.id}`;
    const anchor = taken.has(base) ? `${base}-${project.id}` : base;
    taken.add(anchor);
    return { project, anchor, typeLabel: matchWorkType(project).typeLabel };
  });
}

export function groupWorkEntries(entries: WorkEntry[]): WorkGroup[] {
  return DISPLAY_ORDER.map((rule) => ({
    id: generateSlug(rule.heading),
    heading: rule.heading,
    typeLabel: rule.typeLabel,
    entries: entries.filter((entry) => entry.typeLabel === rule.typeLabel),
  })).filter((group) => group.entries.length > 0);
}

const NUMBER_WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
];

export const numberWord = (n: number): string =>
  NUMBER_WORDS[n] ?? String(n);

export function joinProse(parts: string[]): string {
  if (parts.length <= 1) return parts.join("");
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

/** e.g. "three web applications, two browser extensions and one mobile application" */
export function describeGroupCounts(groups: WorkGroup[]): string {
  const parts = groups.map((group) => {
    const count = group.entries.length;
    const label =
      count === 1
        ? group.typeLabel.toLowerCase()
        : group.heading.toLowerCase();
    return `${numberWord(count)} ${label}`;
  });
  return joinProse(parts);
}

/** Most frequently used technologies across all works, keeping first-seen casing. */
export function topTechnologies(
  projects: ProjectView[],
  limit: number,
): string[] {
  const counts = new Map<string, { label: string; count: number }>();
  for (const project of projects) {
    for (const tech of project.technologies) {
      const key = tech.toLowerCase();
      const existing = counts.get(key);
      counts.set(key, {
        label: existing?.label ?? tech,
        count: (existing?.count ?? 0) + 1,
      });
    }
  }
  return [...counts.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((entry) => entry.label);
}
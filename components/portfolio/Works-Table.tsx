"use client";

import { useMemo, useState } from "react";

export interface WorkRow {
  no: number;
  title: string;
  anchor: string;
  typeLabel: string;
  technologies: string[];
  description: string;
  liveDemoLink: string;
  githubLink: string;
}

interface WorksTableProps {
  works: WorkRow[];
  caption: string;
}

type SortKey = "no" | "title" | "typeLabel";
type SortDir = "asc" | "desc";

const compareRows = (a: WorkRow, b: WorkRow, key: SortKey): number =>
  key === "no" ? a.no - b.no : a[key].localeCompare(b[key]);

export function WorksTable({ works, caption }: WorksTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("no");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const rows = useMemo(() => {
    const sorted = [...works].sort((a, b) => compareRows(a, b, sortKey));
    return sortDir === "asc" ? sorted : sorted.reverse();
  }, [works, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const ariaSort = (key: SortKey) =>
    sortKey === key
      ? sortDir === "asc"
        ? "ascending"
        : "descending"
      : undefined;

  const sortIndicator = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? "▲" : "▼") : "↕";

  const renderSortHeader = (key: SortKey, label: string, width?: string) => (
    <th className="sortable" style={width ? { width } : undefined} aria-sort={ariaSort(key)}>
      <button type="button" className="sort-btn" onClick={() => handleSort(key)}>
        {label} <span className="sort-ind">{sortIndicator(key)}</span>
      </button>
    </th>
  );

  return (
    <div className="table-scroll">
      <table className="wikitable">
        <caption>{caption}</caption>
        <thead>
          <tr>
            {renderSortHeader("no", "No.", "6%")}
            {renderSortHeader("title", "Title", "17%")}
            {renderSortHeader("typeLabel", "Type", "14%")}
            <th style={{ width: "19%" }}>Technologies</th>
            <th>Description</th>
            <th style={{ width: "9%" }}>Links</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((work) => (
            <tr key={work.anchor}>
              <td>{work.no}</td>
              <td>
                <i>
                  <a href={`#${work.anchor}`}>{work.title}</a>
                </i>
              </td>
              <td>{work.typeLabel}</td>
              <td>{work.technologies.join(", ")}</td>
              <td>{work.description}</td>
              <td>
                {work.liveDemoLink && (
                  <>
                    <a className="external" href={work.liveDemoLink}>
                      Live
                    </a>
                    <br />
                  </>
                )}
                {work.githubLink && (
                  <a className="external" href={work.githubLink}>
                    Source
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
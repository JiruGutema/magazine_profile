"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import SelectedProjectCard, { SelectedProjectCardProps } from "./SelectedProjectCard";

const projects: SelectedProjectCardProps[]  = [
  {
    title: "Email Craft",
    description:
      "Email Craft is a full-stack application for composing, styling, and sending custom HTML emails directly from your Gmail account. " +
      "I haven't verified it with Google yet, so it is currently in testing mode and can only be used by a limited number of users. " +
      "If you want to try it out, please contact me. or watch the demo video.",
    links: [
      { href: "https://www.youtube.com/watch?v=Abs08REbc4o", label: "Demo Video" },
      { href: "https://email-craft-olive.vercel.app", label: "Try Email Craft" },
      { href: "https://Github.com/jirugutema/email-craft", label: "Github" },
    ],
  },
  {
    title: "Kai-Share",
    description:
      "KaiShare is a secure platform for sharing code snippets and text with others, focusing on privacy, simplicity, and collaborative sharing.",
    links: [
      { href: "https://Kai-Share.vercel.app", label: "Try Kai-Share" },
      { href: "https://Github.com/jirugutema/KaiShare", label: "Github" },
    ],
  },
  {
    title: "Tooran (Task Management Android)",
    description:
      "Tooran is a comprehensive task management application designed for systematic organization of daily tasks and responsibilities. " +
      "This application enables efficient categorization of tasks, facilitating streamlined management of both professional and personal workflows.",
    links: [
      { href: "https://tooran.vercel.app", label: "Install for Android" },
    ],
  },
  {
    title: "Hide Youtube Shorts (Firefox Extension)",
    description:
      "A Firefox extension to hide YouTube Shorts, allowing users to overcome endless looping of shorts scrolling. " +
      "This extension provides a seamless viewing experience by eliminating distractions and focusing on the main content.",
    links: [
      { href: "/projects#project-1", label: "Install for Firefox" },
    ],
    showUserCount: "hideyoutubeuser",
  },
  {
    title: "Swagger-Html",
    description:
      "I developed swagger-html, a npm package to export your Swagger/OpenAPI docs as a single offline HTML file for easy sharing and viewing no server required! " +
      "The package makes it simple to generate and share API documentation, enhancing collaboration among developers.",
    links: [
      { href: "https://www.npmjs.com/package/swagger-html", label: "Go to Documentation" },
    ],
  },
  {
    title: "Page Marker",
    description:
      "A simple Firefox extension that lets you draw, annotate, and highlight directly on any webpage.",
    links: [
      { href: "https://addons.mozilla.org/en-US/firefox/addon/draw-and-mark-a-webpage/", label: "Install for Firefox" },
    ],
    showUserCount: "pagemarkeruser",
  },
];

export default function SelectedProjects() {
  const [hideyoutubeuser, sethideyoutubeuser] = useState(0);
  const [pagemarkeruser, setPagemarkeruser] = useState(0);

  useEffect(() => {
    async function fetchHideYoutubeData() {
      const slug = "hide-youtube-short";
      const res = await fetch(
        `https://addons.mozilla.org/api/v5/addons/addon/${slug}/`,
      );
      if (!res.ok) throw new Error(`AMO API error ${res.status}`);
      const data = await res.json();
      sethideyoutubeuser(data.average_daily_users);
    }
    async function fetchPageMarkerData() {
      const slug = "draw-and-mark-a-webpage";
      const res = await fetch(
        `https://addons.mozilla.org/api/v5/addons/addon/${slug}/`,
      );
      if (!res.ok) throw new Error(`AMO API error ${res.status}`);
      const data = await res.json();
      setPagemarkeruser(data.average_daily_users);
    }
    fetchHideYoutubeData();
    fetchPageMarkerData();
  }, []);

  return (
    <section>
      <h2 className="text-3xl font-bold font-serif  border-border pb-2 mb-4">
        Top Picks Projects
      </h2>
      <p className="info">
        For more projects{" "}
        <Link
          href="/projects"
          className="text-blue-600 pb-2 font-bold hover:underline"
        >
          click here
        </Link>
        .
      </p>
      <br />
      <div className="grid gap-6">
        {projects.map((project, idx) => (
          <SelectedProjectCard
            key={project.title}
            {...project}
            userCount={
              project.showUserCount === "hideyoutubeuser"
                ? hideyoutubeuser
                : project.showUserCount === "pagemarkeruser"
                ? pagemarkeruser
                : undefined
            }
          />
        ))}
      </div>
      <Link
        href="/projects"
        className="bg-background border rounded-sm border-border p-2 hover:underline text-sm mt-2 inline-block"
      >
        View Other Selected Projects
      </Link>
    </section>
  );
}





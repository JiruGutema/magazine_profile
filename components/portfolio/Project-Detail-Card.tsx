"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { User } from "lucide-react";

interface ProjectDetailCardProps {
  id: number;
  title: string;
  note: string;
  description: string;
  technologies: string[];
  details: string[];
  liveDemoLink?: string;
  githubLink?: string;
}

export function ProjectDetailCard({
  id,
  title,
  description,
  note,
  technologies,
  details,
  liveDemoLink,
  githubLink,
}: ProjectDetailCardProps) {
  const [hideyoutubeuser, sethideyoutubeuser] = useState(0);
  const [pagemarkeruser, setPagemarkeruser] = useState(0);
  useEffect(() => {
    async function fetchHideYoutubeData() {
      const slug = "hide-youtube-short";
      const res = await fetch(
        `https://addons.mozilla.org/api/v5/addons/addon/${slug}/`
      );
      if (!res.ok) throw new Error(`AMO API error ${res.status}`);
      const data = await res.json();
      sethideyoutubeuser(data.average_daily_users);
    }
    async function fetchPageMarkerData() {
      const slug = "draw-and-mark-a-webpage";
      const res = await fetch(
        `https://addons.mozilla.org/api/v5/addons/addon/${slug}/`
      );
      if (!res.ok) throw new Error(`AMO API error ${res.status}`);
      const data = await res.json();
      setPagemarkeruser(data.average_daily_users);
    }

    fetchHideYoutubeData(), fetchPageMarkerData(), [];
  });
  return (
    <article
      className="border border-border rounded-sm p-6 space-y-4"
      id={`project-${id}`}
    >
      <h2 className="text-2xl font-semibold font-serif">{title}</h2>
        <p className="text-base text-muted-foreground">{description}</p>
        {note && <i className="text-sm italic mt-0 text-muted-foreground">{note}</i>}
        <div>
          <h3 className="text-lg font-normal">Technologies Used:</h3>
          <p className="text-base">{technologies.join(", ")}</p>
        </div>
        <div>
          <h3 className="text-lg font-normal">
            Key Features & Contributions:
          </h3>
          <ul className="list-disc list-inside text-base space-y-1">
            {details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        </div>
        {title.includes("Youtube Shorts Blocker") && (
          <span
            className=" flex flex-row ml-2 font-bold transition-colors duration-500 animate-pulse"
            style={{
              color:
                hideyoutubeuser > 10000
                  ? "#16a34a"
                  : hideyoutubeuser > 1000
                    ? "#eab308"
                    : "#ef4444",
              fontWeight: "bold",
              textShadow: "0 0 8px rgba(255,255,0,0.5)",
            }}
          >
            <User />
            <span>Average Daily Users: {hideyoutubeuser}</span>
          </span>
        )}

        {title.includes("Page Marker") && (
          <span
            className="flex font-bold ml-2 transition-colors duration-500 animate-pulse"
            style={{
              color:
                hideyoutubeuser > 10000
                  ? "#16a34a"
                  : hideyoutubeuser > 1000
                    ? "#eab308"
                    : "#ef4444",
              fontWeight: "bold",
              textShadow: "0 0 8px rgba(255,255,0,0.5)",
            }}
          >
            <User />
            Average Daily Users: {pagemarkeruser}
          </span>
        )}

        <div className="flex flex-wrap gap-4 pt-2">
          {liveDemoLink && (
            <Link href={liveDemoLink} target="_blank" rel="noopener noreferrer">
              <span className="inline-block rounded-sm border border-border bg-background px-3 py-2 text-sm hover:underline">
                {title.includes("Firefox") ? (
                  <span className="ml-2">Install for Firefox</span>
                ) : title.includes("Tooran") ? (
                  <span className="ml-2">Install for Android</span>
                ) : (
                  <span className="ml-2">Live Demo</span>
                )}
              </span>
            </Link>
          )}
          {githubLink && (
            <Link href={githubLink} target="_blank" rel="noopener noreferrer">
              <span className="inline-block rounded-sm border border-border bg-transparent px-3 py-2 text-sm hover:underline">
                View GitHub
              </span>
            </Link>
          )}
          {title.includes("Email Craft") && (
            <Link
              href="https://www.youtube.com/watch?v=Abs08REbc4o"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="inline-block rounded-sm border border-border bg-transparent px-3 py-2 text-sm hover:underline">
                <span className="ml-2">Demo Video</span>
              </span>
            </Link>
          )}
        </div>
    </article>
  );
}

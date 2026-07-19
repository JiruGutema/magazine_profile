
export interface ProjectData {
  title: string;
  description: string;
  links: { label: string; href: string }[];
  showUserCount?: boolean;
  userCountKey?: "hideyoutubeuser" | "pagemarkeruser";
}

export const selectedProjectsData: ProjectData[] = [
  {
    title: "Email Craft",
    description:
      "Email Craft is a full-stack application for composing, styling, and sending custom HTML emails directly from your Gmail account. I haven't verified it with Google yet, so it is currently in testing mode and can only be used by a limited number of users. If you want to try it out, please contact me. Or watch the demo video.",
    links: [
      { label: "Try Email Craft", href: "https://email-craft-olive.vercel.app" },
      { label: "Github", href: "https://Github.com/jirugutema/email-craft" },
      { label: "Demo Video", href: "https://www.youtube.com/watch?v=Abs08REbc4o" },
    ],
  },
  {
    title: "Kai-Share",
    description:
      "KaiShare is a secure platform for sharing code snippets and text with others, focusing on privacy, simplicity, and collaborative sharing.",
    links: [
      { label: "Try Kai-Share", href: "https://Kai-Share.vercel.app" },
      { label: "Github", href: "https://Github.com/jirugutema/KaiShare" },
    ],
  },
  {
    title: "Tooran (Task Management Android)",
    description:
      "Tooran is a comprehensive task management application designed for systematic organization of daily tasks and responsibilities. This application enables efficient categorization of tasks, facilitating streamlined management of both professional and personal workflows.",
    links: [
      { label: "Install for Android", href: "https://tooran.vercel.app" },
    ],
  },
  {
    title: "Hide Youtube Shorts (Firefox Extension)",
    description:
      "A Firefox extension to hide YouTube Shorts, allowing users to overcome endless looping of shorts scrolling. This extension provides a seamless viewing experience by eliminating distractions and focusing on the main content.",
    links: [
      { label: "Install for Firefox", href: "/projects#project-1" },
    ],
    showUserCount: true,
    userCountKey: "hideyoutubeuser",
  },
  {
    title: "Page Marker",
    description:
      "A simple Firefox extension that lets you draw, annotate, and highlight directly on any webpage.",
    links: [
      { label: "Install for Firefox", href: "https://addons.mozilla.org/en-US/firefox/addon/draw-and-mark-a-webpage/" },
    ],
    showUserCount: true,
    userCountKey: "pagemarkeruser",
  },
  {
    title: "Content Section Blocker (Browser Extension)",
    description:
      "A cross-browser extension that force-hides any element on any website by CSS selector. Includes a point-and-click element picker, plus per-site or global rules that persist locally.",
    links: [
      { label: "Install for Firefox", href: "https://addons.mozilla.org/en-US/firefox/addon/element-selector-blocker" },
      { label: "Github", href: "https://github.com/JiruGutema/element-blocker-browser-extension" },
    ],
  },
];

import type {
  FooterContent,
  HeaderContent,
  HeroContent,
  InfoboxContent,
  ProjectInput,
  SectionInput,
  TagsContent,
} from "@/lib/content-types";

/**
 * Default site content. This mirrors the original hardcoded portfolio exactly,
 * so the public pages render identically before the database is seeded and the
 * seed script has a single source of truth to insert from.
 */

export const DEFAULT_HEADER: HeaderContent = {
  email: "jirudagutema@gmail.com",
  location: "Addis Ababa, ET",
  timezone: "UTC+3",
  availability: "Available for work",
};

export const DEFAULT_HERO: HeroContent = {
  name: "Jiru Gutema",
  tagline: "Software engineer · Fullstack developer · Addis Ababa",
  goodArticle: true,
  leadHtml: `<p>I am <b>Jiru Gutema</b>, an Ethiopian <a href="https://en.wikipedia.org/wiki/Software_engineer">software engineer</a> and <a href="https://en.wikipedia.org/wiki/Solution_stack">full-stack developer</a> based in <a href="https://en.wikipedia.org/wiki/Addis_Ababa">Addis Ababa</a>, and an undergraduate at <a href="https://aau.edu.et/">Addis Ababa University</a>. Since June 2026 I have worked at <a href="https://www.merebtechnology.com/">Mereb Technologies</a> building asynchronous <a href="https://fastapi.tiangolo.com/">FastAPI</a> microservices on <a href="https://azure.microsoft.com/">Microsoft Azure</a>, over a dual-database architecture that pairs <a href="https://www.microsoft.com/sql-server">MS SQL Server</a> for transactional workloads with <a href="https://www.starrocks.io/">StarRocks</a> for real-time analytics. In parallel I develop the university's <a href="https://angular.dev/">Angular</a> and <a href="https://dotnet.microsoft.com/">.NET Core</a> regional property management system, a cloud-ready, multi-tenant platform.</p>
<p>My work sits at the seam between front-end and back-end systems, with a bias toward the backend and toward <a href="https://en.wikipedia.org/wiki/Microservices">distributed architecture</a>. I have shipped production services in <a href="https://nodejs.org/">Node.js</a>, <a href="https://go.dev/">Go</a>, .NET and FastAPI, backed by <a href="https://www.postgresql.org/">PostgreSQL</a>, <a href="https://redis.io/">Redis</a> and <a href="https://www.rabbitmq.com/">RabbitMQ</a>, secured with <a href="https://www.keycloak.org/">Keycloak</a> and instrumented with <a href="https://prometheus.io/">Prometheus</a>, <a href="https://grafana.com/">Grafana</a> and <a href="https://www.jaegertracing.io/">Jaeger</a>. I prefer code that the next person to read it can <i>reason</i> about without a meeting.</p>
<p>Independently I have published browser extensions, web services and developer tools across more than a hundred public repositories on <a class="external" href="https://github.com/JiruGutema">GitHub</a>. These include <i>Hide YouTube Shorts</i>, <i>Page Marker</i> and <i>Content Section Blocker</i> for <a href="https://www.mozilla.org/firefox/">Mozilla Firefox</a> and Chrome; the Gmail-integrated email composer <a href="https://email-craft-olive.vercel.app/"><i>Email Craft</i></a>; the secure text- and code-sharing service <i>KaiShare</i>; the category-based task manager <i>Tooran</i>; and a set of Go service modules, among them a reusable <a class="external" href="https://github.com/JiruGutema/go_rbac_service">role-based access control service</a>.</p>
<p>Outside of my employment, I mentor students in React, Next.js, backend development and data structures at <a href="https://nexustutorial.vercel.app/">Nexus Tutorial</a>, and I have served as a core team member of the AWS Cloud Club at Addis Ababa University. I have contributed Afaan Oromoo localisation to <a href="https://www.db4free.net/">db4free.net</a> and submitted patches to the <i>react-next-folder</i> npm package.</p>`,
};

export const DEFAULT_INFOBOX: InfoboxContent = {
  title: "Jiru Gutema",
  image: "/images/profile.png",
  imageCaption: "Jiru in Addis Ababa, 2026",
  sections: [
    {
      heading: "Personal details",
      rows: [
        { label: "Born", value: "Jiru Gutema<br />Addis Ababa, Ethiopia" },
        { label: "Residence", value: "Addis Ababa, Ethiopia" },
        { label: "Nationality", value: "Ethiopian" },
        {
          label: "Education",
          value:
            "Addis Ababa University (BSc Software Engineering, 2022–2027)",
        },
        {
          label: "Occupation",
          value: "Software engineer · Fullstack developer",
        },
        {
          label: "Employer(s)",
          value: "Addis Ababa University<br />Mereb Technologies",
        },
        {
          label: "Known for",
          value:
            "<i>Hide YouTube Shorts</i>, <i>Page Marker</i>, <i>Content Section Blocker</i>, <i>Email Craft</i>, <i>KaiShare</i>, <i>Tooran</i>, contributions to Bahmni / OpenMRS",
        },
        {
          label: "Languages",
          value: "Afaan Oromoo (native), Amharic, English",
        },
      ],
    },
    {
      heading: "Online presence",
      website: true,
      rows: [
        {
          label: "GitHub",
          value:
            '<a class="external" href="https://github.com/JiruGutema">github.com/JiruGutema</a>',
        },
        {
          label: "LinkedIn",
          value:
            '<a class="external" href="https://www.linkedin.com/in/jiru-gutema">linkedin.com/in/jiru-gutema</a>',
        },
        {
          label: "X / Twitter",
          value:
            '<a class="external" href="https://www.x.com/jirugutema">x.com/jirugutema</a>',
        },
        {
          label: "LeetCode",
          value:
            '<a class="external" href="https://www.leetcode.com/jiru_gutema">leetcode.com/jiru_gutema</a>',
        },
        {
          label: "Email",
          value:
            '<a href="mailto:jirudagutema@gmail.com">jirudagutema@gmail.com</a>',
        },
      ],
    },
  ],
};

export const DEFAULT_FOOTER: FooterContent = {
  tagline:
    "Written and maintained in Addis Ababa, Ethiopia · Open to fullstack roles, contract work and interesting collaborations.",
  links: [
    { label: "Back to top ↑", href: "#top", external: false },
    { label: "Email", href: "mailto:jirudagutema@gmail.com", external: false },
    { label: "GitHub", href: "https://github.com/JiruGutema", external: true },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/jiru-gutema",
      external: true,
    },
    { label: "X / Twitter", href: "https://www.x.com/jirugutema", external: true },
    { label: "Download résumé", href: "/resume.pdf", external: false },
  ],
};

export const DEFAULT_TAGS: TagsContent = {
  items: [
    "Software engineer",
    "Full-stack developer",
    "Open-source contributor",
    "Microservices",
    "FastAPI",
    "Go",
    ".NET",
    "Angular",
    "Next.js",
    "PostgreSQL",
    "Microsoft Azure",
    "Bahmni / OpenMRS",
    "Addis Ababa",
  ],
};

export const DEFAULT_SECTIONS: SectionInput[] = [
  {
    key: "early",
    title: "Early life and education",
    level: 2,
    body: "",
    order: 10,
    inToc: true,
    published: true,
    special: "",
  },
  {
    key: "school",
    title: "School and bootcamps",
    level: 3,
    body: `<p>I was raised in Addis Ababa and educated in the Ethiopian public school system. In early 2025, I completed a Google-backed full-stack web-development bootcamp known locally as the <i>Coding Academy</i> (African to Silicon Valley), where I studied advanced data structures and algorithms — including graph and tree algorithms, dynamic programming, and advanced string algorithms.</p>
<p>Between November 2024 and January 2025, I completed an intensive at the <a href="https://www.insa.gov.et/">Information Network Security Agency</a> (INSA) Summer Program covering introduction to cybersecurity, ethical hacking and cryptography.</p>`,
    order: 20,
    inToc: true,
    published: true,
    special: "",
  },
  {
    key: "university",
    title: "University",
    level: 3,
    body: `<p>Since January 2022, I have been pursuing a Bachelor of Science in <a href="https://en.wikipedia.org/wiki/Software_engineering">software engineering</a> at Addis Ababa University, with expected graduation in September 2027. My coursework spans web development, mobile application development with <a href="https://flutter.dev/">Flutter</a>, fundamentals of software engineering, data structures and algorithms, operating systems, computer architecture, object-oriented programming and software development.</p>`,
    order: 30,
    inToc: true,
    published: true,
    special: "",
  },
  {
    key: "career",
    title: "Career",
    level: 2,
    body: `<div class="quotebox"><div class="qb-q">"Jiru takes initiative and suggested using React for the project. He handles project requirements carefully, delivers timely updates, and is a team player. His performance during the internship was marked by strong collaboration with peers, proficiency in the React framework, and a solid understanding of backend workflows."</div><div class="qb-by">— <a href="https://www.linkedin.com/in/anteneh-yimmam0/">Anteneh Yimmam</a>, Education Lead at <a href="https://ethioware.org/">Ethioware EdTech Initiative</a></div></div>`,
    order: 40,
    inToc: true,
    published: true,
    special: "",
  },
  {
    key: "mereb-fastapi",
    title: "Mereb Technologies (FastAPI)",
    level: 3,
    body: `<p>Since June 2026, I have worked full-time at <a href="https://www.merebtechnology.com/">Mereb Technologies</a> as a full-stack developer on an <a href="https://fastapi.tiangolo.com/">FastAPI</a> platform. I design and scale asynchronous <a href="https://en.wikipedia.org/wiki/Microservices">microservices</a> in Python, using <a href="https://www.sqlalchemy.org/">SQLAlchemy</a> and <code>asyncio</code> behind REST APIs, with a clean separation of concerns between transport, domain and persistence layers.</p>
<p>The platform runs on a dual-database architecture: <a href="https://www.microsoft.com/sql-server">MS SQL Server</a> handles transactional (<a href="https://en.wikipedia.org/wiki/Online_transaction_processing">OLTP</a>) workloads, while <a href="https://www.starrocks.io/">StarRocks</a> serves real-time analytical (<a href="https://en.wikipedia.org/wiki/Online_analytical_processing">OLAP</a>) queries. I build the ingestion pipelines between them — including work with StarRocks' Stream Load interface — to aggregate large volumes of transactional data for live analysis, and I deploy, monitor and secure the resulting workloads on <a href="https://azure.microsoft.com/">Microsoft Azure</a> using <a href="https://www.docker.com/">Docker</a> and managed secret storage.</p>`,
    order: 45,
    inToc: true,
    published: true,
    special: "",
  },
  {
    key: "aau",
    title: "Addis Ababa University (2026–present)",
    level: 3,
    body: `<p>Since March 2026, I have worked remotely as a fullstack developer at <a href="https://aau.edu.et/">Addis Ababa University</a>, contributing to a Regional Property Management System (PMS) built with <a href="https://angular.dev/">Angular</a> and <a href="https://dotnet.microsoft.com/">.NET Core</a>. The system streamlines property registration, tenant management, billing, payments, and reporting across a scalable, multi-tenant platform serving regional property needs.</p>
<p>The system is organised as a cloud-ready microservices architecture with an emphasis on scalability, performance and observability: <a href="https://www.keycloak.org/">Keycloak</a> for identity and access management, <a href="https://www.postgresql.org/">PostgreSQL</a> for persistence, <a href="https://www.rabbitmq.com/">RabbitMQ</a> for inter-service messaging, <a href="https://redis.io/">Redis</a> for caching, and <a href="https://prometheus.io/">Prometheus</a>, <a href="https://grafana.com/">Grafana</a> and <a href="https://www.jaegertracing.io/">Jaeger</a> for metrics, dashboards and distributed tracing.</p>`,
    order: 50,
    inToc: true,
    published: true,
    special: "",
  },
  {
    key: "mereb",
    title: "Mereb Technologies (Bahmni)",
    level: 3,
    body: `<p>Between February and June 2026, I held a fullstack-developer role at <a href="https://www.merebtechnology.com/">Mereb Technologies</a>, where I developed and maintained full-stack features for <a href="https://bahmni.org/">Bahmni</a>-based healthcare software systems, including legacy application maintenance, improvements, and the addition of new functionality to support clinical operations and healthcare workflows.</p>`,
    order: 60,
    inToc: true,
    published: true,
    special: "",
  },
  {
    key: "gulit",
    title: "Gulit Marketplace (2025)",
    level: 3,
    body: `<p>Between July and December 2025, I served as a part-time backend developer at <i>Gulit Marketplace</i>. I designed and implemented scalable backend services for authentication, admin dashboards and user management using Express.js, <a href="https://www.postgresql.org/">PostgreSQL</a> and <a href="https://redis.io/">Redis</a>; I also developed secure APIs with role-based access control and integrated them with frontend dashboards.</p>`,
    order: 70,
    inToc: true,
    published: true,
    special: "",
  },
  {
    key: "ethioware",
    title: "Ethioware EdTech Initiative (2025)",
    level: 3,
    body: `<p>My first professional engagement was a backend internship at the <a href="https://ethioware.org/">Ethioware EdTech Initiative</a> from January to May 2025. I collaborated on backend development to build and enhance server-side applications using <a href="https://expressjs.com/">Express.js</a> on <a href="https://nodejs.org/">Node.js</a> with a <a href="https://www.mysql.com/">MySQL</a> backing store, and contributed to the company website redesign project, focusing on reliable backend architecture and workflows.</p>`,
    order: 80,
    inToc: true,
    published: true,
    special: "",
  },
  {
    key: "projects",
    title: "Notable projects",
    level: 2,
    body: `<p class="hatnote">Main article: <a class="new" href="/projects">List of works by Jiru Gutema</a></p>
<p>In addition to my employment, I have authored several independent software projects, primarily web applications, browser extensions and developer tools. A selection are summarised in the table below; a fuller list is available at <a href="/projects">List of works by Jiru Gutema</a>.</p>`,
    order: 90,
    inToc: true,
    published: true,
    special: "projects",
  },
  {
    key: "oss",
    title: "Open-source contributions",
    level: 2,
    body: `<p>I have contributed to several open-source projects, with a focus on developer tooling and localisation:</p>
<ul><li><a class="external" href="https://github.com/JiruGutema/react-next_folder">JiruGutema/react-next_folder</a> — enhanced user experience with commands and added multi-argument support for creating multiple React/Next.js folders simultaneously.</li><li><a class="external" href="https://github.com/mpopp75/db4free-net-l10n/tree/main/om">mpopp75/db4free-net-l10n</a> — contributed an Afaan Oromoo translation pool to the db4free.net free online database host platform.</li></ul>`,
    order: 100,
    inToc: true,
    published: true,
    special: "",
  },
  {
    key: "activity",
    title: "Public coding activity",
    level: 2,
    body: `<p>My public <a href="https://github.com/JiruGutema">GitHub</a> account (<a class="external" href="https://github.com/JiruGutema">@JiruGutema</a>) holds more than a hundred repositories and contains the source for most of the projects listed above, including <i>Email Craft</i>, <i>KaiShare</i>, <i>Tooran</i>, <i>Hide YouTube Shorts</i>, <i>Page Marker</i> and <i>Content Section Blocker</i>.</p>
<p>Alongside those, the account is where I work through systems and language fundamentals in the open. In <a href="https://go.dev/">Go</a> this includes a reusable <a class="external" href="https://github.com/JiruGutema/go_rbac_service">RBAC service module</a>, an in-memory <a class="external" href="https://github.com/JiruGutema/Go-Key-Value-Store">key–value store</a>, a <a class="external" href="https://github.com/JiruGutema/GoPasteBin">pastebin service</a> with link expiry, and a <a class="external" href="https://github.com/JiruGutema/Remote-Procedure-Calls">remote-procedure-call</a> exercise from my distributed-systems coursework; in C# and .NET it includes minimal-API and enterprise-application coursework projects. I also publish my <a class="external" href="https://github.com/JiruGutema/dotfiles">dotfiles</a> and <a class="external" href="https://github.com/JiruGutema/NeoVimConfig">Neovim configuration</a>, which is the editor I do most of my work in. I additionally maintain profiles on <a class="external" href="https://www.leetcode.com/jiru_gutema">LeetCode</a> and <a class="external" href="https://www.linkedin.com/in/jiru-gutema">LinkedIn</a>.</p>`,
    order: 110,
    inToc: true,
    published: true,
    special: "",
  },
  {
    key: "views",
    title: "Views and influences",
    level: 2,
    body: `<p>I credit educational and science programming as a continuing influence on my approach to engineering — <a class="external" href="https://www.youtube.com/c/veritasium">Veritasium</a>, <a class="external" href="https://www.youtube.com/c/startalk">StarTalk</a> and <a class="external" href="https://www.youtube.com/c/3blue1brown">3Blue1Brown</a> have been informal sources of mathematical and physical intuition. I prefer to write clean, efficient and maintainable code, and I have a continuing interest in full-stack development, machine learning and cloud computing.</p>`,
    order: 120,
    inToc: true,
    published: true,
    special: "",
  },
  {
    key: "reception",
    title: "Reception",
    level: 2,
    body: `<p>Colleagues and mentors have described my work in generally positive terms. Anteneh Yimmam, Education Lead at the Ethioware EdTech Initiative, noted my initiative in suggesting React as the framework for the company website redesign, and described me as a team player who handles project requirements carefully and delivers timely updates. Yimmam concluded that I "will excel in any backend web development role he pursues" and that he would "welcome the opportunity to work with him again".</p>`,
    order: 130,
    inToc: true,
    published: true,
    special: "",
  },
  {
    key: "writings",
    title: "Selected writings",
    level: 2,
    body: `<p>A list of my published writings is available at <a href="/blogs">/blogs</a>. Topics include software development, web technologies and programming best practices.</p>`,
    order: 140,
    inToc: true,
    published: true,
    special: "",
  },
  {
    key: "personal",
    title: "Personal life",
    level: 2,
    body: `<p>I am a native speaker of <a href="https://en.wikipedia.org/wiki/Oromo_language">Afaan Oromoo</a> and I am fluent in <a href="https://en.wikipedia.org/wiki/Amharic">Amharic</a> and English. I live in Addis Ababa.</p>`,
    order: 150,
    inToc: true,
    published: true,
    special: "",
  },
  {
    key: "external",
    title: "External links",
    level: 2,
    body: `<ul><li><a class="external" href="https://github.com/JiruGutema">Jiru Gutema</a> on GitHub</li><li><a class="external" href="https://www.linkedin.com/in/jiru-gutema">Jiru Gutema</a> on LinkedIn</li><li><a class="external" href="https://www.x.com/jirugutema">Jiru Gutema</a> on X (formerly Twitter)</li><li><a class="external" href="https://www.leetcode.com/jiru_gutema">Jiru Gutema</a> on LeetCode</li><li><a href="mailto:jirudagutema@gmail.com">jirudagutema@gmail.com</a> (email)</li><li><a href="/resume.pdf">Résumé (PDF)</a></li></ul>`,
    order: 170,
    inToc: true,
    published: true,
    special: "",
  },
];

interface RawProject {
  title: string;
  description: string;
  note?: string;
  technologies?: string[];
  details?: string[];
  liveDemoLink?: string;
  githubLink?: string;
  imageUrl?: string;
  imageCaption?: string;
}

const RAW_DEFAULT_PROJECTS: RawProject[] = [
  {
    title: "Email Craft",
    description:
      "Email Craft is a full-stack application for composing, styling, and sending custom HTML emails directly from your Gmail account.",
    note: "Currently in testing mode for limited users before Google verification. Watch demo video or contact me to try it out.",
    technologies: [
      "NestJS",
      "NextJS",
      "Prisma ORM",
      "PostgreSQL",
      "Google OAuth",
      "Gmail API",
      "JWT",
    ],
    details: [
      "Email Craft is a web application designed to create, style, and send professional emails directly from your Gmail account.",
      "Implements secure Google OAuth authentication and JWT-based authorization for safe, user-specific email sending.",
      "Integrates with the Gmail API to support sending both plain text and rich HTML emails.",
      "Backend built with NestJS and Prisma ORM for efficient database and token management using PostgreSQL.",
      "Automatic token refresh ensures uninterrupted email-sending access without manual reauthentication.",
      "Frontend built with NextJS provides a live HTML email editor with syntax highlighting and real-time preview.",
      "Drafts are automatically cached in the browser, allowing users to resume unfinished emails anytime.",
      "Features custom backend guards to protect sensitive routes and operations.",
      "Demonstrates proficiency in full-stack development, OAuth integration, and secure API design.",
    ],
    liveDemoLink: "https://email-craft-olive.vercel.app/",
    githubLink: "https://github.com/JiruGutema/email-craft",
  },
  {
    title: "Kai-Share",
    description:
      "KaiShare is a secure platform for sharing code snippets and text with others, focusing on privacy, simplicity, and collaborative sharing.",
    note: "If you don't have an account, don't forget to copy the generated link after posting, as there is no way to retrieve it later.",
    technologies: ["NextJS", "Go (Gin Framework)", "PostgreSQL"],
    details: [
      "Easily share code blocks or plain text securely with encryption options.",
      "Supports 20+ programming languages for code formatting.",
      "Modern and intuitive UI built with NextJS for a smooth user experience.",
      "Backend built with Go (Gin Framework) for robust and scalable services.",
      "Privacy-focused platform with options for expiry and one-time viewing of shared content.",
    ],
    liveDemoLink: "https://kai-share.vercel.app/",
    githubLink: "https://github.com/JiruGutema/KaiShare",
  },
  {
    title: "Page Marker (Firefox Extension)",
    note: "",
    description:
      "A simple Firefox extension that lets you draw, annotate, and highlight directly on any webpage.",
    technologies: ["JavaScript", "HTML5 Canvas", "WebExtensions API", "CSS"],
    details: [
      "Ever wanted to jot down quick notes or draw on a webpage while browsing? Page Marker makes it possible.",
      "Allows users to draw freehand, highlight text areas, and mark important sections on any webpage.",
      "Built using the WebExtensions API and HTML5 Canvas for smooth, responsive drawing.",
      "Supports brush size and color customization for flexible annotations.",
      "Includes an intuitive interface for clearing, saving, or restoring drawings.",
      "Enhances productivity by allowing visual note-taking without switching tabs.",
      "Showcases strong skills in browser extension development and canvas manipulation.",
    ],
    liveDemoLink:
      "https://addons.mozilla.org/en-US/firefox/addon/draw-and-mark-a-webpage/",
    githubLink: "https://github.com/JiruGutema/Firefox-Marker-Extension",
  },
  {
    title: "Youtube Shorts Blocker (Firefox Extension)",
    description: "A Firefox extension to block YouTube Shorts.",
    note: "",
    technologies: ["JavaScript", "WebExtensions API", "HTML", "CSS"],
    details: [
      "Have you ever wanted to watch youtube videos and then lost yourself in the endless loop of YouTube Shorts?",
      "This extension is designed to block YouTube Shorts, allowing you to focus on full-length videos without distractions.",
      "It uses the WebExtensions API to modify YouTube's DOM, removing Shorts content.",
      "Developed a Firefox extension that blocks YouTube Shorts.",
      "Utilizes the WebExtensions API to modify YouTube's DOM.",
      "Provides users with a cleaner YouTube experience by removing Shorts content.",
      "Demonstrates proficiency in browser extension development and JavaScript.",
    ],
    liveDemoLink:
      "https://addons.mozilla.org/en-US/firefox/addon/hide-youtube-short/",
    githubLink: "https://github.com/JiruGutema/Hide-Youtube-Shorts",
  },
  {
    title: "Content Section Blocker (Browser Extension)",
    description:
      "A cross-browser extension that force-hides any element on any website by CSS selector (class or id). Rules are editable and stored locally — per-site by default, or globally across all sites.",
    note: "",
    technologies: [
      "JavaScript",
      "WebExtensions API",
      "Manifest V3",
      "HTML",
      "CSS",
    ],
    details: [
      "Block any element by pasting a CSS selector like `.ad-container` or `#promoted-post`; the matching element is force-hidden with `display: none !important`.",
      "Includes a point-and-click element picker that generates a selector (preferring the element's id) and blocks it instantly.",
      "Supports per-site rules that fire only on the domain they were added on, plus global rules that apply everywhere.",
      "Rules are fully editable — toggle on/off, edit the selector, or delete — and persist in storage.local, with a master switch to pause or resume all blocking.",
      "Injects rules as a stylesheet at document_start, so blocked elements never flash and dynamically-added elements stay hidden without per-node scanning.",
      "Shares a single Manifest V3 codebase across Chrome/Edge and Firefox using the WebExtensions API.",
    ],
    liveDemoLink:
      "https://addons.mozilla.org/en-US/firefox/addon/element-selector-blocker",
    githubLink:
      "https://github.com/JiruGutema/element-blocker-browser-extension",
  },
  {
    title: "Tooran Android Application",
    description: "A task organizer Flutter app.",
    note: "",
    technologies: [
      "Flutter",
      "Dart",
      "Firebase (optional for future features)",
    ],
    details: [
      "Allows users to manage tasks within categories.",
      "Features include creating categories, adding tasks, and efficient task management.",
      "Designed for a clean and intuitive user experience on Android devices.",
    ],
    liveDemoLink: "https://tooran-documentation.vercel.app/",
    githubLink: "https://github.com/JiruGutema/Tooran",
  },
  {
    title: "Sentiment Analysis Web Application",
    description:
      "A sentiment analysis web application built with Python and Flask.",
    technologies: ["Python", "Natural Language Processing", "Flask"],
    note: "",
    details: [
      "Built a sentiment analysis web application that allows users to analyze the sentiment of text.",
      "Utilizes Natural Language Processing techniques for accurate sentiment detection.",
      "Demonstrates proficiency in backend development and machine learning integration.",
    ],
    liveDemoLink: "https://github.com/JiruGutema/sentiment-analysis",
    githubLink: "https://github.com/JiruGutema/sentiment-analysis",
  },
  {
    title: "House Rental Web Application (Group Project)",
    description: "A full-stack web application for a house rental platform.",
    note: "",
    technologies: ["Node.js", "Express", "MySQL", "React", "JWT"],
    details: [
      "Developed a comprehensive platform for listing and renting houses.",
      "Implemented user authentication and authorization using JWT.",
      "Managed database interactions with MySQL.",
      "Contributed to both frontend (React) and backend (Node.js/Express) development.",
    ],
    liveDemoLink:
      "https://github.com/JiruGutema/House_Rental_and_Sell_Management_System",
    githubLink:
      "https://github.com/JiruGutema/House_Rental_and_Sell_Management_System",
  },
  {
    title: "Restaurant Management System (Group Project)",
    description: "A full-stack restaurant management system.",
    technologies: ["Node.js", "NestJS", "TypeScript", "Vanilla HTML", "MySQL"],
    note: "",
    details: [
      "Participated in a group project contributing as a database designer, frontend developer, and API integrator.",
      "Built with modern backend frameworks (NestJS, TypeScript) and vanilla HTML for the frontend.",
      "Designed and implemented the database schema for restaurant operations.",
    ],
    liveDemoLink:
      "https://github.com/JiruGutema/Restaurant_Ordering_System_2024_25",
    githubLink:
      "https://github.com/JiruGutema/Restaurant_Ordering_System_2024_25",
  },
  {
    title: "VolunteerConnect (Group Project)",
    description: "Connects volunteers with organizations.",
    technologies: ["Express", "MySQL", "Flutter", "JWT", "Firebase"],
    note: "",
    details: [
      "Contributed as a backend developer and Flutter developer.",
      "Implemented backend functionalities using Express and MySQL.",
      "Developed mobile features with Flutter.",
      "Integrated JWT for secure authentication and Firebase for additional services.",
    ],
    liveDemoLink: "https://github.com/JiruGutema/VolunteerConnect",
    githubLink: "https://github.com/JiruGutema/VolunteerConnect",
  },
  {
    title: "React-Next-Folder Creator (Contribution)",
    description:
      "A Node.js library that creates folders for React and Next.js projects.",
    technologies: ["Node.js"],
    note: "",
    details: [
      "Contributed to a project by enhancing user experience with commands.",
      "Added multi-argument support for creating multiple folders simultaneously.",
      "Improved the utility and efficiency of the library for developers.",
    ],
    liveDemoLink: "https://www.npmjs.com/package/react-cli-builder",
    githubLink: "https://github.com/JiruGutema/react-next_folder",
  },
  {
    title: "db4free-net-l10n (Contribution)",
    note: "",
    description: "Contribution to a free online database host platform.",
    technologies: ["Localization", "Afaan Oromoo"],
    details: [
      "Contributed to the db4free.net project by adding an Afaan Oromoo Translation pool.",
      "Helped make the platform more accessible to Afaan Oromoo speakers.",
      "Demonstrates commitment to open-source and localization efforts.",
    ],
    liveDemoLink: "https://www.db4free.net/translate.php?language=om",
    githubLink: "https://github.com/mpopp75/db4free-net-l10n/tree/main/om",
  },
  {
    title: "Local File Sharing",
    description: "A file sharing application built with Node.js and Express.",
    note: "",
    technologies: ["Javascript", "Node.js", "Express", "Socket.IO"],
    details: [
      "Built a file sharing application that allows users to upload and share files.",
      "Utilizes Express for real-time file transfer.",
      "Demonstrates proficiency in backend development and real-time web applications.",
    ],
    liveDemoLink: "https://github.com/JiruGutema/FileShare-Hub",
    githubLink: "https://github.com/JiruGutema/FileShare-Hub",
  },
];

/** The first six projects are shown in the biography summary table. */
const FEATURED_COUNT = 6;

export const DEFAULT_PROJECTS: ProjectInput[] = RAW_DEFAULT_PROJECTS.map(
  (p, i) => ({
    title: p.title.trim(),
    description: p.description ?? "",
    note: p.note ?? "",
    technologies: (p.technologies ?? []).join(", "),
    details: (p.details ?? []).join("\n"),
    liveDemoLink: p.liveDemoLink ?? "",
    githubLink: p.githubLink ?? "",
    imageUrl: p.imageUrl ?? "",
    imageCaption: p.imageCaption ?? "",
    featured: i < FEATURED_COUNT,
    order: (i + 1) * 10,
  }),
);

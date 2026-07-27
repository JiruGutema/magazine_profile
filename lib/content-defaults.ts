import { projects as legacyProjects } from "@/components/data/projects";
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
  leadHtml: `<p><b>Jiru Gutema</b> is an Ethiopian <a href="https://en.wikipedia.org/wiki/Software_engineer">software engineer</a> and <a href="https://en.wikipedia.org/wiki/Solution_stack">full-stack developer</a> based in <a href="https://en.wikipedia.org/wiki/Addis_Ababa">Addis Ababa</a>. He is currently an undergraduate at <a href="https://aau.edu.et/">Addis Ababa University</a>, where he is concurrently developing the university's <a href="https://angular.dev/">Angular</a>/<a href="https://dotnet.microsoft.com/">.NET</a>-based regional property management system, and a fullstack developer at <a href="https://www.merebtechnology.com/">Mereb Technologies</a> on a <a href="https://bahmni.org/">Bahmni</a>-based healthcare platform.</p>
<p>Jiru is known for several browser extensions and developer tools, including <i>Hide YouTube Shorts</i> and <i>Page Marker</i> for <a href="https://www.mozilla.org/firefox/">Mozilla Firefox</a>, and the full-stack Gmail-integrated email composer <a href="https://email-craft-olive.vercel.app/"><i>Email Craft</i></a>. His professional work centers on the seam between front-end and back-end systems, with a stated preference for code that the next person to read it can <i>reason</i> about without a meeting.</p>
<p>Outside of his employment, Jiru mentors students in React, Next.js, backend development and data structures at <a href="https://nexustutorial.vercel.app/">Nexus Tutorial</a>, and has served as a core team member of the AWS Cloud Club at Addis Ababa University. He has contributed Afaan Oromoo localisation to <a href="https://www.db4free.net/">db4free.net</a> and submitted patches to the <i>react-next-folder</i> npm package.</p>`,
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
            "<i>Hide YouTube Shorts</i>, <i>Page Marker</i>, <i>Email Craft</i>, contributions to Bahmni / OpenMRS",
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
    ".NET",
    "Angular",
    "Next.js",
    "PostgreSQL",
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
    body: `<p>Jiru was raised in Addis Ababa and educated in the Ethiopian public school system. In early 2025, he completed a Google-backed full-stack web-development bootcamp known locally as the <i>Coding Academy</i> (African to Silicon Valley), where he studied advanced data structures and algorithms — including graph and tree algorithms, dynamic programming, and advanced string algorithms.</p>
<p>Between November 2024 and January 2025, he completed an intensive at the <a href="https://www.insa.gov.et/">Information Network Security Agency</a> (INSA) Summer Program covering introduction to cybersecurity, ethical hacking and cryptography.</p>`,
    order: 20,
    inToc: true,
    published: true,
    special: "",
  },
  {
    key: "university",
    title: "University",
    level: 3,
    body: `<p>Since January 2022, Jiru has been pursuing a Bachelor of Science in <a href="https://en.wikipedia.org/wiki/Software_engineering">software engineering</a> at Addis Ababa University, with expected graduation in September 2027. His coursework spans web development, mobile application development with <a href="https://flutter.dev/">Flutter</a>, fundamentals of software engineering, data structures and algorithms, operating systems, computer architecture, object-oriented programming and software development.</p>`,
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
    key: "aau",
    title: "Addis Ababa University (2026)",
    level: 3,
    body: `<p>Since March 2026, Jiru has worked remotely as a fullstack developer at <a href="https://aau.edu.et/">Addis Ababa University</a>, contributing to a Regional Property Management System (PMS) built with <a href="https://angular.dev/">Angular</a> and <a href="https://dotnet.microsoft.com/">.NET Core</a>. The system streamlines property registration, tenant management, billing, payments, and reporting across a scalable, multi-tenant platform serving regional property needs.</p>`,
    order: 50,
    inToc: true,
    published: true,
    special: "",
  },
  {
    key: "mereb",
    title: "Mereb Technologies (2026)",
    level: 3,
    body: `<p>Since February 2026, Jiru has held a fullstack-developer role at <a href="https://www.merebtechnology.com/">Mereb Technologies</a>, where he develops and maintains full-stack features for <a href="https://bahmni.org/">Bahmni</a>-based healthcare software systems, including legacy application maintenance, improvements, and the addition of new functionality to support clinical operations.</p>`,
    order: 60,
    inToc: true,
    published: true,
    special: "",
  },
  {
    key: "gulit",
    title: "Gulit Marketplace (2025)",
    level: 3,
    body: `<p>Between July and December 2025, Jiru served as a part-time backend developer at <i>Gulit Marketplace</i>. He designed and implemented scalable backend services for authentication, admin dashboards and user management using Express.js, <a href="https://www.postgresql.org/">PostgreSQL</a> and <a href="https://redis.io/">Redis</a>; he also developed secure APIs with role-based access control and integrated them with frontend dashboards.</p>`,
    order: 70,
    inToc: true,
    published: true,
    special: "",
  },
  {
    key: "ethioware",
    title: "Ethioware EdTech Initiative (2025)",
    level: 3,
    body: `<p>Jiru's first professional engagement was a backend internship at the <a href="https://ethioware.org/">Ethioware EdTech Initiative</a> from January to May 2025. He collaborated on backend development to build and enhance server-side applications using <a href="https://expressjs.com/">Express.js</a> on <a href="https://nodejs.org/">Node.js</a> with a <a href="https://www.mysql.com/">MySQL</a> backing store, and contributed to the company website redesign project, focusing on reliable backend architecture and workflows.</p>`,
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
<p>In addition to his employment, Jiru has authored several independent software projects, primarily web applications, browser extensions and developer tools. A selection are summarised in the table below; a fuller list is available at <a href="/projects">List of works by Jiru Gutema</a>.</p>`,
    order: 90,
    inToc: true,
    published: true,
    special: "projects",
  },
  {
    key: "oss",
    title: "Open-source contributions",
    level: 2,
    body: `<p>Jiru has contributed to several open-source projects, with a focus on developer tooling and localisation:</p>
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
    body: `<p>Jiru's public <a href="https://github.com/JiruGutema">GitHub</a> account (<a class="external" href="https://github.com/JiruGutema">@JiruGutema</a>) contains the source for most of the projects listed above, including <i>Email Craft</i>, <i>KaiShare</i>, <i>Hide YouTube Shorts</i> and <i>Page Marker</i>. He additionally maintains profiles on <a class="external" href="https://www.leetcode.com/jiru_gutema">LeetCode</a> and <a class="external" href="https://www.linkedin.com/in/jiru-gutema">LinkedIn</a>.</p>`,
    order: 110,
    inToc: true,
    published: true,
    special: "",
  },
  {
    key: "views",
    title: "Views and influences",
    level: 2,
    body: `<p>Jiru has cited educational and science programming as a continuing influence on his approach to engineering, including <a class="external" href="https://www.youtube.com/c/veritasium">Veritasium</a>, <a class="external" href="https://www.youtube.com/c/startalk">StarTalk</a> and <a class="external" href="https://www.youtube.com/c/3blue1brown">3Blue1Brown</a> as informal sources of mathematical and physical intuition. He has stated a preference for writing clean, efficient and maintainable code, and a continuing interest in full-stack development, machine learning and cloud computing.</p>`,
    order: 120,
    inToc: true,
    published: true,
    special: "",
  },
  {
    key: "reception",
    title: "Reception",
    level: 2,
    body: `<p>Jiru has been described in generally positive terms by colleagues and mentors. Anteneh Yimmam, Education Lead at the Ethioware EdTech Initiative, noted Jiru's initiative in suggesting React as the framework for the company website redesign, and described him as a team player who handles project requirements carefully and delivers timely updates. Yimmam concluded that Jiru "will excel in any backend web development role he pursues" and that he would "welcome the opportunity to work with him again".</p>`,
    order: 130,
    inToc: true,
    published: true,
    special: "",
  },
  {
    key: "writings",
    title: "Selected writings",
    level: 2,
    body: `<p>A list of Jiru's published writings is available at <a href="/blogs">/blogs</a>. Topics include software development, web technologies and programming best practices.</p>`,
    order: 140,
    inToc: true,
    published: true,
    special: "",
  },
  {
    key: "personal",
    title: "Personal life",
    level: 2,
    body: `<p>Jiru is a native speaker of <a href="https://en.wikipedia.org/wiki/Oromo_language">Afaan Oromoo</a> and is fluent in <a href="https://en.wikipedia.org/wiki/Amharic">Amharic</a> and English. He resides in Addis Ababa.</p>`,
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

interface LegacyProject {
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

/** The first six projects are shown in the biography summary table. */
const FEATURED_COUNT = 6;

export const DEFAULT_PROJECTS: ProjectInput[] = (
  legacyProjects as LegacyProject[]
).map((p, i) => ({
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
}));

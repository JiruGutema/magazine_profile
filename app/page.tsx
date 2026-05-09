import { Infobox } from "@/components/profile/Infobox";
import { Toc, type TocItem } from "@/components/profile/Toc";
import { ContributionGraph } from "@/components/portfolio/Contribution-Graph";
import { projects } from "@/components/data/projects";

const TOC: TocItem[] = [
  {
    id: "early",
    label: "Early life and education",
    children: [
      { id: "school", label: "School and bootcamps" },
      { id: "university", label: "University" },
    ],
  },
  {
    id: "career",
    label: "Career",
    children: [
      { id: "aau", label: "Addis Ababa University (2026)" },
      { id: "mereb", label: "Mereb Technologies (2026)" },
      { id: "gulit", label: "Gulit Marketplace (2025)" },
      { id: "ethioware", label: "Ethioware EdTech (2025)" },
    ],
  },
  { id: "projects", label: "Notable projects" },
  { id: "oss", label: "Open-source contributions" },
  { id: "activity", label: "Public coding activity" },
  { id: "views", label: "Views and influences" },
  { id: "reception", label: "Reception" },
  { id: "writings", label: "Selected writings" },
  { id: "personal", label: "Personal life" },
  { id: "seealso", label: "See also" },
  { id: "external", label: "External links" },
];

export default function PortfolioPage() {
  const featured = projects.slice(0, 6);

  return (
    <>
      <div className="firstHeading-wrap">
        <h1 className="firstHeading">
          <i>Jiru Gutema</i>
        </h1>
        <span
          className="ga-star"
          title="This is a good article."
        >
          ★
        </span>
      </div>
      <div className="siteSub">Software engineer · Fullstack developer · Addis Ababa</div>
      <div className="contentSub" />

      <Infobox />

      <p>
        <b>Jiru Gutema</b> is an Ethiopian{" "}
        <a href="https://en.wikipedia.org/wiki/Software_engineer">software engineer</a> and{" "}
        <a href="https://en.wikipedia.org/wiki/Solution_stack">full-stack developer</a> based in{" "}
        <a href="https://en.wikipedia.org/wiki/Addis_Ababa">Addis Ababa</a>. He is currently
        an undergraduate at <a href="https://aau.edu.et/">Addis Ababa University</a>, where
        he is concurrently developing the university's{" "}
        <a href="https://angular.dev/">Angular</a>/<a href="https://dotnet.microsoft.com/">.NET</a>-based
        regional property management system, and a fullstack developer at{" "}
        <a href="https://www.merebtechnology.com/">Mereb Technologies</a> on a{" "}
        <a href="https://bahmni.org/">Bahmni</a>-based healthcare platform.
      </p>

      <p>
        Jiru is known for several browser extensions and developer tools, including{" "}
        <i>Hide YouTube Shorts</i> and <i>Page Marker</i> for{" "}
        <a href="https://www.mozilla.org/firefox/">Mozilla Firefox</a>, and the full-stack
        Gmail-integrated email composer <a href="https://email-craft-olive.vercel.app/"><i>Email Craft</i></a>.
        His professional work centers on the seam between front-end and back-end systems,
        with a stated preference for code that the next person to read it can{" "}
        <i>reason</i> about without a meeting.
      </p>

      <p>
        Outside of his employment, Jiru mentors students in React, Next.js, backend
        development and data structures at <a href="https://nexustutorial.vercel.app/">Nexus Tutorial</a>,
        and has served as a core team member of the AWS Cloud Club at Addis Ababa University.
        He has contributed Afaan Oromoo localisation to <a href="https://www.db4free.net/">db4free.net</a>{" "}
        and submitted patches to the <i>react-next-folder</i> npm package.
      </p>

      <Toc items={TOC} />

      {/* ── EARLY LIFE ── */}
      <h2 id="early">
        Early life and education      </h2>

      <h3 id="school">School and bootcamps</h3>
      <p>
        Jiru was raised in Addis Ababa and educated in the Ethiopian public school
        system. In early 2025, he completed a Google-backed full-stack web-development
        bootcamp known locally as the <i>Coding Academy</i> (African to Silicon Valley),
        where he studied advanced data structures and algorithms — including graph and
        tree algorithms, dynamic programming, and advanced string algorithms.
      </p>
      <p>
        Between November 2024 and January 2025, he completed an intensive at the{" "}
        <a href="https://www.insa.gov.et/">Information Network Security Agency</a> (INSA)
        Summer Program covering introduction to cybersecurity, ethical hacking and
        cryptography.
      </p>

      <h3 id="university">University</h3>
      <p>
        Since January 2023, Jiru has been pursuing a Bachelor of Science in{" "}
        <a href="https://en.wikipedia.org/wiki/Software_engineering">software engineering</a>{" "}
        at Addis Ababa University, with expected graduation in September 2027. His
        coursework spans web development, mobile application development with{" "}
        <a href="https://flutter.dev/">Flutter</a>, fundamentals of software
        engineering, data structures and algorithms, operating systems, computer
        architecture, object-oriented programming and software development.
      </p>

      {/* ── CAREER ── */}
      <h2 id="career">
        Career      </h2>

      <div className="quotebox">
        <div className="qb-q">
          "Jiru takes initiative and suggested using React for the project. He handles
          project requirements carefully, delivers timely updates, and is a team player.
          His performance during the internship was marked by strong collaboration with
          peers, proficiency in the React framework, and a solid understanding of
          backend workflows."
        </div>
        <div className="qb-by">
          —{" "}
          <a href="https://www.linkedin.com/in/anteneh-yimmam0/">Anteneh Yimmam</a>,
          Education Lead at{" "}
          <a href="https://ethioware.org/">Ethioware EdTech Initiative</a>
        </div>
      </div>

      <h3 id="aau">Addis Ababa University (2026)</h3>
      <p>
        Since March 2026, Jiru has worked remotely as a fullstack developer at{" "}
        <a href="https://aau.edu.et/">Addis Ababa University</a>, contributing
        to a Regional Property Management System (PMS) built with{" "}
        <a href="https://angular.dev/">Angular</a> and{" "}
        <a href="https://dotnet.microsoft.com/">.NET Core</a>. The system streamlines
        property registration, tenant management, billing, payments, and reporting
        across a scalable, multi-tenant platform serving regional property needs.
      </p>

      <h3 id="mereb">Mereb Technologies (2026)</h3>
      <p>
        Since February 2026, Jiru has held a fullstack-developer role at{" "}
        <a href="https://www.merebtechnology.com/">Mereb Technologies</a>, where he develops
        and maintains full-stack features for <a href="https://bahmni.org/">Bahmni</a>-based
        healthcare software systems, including legacy application maintenance,
        improvements, and the addition of new functionality to support clinical
        operations.
      </p>

      <h3 id="gulit">Gulit Marketplace (2025)</h3>
      <p>
        Between July and December 2025, Jiru served as a part-time backend developer
        at <i>Gulit Marketplace</i>. He designed and implemented scalable backend
        services for authentication, admin dashboards and user management using
        Express.js, <a href="https://www.postgresql.org/">PostgreSQL</a> and{" "}
        <a href="https://redis.io/">Redis</a>; he also developed secure APIs with
        role-based access control and integrated them with frontend dashboards.
      </p>

      <h3 id="ethioware">Ethioware EdTech Initiative (2025)</h3>
      <p>
        Jiru's first professional engagement was a backend internship at the{" "}
        <a href="https://ethioware.org/">Ethioware EdTech Initiative</a>{" "}
        from January to May 2025. He collaborated on backend development to build and
        enhance server-side applications using <a href="https://expressjs.com/">Express.js</a>{" "}
        on <a href="https://nodejs.org/">Node.js</a> with a{" "}
        <a href="https://www.mysql.com/">MySQL</a> backing store, and contributed to
        the company website redesign project, focusing on reliable backend architecture
        and workflows.
      </p>

      {/* ── NOTABLE PROJECTS ── */}
      <h2 id="projects">
        Notable projects      </h2>
      <p className="hatnote">
        Main article: <a className="new" href="/projects">List of works by Jiru Gutema</a>
      </p>
      <p>
        In addition to his employment, Jiru has authored several independent
        software projects, primarily web applications, browser extensions and
        developer tools. A selection are summarised in the table below; a fuller
        list is available at <a href="/projects">List of works by Jiru Gutema</a>.
      </p>

      <table className="wikitable">
        <caption>Selected projects by Jiru Gutema</caption>
        <thead>
          <tr>
            <th style={{ width: "20%" }}>Title</th>
            <th style={{ width: "22%" }}>Technologies</th>
            <th>Description</th>
            <th style={{ width: "16%" }}>Links</th>
          </tr>
        </thead>
        <tbody>
          {featured.map((p) => (
            <tr key={`${p.id}-${p.title}`}>
              <td><i>{p.title}</i></td>
              <td>{p.technologies.join(", ")}</td>
              <td>{p.description}</td>
              <td>
                {p.liveDemoLink && (
                  <>
                    <a className="external" href={p.liveDemoLink}>Live</a>
                    <br />
                  </>
                )}
                {p.githubLink && (
                  <a className="external" href={p.githubLink}>Source</a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── OSS ── */}
      <h2 id="oss">
        Open-source contributions      </h2>
      <p>
        Jiru has contributed to several open-source projects, with a focus on
        developer tooling and localisation:
      </p>
      <ul>
        <li>
          <a className="external" href="https://github.com/JiruGutema/react-next_folder">
            JiruGutema/react-next_folder
          </a>{" "}
          &mdash; enhanced user experience with commands and added multi-argument support
          for creating multiple React/Next.js folders simultaneously.
        </li>
        <li>
          <a className="external" href="https://github.com/mpopp75/db4free-net-l10n/tree/main/om">
            mpopp75/db4free-net-l10n
          </a>{" "}
          &mdash; contributed an Afaan Oromoo translation pool to the db4free.net free
          online database host platform.
        </li>
      </ul>

      {/* ── ACTIVITY ── */}
      <h2 id="activity">
        Public coding activity      </h2>
      <p>
        Jiru's public <a href="https://github.com/JiruGutema">GitHub</a> account
        (<a className="external" href="https://github.com/JiruGutema">@JiruGutema</a>)
        contains the source for most of the projects listed above, including{" "}
        <i>Email Craft</i>, <i>KaiShare</i>, <i>Hide YouTube Shorts</i> and{" "}
        <i>Page Marker</i>. He additionally maintains profiles on{" "}
        <a className="external" href="https://www.leetcode.com/jiru_gutema">LeetCode</a>{" "}
        and <a className="external" href="https://www.linkedin.com/in/jiru-gutema">LinkedIn</a>.
      </p>

      {/* ── VIEWS ── */}
      <h2 id="views">
        Views and influences      </h2>
      <p>
        Jiru has cited educational and science programming as a continuing influence
        on his approach to engineering, including{" "}
        <a className="external" href="https://www.youtube.com/c/veritasium">Veritasium</a>,{" "}
        <a className="external" href="https://www.youtube.com/c/startalk">StarTalk</a> and{" "}
        <a className="external" href="https://www.youtube.com/c/3blue1brown">3Blue1Brown</a>{" "}
        as informal sources of mathematical and physical intuition. He has stated a
        preference for writing clean, efficient and maintainable code, and a continuing
        interest in full-stack development, machine learning and cloud computing.
      </p>

      {/* ── RECEPTION ── */}
      <h2 id="reception">
        Reception      </h2>
      <p>
        Jiru has been described in generally positive terms by colleagues and mentors.
        Anteneh Yimmam, Education Lead at the Ethioware EdTech Initiative, noted Jiru's
        initiative in suggesting React as the framework for the company website redesign,
        and described him as a team player who handles project requirements carefully and
        delivers timely updates. Yimmam concluded that Jiru "will excel in any backend
        web development role he pursues" and that he would "welcome the opportunity to
        work with him again".
      </p>

      {/* ── WRITINGS ── */}
      <h2 id="writings">
        Selected writings      </h2>
      <p>
        A list of Jiru's published writings is available at <a href="/blogs">/blogs</a>.
        Topics include software development, web technologies and programming best
        practices.
      </p>

      {/* ── PERSONAL ── */}
      <h2 id="personal">
        Personal life      </h2>
      <p>
        Jiru is a native speaker of <a href="https://en.wikipedia.org/wiki/Oromo_language">Afaan Oromoo</a>{" "}
        and is fluent in <a href="https://en.wikipedia.org/wiki/Amharic">Amharic</a> and English.
        He resides in Addis Ababa.
      </p>

      {/* ── SEE ALSO ── */}
      <h2 id="seealso">
        See also      </h2>
      <div className="col2">
        <ul>
          <li><a href="/projects">List of works by Jiru Gutema</a></li>
          <li><a href="/blogs">Writings by Jiru Gutema</a></li>
          <li><a href="https://bahmni.org/">Bahmni</a></li>
          <li><a href="https://openmrs.org/">OpenMRS</a></li>
          <li><a href="https://aau.edu.et/">Addis Ababa University</a></li>
        </ul>
      </div>

      {/* ── EXTERNAL ── */}
      <h2 id="external">
        External links      </h2>
      <ul>
        <li><a className="external" href="https://github.com/JiruGutema">Jiru Gutema</a> on GitHub</li>
        <li><a className="external" href="https://www.linkedin.com/in/jiru-gutema">Jiru Gutema</a> on LinkedIn</li>
        <li><a className="external" href="https://www.x.com/jirugutema">Jiru Gutema</a> on X (formerly Twitter)</li>
        <li><a className="external" href="https://www.leetcode.com/jiru_gutema">Jiru Gutema</a> on LeetCode</li>
        <li><a href="mailto:jirudagutema@gmail.com">jirudagutema@gmail.com</a> (email)</li>
        <li><a href="/resume.pdf">Résumé (PDF)</a></li>
      </ul>

      {/* ── TAGS ── */}
      <div className="catlinks">
        <b>Tags</b>:{" "}
        <a href="#">Software engineer</a>
        <span className="catbar">|</span>
        <a href="#">Full-stack developer</a>
        <span className="catbar">|</span>
        <a href="#">Open-source contributor</a>
        <span className="catbar">|</span>
        <a href="#">.NET</a>
        <span className="catbar">|</span>
        <a href="#">Angular</a>
        <span className="catbar">|</span>
        <a href="#">Next.js</a>
        <span className="catbar">|</span>
        <a href="#">PostgreSQL</a>
        <span className="catbar">|</span>
        <a href="#">Bahmni / OpenMRS</a>
        <span className="catbar">|</span>
        <a href="#">Addis Ababa</a>
      </div>
    </>
  );
}

import Link from "next/link";

export function VectorSidebar() {
  return (
    <aside className="vector-side" id="top">
      <div className="vs-portlet">
        <h5>Navigation</h5>
        <ul>
          <li><Link href="/#early">Early life &amp; education</Link></li>
          <li><Link href="/#career">Career</Link></li>
          <li><Link href="/#projects">Notable projects</Link></li>
          <li><Link href="/#oss">Open-source work</Link></li>
          <li><Link href="/#activity">Coding activity</Link></li>
          <li><Link href="/#views">Views &amp; influences</Link></li>
          <li><Link href="/#reception">Reception</Link></li>
          <li><Link href="/#writings">Selected writings</Link></li>
          <li><Link href="/#personal">Personal life</Link></li>
          <li><Link href="/projects">List of works</Link></li>
          <li><Link href="/blogs">Writings index</Link></li>
        </ul>
      </div>
      <div className="vs-portlet">
        <h5>Profiles</h5>
        <ul>
          <li><a className="external" href="https://github.com/JiruGutema">GitHub</a></li>
          <li><a className="external" href="https://www.linkedin.com/in/jiru-gutema">LinkedIn</a></li>
          <li><a className="external" href="https://www.x.com/jirugutema">X / Twitter</a></li>
          <li><a className="external" href="https://www.leetcode.com/jiru_gutema">LeetCode</a></li>
        </ul>
      </div>
      <div className="vs-portlet">
        <h5>Contact</h5>
        <ul>
          <li><a href="mailto:jirudagutema@gmail.com">Email</a></li>
          <li><Link href="/resume.pdf">Download résumé (PDF)</Link></li>
        </ul>
      </div>
      <div className="vs-portlet">
        <h5>Stack</h5>
        <ul>
          <li>JavaScript, C#, Go</li>
          <li>.NET, NestJS, Express</li>
          <li>React, Next.js, Angular</li>
          <li>PostgreSQL, Prisma</li>
          <li>Docker, AWS, Linux</li>
        </ul>
      </div>
      <div className="vs-portlet">
        <h5>Languages</h5>
        <ul>
          <li>Afaan Oromoo &mdash; native</li>
          <li>አማርኛ &mdash; fluent</li>
          <li>English &mdash; fluent</li>
        </ul>
      </div>
      <div className="vs-portlet">
        <h5>Currently</h5>
        <ul>
          <li>AAU property mgmt. system</li>
          <li>Bahmni @ Mereb Tech</li>
          <li>Re-reading <i>DDIA</i></li>
        </ul>
      </div>
    </aside>
  );
}

export default function Experience() {
  return (
    <section>
      <h2 className="text-3xl font-normal font-serif border-border pb-2 mb-4">
        Experience
      </h2>
      <div className="space-y-6">
        {/* Most recent first */}
        <article>
          <h6 className="text-xl font-serif font-bold">
            Fullstack Developer
          </h6>
          <p className="text-base text-muted-foreground font-medium">
            Addis Ababa University · Full-time
          </p>
          <p className="text-base text-muted-foreground">
            Addis Ababa, Ethiopia · Remote · Mar 2026
          </p>
          <ul className="list-disc list-inside text-base mt-2 space-y-1">
            <li>
              Contributing to the development of a Regional Property Management System (PMS) to streamline property registration, tenant management, billing, payments, and reporting.
            </li>
            <li>
              Building full-stack features for a scalable, multi-tenant platform serving regional property needs.
            </li>
          </ul>
          <p className="text-sm text-muted-foreground mt-1 italic">
            Technologies: Angular, .NET Core
          </p>
        </article>

        <article>
          <h6 className="text-xl font-serif font-bold">
            Full-stack Developer
          </h6>
          <p className="text-base text-muted-foreground font-medium">
            Mereb Technologies · Full-time
          </p>
          <p className="text-base text-muted-foreground">
            Addis Ababa, Ethiopia · On-site · Feb 2026
          </p>
          <ul className="list-disc list-inside text-base mt-2 space-y-1">
            <li>
              Developing and maintaining full-stack features for Bahmni-based healthcare software systems.
            </li>
            <li>
              Responsible for maintaining legacy applications, implementing improvements, and adding new functionalities to support healthcare operations.
            </li>
          </ul>
          <p className="text-sm text-muted-foreground mt-1 italic">
            Skills: Full-Stack Development, Legacy Systems Maintenance
          </p>
        </article>

        <article>
          <h6 className="text-xl font-serif font-bold">
            Back End Developer
          </h6>
          <p className="text-base text-muted-foreground font-medium">
            Gulit Marketplace · Part-time
          </p>
          <p className="text-base text-muted-foreground">
            Addis Ababa, Ethiopia · Remote · Jul 2025 – Dec 2025
          </p>
          <ul className="list-disc list-inside text-base mt-2 space-y-1">
            <li>
              Designed and implemented scalable backend services for authentication, admin dashboards, and user management using Express.js, PostgreSQL, and Redis.
            </li>
            <li>
              Developed secure APIs with role-based access control and integrated them with frontend dashboards.
            </li>
          </ul>
          <p className="text-sm text-muted-foreground mt-1 italic">
            Technologies: Express.js, PostgreSQL, Redis
          </p>
        </article>

        <article>
          <h6 className="text-xl font-serif font-bold">
            Backend Developer (Internship)
          </h6>
          <p className="text-base text-muted-foreground font-medium">
            Ethioware EdTech Initiative
          </p>
          <p className="text-base text-muted-foreground">
            Addis Ababa, Ethiopia · Remote · Jan 2025 – May 2025
          </p>
          <ul className="list-disc list-inside text-base mt-2 space-y-1">
            <li>
              Collaborated with the team on backend development to build and enhance server-side applications using Express.js, Node.js, and MySQL.
            </li>
            <li>
              Contributed to the company website redesign project, focusing on reliable backend architecture and workflows.
            </li>
          </ul>
          <p className="text-sm text-muted-foreground mt-1 italic">
            Technologies: Express.js, Node.js, MySQL
          </p>
        </article>

      </div>
    </section>
  );
}
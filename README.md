# Jiru Gutema's Profile Portfolio

Personal portfolio website. Every section — the biography, projects, blog,
infobox, sidebar, header bar, footer and tags — is stored in the database and
editable from the admin console at `/admin`, with no code changes required.

## Technologies

- Next.js 15
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- bcrypt + JWT authentication

## Getting Started

Install dependencies:
```bash
npm install
```

Set up environment variables in `.env`:
```env
DATABASE_URL="your-postgresql-url"
JWT_SECRET="your-secret-key"
```

Apply migrations and seed the initial content:
```bash
npx prisma migrate deploy
npm run seed-content        # populate the DB with the default portfolio content
```

Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Content administration

All website content is stored in the database and edited from the admin
console. Create an admin user:
```bash
npm run create-admin admin@example.com password "Admin Name"
```

Then sign in at `/admin/login`. The console has a tab for each part of the
site:

| Tab       | Edits |
|-----------|-------|
| Biography | The article headline, lead paragraphs, and every section (add / edit / reorder / hide) |
| Projects  | Project entries; "featured" ones appear in the biography summary table |
| Blog      | Blog posts (Markdown) |
| Infobox   | The bio card (photo, personal details, online-presence links) |
| Sidebar   | The left-rail navigation portlets |
| Header    | The status strip (email, location, timezone, availability) |
| Footer    | Footer tagline and links |
| Tags      | The category bar at the bottom of the biography |

### How content is stored

- `Project` — structured project rows
- `ArticleSection` — the biography's body sections (ordered, each with an HTML body)
- `SiteContent` — JSON blocks for the chrome (header, hero, infobox, sidebar, footer, tags)

Defaults live in `lib/content-defaults.ts`; the public pages fall back to them
if the database is empty, so the site always renders. Admin-authored HTML is
sanitized through `lib/sanitize.ts` before rendering.



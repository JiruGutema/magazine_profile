import Link from "next/link";

export default function Contribution() {
  return (
    <section>
      <h2 className="text-3xl font-normal font-serif border-border pb-2 mb-4">
        Contributions
      </h2>
      <div className="grid gap-6">
        <article>
          <h3 className="text-xl font-bold font-serif mb-2">
            React-Next-Folder Creator
          </h3>
            <p className="text-base text-muted-foreground mb-2">
              A Node.js library that creates folders for React and Next.js
              projects. Contributed by enhancing user experience with commands
              and multi-argument support for multiple folder creation.
            </p>
            <Link
              href="https://github.com/JiruGutema/react-next_folder"
              className="bg-background border rounded-sm border-border hover:underline p-2 text-sm mt-2 inline-block"
            >
              View Contribution
            </Link>
        </article>
        <article>
          <h3 className="text-xl font-bold font-serif mb-2">
            db4free-net-l10n
          </h3>
            <p className="text-base text-muted-foreground mb-2">
              Contributed to the db4free.net platform (a free online database
              host) by adding an Afaan Oromoo Translation pool.
            </p>
            <Link
              href="https://github.com/mpopp75/db4free-net-l10n/graphs/contributors"
              className="bg-background border rounded-sm border-border hover:underline p-2 text-sm mt-2 inline-block"
            >
              View Contribution
            </Link>
        </article>
      </div>
    </section>
  );
}

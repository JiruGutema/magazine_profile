import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <div className="firstHeading-wrap">
        <h1 className="firstHeading">
          <i>Blog post not found</i>
        </h1>
      </div>
      <div className="siteSub">No such article exists in the catalogue</div>

      <p className="hatnote">
        Main article: <Link href="/blogs">Writings by Jiru Gutema</Link>.
      </p>

      <p>
        The blog post you are looking for does not exist, may have been moved,
        or has not yet been catalogued. You may wish to consult the full{" "}
        <Link href="/blogs">list of writings</Link> or return to the{" "}
        <Link href="/">main page</Link>.
      </p>

    </>
  );
}

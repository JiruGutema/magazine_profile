export default function Loading() {
  return (
    <>
      <div className="firstHeading-wrap">
        <h1 className="firstHeading">
          <span className="skeleton skeleton-line lg" style={{ width: "70%" }} />
        </h1>
      </div>
      <div className="siteSub">
        <span className="skeleton skeleton-line" style={{ width: 240 }} />
      </div>

      <div className="article-meta-strip" style={{ marginTop: 12 }}>
        <span className="skeleton skeleton-line" style={{ width: 120 }} />
        <span className="skeleton skeleton-line" style={{ width: 80 }} />
        <span className="skeleton skeleton-line" style={{ width: 100 }} />
      </div>

      <p>
        <span className="skeleton skeleton-line" style={{ width: "100%" }} />
        <span className="skeleton skeleton-line" style={{ width: "98%" }} />
        <span className="skeleton skeleton-line" style={{ width: "92%" }} />
        <span className="skeleton skeleton-line" style={{ width: "75%" }} />
      </p>

      <h2>
        <span className="skeleton skeleton-line md" style={{ width: "40%" }} />
      </h2>
      <p>
        <span className="skeleton skeleton-line" style={{ width: "100%" }} />
        <span className="skeleton skeleton-line" style={{ width: "96%" }} />
        <span className="skeleton skeleton-line" style={{ width: "88%" }} />
        <span className="skeleton skeleton-line" style={{ width: "60%" }} />
      </p>

      <div
        className="skeleton skeleton-block"
        style={{ height: 140, margin: "12px 0" }}
        aria-hidden
      />

      <p>
        <span className="skeleton skeleton-line" style={{ width: "100%" }} />
        <span className="skeleton skeleton-line" style={{ width: "94%" }} />
        <span className="skeleton skeleton-line" style={{ width: "80%" }} />
      </p>

      <h2>
        <span className="skeleton skeleton-line md" style={{ width: "30%" }} />
      </h2>
      <p>
        <span className="skeleton skeleton-line" style={{ width: "100%" }} />
        <span className="skeleton skeleton-line" style={{ width: "97%" }} />
        <span className="skeleton skeleton-line" style={{ width: "70%" }} />
      </p>
    </>
  );
}

export default function Loading() {
  return (
    <>
      <div className="firstHeading-wrap">
        <h1 className="firstHeading">
          <span className="skeleton skeleton-line lg" style={{ width: "55%" }} />
        </h1>
      </div>
      <div className="siteSub">
        <span className="skeleton skeleton-line" style={{ width: "30%" }} />
      </div>

      <p>
        <span className="skeleton skeleton-line" style={{ width: "100%" }} />
        <span className="skeleton skeleton-line" style={{ width: "90%" }} />
        <span className="skeleton skeleton-line" style={{ width: "60%" }} />
      </p>

      <table className="wikitable">
        <caption>
          <span className="skeleton skeleton-line" style={{ width: 200, display: "inline-block" }} />
        </caption>
        <thead>
          <tr>
            <th style={{ width: "26%" }}>Title</th>
            <th style={{ width: "12%" }}>Published</th>
            <th style={{ width: "10%" }}>Read time</th>
            <th>Excerpt</th>
            <th style={{ width: "16%" }}>Tags</th>
          </tr>
        </thead>
        <tbody>
          {[0, 1, 2, 3, 4].map((i) => (
            <tr key={i}>
              <td><span className="skeleton skeleton-line" style={{ width: "85%" }} /></td>
              <td><span className="skeleton skeleton-line" style={{ width: "80%" }} /></td>
              <td><span className="skeleton skeleton-line" style={{ width: "60%" }} /></td>
              <td>
                <span className="skeleton skeleton-line" style={{ width: "100%" }} />
                <span className="skeleton skeleton-line" style={{ width: "70%" }} />
              </td>
              <td><span className="skeleton skeleton-line" style={{ width: "75%" }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

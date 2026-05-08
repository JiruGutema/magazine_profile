export function VectorFooter() {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <footer className="vector-footer">
      <div className="vf-info">This page was last revised on {today} by Jiru Gutema.</div>
      <div className="vf-info">
        © {new Date().getFullYear()} Jiru Gutema · Written and maintained in Addis Ababa, Ethiopia ·
        Open to fullstack roles, contract work and interesting collaborations.
      </div>
      <ul>
        <li><a href="#top">Back to top ↑</a></li>
        <li><a href="mailto:jirudagutema@gmail.com">Email</a></li>
        <li><a className="external" href="https://github.com/JiruGutema">GitHub</a></li>
        <li><a className="external" href="https://www.linkedin.com/in/jiru-gutema">LinkedIn</a></li>
        <li><a className="external" href="https://www.x.com/jirugutema">X / Twitter</a></li>
        <li><a href="/resume.pdf">Download résumé</a></li>
      </ul>
    </footer>
  );
}

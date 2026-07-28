// const COLS = 53;
// const ROWS = 7;
//
// function buildCells() {
//   let s = 1234;
//   const rand = () => {
//     s = (s * 1664525 + 1013904223) % 0x100000000;
//     return s / 0x100000000;
//   };
//   const out: string[] = [];
//   for (let c = 0; c < COLS; c++) {
//     const ramp = 0.25 + (c / COLS) * 0.65;
//     for (let r = 0; r < ROWS; r++) {
//       const weekend = r === 0 || r === 6;
//       const v = rand() * ramp - (weekend ? 0.18 : 0);
//       let cls = "";
//       if (v > 0.55) cls = "l4";
//       else if (v > 0.42) cls = "l3";
//       else if (v > 0.28) cls = "l2";
//       else if (v > 0.14) cls = "l1";
//       out.push(cls);
//     }
//   }
//   return out;
// }

export function ContributionGraph() {
  return (
    <div className="thumb">
      <div className="ct-grid" style={{ margin: 4 }}>
        <img
          src="https://ghchart.rshah.org/jirugutema"
          alt="2016rshah's Github chart"
        />
      </div>
      <div className="caption">
        Public commit activity to{" "}
        <a href="https://github.com/JiruGutema">GitHub</a> over the preceding
        twelve months (illustrative).
      </div>
    </div>
  );
}

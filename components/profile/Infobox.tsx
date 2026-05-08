import Image from "next/image";

export function Infobox() {
  return (
    <table className="infobox">
      <tbody>
        <tr><th className="ib-title" colSpan={2}>Jiru Gutema</th></tr>
        <tr>
          <td className="ib-photo" colSpan={2}>
            <div className="ph">
              <Image
                src="/images/profile.png"
                alt="Jiru Gutema"
                width={200}
                height={250}
                priority
              />
            </div>
            <div className="cap">Gutema in Addis Ababa, {new Date().getFullYear()}</div>
          </td>
        </tr>
        <tr><td className="ib-section" colSpan={2}>Personal details</td></tr>
        <tr className="ib-row"><th>Born</th><td>Jiru Gutema<br />Addis Ababa, Ethiopia</td></tr>
        <tr className="ib-row"><th>Residence</th><td>Addis Ababa, Ethiopia</td></tr>
        <tr className="ib-row"><th>Nationality</th><td>Ethiopian</td></tr>
        <tr className="ib-row"><th>Education</th><td>Addis Ababa University (BSc Software Engineering, 2023–2027)</td></tr>
        <tr className="ib-row"><th>Occupation</th><td>Software engineer · Fullstack developer</td></tr>
        <tr className="ib-row">
          <th>Employer(s)</th>
          <td>
            Addis Ababa University<br />
            Mereb Technologies
          </td>
        </tr>
        <tr className="ib-row">
          <th>Known for</th>
          <td>
            <i>Hide YouTube Shorts</i>, <i>Page Marker</i>, <i>Email Craft</i>, contributions to Bahmni / OpenMRS
          </td>
        </tr>
        <tr className="ib-row"><th>Languages</th><td>Afaan Oromoo (native), Amharic, English</td></tr>

        <tr><td className="ib-section" colSpan={2}>Online presence</td></tr>
        <tr className="ib-row"><th>GitHub</th><td className="ib-website"><a className="external" href="https://github.com/JiruGutema">github.com/JiruGutema</a></td></tr>
        <tr className="ib-row"><th>LinkedIn</th><td className="ib-website"><a className="external" href="https://www.linkedin.com/in/jiru-gutema">linkedin.com/in/jiru-gutema</a></td></tr>
        <tr className="ib-row"><th>X / Twitter</th><td className="ib-website"><a className="external" href="https://www.x.com/jirugutema">x.com/jirugutema</a></td></tr>
        <tr className="ib-row"><th>LeetCode</th><td className="ib-website"><a className="external" href="https://www.leetcode.com/jiru_gutema">leetcode.com/jiru_gutema</a></td></tr>
        <tr className="ib-row"><th>Email</th><td className="ib-website"><a href="mailto:jirudagutema@gmail.com">jirudagutema@gmail.com</a></td></tr>
      </tbody>
    </table>
  );
}

import Image from "next/image";
import { Html } from "@/components/common/Html";
import type { InfoboxContent } from "@/lib/content-types";

export function Infobox({ data }: { data: InfoboxContent }) {
  return (
    <table className="infobox">
      <tbody>
        <tr>
          <th className="ib-title" colSpan={2}>
            {data.title}
          </th>
        </tr>
        <tr>
          <td className="ib-photo" colSpan={2}>
            <div className="ph">
              <Image
                src={data.image}
                alt={data.title}
                width={200}
                height={200}
                priority
              />
            </div>
            <div className="cap">{data.imageCaption}</div>
          </td>
        </tr>

        {data.sections.map((section) => (
          <SectionRows key={section.heading} section={section} />
        ))}
      </tbody>
    </table>
  );
}

function SectionRows({
  section,
}: {
  section: InfoboxContent["sections"][number];
}) {
  return (
    <>
      <tr>
        <td className="ib-section" colSpan={2}>
          {section.heading}
        </td>
      </tr>
      {section.rows.map((row) => (
        <tr className="ib-row" key={row.label}>
          <th>{row.label}</th>
          <Html
            as="td"
            html={row.value}
            className={section.website ? "ib-website" : undefined}
          />
        </tr>
      ))}
    </>
  );
}

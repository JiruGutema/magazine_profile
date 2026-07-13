import { Html } from "@/components/common/Html";
import type { FooterContent } from "@/lib/content-types";

export function VectorFooter({ data }: { data: FooterContent }) {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <footer className="vector-footer">
      <div className="vf-info">
        This page was last revised on {today} by Jiru Gutema.
      </div>
      <div className="vf-info">
        © {new Date().getFullYear()} Jiru Gutema · <Html as="span" html={data.tagline} />
      </div>
      <ul>
        {data.links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className={link.external ? "external" : undefined}
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://jiru.is-a.dev";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/projects", "/blogs"],
        disallow: ["/admin/", "/api/", "/blogs/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

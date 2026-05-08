import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { WikiShell } from "@/components/layout/Wiki-Shell";

export const metadata: Metadata = {
  title: "Jiru Gutema | Software Engineer & Fullstack Developer Portfolio",
  icons: { icon: "/icon.png" },
  description:
    "The official online portfolio of Jiru Gutema, a software engineer and fullstack developer student showcasing projects, skills, and experience.",
  keywords: [
    "Jiru Gutema",
    "Software Engineer",
    "Fullstack Developer",
    "Portfolio",
    "Next.js",
    "React",
    "Node.js",
    "Flutter",
    "Addis Ababa",
  ],
  authors: [{ name: "Jiru Gutema" }],
  openGraph: {
    title: "Jiru Gutema",
    description:
      "The official online portfolio of Jiru Gutema, a software engineer and fullstack developer student showcasing projects, skills, and experience.",
    url: "https://jirugutema.vercel.app",
    siteName: "Jiru Gutema's Portfolio",
    images: [
      {
        url: "/images/profile.jpg",
        width: 1200,
        height: 630,
        alt: "Jiru Gutema's Software Engineering Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jiru Gutema",
    description:
      "The official online portfolio of Jiru Gutema, a software engineer and fullstack developer student showcasing projects, skills, and experience.",
    creator: "@jirugutema",
    images: ["/images/profile.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="22Myp3cGeJIavTM3UD5CbQFQm32ClaDhSl1_HPJzMxA"
        />
      </head>
      <body style={{ scrollBehavior: "smooth" }}>
        <WikiShell>{children}</WikiShell>
      </body>
    </html>
  );
}

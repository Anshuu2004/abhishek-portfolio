/**
 * Single source of truth for site-wide metadata. Imported by layout, sitemap,
 * robots, and individual pages so changing the canonical URL or default
 * description is a one-file edit.
 */
export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://abhishek.dev",
  name: "Abhishek Choudhary",
  shortName: "abhishek.dev",
  tagline: "AI-native full-stack engineer",
  description:
    "Full-stack engineer building AI products on real production foundations. Multi-tenant SaaS, RAG pipelines, edge ML at 30 FPS on a CPU.",
  email: "abhishekcse2004@gmail.com",
  github: "https://github.com/Anshuu2004",
  linkedin: "https://linkedin.com/in/abhishekcse2004",
  /** Served from /public — direct download, no external dependency. */
  resume: "/Abhishek_Choudhary_Resume.pdf",
  location: {
    city: "Bhopal",
    region: "Madhya Pradesh",
    country: "India",
  },
} as const;

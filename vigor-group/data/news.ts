/**
 * News & press content source.
 *
 * This is a plain typed array so a non-developer can add a post by appending
 * one object — no design changes, no redeploy of components. Swap this for a
 * CMS/markdown loader later without touching /app/news/page.tsx: keep the
 * `NewsPost` shape and the `getNews()` contract.
 *
 * NOTE: entries below are SAMPLE/PLACEHOLDER content to demonstrate the layout.
 */

export interface NewsPost {
  slug: string;
  title: string;
  date: string; // ISO date
  category: "Announcement" | "Press" | "Milestone";
  excerpt: string;
  body: string[]; // paragraphs
}

export const news: NewsPost[] = [
  {
    slug: "vigor-group-unified-platform",
    title: "Vigor Group launches a unified digital platform",
    date: "2026-06-18",
    category: "Announcement",
    excerpt:
      "The group's 16 companies come together under one identity and one website for the first time.",
    body: [
      "Vigor Group of Companies has brought all of its subsidiaries under a single unified digital platform, replacing a fragmented set of independent websites.",
      "The new platform gives every company a branded home within one shared system, making it easier for partners, customers and job-seekers to discover the full breadth of the group.",
      "This is placeholder announcement copy to demonstrate the News layout.",
    ],
  },
  {
    slug: "renewable-energy-comoros",
    title: "Renewable energy plant supplies the Comoros national grid",
    date: "2026-05-02",
    category: "Milestone",
    excerpt:
      "The group's hybrid solar PV-battery storage plant in Anjouan supplies power to SONELEC.",
    body: [
      "The group's Renewable Energy Division operates a hybrid solar PV and battery energy storage plant in Anjouan, in the Union of Comoros.",
      "The facility supplies power to SONELEC, the national electricity company, extending the group's footprint into clean grid-scale energy.",
      "This is placeholder milestone copy to demonstrate the News layout.",
    ],
  },
  {
    slug: "hospitality-growth",
    title: "Hospitality division expands with international brands",
    date: "2026-03-11",
    category: "Press",
    excerpt:
      "Golden Tulip franchise properties in Zanzibar and Dar es Salaam anchor the group's hospitality growth.",
    body: [
      "The group's hospitality division operates Golden Tulip franchise properties in both Zanzibar and Dar es Salaam, alongside boutique villa stays on the coast.",
      "This is placeholder press copy to demonstrate the News layout.",
    ],
  },
];

export function getNews(): NewsPost[] {
  return [...news].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): NewsPost | undefined {
  return news.find((p) => p.slug === slug);
}

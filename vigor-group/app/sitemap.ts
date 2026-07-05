import type { MetadataRoute } from "next";
import { companies } from "@/data/companies";
import { news } from "@/data/news";
import { baseUrl } from "@/lib/seo";

/** Generated from the companies + news data plus static routes. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/companies",
    "/services",
    "/news",
    "/careers",
    "/contact",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const companyRoutes = companies.map((c) => ({
    url: `${baseUrl}/companies/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const newsRoutes = news.map((p) => ({
    url: `${baseUrl}/news/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...companyRoutes, ...newsRoutes];
}

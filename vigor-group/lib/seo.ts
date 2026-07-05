import type { Metadata } from "next";
import { group } from "@/data/site";

const baseUrl = group.url;

/**
 * Build per-page metadata with real title, description and OpenGraph tags.
 * Every route uses this so content is server-rendered and indexable — the
 * core problem this platform exists to fix.
 */
export function pageMeta({
  title,
  description,
  path = "/",
  images,
}: {
  title: string;
  description: string;
  path?: string;
  images?: string[];
}): Metadata {
  const url = `${baseUrl}${path}`;
  const ogImages = images ?? ["/og-default.svg"];
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: group.tradingName,
      type: "website",
      locale: "en_GB",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages,
    },
  };
}

export { baseUrl };

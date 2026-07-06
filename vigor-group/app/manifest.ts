import type { MetadataRoute } from "next";
import { group } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: group.tradingName,
    short_name: "Vigor Group",
    description: group.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#fdfbf7",
    theme_color: "#112d34",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}

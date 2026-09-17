import type { MetadataRoute } from "next";
import { getSiteUrl, LOGO_PATH, SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  const siteUrl = getSiteUrl();

  return {
    name: SITE_NAME,
    short_name: "ASM Foundation",
    description:
      "Education aid for needy students in Pakistan. Approved support is paid directly to schools.",
    start_url: "/en",
    display: "standalone",
    background_color: "#f7f8f6",
    theme_color: "#144a32",
    lang: "en",
    dir: "ltr",
    categories: ["education", "nonprofits"],
    icons: [
      {
        src: `${siteUrl}/icon-32.png`,
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: `${siteUrl}${LOGO_PATH}`,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${siteUrl}/apple-icon.png`,
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}

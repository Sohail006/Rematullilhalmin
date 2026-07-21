import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://alsiratulmustaqeem.org.pk";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/apply", "/donate", "/contact", "/status"];
  const locales = ["en", "ur"];

  return locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${siteUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: page === "" ? "weekly" : "monthly",
      priority: page === "" ? 1 : page === "/apply" ? 0.9 : 0.7,
    })),
  );
}

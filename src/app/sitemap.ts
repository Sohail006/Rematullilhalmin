import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

const pages = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/apply", priority: 0.95, changeFrequency: "weekly" as const },
  { path: "/donate", priority: 0.95, changeFrequency: "weekly" as const },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/status", priority: 0.7, changeFrequency: "monthly" as const },
];

const locales = ["en", "ur"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  return locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${siteUrl}/${locale}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: {
          en: `${siteUrl}/en${page.path}`,
          ur: `${siteUrl}/ur${page.path}`,
          "x-default": `${siteUrl}/en${page.path}`,
        },
      },
    })),
  );
}

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import {
  getSiteUrl,
  LOGO_PATH,
  OG_IMAGE_PATH,
  SITE_NAME,
} from "@/lib/site";

export type PublicPage =
  | "home"
  | "about"
  | "apply"
  | "donate"
  | "contact"
  | "status";

const pagePaths: Record<PublicPage, string> = {
  home: "",
  about: "/about",
  apply: "/apply",
  donate: "/donate",
  contact: "/contact",
  status: "/status",
};

export async function getPageMetadata(
  locale: Locale,
  page: PublicPage,
): Promise<Metadata> {
  const siteUrl = getSiteUrl();
  const brand = await getTranslations({ locale, namespace: "brand" });
  const seo = await getTranslations({ locale, namespace: "seo" });
  const path = pagePaths[page];
  const url = `${siteUrl}/${locale}${path}`;

  const title =
    page === "home" ? brand("name") : seo(`${page}Title` as "aboutTitle");
  const description = seo(`${page}Description` as "homeDescription");
  const keywords = seo("keywords")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const ogImage = `${siteUrl}${OG_IMAGE_PATH}`;
  const logoImage = `${siteUrl}${LOGO_PATH}`;

  return {
    title:
      page === "home"
        ? { absolute: `${brand("name")} | ${brand("motto")}` }
        : title,
    description,
    keywords,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: siteUrl }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "Education",
    alternates: {
      canonical: url,
      languages: {
        en: `${siteUrl}/en${path}`,
        ur: `${siteUrl}/ur${path}`,
        "x-default": `${siteUrl}/en${path}`,
      },
    },
    openGraph: {
      title: page === "home" ? brand("name") : title,
      description,
      url,
      siteName: brand("name"),
      locale: locale === "ur" ? "ur_PK" : "en_PK",
      alternateLocale: locale === "ur" ? ["en_PK"] : ["ur_PK"],
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: brand("name"),
        },
        {
          url: logoImage,
          width: 512,
          height: 512,
          alt: brand("name"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page === "home" ? brand("name") : title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

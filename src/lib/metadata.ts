import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://alsiratulmustaqeem.org.pk";

const ogImage = `${siteUrl}/logo.png`;

export async function getPageMetadata(
  locale: Locale,
  page: "home" | "about" | "apply" | "donate" | "contact" | "status",
): Promise<Metadata> {
  const brand = await getTranslations({ locale, namespace: "brand" });
  const titles: Record<typeof page, string> = {
    home: brand("name"),
    about: await getTranslations({ locale, namespace: "about" }).then((t) =>
      t("title"),
    ),
    apply: await getTranslations({ locale, namespace: "apply" }).then((t) =>
      t("title"),
    ),
    donate: await getTranslations({ locale, namespace: "donate" }).then((t) =>
      t("title"),
    ),
    contact: await getTranslations({ locale, namespace: "contact" }).then((t) =>
      t("title"),
    ),
    status: await getTranslations({ locale, namespace: "status" }).then((t) =>
      t("title"),
    ),
  };

  const title = titles[page];
  const description =
    page === "home"
      ? await getTranslations({ locale, namespace: "home" }).then((t) =>
          t("subhead"),
        )
      : title;

  const path = page === "home" ? "" : `/${page}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}${path}`,
      languages: {
        en: `${siteUrl}/en${path}`,
        ur: `${siteUrl}/ur${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}${path}`,
      siteName: brand("name"),
      locale: locale === "ur" ? "ur_PK" : "en_PK",
      type: "website",
      images: [{ url: ogImage, width: 512, height: 512, alt: brand("name") }],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [ogImage],
    },
  };
}

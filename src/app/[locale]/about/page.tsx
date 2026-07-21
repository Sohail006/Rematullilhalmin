import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { getPageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata(locale as Locale, "about");
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("about");

  return (
    <div className="container-site py-14 max-w-3xl">
      <h1 className="font-display text-3xl font-semibold text-brand-green">
        {t("title")}
      </h1>
      <div className="mt-8 space-y-5 text-brand-muted leading-relaxed text-lg">
        <p>{t("p1")}</p>
        <p>{t("p2")}</p>
        <p className="text-brand-green font-medium">{t("p3")}</p>
      </div>
    </div>
  );
}

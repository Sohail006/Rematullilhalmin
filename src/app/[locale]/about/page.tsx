import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { getPageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/site/PageHero";

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
    <PageHero title={t("title")} intro={t("intro")}>
      <div className="space-y-5 text-brand-muted leading-relaxed text-lg rounded-2xl bg-white/80 p-6 sm:p-8 ring-1 ring-brand-green/10">
        <p>{t("p1")}</p>
        <p>{t("p2")}</p>
        <p className="text-brand-green font-medium">{t("p3")}</p>
      </div>
    </PageHero>
  );
}

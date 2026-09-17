import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { ApplyForm } from "@/components/site/ApplyForm";
import { getPageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/site/PageHero";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata(locale as Locale, "apply");
}

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("apply");

  return (
    <PageHero title={t("title")} intro={t("intro")} wide>
      <div className="surface-card p-5 sm:p-8">
        <ApplyForm />
      </div>
    </PageHero>
  );
}

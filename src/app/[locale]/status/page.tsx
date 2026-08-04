import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { StatusLookupForm } from "@/components/site/StatusLookupForm";
import { getPageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/site/PageHero";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata(locale as Locale, "status");
}

export default async function StatusPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("status");

  return (
    <PageHero title={t("title")} intro={t("intro")}>
      <div className="rounded-2xl bg-white/90 p-5 sm:p-8 ring-1 ring-brand-green/10 shadow-sm">
        <StatusLookupForm />
      </div>
    </PageHero>
  );
}

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { StatusLookupForm } from "@/components/site/StatusLookupForm";
import { getPageMetadata } from "@/lib/metadata";

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
    <div className="container-site py-14 max-w-3xl">
      <h1 className="font-display text-3xl font-semibold text-brand-green">
        {t("title")}
      </h1>
      <p className="mt-3 text-brand-muted mb-10">{t("intro")}</p>
      <StatusLookupForm />
    </div>
  );
}

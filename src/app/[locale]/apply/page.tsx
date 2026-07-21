import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { ApplyForm } from "@/components/site/ApplyForm";
import { getPageMetadata } from "@/lib/metadata";

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
    <div className="container-site py-14 max-w-3xl">
      <h1 className="font-display text-3xl font-semibold text-brand-green">
        {t("title")}
      </h1>
      <p className="mt-3 text-brand-muted mb-10">{t("intro")}</p>
      <ApplyForm />
    </div>
  );
}

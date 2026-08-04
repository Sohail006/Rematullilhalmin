import Link from "next/link";
import type { Metadata } from "next";
import {
  Building2,
  FileText,
  HandHeart,
  School,
  ShieldCheck,
} from "lucide-react";
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

  const pillars = [
    { icon: School, title: t("pillar1Title"), text: t("pillar1Text") },
    { icon: ShieldCheck, title: t("pillar2Title"), text: t("pillar2Text") },
    { icon: Building2, title: t("pillar3Title"), text: t("pillar3Text") },
  ];

  return (
    <PageHero title={t("title")} intro={t("intro")}>
      <div className="space-y-10">
        <div className="space-y-5 text-brand-muted leading-relaxed text-lg rounded-2xl bg-white/80 p-6 sm:p-8 ring-1 ring-brand-green/10">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
          <p className="text-brand-green font-medium">{t("p3")}</p>
        </div>

        <div>
          <h2 className="section-title text-2xl mb-6">{t("pillarsTitle")}</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {pillars.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="rounded-2xl bg-white p-6 ring-1 ring-brand-green/10"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-green-soft text-brand-green">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-brand-green text-lg">{title}</h3>
                <p className="mt-2 text-sm text-brand-muted leading-relaxed">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href={`/${locale}/apply`} className="btn-primary">
            <FileText className="h-4 w-4" />
            {t("applyCta")}
          </Link>
          <Link href={`/${locale}/donate`} className="btn-outline">
            <HandHeart className="h-4 w-4" />
            {t("donateCta")}
          </Link>
        </div>
      </div>
    </PageHero>
  );
}

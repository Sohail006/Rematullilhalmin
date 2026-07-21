import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { getPageMetadata } from "@/lib/metadata";
import { FoundationLogo } from "@/components/site/FoundationLogo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata(locale as Locale, "home");
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("home");
  const brand = await getTranslations("brand");

  return (
    <>
      <section className="relative overflow-hidden bg-brand-cream">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #c09e5840, transparent 40%), radial-gradient(circle at 80% 0%, #15503322, transparent 35%), linear-gradient(160deg, #f7f5f0 0%, #e8f2ec 55%, #f7f5f0 100%)",
          }}
        />
        <div className="container-site relative grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:py-24">
          <div className="order-2 lg:order-1 space-y-5 sm:space-y-6">
            <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-brand-green leading-tight">
              {brand("name")}
            </p>
            <h1 className="text-xl sm:text-2xl text-brand-ink font-medium leading-snug max-w-xl">
              {t("headline")}
            </h1>
            <p className="text-brand-muted max-w-xl leading-relaxed">
              {t("subhead")}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href={`/${locale}/apply`} className="btn-gold">
                {t("applyCta")}
              </Link>
              <Link href={`/${locale}/donate`} className="btn-outline">
                {t("donateCta")}
              </Link>
            </div>
          </div>
          <div className="order-1 lg:order-2 flex justify-center px-2 animate-[fadeUp_0.8s_ease]">
            <FoundationLogo
              alt={brand("name")}
              size="hero"
              priority
              framed
            />
          </div>
        </div>
      </section>

      <section className="container-site py-16">
        <h2 className="font-display text-2xl text-brand-green font-semibold mb-8">
          {t("howTitle")}
        </h2>
        <ol className="grid gap-6 md:grid-cols-3">
          {[t("step1"), t("step2"), t("step3")].map((step, index) => (
            <li key={step} className="relative pl-4 border-s-2 border-brand-gold">
              <span className="text-brand-gold font-display text-3xl font-semibold">
                {index + 1}
              </span>
              <p className="mt-2 text-brand-muted leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-site py-10 border-t border-brand-green/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-brand-muted">{t("statusHint")}</p>
          <Link href={`/${locale}/status`} className="btn-outline">
            {t("statusCta")}
          </Link>
        </div>
      </section>

      <section className="bg-brand-green text-white">
        <div className="container-site py-14 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="font-display text-2xl font-semibold">
              {t("inclusiveTitle")}
            </h2>
            <p className="mt-3 text-white/85 max-w-2xl">{t("inclusiveText")}</p>
          </div>
          <Link href={`/${locale}/apply`} className="btn-gold w-fit">
            {t("applyCta")}
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

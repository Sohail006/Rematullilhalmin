import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  BookOpen,
  Building2,
  FileText,
  Flag,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  Plane,
  ShieldCheck,
  Users,
} from "lucide-react";
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

  const pills = [
    { icon: Users, label: t("pill1") },
    { icon: BookOpen, label: t("pill2") },
    { icon: HandHeart, label: t("pill3") },
    { icon: Flag, label: t("pill4") },
  ];

  const missions = [
    { icon: GraduationCap, title: t("mission1Title"), text: t("mission1Text") },
    { icon: ShieldCheck, title: t("mission2Title"), text: t("mission2Text") },
    { icon: HeartHandshake, title: t("mission3Title"), text: t("mission3Text") },
    { icon: Flag, title: t("mission4Title"), text: t("mission4Text") },
  ];

  return (
    <div className="page-shell">
      <section className="container-site relative py-10 sm:py-14 lg:py-18">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
          <div className="order-2 lg:order-1 space-y-6 animate-fade-up">
            <div className="relative inline-block">
              <p
                className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold text-brand-green leading-tight"
                dir="rtl"
              >
                <span className="text-brand-gold">{t("urduDisplay").slice(0, 8)}</span>
                {t("urduDisplay").slice(8)}
              </p>
              <GraduationCap className="absolute -top-2 start-0 h-6 w-6 text-brand-green/70" />
              <Plane className="absolute -end-2 top-1 h-5 w-5 text-brand-green rotate-12 animate-float" />
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-[2rem] font-semibold text-brand-green leading-snug max-w-xl">
              {t("headline")}{" "}
              <span className="text-brand-green-deep">{t("headlineAccent")}</span>
            </h1>

            <p className="text-brand-muted max-w-xl leading-relaxed text-[1.02rem]">
              {t("subhead")}
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
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

          <div className="order-1 lg:order-2 flex justify-center animate-fade-up">
            <div className="relative w-full max-w-[460px]">
              <div className="hero-orb mx-auto">
                <Image
                  src="/images/hero-student.jpg"
                  alt={brand("name")}
                  width={920}
                  height={920}
                  priority
                  className="object-cover"
                />
              </div>

              <div className="absolute -top-2 -end-1 sm:top-2 sm:end-0 w-24 sm:w-32 animate-float">
                <FoundationLogo alt={brand("name")} size="auth" priority />
              </div>

              <div className="absolute inset-x-2 -bottom-4 sm:inset-x-4 sm:-bottom-5 rounded-2xl bg-brand-green text-white shadow-xl px-3 py-3 sm:px-4 sm:py-3.5">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-2">
                  {pills.map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center text-center gap-1.5"
                    >
                      <Icon className="h-4 w-4 text-brand-gold-soft" />
                      <span className="text-[10px] sm:text-[11px] leading-tight text-white/95">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-site pt-16 sm:pt-20 pb-10">
        <h2 className="section-title text-center text-2xl sm:text-3xl">
          {t("missionTitle")}{" "}
          <span className="relative inline-block">
            {t("missionTitleAccent")}
            <span className="absolute inset-x-0 -bottom-1 h-1 rounded-full bg-brand-gold/80" />
          </span>
        </h2>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {missions.map(({ icon: Icon, title, text }) => (
            <article key={title} className="text-center px-2">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-brand-green/10">
                <Icon className="h-7 w-7 text-brand-green" />
              </div>
              <h3 className="font-semibold text-brand-green text-lg">{title}</h3>
              <p className="mt-2 text-sm text-brand-muted leading-relaxed">{text}</p>
            </article>
          ))}
        </div>

        <p className="mt-12 text-center font-display text-xl sm:text-2xl text-brand-green">
          <span className="text-brand-gold text-3xl align-top me-1">“</span>
          {t("quote")}
          <span className="text-brand-gold text-3xl align-top ms-1">”</span>
        </p>
      </section>

      <section className="container-site py-12">
        <div className="rounded-2xl bg-white/80 border border-brand-green/10 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="h-5 w-5 text-brand-gold" />
            <h2 className="section-title text-2xl">{t("howTitle")}</h2>
          </div>
          <ol className="grid gap-5 md:grid-cols-3">
            {[t("step1"), t("step2"), t("step3")].map((step, index) => (
              <li key={step} className="border-s-2 border-brand-gold ps-4">
                <span className="font-display text-3xl text-brand-gold font-semibold">
                  {index + 1}
                </span>
                <p className="mt-2 text-brand-muted leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-site pb-16">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-brand-green-soft px-6 py-5">
          <p className="text-brand-green font-medium">{t("statusHint")}</p>
          <Link href={`/${locale}/status`} className="btn-outline py-2.5">
            {t("statusCta")}
          </Link>
        </div>
      </section>
    </div>
  );
}

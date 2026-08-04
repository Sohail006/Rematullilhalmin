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
      <section className="container-site relative py-8 sm:py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
          <div className="order-2 lg:order-1 space-y-5 sm:space-y-6">
            <p
              className="font-urdu-hero text-[2.15rem] sm:text-5xl lg:text-[3.35rem] font-semibold text-brand-green leading-[1.45]"
              dir="rtl"
              lang="ur"
            >
              <span className="text-brand-gold">{t("urduAccent")}</span>{" "}
              {t("urduRest")}
            </p>

            <h1 className="text-[1.65rem] sm:text-3xl lg:text-[2.05rem] font-semibold text-brand-green leading-snug max-w-xl tracking-tight">
              {t("headline")}{" "}
              <span className="text-brand-green-deep">{t("headlineAccent")}</span>
            </h1>

            <p className="text-brand-muted max-w-xl leading-relaxed text-base sm:text-[1.05rem]">
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

          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative w-full max-w-[420px] pb-2">
              <div className="hero-orb mx-auto">
                <Image
                  src="/images/hero-student.jpg"
                  alt={brand("name")}
                  width={920}
                  height={920}
                  priority
                  quality={95}
                  className="object-cover object-[center_20%]"
                />
              </div>

              <div className="hero-logo-badge absolute -top-1 end-0 sm:top-1 sm:end-1">
                <FoundationLogo alt={brand("name")} size="badge" priority />
              </div>

              <div className="hero-value-bar mt-5 sm:mt-6">
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 sm:grid-cols-4 sm:gap-2">
                  {pills.map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center text-center gap-1.5 px-1"
                    >
                      <Icon className="h-4 w-4 text-brand-gold-soft shrink-0" />
                      <span className="text-[10px] sm:text-[11px] leading-snug text-white/95">
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

      <section className="container-site pt-14 sm:pt-18 pb-10">
        <h2 className="section-title text-center text-2xl sm:text-3xl">
          {t("missionTitle")}{" "}
          <span className="relative inline-block">
            {t("missionTitleAccent")}
            <span className="absolute inset-x-0 -bottom-1 h-1 rounded-full bg-brand-gold/80" />
          </span>
        </h2>

        <div className="mt-10 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {missions.map(({ icon: Icon, title, text }) => (
            <article key={title} className="text-center px-2">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-brand-green/10">
                <Icon className="h-7 w-7 text-brand-green" />
              </div>
              <h3 className="font-semibold text-brand-green text-lg">{title}</h3>
              <p className="mt-2 text-sm text-brand-muted leading-relaxed">
                {text}
              </p>
            </article>
          ))}
        </div>

        <blockquote className="mt-14 mx-auto max-w-2xl text-center">
          <p className="font-display text-xl sm:text-2xl text-brand-green leading-relaxed">
            <span className="text-brand-gold text-3xl align-top me-1" aria-hidden>
              “
            </span>
            {t("quote")}
            <span className="text-brand-gold text-3xl align-top ms-1" aria-hidden>
              ”
            </span>
          </p>
        </blockquote>
      </section>

      <section className="container-site py-12">
        <div className="rounded-2xl bg-white/85 border border-brand-green/10 p-6 sm:p-8">
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

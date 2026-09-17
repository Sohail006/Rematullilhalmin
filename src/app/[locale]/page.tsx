import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Accessibility,
  Baby,
  BookOpen,
  FileText,
  GraduationCap,
  HandHeart,
  Heart,
  HeartHandshake,
  Shirt,
  ShieldCheck,
  Users,
  UsersRound,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { getPageMetadata } from "@/lib/metadata";

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

  const focus = [
    { icon: Baby, label: t("focus1") },
    { icon: UsersRound, label: t("focus2") },
    { icon: GraduationCap, label: t("focus3") },
    { icon: Accessibility, label: t("focus4") },
  ];

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label"), icon: Users },
    { value: t("stat2Value"), label: t("stat2Label"), icon: GraduationCap },
    { value: t("stat3Value"), label: t("stat3Label"), icon: BookOpen },
    { value: t("stat4Value"), label: t("stat4Label"), icon: HeartHandshake },
  ];

  const works = [
    {
      icon: GraduationCap,
      title: t("do1Title"),
      text: t("do1Text"),
      tone: "bg-[#e8f4ee]",
    },
    {
      icon: Shirt,
      title: t("do2Title"),
      text: t("do2Text"),
      tone: "bg-[#f8f0d8]",
    },
    {
      icon: BookOpen,
      title: t("do3Title"),
      text: t("do3Text"),
      tone: "bg-[#eaf3e4]",
    },
    {
      icon: HandHeart,
      title: t("do4Title"),
      text: t("do4Text"),
      tone: "bg-[#f8ebe3]",
    },
  ];

  const gallery = [
    "/images/gallery-1.jpg",
    "/images/gallery-2.jpg",
    "/images/gallery-3.jpg",
    "/images/gallery-4.jpg",
    "/images/gallery-5.jpg",
  ];

  const updates = [
    { title: t("update1Date"), text: t("update1Text"), img: "/images/gallery-2.jpg" },
    { title: t("update2Date"), text: t("update2Text"), img: "/images/gallery-3.jpg" },
    { title: t("update3Date"), text: t("update3Text"), img: "/images/gallery-4.jpg" },
  ];

  return (
    <div>
      {/* Hero — full-bleed */}
      <section className="relative min-h-[78vh] sm:min-h-[86vh] flex items-center overflow-hidden">
        <Image
          src="/images/hero-children.jpg"
          alt={t("heroTitle")}
          fill
          priority
          quality={95}
          className="object-cover object-[center_30%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/25 rtl:bg-gradient-to-l" />

        <div className="container-site relative z-10 py-16 sm:py-20 w-full">
          <div className="max-w-2xl text-white">
            <p className="text-sm sm:text-base tracking-[0.18em] uppercase text-white/85 mb-3">
              {t("welcome")}
            </p>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-[3.35rem] font-semibold leading-[1.12] uppercase tracking-tight">
              {t("heroTitle")}
            </h1>
            <p className="mt-5 text-white/90 text-base sm:text-lg leading-relaxed max-w-xl">
              {t("heroText")}
            </p>
            <p
              className={`${locale === "ur" ? "font-urdu-hero" : "font-script"} text-brand-yellow text-2xl sm:text-3xl mt-5 leading-snug`}
            >
              {t("heroScript")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/${locale}/donate`} className="btn-donate">
                <Heart className="h-4 w-4 fill-current" />
                {t("donateCta")}
              </Link>
              <Link href={`/${locale}/apply`} className="btn-hero-outline">
                <FileText className="h-4 w-4" />
                {t("applyCta")}
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute end-4 bottom-8 sm:end-10 sm:bottom-12 z-10 hidden sm:block">
          <div className="hero-seal">
            <p className="text-center text-white font-semibold text-sm leading-snug px-3">
              {t("badge")}
            </p>
          </div>
        </div>
      </section>

      {/* Who / Focus / Vision */}
      <section className="container-site py-14 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
          <article>
            <h2 className="section-title text-2xl sm:text-3xl">{t("whoTitle")}</h2>
            <p className="mt-4 text-brand-muted leading-relaxed">{t("whoText")}</p>
            <Link href={`/${locale}/about`} className="btn-primary mt-6">
              {t("whoCta")}
              <span aria-hidden className="ms-1 inline-block rtl:-scale-x-100">
                →
              </span>
            </Link>
          </article>

          <article>
            <h2 className="section-title text-2xl sm:text-3xl">{t("focusTitle")}</h2>
            <ul className="mt-5 space-y-4">
              {focus.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-green text-white shrink-0">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-medium text-brand-ink">{label}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl bg-brand-green-soft p-6 sm:p-7 ring-1 ring-brand-green/10">
            <h2 className="section-title text-2xl">{t("visionTitle")}</h2>
            <p className="mt-4 font-display text-lg text-brand-green leading-relaxed">
              <span aria-hidden>“</span>
              {t("visionText")}
              <span aria-hidden>”</span>
            </p>
          </article>
        </div>
      </section>

      {/* Impact stats */}
      <section id="impact" className="bg-brand-green text-white scroll-mt-28">
        <div className="container-site py-10 sm:py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center px-2">
                <Icon className="mx-auto h-7 w-7 text-brand-yellow mb-3" />
                <p className="font-display text-2xl sm:text-3xl font-semibold">
                  {value}
                </p>
                <p className="mt-1 text-sm text-white/85">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we do */}
      <section id="what-we-do" className="container-site py-14 sm:py-16 scroll-mt-28">
        <h2 className="section-title text-center text-2xl sm:text-3xl">
          {t("doTitle")}
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {works.map(({ icon: Icon, title, text, tone }) => (
            <article
              key={title}
              className={`rounded-2xl ${tone} p-6 text-center shadow-sm`}
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand-green shadow-sm">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-brand-green text-lg">{title}</h3>
              <p className="mt-2 text-sm text-brand-muted leading-relaxed">
                {text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-[#f3f6f4] py-14 sm:py-16">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <h2 className="section-title text-2xl sm:text-3xl">
              {t("galleryTitle")}
            </h2>
            <p
              className={`${locale === "ur" ? "font-urdu-hero" : "font-script"} text-brand-green text-2xl sm:text-3xl max-w-xs leading-tight`}
            >
              {t("galleryScript")}
              <span className="block h-1 w-24 mt-2 rounded-full bg-brand-yellow" />
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
            {gallery.map((src, i) => (
              <div
                key={src}
                className={`relative overflow-hidden rounded-xl aspect-[4/5] ${
                  i === 0 ? "col-span-2 md:col-span-1" : ""
                }`}
              >
                <Image
                  src={src}
                  alt={`${t("galleryTitle")} ${i + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How you can help */}
      <section id="help" className="container-site py-14 sm:py-16 scroll-mt-28">
        <h2 className="section-title text-center text-2xl sm:text-3xl">
          {t("helpTitle")}
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl bg-white p-7 text-center ring-1 ring-brand-green/10 shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-green text-white">
              <Baby className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-brand-green text-xl">
              {t("help1Title")}
            </h3>
            <p className="mt-2 text-sm text-brand-muted leading-relaxed">
              {t("help1Text")}
            </p>
            <Link href={`/${locale}/donate`} className="btn-primary mt-6">
              {t("help1Cta")}
            </Link>
          </article>

          <article className="rounded-2xl bg-white p-7 text-center ring-1 ring-brand-yellow/40 shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-yellow text-brand-ink">
              <Heart className="h-6 w-6 fill-current" />
            </div>
            <h3 className="font-semibold text-brand-green text-xl">
              {t("help2Title")}
            </h3>
            <p className="mt-2 text-sm text-brand-muted leading-relaxed">
              {t("help2Text")}
            </p>
            <Link href={`/${locale}/donate`} className="btn-donate mt-6">
              {t("help2Cta")}
            </Link>
          </article>

          <article className="rounded-2xl bg-white p-7 text-center ring-1 ring-brand-green/10 shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-green text-white">
              <HandHeart className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-brand-green text-xl">
              {t("help3Title")}
            </h3>
            <p className="mt-2 text-sm text-brand-muted leading-relaxed">
              {t("help3Text")}
            </p>
            <Link href={`/${locale}/contact`} className="btn-primary mt-6">
              {t("help3Cta")}
            </Link>
          </article>
        </div>
      </section>

      {/* Transparency + updates */}
      <section className="bg-[#f7f5f0] py-14 sm:py-16">
        <div className="container-site grid gap-6 lg:grid-cols-3">
          <article className="rounded-2xl bg-brand-green text-white p-7 flex flex-col">
            <ShieldCheck className="h-10 w-10 text-brand-yellow" />
            <h2 className="mt-4 font-display text-2xl font-semibold">
              {t("transparencyTitle")}
            </h2>
            <p className="mt-3 text-white/85 leading-relaxed flex-1">
              {t("transparencyText")}
            </p>
            <Link
              href={`/${locale}/about`}
              className="btn-donate mt-6 self-start"
            >
              {t("transparencyCta")}
              <span aria-hidden className="ms-1 inline-block rtl:-scale-x-100">
                →
              </span>
            </Link>
          </article>

          <article className="rounded-2xl bg-white p-7 ring-1 ring-brand-green/10">
            <h2 className="section-title text-xl">{t("linksTitle")}</h2>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-brand-green hover:underline"
                >
                  {t("linkAbout")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/apply`}
                  className="text-brand-green hover:underline"
                >
                  {t("linkApply")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/donate`}
                  className="text-brand-green hover:underline"
                >
                  {t("linkDonate")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/status`}
                  className="text-brand-green hover:underline"
                >
                  {t("linkStatus")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="text-brand-green hover:underline"
                >
                  {t("linkContact")}
                </Link>
              </li>
            </ul>
          </article>

          <article className="rounded-2xl bg-white p-7 ring-1 ring-brand-green/10">
            <h2 className="section-title text-xl">{t("updatesTitle")}</h2>
            <ul className="mt-5 space-y-4">
              {updates.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-brand-green text-sm">
                      {item.title}
                    </p>
                    <p className="text-xs text-brand-muted leading-relaxed mt-1">
                      {item.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      {/* Pre-footer CTA */}
      <section className="bg-brand-green text-white">
        <div className="container-site py-12 sm:py-14 text-center">
          <p className="font-display text-2xl sm:text-3xl font-semibold max-w-3xl mx-auto leading-snug">
            {t("ctaBanner")}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href={`/${locale}/donate`} className="btn-donate">
              <Heart className="h-4 w-4 fill-current" />
              {t("ctaDonate")}
            </Link>
            <Link href={`/${locale}/donate`} className="btn-hero-outline">
              {t("ctaSupport")}
            </Link>
          </div>
        </div>
      </section>

      {/* Status strip */}
      <section className="container-site py-10">
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

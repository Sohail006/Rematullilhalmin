import Image from "next/image";
import type { Metadata } from "next";
import {
  Building2,
  HandHeart,
  Handshake,
  Package,
  UserRound,
  Users,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { getDonateSettings } from "@/lib/settings";
import { getPageMetadata } from "@/lib/metadata";
import { getContactSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata(locale as Locale, "donate");
}

export default async function DonatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("donate");
  const donate = await getDonateSettings();
  const contact = await getContactSettings();

  const hasAny =
    (donate.bank.enabled &&
      (donate.bank.accountNumber || donate.bank.iban)) ||
    (donate.jazzcash.enabled && donate.jazzcash.mobileNumber) ||
    (donate.easypaisa.enabled && donate.easypaisa.mobileNumber);

  const supporters = [
    { icon: UserRound, title: t("who1Title"), text: t("who1Text") },
    { icon: Handshake, title: t("who2Title"), text: t("who2Text") },
    { icon: Building2, title: t("who3Title"), text: t("who3Text") },
    { icon: Users, title: t("who4Title"), text: t("who4Text") },
  ];

  const whatsapp = contact.whatsapp?.replace(/\D/g, "");
  const inkindHref = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent("I would like to offer in-kind support.")}`
    : contact.email
      ? `mailto:${contact.email}?subject=In-kind%20donation`
      : `/${locale}/contact`;

  return (
    <div className="bg-[#f7f8f6]">
      <section className="container-site relative py-10 sm:py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-12">
          <div className="space-y-5">
            <p className="text-brand-green text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase">
              {t("impact")}
            </p>
            <h1 className="section-title text-4xl sm:text-5xl">{t("title")}</h1>
            <span className="block h-1 w-20 rounded-full bg-brand-yellow" />
            <p className="text-brand-muted text-lg leading-relaxed max-w-xl">
              {t("intro")}
            </p>
            <p className="text-brand-muted leading-relaxed max-w-xl">
              {t("intro2")}
            </p>
            <div className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-3 ring-1 ring-brand-green/10 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-yellow text-brand-ink">
                <HandHeart className="h-5 w-5" />
              </span>
              <span className="text-brand-green font-medium">{t("quote")}</span>
            </div>
          </div>

          <div className="relative pb-10 sm:pb-8">
            <div className="watercolor-frame">
              <Image
                src="/images/donate-student.jpg"
                alt={t("title")}
                width={1100}
                height={820}
                className="w-full h-auto object-cover object-[center_15%] aspect-[5/4] sm:aspect-[4/3]"
                priority
                quality={95}
              />
            </div>
            <div className="donate-quote absolute -bottom-1 start-2 sm:start-4 max-w-[min(260px,78%)]">
              <p className="font-display text-brand-green text-sm sm:text-base leading-snug">
                <span className="text-brand-gold text-2xl me-1" aria-hidden>
                  “
                </span>
                {t("quote")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-site py-12 sm:py-14">
        <div className="text-center mb-10">
          <div className="gold-divider mb-4">
            <span className="text-brand-gold text-xs" aria-hidden>
              ◆
            </span>
          </div>
          <h2 className="section-title text-2xl sm:text-3xl">{t("whoTitle")}</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
          {supporters.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="supporter-card rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-brand-green/10"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-green text-white">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-brand-green">{title}</h3>
              <p className="mt-2 text-sm text-brand-muted leading-relaxed flex-1">
                {text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-site pb-10">
        <div className="text-center mb-10">
          <div className="gold-divider mb-4">
            <span className="text-brand-gold text-xs" aria-hidden>
              ◆
            </span>
          </div>
          <h2 className="section-title text-2xl sm:text-3xl">{t("waysTitle")}</h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl bg-brand-cream p-7 sm:p-8 ring-1 ring-brand-green/10 flex flex-col">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-green text-white">
              <HandHeart className="h-7 w-7" />
            </div>
            <h3 className="mt-5 font-display text-2xl text-brand-green font-semibold">
              {t("monetaryTitle")}
            </h3>
            <p className="mt-3 text-brand-muted leading-relaxed flex-1">
              {t("monetaryText")}
            </p>
            <a href="#donation-details" className="btn-donate mt-6 self-start">
              {t("monetaryCta")}
              <span aria-hidden className="ms-1 inline-block rtl:-scale-x-100">
                →
              </span>
            </a>
          </article>

          <article className="rounded-2xl bg-[#f8f0d8] p-7 sm:p-8 ring-1 ring-brand-yellow/40 flex flex-col">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-yellow text-brand-ink">
              <Package className="h-7 w-7" />
            </div>
            <h3 className="mt-5 font-display text-2xl text-brand-green font-semibold">
              {t("inkindTitle")}
            </h3>
            <p className="mt-3 text-brand-muted leading-relaxed flex-1">
              {t("inkindText")}
            </p>
            <a
              href={inkindHref}
              target={whatsapp || contact.email ? "_blank" : undefined}
              rel={whatsapp || contact.email ? "noreferrer" : undefined}
              className="btn-primary mt-6 self-start"
            >
              {t("inkindCta")}
              <span aria-hidden className="ms-1 inline-block rtl:-scale-x-100">
                →
              </span>
            </a>
          </article>
        </div>
      </section>

      <section id="donation-details" className="container-site pb-16 scroll-mt-24">
        <h2 className="section-title text-2xl mb-6">{t("detailsTitle")}</h2>
        {donate.note ? (
          <p className="mb-6 text-brand-green font-medium">{donate.note}</p>
        ) : null}

        {!hasAny ? (
          <p className="text-brand-muted surface-card p-6">{t("empty")}</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {donate.bank.enabled ? (
              <article className="surface-card p-6">
                <h3 className="font-display text-xl text-brand-green font-semibold">
                  {t("bank")}
                </h3>
                <dl className="mt-4 space-y-2 text-sm text-brand-muted">
                  {donate.bank.bankName ? (
                    <div>
                      <dt className="font-semibold text-brand-ink">{t("bankName")}</dt>
                      <dd>{donate.bank.bankName}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt className="font-semibold text-brand-ink">{t("accountTitle")}</dt>
                    <dd>{donate.bank.accountTitle}</dd>
                  </div>
                  {donate.bank.accountNumber ? (
                    <div>
                      <dt className="font-semibold text-brand-ink">
                        {t("accountNumber")}
                      </dt>
                      <dd className="font-mono">{donate.bank.accountNumber}</dd>
                    </div>
                  ) : null}
                  {donate.bank.iban ? (
                    <div>
                      <dt className="font-semibold text-brand-ink">{t("iban")}</dt>
                      <dd className="font-mono">{donate.bank.iban}</dd>
                    </div>
                  ) : null}
                  {donate.bank.branch ? (
                    <div>
                      <dt className="font-semibold text-brand-ink">{t("branch")}</dt>
                      <dd>{donate.bank.branch}</dd>
                    </div>
                  ) : null}
                </dl>
              </article>
            ) : null}

            {donate.jazzcash.enabled ? (
              <article className="surface-card p-6">
                <h3 className="font-display text-xl text-brand-green font-semibold">
                  {t("jazzcash")}
                </h3>
                <dl className="mt-4 space-y-2 text-sm text-brand-muted">
                  <div>
                    <dt className="font-semibold text-brand-ink">{t("accountTitle")}</dt>
                    <dd>{donate.jazzcash.accountName}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-brand-ink">{t("mobileAccount")}</dt>
                    <dd className="font-mono">{donate.jazzcash.mobileNumber}</dd>
                  </div>
                </dl>
              </article>
            ) : null}

            {donate.easypaisa.enabled ? (
              <article className="surface-card p-6">
                <h3 className="font-display text-xl text-brand-green font-semibold">
                  {t("easypaisa")}
                </h3>
                <dl className="mt-4 space-y-2 text-sm text-brand-muted">
                  <div>
                    <dt className="font-semibold text-brand-ink">{t("accountTitle")}</dt>
                    <dd>{donate.easypaisa.accountName}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-brand-ink">{t("mobileAccount")}</dt>
                    <dd className="font-mono">{donate.easypaisa.mobileNumber}</dd>
                  </div>
                </dl>
              </article>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}

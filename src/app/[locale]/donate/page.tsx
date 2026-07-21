import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { getDonateSettings } from "@/lib/settings";
import { getPageMetadata } from "@/lib/metadata";

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

  const hasAny =
    (donate.bank.enabled &&
      (donate.bank.accountNumber || donate.bank.iban)) ||
    (donate.jazzcash.enabled && donate.jazzcash.mobileNumber) ||
    (donate.easypaisa.enabled && donate.easypaisa.mobileNumber);

  return (
    <div className="container-site py-14">
      <h1 className="font-display text-3xl font-semibold text-brand-green">
        {t("title")}
      </h1>
      <p className="mt-3 text-brand-muted max-w-2xl">{t("intro")}</p>
      {donate.note ? (
        <p className="mt-4 text-brand-green font-medium">{donate.note}</p>
      ) : null}

      {!hasAny ? (
        <p className="mt-10 text-brand-muted">{t("empty")}</p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {donate.bank.enabled ? (
            <article className="border border-brand-green/15 bg-brand-cream p-6">
              <h2 className="font-display text-xl text-brand-green font-semibold">
                {t("bank")}
              </h2>
              <dl className="mt-4 space-y-2 text-sm text-brand-muted">
                {donate.bank.bankName ? (
                  <div>
                    <dt className="font-semibold text-brand-ink">
                      {t("bankName")}
                    </dt>
                    <dd>{donate.bank.bankName}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="font-semibold text-brand-ink">
                    {t("accountTitle")}
                  </dt>
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
            <article className="border border-brand-green/15 bg-brand-cream p-6">
              <h2 className="font-display text-xl text-brand-green font-semibold">
                {t("jazzcash")}
              </h2>
              <dl className="mt-4 space-y-2 text-sm text-brand-muted">
                <div>
                  <dt className="font-semibold text-brand-ink">
                    {t("accountTitle")}
                  </dt>
                  <dd>{donate.jazzcash.accountName}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-brand-ink">
                    {t("mobileAccount")}
                  </dt>
                  <dd className="font-mono">{donate.jazzcash.mobileNumber}</dd>
                </div>
              </dl>
            </article>
          ) : null}

          {donate.easypaisa.enabled ? (
            <article className="border border-brand-green/15 bg-brand-cream p-6">
              <h2 className="font-display text-xl text-brand-green font-semibold">
                {t("easypaisa")}
              </h2>
              <dl className="mt-4 space-y-2 text-sm text-brand-muted">
                <div>
                  <dt className="font-semibold text-brand-ink">
                    {t("accountTitle")}
                  </dt>
                  <dd>{donate.easypaisa.accountName}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-brand-ink">
                    {t("mobileAccount")}
                  </dt>
                  <dd className="font-mono">{donate.easypaisa.mobileNumber}</dd>
                </div>
              </dl>
            </article>
          ) : null}
        </div>
      )}
    </div>
  );
}

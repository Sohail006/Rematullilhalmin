import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import {
  defaultContact,
  getContactSettings,
} from "@/lib/settings";
import { getPageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata(locale as Locale, "contact");
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("contact");
  const contact = await getContactSettings().catch(() => defaultContact);

  const hasAny =
    contact.phone ||
    contact.whatsapp ||
    contact.email ||
    contact.address ||
    contact.officeHours;

  return (
    <div className="container-site py-14 max-w-3xl">
      <h1 className="font-display text-3xl font-semibold text-brand-green">
        {t("title")}
      </h1>
      <p className="mt-3 text-brand-muted">{t("intro")}</p>

      {!hasAny ? (
        <p className="mt-10 text-brand-muted">{t("empty")}</p>
      ) : (
        <dl className="mt-10 space-y-5">
          {contact.phone ? (
            <div>
              <dt className="font-semibold text-brand-ink">{t("phone")}</dt>
              <dd>
                <a
                  href={`tel:${contact.phone}`}
                  className="text-brand-green hover:underline"
                >
                  {contact.phone}
                </a>
              </dd>
            </div>
          ) : null}
          {contact.whatsapp ? (
            <div>
              <dt className="font-semibold text-brand-ink">{t("whatsapp")}</dt>
              <dd>
                <a
                  href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-green hover:underline"
                >
                  {contact.whatsapp}
                </a>
              </dd>
            </div>
          ) : null}
          {contact.email ? (
            <div>
              <dt className="font-semibold text-brand-ink">{t("email")}</dt>
              <dd>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-brand-green hover:underline"
                >
                  {contact.email}
                </a>
              </dd>
            </div>
          ) : null}
          {contact.address ? (
            <div>
              <dt className="font-semibold text-brand-ink">{t("address")}</dt>
              <dd className="text-brand-muted whitespace-pre-line">
                {contact.address}
              </dd>
            </div>
          ) : null}
          {contact.officeHours ? (
            <div>
              <dt className="font-semibold text-brand-ink">{t("officeHours")}</dt>
              <dd className="text-brand-muted">{contact.officeHours}</dd>
            </div>
          ) : null}
          <div>
            <dt className="font-semibold text-brand-ink">{t("website")}</dt>
            <dd className="text-brand-muted">alsiratulmustaqeem.org.pk</dd>
          </div>
        </dl>
      )}
    </div>
  );
}

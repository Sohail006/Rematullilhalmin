import type { Metadata } from "next";
import { Clock3, Globe, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { getContactSettings } from "@/lib/settings";
import { getPageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/site/PageHero";

export const dynamic = "force-dynamic";

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
  const contact = await getContactSettings();

  const items = [
    contact.phone
      ? {
          icon: Phone,
          label: t("phone"),
          value: contact.phone,
          href: `tel:${contact.phone}`,
        }
      : null,
    contact.whatsapp
      ? {
          icon: MessageCircle,
          label: t("whatsapp"),
          value: contact.whatsapp,
          href: `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`,
          external: true,
        }
      : null,
    contact.email
      ? {
          icon: Mail,
          label: t("email"),
          value: contact.email,
          href: `mailto:${contact.email}`,
        }
      : null,
    contact.address
      ? {
          icon: MapPin,
          label: t("address"),
          value: contact.address,
        }
      : null,
    contact.officeHours
      ? {
          icon: Clock3,
          label: t("officeHours"),
          value: contact.officeHours,
        }
      : null,
    {
      icon: Globe,
      label: t("website"),
      value: "alsiratulmustaqeem.org.pk",
      href: "https://www.alsiratulmustaqeem.org.pk",
      external: true,
    },
  ].filter(Boolean) as Array<{
    icon: typeof Phone;
    label: string;
    value: string;
    href?: string;
    external?: boolean;
  }>;

  const hasConfigured =
    contact.phone ||
    contact.whatsapp ||
    contact.email ||
    contact.address ||
    contact.officeHours;

  return (
    <PageHero title={t("title")} intro={t("intro")} eyebrow={t("reachUs")}>
      {!hasConfigured ? (
        <p className="surface-card p-6 text-brand-muted">{t("empty")}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map(({ icon: Icon, label, value, href, external }) => (
            <article key={label} className="surface-card p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-green text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-brand-ink">{label}</p>
                  {href ? (
                    <a
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                      className="mt-1 block text-brand-green hover:underline whitespace-pre-line break-words"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="mt-1 text-brand-muted whitespace-pre-line">
                      {value}
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </PageHero>
  );
}

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { FoundationLogo } from "@/components/site/FoundationLogo";
import { getContactSettings } from "@/lib/settings";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const brand = await getTranslations("brand");
  const nav = await getTranslations("nav");
  const locale = await getLocale();
  const contact = await getContactSettings();

  return (
    <footer className="mt-0 bg-[#0b2f20] text-white">
      <div className="container-site py-12 grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="flex items-start gap-4">
          <div className="shrink-0 rounded-full bg-white/95 p-1">
            <FoundationLogo alt={brand("name")} size="footer" />
          </div>
          <div>
            <p className="font-display text-xl font-semibold leading-tight">
              {brand("name")}
            </p>
            <p className="text-brand-yellow mt-2 text-sm">{brand("tagline")}</p>
            <p className="text-white/75 text-sm mt-4 max-w-md leading-relaxed">
              {t("blurb")}
            </p>
          </div>
        </div>

        <div>
          <p className="text-brand-yellow text-sm font-semibold mb-3">
            {t("links")}
          </p>
          <div className="flex flex-col gap-2 text-sm text-white/85">
            <Link href={`/${locale}/about`} className="hover:text-white">
              {nav("about")}
            </Link>
            <Link href={`/${locale}/apply`} className="hover:text-white">
              {nav("apply")}
            </Link>
            <Link href={`/${locale}/donate`} className="hover:text-white">
              {nav("donate")}
            </Link>
            <Link href={`/${locale}/status`} className="hover:text-white">
              {nav("status")}
            </Link>
            <Link href={`/${locale}/contact`} className="hover:text-white">
              {nav("contact")}
            </Link>
          </div>
        </div>

        <div>
          <p className="text-brand-yellow text-sm font-semibold mb-3">
            {t("contactTitle")}
          </p>
          <div className="space-y-2.5 text-sm text-white/85">
            {contact.address ? (
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-brand-yellow" />
                <span>{contact.address}</span>
              </p>
            ) : null}
            {contact.phone ? (
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-brand-yellow" />
                <a href={`tel:${contact.phone}`} className="hover:text-white">
                  {contact.phone}
                </a>
              </p>
            ) : null}
            {contact.email ? (
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-brand-yellow" />
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:text-white break-all"
                >
                  {contact.email}
                </a>
              </p>
            ) : null}
            <p className="pt-2 text-white/70">{t("domain")}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site py-4 flex flex-wrap items-center justify-between gap-3 text-xs text-white/70">
          <p>
            © {new Date().getFullYear()} {brand("name")}. {t("rights")}
          </p>
          <p className="flex gap-3">
            <span>{t("privacy")}</span>
            <span aria-hidden>|</span>
            <span>{t("terms")}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

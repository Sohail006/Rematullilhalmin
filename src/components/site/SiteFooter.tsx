import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { FoundationLogo } from "@/components/site/FoundationLogo";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const brand = await getTranslations("brand");
  const nav = await getTranslations("nav");
  const locale = await getLocale();

  return (
    <footer className="mt-20 bg-brand-green text-white">
      <div className="container-site py-12 grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-start">
        <div className="flex items-start gap-4">
          <div className="shrink-0 rounded-full bg-white/95 p-1">
            <FoundationLogo alt={brand("name")} size="footer" />
          </div>
          <div>
            <p className="font-display text-xl font-semibold leading-tight">
              {brand("name")}
            </p>
            <p className="text-brand-gold-soft mt-2 text-sm">{brand("motto")}</p>
            <p className="text-white/75 text-sm mt-4 max-w-md leading-relaxed">
              {t("blurb")}
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-brand-gold-soft text-sm font-semibold mb-3">
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
              <Link href={`/${locale}/contact`} className="hover:text-white">
                {nav("contact")}
              </Link>
            </div>
          </div>
          <div className="text-sm text-white/80">
            <p className="text-brand-gold-soft font-semibold mb-3">
              {t("domain")}
            </p>
            <p>
              © {new Date().getFullYear()} {t("rights")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

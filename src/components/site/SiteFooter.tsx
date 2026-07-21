import { getTranslations } from "next-intl/server";
import { FoundationLogo } from "@/components/site/FoundationLogo";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const brand = await getTranslations("brand");

  return (
    <footer className="mt-16 border-t border-brand-green/10 bg-brand-green text-white">
      <div className="container-site py-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="rounded-full bg-white/95 p-1.5 shrink-0">
            <FoundationLogo alt={brand("name")} size="footer" />
          </div>
          <div>
            <p className="font-display text-base sm:text-lg font-semibold leading-tight">
              {brand("name")}
            </p>
            <p className="text-brand-gold-soft text-sm mt-1">{brand("motto")}</p>
          </div>
        </div>
        <div className="text-sm text-white/80 sm:text-end">
          <p>{t("domain")}</p>
          <p>
            © {new Date().getFullYear()} {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}

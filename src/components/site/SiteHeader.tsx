"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import { FoundationLogo } from "@/components/site/FoundationLogo";

const links = [
  { href: "", key: "home" as const },
  { href: "/about", key: "about" as const },
  { href: "/apply", key: "apply" as const },
  { href: "/donate", key: "donate" as const },
  { href: "/contact", key: "contact" as const },
  { href: "/status", key: "status" as const },
];

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");
  const brand = useTranslations("brand");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const otherLocale = locale === "en" ? "ur" : "en";
  const switchedPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-green/10 bg-white/95 backdrop-blur">
      <div className="container-site flex items-center justify-between gap-3 py-2.5 sm:py-3">
        <Link href={`/${locale}`} className="flex items-center gap-2.5 sm:gap-3 min-w-0 max-w-[58%] sm:max-w-none">
          <FoundationLogo alt={brand("name")} size="header" priority />
          <div className="min-w-0">
            <p className="font-display text-xs sm:text-sm lg:text-base font-semibold text-brand-green leading-tight line-clamp-2 sm:line-clamp-none">
              {brand("name")}
            </p>
            <p className="text-[11px] sm:text-xs text-brand-gold truncate hidden sm:block">
              {brand("motto")}
            </p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-brand-muted">
          {links.map((link) => {
            const href = `/${locale}${link.href}`;
            const active =
              link.href === ""
                ? pathname === `/${locale}`
                : pathname.startsWith(href);
            return (
              <Link
                key={link.key}
                href={href}
                className={
                  active
                    ? "text-brand-green"
                    : "hover:text-brand-green transition-colors"
                }
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={switchedPath}
            className="rounded border border-brand-green/20 px-2.5 py-1.5 text-xs font-semibold text-brand-green"
          >
            {otherLocale === "ur" ? "اردو" : "EN"}
          </Link>
          <Link
            href="/admin/login"
            className="hidden sm:inline-flex text-xs font-semibold text-brand-muted hover:text-brand-green"
          >
            {t("boardLogin")}
          </Link>
          <button
            type="button"
            className="lg:hidden rounded border border-brand-green/20 px-2.5 py-1.5 text-xs font-semibold text-brand-green"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            Menu
          </button>
        </div>
      </div>

      {open ? (
        <div className="lg:hidden border-t border-brand-green/10 bg-white px-4 py-3 flex flex-col gap-3">
          {links.map((link) => (
            <Link
              key={link.key}
              href={`/${locale}${link.href}`}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-brand-green"
            >
              {t(link.key)}
            </Link>
          ))}
          <Link href="/admin/login" className="text-sm text-brand-muted">
            {t("boardLogin")}
          </Link>
        </div>
      ) : null}
    </header>
  );
}

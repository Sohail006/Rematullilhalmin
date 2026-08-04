"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { FileText, Menu, UserRound, X } from "lucide-react";
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
    <header className="sticky top-0 z-40 border-b border-brand-green/10 bg-[#fbfaf7]/95 backdrop-blur">
      <div className="container-site flex items-center justify-between gap-3 py-2.5 sm:py-3">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2.5 sm:gap-3 min-w-0 max-w-[58%] md:max-w-[42%] lg:max-w-none"
        >
          <FoundationLogo alt={brand("name")} size="header" priority />
          <div className="min-w-0">
            <p className="font-display text-[0.72rem] sm:text-sm lg:text-[0.95rem] font-semibold text-brand-green leading-tight">
              {brand("name")}
            </p>
            <p
              className="text-[10px] sm:text-[11px] text-brand-gold leading-tight mt-0.5"
              dir="rtl"
              lang="ur"
            >
              {brand("mottoUrdu")}
            </p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-4 xl:gap-5 text-[0.9rem] font-medium text-brand-muted">
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
                className={`relative pb-1 transition-colors whitespace-nowrap ${
                  active ? "text-brand-green" : "hover:text-brand-green"
                }`}
              >
                {t(link.key)}
                {active ? (
                  <span className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-brand-green" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Link
            href={`/${locale}/apply`}
            className="inline-flex lg:hidden items-center gap-1 rounded-md bg-brand-green px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold text-white hover:bg-brand-green-mid"
          >
            <FileText className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t("apply")}</span>
            <span className="sm:hidden">{t("applyShort")}</span>
          </Link>
          <Link
            href={switchedPath}
            className="rounded-md border border-brand-green/25 px-2.5 py-1.5 text-xs font-semibold text-brand-green"
          >
            {otherLocale === "ur" ? "اردو" : "EN"}
          </Link>
          <Link
            href="/admin/login"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-brand-green px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-green-mid"
          >
            <UserRound className="h-3.5 w-3.5" />
            {t("boardLogin")}
          </Link>
          <button
            type="button"
            className="lg:hidden rounded-md border border-brand-green/25 p-2 text-brand-green"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="lg:hidden border-t border-brand-green/10 bg-white px-4 py-4 flex flex-col gap-3">
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
                onClick={() => setOpen(false)}
                className={`text-sm font-medium ${
                  active ? "text-brand-green" : "text-brand-muted"
                }`}
              >
                {t(link.key)}
              </Link>
            );
          })}
          <Link
            href="/admin/login"
            onClick={() => setOpen(false)}
            className="btn-primary text-sm py-2.5"
          >
            {t("boardLogin")}
          </Link>
        </div>
      ) : null}
    </header>
  );
}

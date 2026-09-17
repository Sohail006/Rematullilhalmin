"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Heart, Mail, Menu, UserRound, X } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import { FoundationLogo } from "@/components/site/FoundationLogo";

const links = [
  { href: "", key: "home" as const },
  { href: "/about", key: "about" as const },
  { href: "#what-we-do", key: "work" as const, hash: true },
  { href: "#impact", key: "impact" as const, hash: true },
  { href: "#help", key: "help" as const, hash: true },
  { href: "/apply", key: "apply" as const },
  { href: "/contact", key: "contact" as const },
];

export function SiteHeader({
  locale,
  email,
}: {
  locale: Locale;
  email?: string;
}) {
  const t = useTranslations("nav");
  const top = useTranslations("topbar");
  const brand = useTranslations("brand");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const otherLocale = locale === "en" ? "ur" : "en";
  const switchedPath = pathname.replace(`/${locale}`, `/${otherLocale}`);
  const homePath = `/${locale}`;

  function resolveHref(link: (typeof links)[number]) {
    if (link.hash) {
      return pathname === homePath || pathname === `${homePath}/`
        ? link.href
        : `${homePath}${link.href}`;
    }
    return `/${locale}${link.href}`;
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-brand-green-deep text-white text-[11px] sm:text-xs">
        <div className="container-site flex flex-wrap items-center justify-between gap-2 py-2">
          <p className="tracking-wide text-white/90">{top("values")}</p>
          <div className="flex items-center gap-3 text-white/90">
            {email ? (
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-1.5 hover:text-white"
              >
                <Mail className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{email}</span>
              </a>
            ) : null}
            <Link
              href={switchedPath}
              className="rounded px-2 py-0.5 border border-white/25 font-semibold hover:bg-white/10"
            >
              {otherLocale === "ur" ? "اردو" : "EN"}
            </Link>
          </div>
        </div>
      </div>

      <div className="border-b border-brand-green/10 bg-white/95 backdrop-blur">
        <div className="container-site flex items-center justify-between gap-3 py-3">
          <Link
            href={homePath}
            className="flex items-center gap-2.5 sm:gap-3 min-w-0 max-w-[70%] lg:max-w-[34%]"
          >
            <FoundationLogo alt={brand("name")} size="header" priority />
            <div className="min-w-0">
              <p className="font-display text-[0.72rem] sm:text-sm lg:text-[0.92rem] font-semibold text-brand-green leading-tight uppercase tracking-wide">
                {brand("name")}
              </p>
              <p className="text-[10px] sm:text-[11px] text-brand-muted leading-tight mt-0.5 hidden sm:block">
                {brand("tagline")}
              </p>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-4 text-[0.88rem] font-medium text-brand-muted">
            {links.map((link) => {
              const href = resolveHref(link);
              const active =
                !link.hash &&
                (link.href === ""
                  ? pathname === homePath || pathname === `${homePath}/`
                  : pathname.startsWith(`/${locale}${link.href}`));
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
                    <span className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-brand-yellow" />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/${locale}/donate`}
              className="btn-donate hidden sm:inline-flex"
            >
              <Heart className="h-3.5 w-3.5 fill-current" />
              {t("donateNow")}
            </Link>
            <Link
              href="/admin/login"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-md border border-brand-green/20 px-2.5 py-1.5 text-xs font-semibold text-brand-green hover:bg-brand-green-soft"
            >
              <UserRound className="h-3.5 w-3.5" />
              {t("boardLogin")}
            </Link>
            <button
              type="button"
              className="xl:hidden rounded-md border border-brand-green/25 p-2 text-brand-green"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {open ? (
          <div className="xl:hidden border-t border-brand-green/10 bg-white px-4 py-4 flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.key}
                href={resolveHref(link)}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-brand-green"
              >
                {t(link.key)}
              </Link>
            ))}
            <Link
              href={`/${locale}/status`}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-brand-muted"
            >
              {t("status")}
            </Link>
            <Link
              href={`/${locale}/donate`}
              onClick={() => setOpen(false)}
              className="btn-donate"
            >
              <Heart className="h-4 w-4 fill-current" />
              {t("donateNow")}
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="btn-primary text-sm py-2.5"
            >
              {t("boardLogin")}
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
}

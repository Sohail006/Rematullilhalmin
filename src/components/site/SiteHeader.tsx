"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Heart, Mail, UserRound } from "lucide-react";
import { useEffect, useId, useState } from "react";
import type { Locale } from "@/i18n/config";
import { FoundationLogo } from "@/components/site/FoundationLogo";

const links = [
  { href: "", key: "home" as const },
  { href: "/about", key: "about" as const },
  { href: "#what-we-do", key: "work" as const, hash: true },
  { href: "#impact", key: "impact" as const, hash: true },
  { href: "#help", key: "help" as const, hash: true },
  { href: "/apply", key: "apply" as const },
  { href: "/donate", key: "donate" as const },
  { href: "/contact", key: "contact" as const },
];

function MenuGlyph({ open }: { open: boolean }) {
  return (
    <span className="relative block h-3.5 w-4" aria-hidden>
      <span
        className={`absolute start-0 top-0 h-0.5 w-4 rounded-full bg-current transition-all duration-200 ${
          open ? "top-1.5 rotate-45" : ""
        }`}
      />
      <span
        className={`absolute start-0 top-1.5 h-0.5 w-4 rounded-full bg-current transition-all duration-200 ${
          open ? "opacity-0 scale-x-50" : ""
        }`}
      />
      <span
        className={`absolute start-0 top-3 h-0.5 w-4 rounded-full bg-current transition-all duration-200 ${
          open ? "top-1.5 -rotate-45" : ""
        }`}
      />
    </span>
  );
}

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
  const menuId = useId();
  const otherLocale = locale === "en" ? "ur" : "en";
  const switchedPath = pathname.replace(`/${locale}`, `/${otherLocale}`);
  const homePath = `/${locale}`;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
                <span className="hidden md:inline">{email}</span>
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
            className="flex items-center gap-2.5 sm:gap-3 min-w-0 max-w-[62%] lg:max-w-[30%]"
          >
            <FoundationLogo alt={brand("name")} size="header" priority />
            <div className="min-w-0">
              <p className="font-display text-[0.72rem] sm:text-sm lg:text-[0.9rem] font-semibold text-brand-green leading-tight uppercase tracking-wide">
                {brand("name")}
              </p>
              <p className="text-[10px] sm:text-[11px] text-brand-muted leading-tight mt-0.5 hidden sm:block">
                {brand("tagline")}
              </p>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-3.5 text-[0.86rem] font-medium text-brand-muted">
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
              className="btn-donate !px-3 !py-2 sm:!px-4"
              aria-label={t("donateNow")}
            >
              <Heart className="h-3.5 w-3.5 fill-current" />
              <span className="hidden sm:inline">{t("donateNow")}</span>
            </Link>
            <Link
              href="/admin/login"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-brand-green/20 px-3 py-1.5 text-xs font-semibold text-brand-green hover:bg-brand-green-soft"
            >
              <UserRound className="h-3.5 w-3.5" />
              {t("boardLogin")}
            </Link>
            <button
              type="button"
              className={`xl:hidden inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                open
                  ? "bg-brand-green text-white shadow-sm"
                  : "border border-brand-green/20 bg-white text-brand-green hover:bg-brand-green-soft"
              }`}
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? t("closeMenu") : t("menu")}
              aria-expanded={open}
              aria-controls={menuId}
            >
              <MenuGlyph open={open} />
              <span className="hidden sm:inline">
                {open ? t("closeMenu") : t("menu")}
              </span>
            </button>
          </div>
        </div>

        {open ? (
          <div
            id={menuId}
            className="xl:hidden border-t border-brand-green/10 bg-gradient-to-b from-white to-[#f7f8f6]"
          >
            <div className="container-site py-4 space-y-1">
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
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-brand-green-soft text-brand-green"
                        : "text-brand-ink hover:bg-white hover:text-brand-green"
                    }`}
                  >
                    <span>{t(link.key)}</span>
                    {active ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-yellow" />
                    ) : null}
                  </Link>
                );
              })}
              <div className="pt-3 mt-2 border-t border-brand-green/10 grid gap-2 sm:grid-cols-2">
                <Link
                  href={`/${locale}/status`}
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-full border border-brand-green/20 bg-white px-4 py-2.5 text-sm font-semibold text-brand-green hover:bg-brand-green-soft"
                >
                  {t("status")}
                </Link>
                <Link
                  href="/admin/login"
                  onClick={() => setOpen(false)}
                  className="btn-primary text-sm py-2.5 lg:hidden"
                >
                  {t("boardLogin")}
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

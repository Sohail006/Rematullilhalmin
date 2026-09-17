import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { HtmlLangDir } from "@/components/site/HtmlLangDir";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteJsonLd } from "@/components/site/SiteJsonLd";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getContactSettings } from "@/lib/settings";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === "ur" ? "rtl" : "ltr";
  const contact = await getContactSettings();

  return (
    <NextIntlClientProvider messages={messages}>
      <HtmlLangDir locale={locale} dir={dir} />
      <SiteJsonLd locale={locale} />
      <div lang={locale} dir={dir} className="min-h-screen flex flex-col">
        <SiteHeader locale={locale} email={contact.email || undefined} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </NextIntlClientProvider>
  );
}

"use client";

import { useEffect } from "react";

/** Keep <html> lang/dir in sync for a11y, SEO, and native form controls. */
export function HtmlLangDir({
  locale,
  dir,
}: {
  locale: string;
  dir: "ltr" | "rtl";
}) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  return null;
}

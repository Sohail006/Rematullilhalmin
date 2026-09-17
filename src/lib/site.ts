/** Canonical public site origin (no trailing slash). */
export function getSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.alsiratulmustaqeem.org.pk";
  return raw.replace(/\/$/, "");
}

export const SITE_NAME = "Al Sirat Ul Mustaqeem Foundation";
export const SITE_NAME_UR = "الصراط المستقیم فاؤنڈیشن";
export const SITE_DOMAIN = "alsiratulmustaqeem.org.pk";
export const SITE_EMAIL = "info@alsiratulmustaqeem.org.pk";

/** Default social / Open Graph image (absolute path on site). */
export const OG_IMAGE_PATH = "/images/hero-children.jpg";
export const LOGO_PATH = "/logo.png";

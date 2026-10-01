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

/** Public social profiles (clean permanent URLs). */
export const SOCIAL_LINKS = [
  {
    key: "facebook" as const,
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61593104421978",
  },
  {
    key: "instagram" as const,
    label: "Instagram",
    href: "https://www.instagram.com/alsiratulmustaqeemfoundation",
  },
  {
    key: "tiktok" as const,
    label: "TikTok",
    href: "https://www.tiktok.com/@alsiratulmustaqeem",
  },
] as const;

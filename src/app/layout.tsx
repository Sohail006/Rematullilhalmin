import type { Metadata } from "next";
import { Caveat, DM_Sans, Fraunces, Noto_Nastaliq_Urdu } from "next/font/google";
import { getSiteUrl, OG_IMAGE_PATH, SITE_NAME } from "@/lib/site";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["500", "600", "700"],
});

const notoNastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-noto-nastaliq",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} | Student education aid in Pakistan`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Al Sirat Ul Mustaqeem Foundation helps needy students continue school. Board-reviewed aid is paid directly to schools across Pakistan.",
  keywords: [
    "Al Sirat Ul Mustaqeem Foundation",
    "student fee aid Pakistan",
    "education charity Pakistan",
    "school fee support",
    "donate education Pakistan",
    "need based student aid",
    "الصراط المستقیم فاؤنڈیشن",
  ],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: siteUrl }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Education",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "48x48" },
      { url: "/icon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/logo.png", type: "image/png", sizes: "any" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.png",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description:
      "Non-profit education support for needy students. Approved aid is paid directly to schools.",
    url: siteUrl,
    locale: "en_PK",
    alternateLocale: ["ur_PK"],
    images: [
      {
        url: OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "Education aid for needy students in Pakistan — paid directly to schools.",
    images: [OG_IMAGE_PATH],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    // Add Search Console / Bing codes in env when available
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? {
          "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
        }
      : undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${fraunces.variable} ${caveat.variable} ${notoNastaliq.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

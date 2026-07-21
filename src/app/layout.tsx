import type { Metadata } from "next";
import { DM_Sans, Fraunces, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const notoNastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-noto-nastaliq",
});

export const metadata: Metadata = {
  title: {
    default: "Al Sirat Ul Mustaqeem Foundation",
    template: "%s | Al Sirat Ul Mustaqeem Foundation",
  },
  description:
    "Financial support for needy students so every child can continue education. Aid is paid directly to schools.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://alsiratulmustaqeem.org.pk",
  ),
  openGraph: {
    images: ["/logo.png"],
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
        className={`${dmSans.variable} ${fraunces.variable} ${notoNastaliq.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

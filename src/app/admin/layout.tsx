import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Board portal",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f3f6f4] text-brand-ink">{children}</div>
  );
}

import {
  getSiteUrl,
  LOGO_PATH,
  SITE_EMAIL,
  SITE_NAME,
  SITE_NAME_UR,
} from "@/lib/site";

type JsonLdProps = {
  locale: "en" | "ur";
};

export function SiteJsonLd({ locale }: JsonLdProps) {
  const siteUrl = getSiteUrl();
  const name = locale === "ur" ? SITE_NAME_UR : SITE_NAME;
  const description =
    locale === "ur"
      ? "غیر منافع بخش فاؤنڈیشن جو ضرورت مند طلبہ کی تعلیم جاری رکھنے کے لیے اسکول کو براہِ راست فیس کی مدد فراہم کرتی ہے۔"
      : "Non-profit foundation providing school-directed financial aid so needy students in Pakistan can continue their education.";

  const organization = {
    "@context": "https://schema.org",
    "@type": ["NGO", "EducationalOrganization"],
    "@id": `${siteUrl}/#organization`,
    name: SITE_NAME,
    alternateName: [SITE_NAME_UR, "ASM Foundation"],
    url: siteUrl,
    logo: `${siteUrl}${LOGO_PATH}`,
    image: `${siteUrl}/images/hero-children.jpg`,
    description,
    email: SITE_EMAIL,
    areaServed: {
      "@type": "Country",
      name: "Pakistan",
    },
    slogan:
      locale === "ur" ? "اب پڑھے گا ہر بچہ" : "Now every child will study",
    sameAs: [siteUrl],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: SITE_EMAIL,
        availableLanguage: ["English", "Urdu"],
      },
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name,
    description,
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: [locale === "ur" ? "ur-PK" : "en-PK", "en", "ur"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}

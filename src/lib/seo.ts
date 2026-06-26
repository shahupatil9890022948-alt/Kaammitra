import type { Metadata } from "next";
import { business } from "@/lib/data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tanishkabeauty.in";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${business.name} | Premium Ladies Beauty Salon`,
    template: `%s | ${business.name}`
  },
  description:
    "Luxury ladies beauty parlour for bridal makeup, hair, facials, nails, mehendi and premium salon services.",
  keywords: [
    "Tanishka Ladies Beauty Parlour",
    "ladies beauty salon",
    "bridal makeup Pune",
    "hair spa",
    "facial",
    "mehendi artist"
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: business.name,
    title: `${business.name} | Premium Ladies Beauty Salon`,
    description: "Book luxury salon services, bridal packages and beauty rituals online."
  },
  twitter: {
    card: "summary_large_image",
    title: `${business.name} | Premium Ladies Beauty Salon`,
    description: "Luxury salon bookings for women of all age groups."
  },
  alternates: {
    canonical: siteUrl
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true
  }
};

export function salonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: business.name,
    description: "Premium ladies beauty salon with bridal makeup, hair, skin, nails and mehendi services.",
    telephone: business.phone,
    email: business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address,
      addressLocality: "Pune",
      addressRegion: "Maharashtra",
      addressCountry: "IN"
    },
    priceRange: "₹₹",
    openingHours: "Mo-Su 10:00-20:00",
    sameAs: [`https://instagram.com/${business.instagram.replace("@", "")}`]
  };
}

import StoreRouter from "@/components/store/StoreRouter";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "UPSC Store — Topper Answer Copies, Notes & Test Series at ₹99",
  description:
    "Curated UPSC topper resources — strategy compilations, answer copies, notes bundles, test series, and more. Instant PDF delivery. Starting at ₹99.",
  alternates: {
    canonical: "https://upscprepnotes.in/store",
  },
  openGraph: {
    title: "UPSC Store — Topper Answer Copies, Notes & Test Series at ₹99",
    description:
      "Curated UPSC topper resources — strategy compilations, answer copies, notes bundles, test series, and more. Instant PDF delivery.",
    url: "https://upscprepnotes.in/store",
    siteName: "UPSCPrepNotes",
    images: [{ url: "/og/store.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og/store.png"],
  },
};

export default function StorePage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Store", href: "/store" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "UPSC Store — Topper Answer Copies, Notes & Test Series",
            description:
              "Curated UPSC topper resources — strategy compilations, answer copies, notes bundles, test series, and more.",
            url: "https://upscprepnotes.in/store",
            mainEntity: {
              "@type": "ItemList",
              itemListElement: [],
            },
          }),
        }}
      />
      <StoreRouter />
    </>
  );
}

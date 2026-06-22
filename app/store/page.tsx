import StoreClient from "@/components/store/StoreClient";
import Script from "next/script";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "UPSC Store — Topper Answer Copies, Notes & Test Series at ₹99",
  description:
    "Curated UPSC topper resources — strategy compilations, answer copies, notes bundles, test series, and more. Instant PDF delivery. Flash Sale — all products at ₹99.",
  alternates: {
    canonical: "https://upscprepnotes.in/store",
  },
  openGraph: {
    title: "UPSC Store — Topper Answer Copies, Notes & Test Series at ₹99",
    description:
      "Curated UPSC topper resources — strategy compilations, answer copies, notes bundles, test series, and more. Instant PDF delivery.",
    url: "https://upscprepnotes.in/store",
    siteName: "UPSCPrepNotes",
    images: [{ url: "/logo.png", width: 512, height: 512 }],
  },
};

export default function StorePage() {
  return (
    <>
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
      <StoreClient />
    </>
  );
}

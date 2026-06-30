import AdvertiseClient from "./AdvertiseClient";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";

export const metadata = {
  title: "Advertise on UPSCPrepNotes — Reach 5,000+ Monthly UPSC Aspirants",
  description:
    "Sponsor banner ads, sponsored content, and newsletter placements on UPSCPrepNotes. Target serious UPSC CSE aspirants with high engagement. Starting at ₹3,000/month.",
  alternates: {
    canonical: "https://upscprepnotes.in/advertise",
  },
  openGraph: {
    title: "Advertise on UPSCPrepNotes — Reach 5,000+ Monthly UPSC Aspirants",
    description:
      "Sponsor banner ads, sponsored content, and newsletter placements on UPSCPrepNotes. Target serious UPSC CSE aspirants with high engagement.",
    url: "https://upscprepnotes.in/advertise",
    siteName: "UPSCPrepNotes",
    images: [{ url: "/og/advertise.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og/advertise.png"],
  },
};

export default function AdvertisePage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Advertise", href: "/advertise" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "Advertise on UPSCPrepNotes",
            description:
              "Sponsor banner ads, sponsored content, and newsletter placements on UPSCPrepNotes.",
            url: "https://upscprepnotes.in/advertise",
          }),
        }}
      />
      <AdvertiseClient />
    </>
  );
}

import Script from "next/script";
import SalesPage from "@/components/topper/SalesPage";
import type { Metadata } from "next";
import BrandShell from "@/components/brand/BrandShell";

export const metadata: Metadata = {
  title: "50+ UPSC Topper Answer Copies (63 PDFs) — ₹199 | UPSCPrepNotes",
  description:
    "UPSC Mains compilation of 63 handwritten topper answer copies (GS1–4, Essay, Optional), each labelled with rank, year and marks. Just ₹199. Pay by UPI or card. 7-day refund.",
  alternates: {
    canonical: "https://upscprepnotes.in/toppers/toppers-copy-compilation",
  },
  openGraph: {
    title: "UPSC Topper Answer Copy Compilation — 63 Copies",
    description:
      "UPSC Mains compilation of 63 handwritten topper answer copies (GS1–4, Essay, Optional). Just ₹199. 7-day refund.",
    url: "https://upscprepnotes.in/toppers/toppers-copy-compilation",
    images: [{ url: "https://ik.imagekit.io/impiclabs/previews/ishita-kishore.png?tr=w-788,f-auto,q-80", width: 1200, height: 900 }],
  },
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "UPSC Topper Answer Copy Compilation — 63 Copies",
  description:
    "UPSC Mains compilation of 63 handwritten topper answer copies (GS1–4, Essay, Optional), organised by paper and marks, each labelled with rank, year and marks.",
  image: [
    "https://ik.imagekit.io/impiclabs/previews/ishita-kishore.png?tr=w-788,f-auto,q-80",
    "https://ik.imagekit.io/impiclabs/previews/garima-lohia.png?tr=w-788,f-auto,q-80",
    "https://ik.imagekit.io/impiclabs/previews/harshita-goyal.png?tr=w-788,f-auto,q-80",
  ],
  brand: { "@type": "Brand", name: "UPSCPrepNotes" },
  offers: {
    "@type": "Offer",
    price: "99",
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    priceValidUntil: "2026-08-08",
    url: "https://upscprepnotes.in/toppers/toppers-copy-compilation",
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 7,
      returnMethod: "https://schema.org/ReturnByMail",
      returnFees: "https://schema.org/FreeReturn",
    },
    shippingDetails: {
      "@type": "OfferShippingDetails",
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: {
          "@type": "QuantitativeValue",
          minValue: 0,
          maxValue: 2,
          unitCode: "HUR",
        },
        businessDays: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "https://schema.org/Monday",
            "https://schema.org/Tuesday",
            "https://schema.org/Wednesday",
            "https://schema.org/Thursday",
            "https://schema.org/Friday",
            "https://schema.org/Saturday",
            "https://schema.org/Sunday",
          ],
        },
      },
    },
  },
  category: "UPSC Preparation Materials",
  audience: {
    "@type": "Audience",
    audienceType: "UPSC Civil Services Aspirants",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Are these typed notes or handwritten answer copies?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "These are scanned copies of actual handwritten UPSC Mains answer sheets — exactly as toppers wrote them in the exam hall. They show you real handwriting, structure, underlining, and diagrams that scored 140+.",
      },
    },
    {
      "@type": "Question",
      name: "Are these the actual UPSC answer sheets?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All 50+ copies are real handwritten UPSC Mains answer sheets from verified toppers (AIR 1–1249). Each copy includes the original scorecard for verification.",
      },
    },
    {
      "@type": "Question",
      name: "How is this different from free answer copies on Telegram?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Free copies are scattered and hard to compare. This compilation puts 63 copies in one place, organised by paper and marks, with each topper's rank, year and marks on the copy.",
      },
    },
    {
      "@type": "Question",
      name: "How will I receive the files?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Right after payment you land on a download page with every PDF, organised by paper (GS1–4, Essay, Optional). We also email you the link, so you can download again later.",
      },
    },
    {
      "@type": "Question",
      name: "What if I am not satisfied?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Email us within 7 days of receiving the download link. We will refund your payment. No questions asked.",
      },
    },
    {
      "@type": "Question",
      name: "Can I pay via GPay or PhonePe?",
      acceptedAnswer: {
        "@type": "Answer",
        text: 'Yes. The secure checkout accepts UPI (GPay, PhonePe, Paytm and any UPI app), cards and net banking. The compilation costs ₹199 and the download link is emailed to you right after payment.',
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://upscprepnotes.in" },
    { "@type": "ListItem", position: 2, name: "Toppers", item: "https://upscprepnotes.in/toppers" },
    { "@type": "ListItem", position: 3, name: "Topper Answer Copy Compilation", item: "https://upscprepnotes.in/toppers/toppers-copy-compilation" },
  ],
};

export default async function Page() {
  return (
    <BrandShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SalesPage />
    </BrandShell>
  );
}

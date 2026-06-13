import Script from "next/script";
import SalesPage from "@/components/topper/SalesPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "50+ UPSC Topper Answer Copies + 21 Strategy Guides — ₹799 | UPSCPrepNotes",
  description:
    "Complete UPSC Mains compilation with 50+ verified handwritten topper answer copies (GS1–4, Essay, Optional) + 21 original strategy guides. ₹11 per copy. Pay via UPI. 7-day refund.",
  alternates: {
    canonical: "https://upscprepnotes.in/toppers/toppers-copy-compilation",
  },
  openGraph: {
    title: "UPSC Topper Answer Copy Compilation — 50+ Copies + 21 Guides",
    description:
      "Complete UPSC Mains compilation with 50+ verified handwritten topper answer copies (GS1–4, Essay, Optional) + 21 original strategy guides. ₹11 per copy. 7-day refund.",
    url: "https://upscprepnotes.in/toppers/toppers-copy-compilation",
    images: [{ url: "/previews/ishita-kishore.png", width: 1200, height: 900 }],
  },
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "UPSC Topper Answer Copy Compilation — 50+ Copies + 21 Strategy Guides",
  description:
    "Complete UPSC Mains preparation compilation with 50+ verified handwritten topper answer copies (GS1–4, Essay, Optional) + 21 original strategy guides. Organized by paper, marks, and year. Includes AI assistant access and lifetime updates.",
  image: [
    "https://upscprepnotes.in/previews/ishita-kishore.png",
    "https://upscprepnotes.in/previews/garima-lohia.png",
    "https://upscprepnotes.in/previews/harshita-goyal.png",
  ],
  brand: { "@type": "Brand", name: "UPSCPrepNotes" },
  offers: {
    "@type": "Offer",
    price: "799",
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    priceValidUntil: "2027-12-31",
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
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    bestRating: "5",
    ratingCount: "2300",
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
        text: "Free copies are scattered, unverified, and low-quality scans. This is a curated compilation organized by paper and marks — with original strategy guides, examiner commentary, and AI access that no free source provides.",
      },
    },
    {
      "@type": "Question",
      name: "How will I receive the files?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "After payment verification, we email you a download link. The compilation comes as a single ZIP file organized by paper (GS1–4, Essay, Optional). You get lifetime access and free updates.",
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
        text: 'Yes. Pay directly via UPI to rakhangezaid8@pingpay through GPay, PhonePe, or any UPI app. The compilation costs ₹799 and you receive the download link via email within 2 hours.',
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

export default function Page() {
  return (
    <>
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
    </>
  );
}

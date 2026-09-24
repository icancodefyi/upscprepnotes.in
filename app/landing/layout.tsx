import type { Metadata } from "next";
import Script from "next/script";
import "./altruist.css";
import { LANDING_FAQS } from "@/components/landing/faqs-data";

export const metadata: Metadata = {
  title: "UPSCPrepNotes — Topper Answer Copies, Marksheets, AI Mentor & Strategy Guides for UPSC CSE",
  description:
    "Access 280+ UPSC topper profiles with verified marks, 50+ handwritten answer copies (GS1-4, Essay, Optional), optional subject analysis, AI mentor, and a curated store of strategy compilations.",
  openGraph: {
    title: "UPSCPrepNotes — Topper Answer Copies, Marksheets, AI Mentor & Strategy Guides",
    description:
      "Master UPSC CSE with 280+ topper profiles, 50+ handwritten answer copies, marks breakdowns, optional subject analysis, an AI mentor for prep guidance, and a curated store.",
    url: "https://upscprepnotes.in",
    siteName: "UPSCPrepNotes",
    images: [{ url: "/logo.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UPSCPrepNotes — Topper Answer Copies, Marksheets, AI Mentor & Strategy Guides",
    description:
      "Master UPSC CSE with 280+ topper profiles, 50+ handwritten answer copies, optional analysis, and an AI mentor.",
  },
  alternates: {
    canonical: "https://upscprepnotes.in",
  },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "UPSCPrepNotes — Topper Strategies, Answer Copies & Marksheets",
  description:
    "India's UPSC preparation intelligence platform. 280+ topper profiles, 50+ verified handwritten answer copies, marks breakdowns, optional subject analysis, and AI-powered preparation insights.",
  url: "https://upscprepnotes.in",
  publisher: {
    "@type": "Organization",
    name: "UPSCPrepNotes",
    url: "https://upscprepnotes.in",
    logo: "https://upscprepnotes.in/logo.png",
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://upscprepnotes.in",
      },
    ],
  },
};

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: LANDING_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="landing-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <Script
        id="landing-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      {children}
    </>
  );
}

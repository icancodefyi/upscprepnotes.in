import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import Header from "@/components/header";
import Footer from "@/components/footer";


const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "UPSCPrepNotes — Topper Strategies, Answer Copies & Marksheets",
  description:
    "India's UPSC preparation intelligence platform. Access 280+ topper profiles, marks breakdowns, answer copies, optional subject analysis, and AI-powered preparation insights.",
  alternates: {
    canonical: "https://upscprepnotes.in",
  },
  openGraph: {
    title: "UPSCPrepNotes — Topper Strategies, Answer Copies & Marksheets",
    description:
      "Structured topper profiles, marksheet analysis, optional subject trends, and preparation strategies for UPSC aspirants.",
    url: "https://upscprepnotes.in",
  },
  keywords: [
    "UPSC",
    "UPSC CSE",
    "UPSC toppers",
    "IAS preparation",
    "UPSC answer copies",
    "UPSC marksheets",
    "UPSC strategy",
    "Civil Services Examination",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", plusJakarta.variable)}>
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
            `,
          }}
        />

        {/* Umami Analytics */}
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="51e3b8aa-4637-4e44-abd3-b35c0d386331"
        ></script>

        {/* Organization Schema */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "UPSCPrepNotes",
              url: "https://upscprepnotes.in",
              description:
                "Structured UPSC preparation intelligence with topper profiles, marksheets, and optional subject insights",
              logo: {
                "@type": "ImageObject",
                url: "https://upscprepnotes.in/logo.png",
                width: 512,
                height: 512,
              },
              sameAs: [],
            }),
          }}
        />
      </head>
      <body
        className={`${plusJakarta.variable} ${jetbrainsMono.variable} antialiased bg-[#F8F9FA]`}
      >
        {/* Announcement Strip */}
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-2.5 px-3 sm:px-4 sticky top-0 z-50 border-b border-gray-800">
          <a
            href="/toppers/toppers-copy-compilation"
            className="w-full text-[11px] sm:text-xs font-medium tracking-wide hover:text-gray-300 transition-colors cursor-pointer block text-center"
          >
            <span className="font-bold">30+ UPSC Resources Bundle</span>
            <span className="text-white/60 mx-2">·</span>
            <span className="text-[#C4F9D7] font-semibold">21 Guides + Topper Copies</span>
            <span className="text-white/60 mx-2">·</span>
            <span>₹799 Launch Offer →</span>
          </a>
        </div>

        <TooltipProvider>
          <Header />
          {children}
          <Footer />
          <ExitIntentPopup />
        </TooltipProvider>
      </body>
    </html>
  );
}

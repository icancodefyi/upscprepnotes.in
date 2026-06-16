import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppShell from "@/components/AppShell";
import AuthProvider from "@/components/AuthProvider";
import AnalyticsScripts from "@/components/AnalyticsScripts";
import CookieConsent from "@/components/CookieConsent";

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
  title: {
    default: "UPSCPrepNotes — Topper Strategies, Answer Copies & Marksheets",
    template: "%s | UPSCPrepNotes",
  },
  description:
    "India's UPSC preparation intelligence platform. 280+ topper profiles, 50+ verified handwritten answer copies (GS1–4, Essay, Optional), marks breakdowns, optional subject analysis, and AI-powered preparation insights.",
  metadataBase: new URL("https://upscprepnotes.in"),
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {},
  openGraph: {
    title: "UPSCPrepNotes — Topper Strategies, Answer Copies & Marksheets",
    description:
      "Structured topper profiles, marksheet analysis, 50+ handwritten answer copies, optional subject trends, and preparation strategies for UPSC aspirants.",
    url: "https://upscprepnotes.in",
    siteName: "UPSCPrepNotes",
    images: [{ url: "/logo.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UPSCPrepNotes — Topper Strategies, Answer Copies & Marksheets",
    description:
      "India's UPSC preparation intelligence platform. 280+ topper profiles, 50+ handwritten answer copies, optional analysis.",
  },
  keywords: [
    "UPSC",
    "UPSC CSE",
    "UPSC toppers",
    "IAS preparation",
    "UPSC answer copies",
    "topper answer sheets",
    "UPSC marksheets",
    "UPSC strategy",
    "Civil Services Examination",
    "handwritten answer copies",
    "topper compilation",
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
        <AnalyticsScripts />

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
              sameAs: [
                "https://www.youtube.com/@upscprepnotes",
                "https://www.instagram.com/upscprepnotes.in/",
              ],
            }),
          }}
        />

        {/* WebSite Schema */}
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "UPSCPrepNotes",
              url: "https://upscprepnotes.in",
              description:
                "India's UPSC preparation intelligence platform. Access 280+ topper profiles, marks breakdowns, answer copies, and optional subject analysis.",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://upscprepnotes.in/search?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${plusJakarta.variable} ${jetbrainsMono.variable} antialiased bg-[#F8F9FA]`}
      >
        <TooltipProvider>
          <AuthProvider>
            <AppShell>
              {children}
            </AppShell>
            <CookieConsent />
          </AuthProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}

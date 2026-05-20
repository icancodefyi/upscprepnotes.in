import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UPSCPrepNotes — Structured UPSC preparation intelligence",
  description:
    "UPSCPrepNotes: topper strategies, marksheets, optional subject insights, and preparation intelligence for UPSC aspirants.",
  alternates: {
    canonical: "https://upscprepnotes.in",
  },
  openGraph: {
    title: "UPSCPrepNotes — Structured UPSC preparation intelligence",
    description:
      "Structured topper profiles, marksheet analysis, optional subject trends, and preparation strategies.",
    url: "https://upscprepnotes.in",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-mono", jetbrainsMono.variable)}>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Z58V360ESL"
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
              gtag('config', 'G-Z58V360ESL');
            `,
          }}
        />

        {/* Umami Analytics */}
        <script defer src="https://cloud.umami.is/script.js" data-website-id="51e3b8aa-4637-4e44-abd3-b35c0d386331"></script>

        {/* Organization Schema */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "UPSCPrepNotes",
              "url": "https://upscprepnotes.in",
              "description": "Structured UPSC preparation intelligence with topper profiles, marksheets, and optional subject insights",
              "logo": {
                "@type": "ImageObject",
                "url": "https://upscprepnotes.in/logo.png",
                "width": 512,
                "height": 512,
              },
              "sameAs": [],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}

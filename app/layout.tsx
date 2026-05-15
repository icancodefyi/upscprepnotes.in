import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

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
    <html lang="en" className={inter.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

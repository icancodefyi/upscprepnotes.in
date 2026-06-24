import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllToppersList } from "@/services/topper.service";
import SearchClient from "./SearchClient";

export const metadata: Metadata = {
  title: "Search — UPSC Toppers, Answer Copies & Resources",
  description: "Search 280+ UPSC topper profiles, optional subject analysis, answer copies, and preparation resources on UPSCPrepNotes.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "https://upscprepnotes.in/search",
  },
  openGraph: {
    title: "Search — UPSC Toppers, Answer Copies & Resources",
    description: "Search 280+ UPSC topper profiles, optional subject analysis, answer copies, and preparation resources on UPSCPrepNotes.",
    url: "https://upscprepnotes.in/search",
    siteName: "UPSCPrepNotes",
    images: [{ url: "/og/default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og/default.png"],
  },
};

export default async function SearchPage() {
  const toppers = await getAllToppersList();
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-4xl px-6 py-24 text-center text-sm text-zinc-500">Loading...</div>
    }>
      <SearchClient toppers={toppers} />
    </Suspense>
  );
}

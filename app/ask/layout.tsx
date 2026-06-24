import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Mentor for UPSC — Ask Any UPSC Preparation Question Free",
  description:
    "Get instant answers from an AI trained on 280+ UPSC topper strategies, answer copies, marksheets, and optional subject analysis. Ask about preparation strategy, marks, books, optional subjects, and more — free.",
  openGraph: {
    title: "AI Mentor for UPSC — Ask Any Preparation Question Free",
    description:
      "Get instant AI answers trained on 280+ topper strategies, answer copies, marksheets, and optional analysis. Ask about UPSC prep free.",
    url: "https://upscprepnotes.in/ask",
    siteName: "UPSCPrepNotes",
    images: [{ url: "/logo.png", width: 512, height: 512 }],
  },
  alternates: {
    canonical: "https://upscprepnotes.in/ask",
  },
};

export default function AskLayout({ children }: { children: React.ReactNode }) {
  return children;
}

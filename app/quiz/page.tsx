import type { Metadata } from "next";
import { brandFonts } from "@/components/brand/fonts";
import "@/components/brand/brand.css";
import Quiz from "@/components/quiz/Quiz";
import { QUIZ_LIVE } from "@/lib/quiz/config";

export const metadata: Metadata = {
  title: "Daily UPSC Prelims quiz | UPSCPrepNotes",
  description: "Five real UPSC Prelims questions a day, marked the exam way: +2 right, −0.66 wrong. Play with Gilu, keep your streak, level up.",
  alternates: { canonical: "https://upscprepnotes.in/quiz" },
  // Hidden from search until the answers are verified and QUIZ_LIVE is switched on.
  robots: { index: QUIZ_LIVE, follow: QUIZ_LIVE },
  manifest: "/quiz/manifest.webmanifest",
  appleWebApp: { capable: true, title: "UPSC Quiz", statusBarStyle: "default" },
};

export default function QuizPage() {
  return (
    <div className={`up ${brandFonts} min-h-dvh`} style={{ background: "#f4f5f9" }}>
      <Quiz />
    </div>
  );
}

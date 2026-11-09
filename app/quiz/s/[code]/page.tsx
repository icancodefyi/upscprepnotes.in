import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { brandFonts } from "@/components/brand/fonts";
import "@/components/brand/brand.css";
import Gilu from "@/components/brand/Gilu";
import ChallengeSeen from "@/components/quiz/ChallengeSeen";
import { parseShareCode, scoreText } from "@/lib/quiz/share";

type Props = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const r = parseShareCode(code);
  const title = r ? `I scored ${scoreText(r.score)}/10 on today's UPSC quiz. Can you beat it?` : "Daily UPSC quiz";
  return {
    title,
    description: "Five real UPSC Prelims questions a day, marked the exam way: +2 right, −0.66 wrong. Free, with Gilu.",
    // Shared results are personal; keep them out of search.
    robots: { index: false, follow: true },
    openGraph: { title, type: "website" },
    twitter: { card: "summary_large_image", title },
  };
}

/** Where a "beat my score" link lands: the friend's result, then one tap into today's quiz. */
export default async function ChallengePage({ params }: Props) {
  const { code } = await params;
  const r = parseShareCode(code);
  if (!r) notFound();
  const color = r.score > 0 ? "#1a8a4a" : r.score < 0 ? "#c42b22" : "#0b0c10";

  return (
    <div className={`up ${brandFonts} min-h-dvh`} style={{ background: "#f4f5f9" }}>
      <ChallengeSeen code={code} score={r.score} />
      <main className="mx-auto flex min-h-dvh w-full max-w-[520px] flex-col items-center px-4 pb-12 pt-5 text-center">
        <Link href="/" className="text-[15px] font-bold" style={{ color: "#0b0c10" }}>UPSCPrepNotes</Link>
        <Gilu pose={r.score >= 4 ? "celebrating" : "thinking"} size={200} className="mt-3 h-auto w-[112px]" />
        <p className="mt-2 text-[16px]" style={{ color: "#3f4450" }}>A friend scored</p>
        <p className="tab mt-1 text-[60px] font-bold leading-none tracking-[-0.04em]" style={{ color }}>{scoreText(r.score)}</p>
        <p className="mt-1 text-[15px]" style={{ color: "#5f6571" }}>out of 10 on the daily UPSC quiz</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2 text-[14px] font-bold">
          <span className="rounded-full px-3 py-1.5" style={{ background: "#eafaf0", color: "#1a8a4a" }}>{r.right} right</span>
          <span className="rounded-full px-3 py-1.5" style={{ background: "#fff1ef", color: "#c42b22" }}>{r.wrong} wrong</span>
          <span className="rounded-full px-3 py-1.5" style={{ background: "#eef0f4", color: "#3f4450" }}>{r.skipped} skipped</span>
          {r.streak > 1 && <span className="rounded-full px-3 py-1.5" style={{ background: "#fff3e6", color: "#c2410c" }}>Day {r.streak} streak</span>}
        </div>

        <h1 className="mt-5 text-[28px] font-bold leading-tight tracking-[-0.02em]" style={{ color: "#0b0c10" }}>Can you beat it?</h1>
        <p className="mt-2 max-w-[40ch] text-[16px] leading-relaxed" style={{ color: "#3f4450" }}>
          Five real questions from UPSC&apos;s own Prelims paper. <b style={{ color: "#1a8a4a" }}>+2</b> right,{" "}
          <b style={{ color: "#c42b22" }}>−0.66</b> wrong, <b>0</b> skipped, just like the exam.
        </p>
        <Link
          href="/quiz?utm_source=share&utm_medium=challenge&utm_campaign=quiz"
          data-track="quiz-challenge-play"
          className="mt-4 flex min-h-[54px] w-full items-center justify-center rounded-2xl px-5 text-[17px] font-bold text-white"
          style={{ background: "#1f3fd6", boxShadow: "0 4px 0 #13238a" }}
        >
          Play today&apos;s 5
        </Link>
        <p className="mt-2 text-[13px]" style={{ color: "#5f6571" }}>Free · about 5 minutes · no sign-up</p>
      </main>
    </div>
  );
}

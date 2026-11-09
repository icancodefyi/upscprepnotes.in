import Link from "next/link";
import Gilu from "@/components/brand/Gilu";
import { QUIZ_LIVE } from "@/lib/quiz/config";

/**
 * Promotes the daily quiz on other pages. Renders nothing until QUIZ_LIVE is switched on,
 * so no visitor sees a link to an unpublished quiz.
 *
 * box:       standard card, under related links on content pages.
 * compact:   one slim row, inside dialogs and success screens.
 * spotlight: large homepage section.
 */
export default function QuizTeaser({
  track,
  variant = "box",
  lead,
}: {
  track: string;
  variant?: "box" | "compact" | "spotlight";
  /** Optional first words, e.g. "While you wait:". */
  lead?: string;
}) {
  if (!QUIZ_LIVE) return null;
  const href = `/quiz?utm_source=site&utm_medium=${variant}&utm_campaign=${encodeURIComponent(track)}`;
  const dt = `quiz-teaser-${track}`;

  if (variant === "compact") {
    return (
      <Link
        href={href}
        data-track={dt}
        className="mt-3 flex items-center gap-3 rounded-2xl bg-[#fff8d6] px-3 py-2.5 text-left transition-transform hover:-translate-y-[1px]"
        style={{ boxShadow: "inset 0 0 0 1.5px #f2d36b" }}
      >
        <Gilu pose="thinking" size={48} className="h-auto w-10 shrink-0" />
        <span className="text-[14px] leading-snug" style={{ color: "#0b0c10" }}>
          <b>{lead ?? "Try this:"}</b>{" "}today&apos;s 5 real UPSC Prelims questions, marked the exam way →
        </span>
      </Link>
    );
  }

  if (variant === "spotlight") {
    return (
      <section className="px-4 py-14 sm:py-20">
        <div
          className="mx-auto grid max-w-[1080px] items-center gap-8 rounded-[32px] bg-[#fff8d6] p-6 sm:p-10 md:grid-cols-[auto_1fr]"
          style={{ boxShadow: "inset 0 0 0 1.5px #f2d36b" }}
        >
          <div className="flex justify-center gap-2">
            <Gilu pose="correct" size={180} className="h-auto w-[130px] sm:w-[170px]" />
          </div>
          <div>
            <h2 className="t-head text-[30px] sm:text-[40px]">The daily UPSC quiz</h2>
            <p className="mt-3 max-w-[52ch] text-[17px] leading-relaxed" style={{ color: "#3f4450" }}>
              Five real questions from UPSC&apos;s own Prelims paper, every day. Marked the exam way:{" "}
              <b style={{ color: "#1a8a4a" }}>+2</b> right, <b style={{ color: "#c42b22" }}>−0.66</b> wrong. Gilu reacts to every answer,
              explains the trap, and keeps your streak.
            </p>
            <Link href={href} data-track={dt} className="btn btn-blue mt-6 inline-flex">
              Play today&apos;s 5
            </Link>
            <p className="mt-2 text-[14px]" style={{ color: "#5f6571" }}>Free · about 5 minutes · no sign-up</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <Link
      href={href}
      data-track={dt}
      className="mt-6 flex items-center gap-4 rounded-2xl bg-[#fff8d6] p-4 transition-transform hover:-translate-y-[1px]"
      style={{ boxShadow: "inset 0 0 0 1.5px #f2d36b" }}
    >
      <Gilu pose="thinking" size={72} className="h-auto w-14 shrink-0" />
      <span className="text-[15px] leading-snug" style={{ color: "#0b0c10" }}>
        <b>{lead ?? "Test yourself:"}</b>{" "}5 real UPSC Prelims questions, marked the exam way. Free, no sign-up →
      </span>
    </Link>
  );
}

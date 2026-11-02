import Link from "next/link";
import type { Counts } from "./types";

const fmt = (n: number) => n.toLocaleString("en-IN");

/** Answers use live counts so the FAQ (and its schema) can't drift from the data. */
export function FAQS(c: Counts) {
  return [
    {
      q: "Where can I find UPSC topper answer copies?",
      a: `Topper profiles on UPSCPrepNotes include free handwritten answer copies where we have them; ${fmt(c.freeCopies)} toppers have one today. If a topper's copy isn't available, the profile says so.`,
    },
    {
      q: "How do I see the paper-wise marks of UPSC toppers?",
      a: `The UPSC marks database lists essay, GS I–IV, optional and interview marks for ${fmt(c.toppers)} toppers from CSE 2022–2025, with ${fmt(c.full)} complete marksheets you can compare paper by paper.`,
    },
    {
      q: "Which optional subject scores the highest in UPSC?",
      a: `Our optional analysis compares topper marks across ${c.optionals} optional subjects. It shows how high each optional has gone for toppers, which is a ceiling rather than a prediction for every candidate.`,
    },
    {
      q: "Is UPSCPrepNotes free?",
      a: `Yes. Topper profiles, the marks database, previous year questions and ${fmt(Math.floor(c.resources / 100) * 100)}+ free study resources are free to read. Only the downloadable compilations in the store are paid.`,
    },
    {
      q: "Where does the marks data come from?",
      a: "Marks are taken from the official UPSC results for each year and entered paper by paper. Our data methodology page explains how each record is checked.",
    },
    {
      q: "Are UPSC previous year questions available?",
      a: `Yes. There are ${fmt(c.pyqs)} UPSC Mains previous year questions for ${c.pyqYears.join(", ")}, organised by year and paper.`,
    },
  ];
}

export default function Faq({ counts }: { counts: Counts }) {
  const faqs = FAQS(counts);
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto grid max-w-[1120px] gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="t-display h-sec">Questions you might be asking.</h2>
          <p className="mt-5 max-w-[24rem] text-m leading-[1.55] text-[var(--ink-2)]">
            Still unsure? Read the <Link href="/faq" className="font-bold text-[var(--accent)] underline decoration-[var(--accent-soft)] underline-offset-4 hover:decoration-[var(--accent)]">full FAQ</Link> or{" "}
            <Link href="/contact" className="font-bold text-[var(--accent)] underline decoration-[var(--accent-soft)] underline-offset-4 hover:decoration-[var(--accent)]">write to us</Link>.
          </p>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <details
              key={f.q}
              open={i === 0}
              className="group rounded-[22px] bg-white p-6 shadow-[0_0_0_1px_var(--line),0_6px_16px_-10px_rgba(11,12,16,0.25)] open:bg-[#f7f8ff] sm:p-7"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 [&::-webkit-details-marker]:hidden">
                <h3 className="t-head pt-1 text-m">{f.q}</h3>
                <span
                  aria-hidden
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--canvas)] text-m transition-transform duration-300 group-open:rotate-45 group-open:bg-[var(--accent)] group-open:text-white"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-[40rem] text-m leading-[1.6] text-[var(--ink-2)]">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

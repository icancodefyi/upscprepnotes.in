import Link from "next/link";
import Outline from "@/components/brand/Outline";
import type { Counts } from "./types";

const fmt = (n: number) => n.toLocaleString("en-IN");

/** Replaces the old "coaching vs us" matrix with what we can actually show: how the data is made. */
export default function Verify({ counts }: { counts: Counts }) {
  const steps = [
    { n: "1", title: "Taken from the published result", body: "Every mark comes from the official UPSC result for that year, entered by hand, paper by paper." },
    { n: "2", title: "Complete or clearly partial", body: `A marksheet counts as complete only when every paper, the interview and the final total are on record. ${fmt(counts.full)} of ${fmt(counts.toppers)} are complete today.` },
    { n: "3", title: "Scans shown as they are", body: "Answer booklets keep their original watermarks and test-series headers. We label the source; we never redraw a page." },
    { n: "4", title: "Only files we hold", body: "Answer copies are linked only when we hold the actual scan. No reconstructed or 'model' answers passed off as a topper's." },
  ];
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto grid max-w-[1120px] gap-14 px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative lg:sticky lg:top-28 lg:self-start">
          <h2 className="t-display h-sec">
            Why you can trust <span className="swipe">these numbers.</span>
          </h2>
          <p className="mt-5 max-w-[28rem] text-m leading-[1.55] text-[var(--ink-2)]">
            Coaching ads claim toppers. We publish their numbers, and show our working.
          </p>
          <Link href="/content/data-methodology-and-editorial-standards" className="btn btn-paper mt-8">
            Read our data methodology <span className="knob">↗</span>
          </Link>
          <div aria-hidden className="relative mt-12 hidden h-44 lg:block">
            <Outline kind="shield" className="-left-3 top-0 h-44 w-60 rotate-[-6deg] text-[var(--accent)]/[0.12]" />
          </div>
        </div>
        <ol className="space-y-4">
          {steps.map((s, i) => (
            <li
              key={s.n}
              className={`relative flex gap-5 rounded-[24px] bg-white p-6 shadow-[0_0_0_1px_var(--line),0_6px_16px_-10px_rgba(11,12,16,0.25)] sm:gap-6 sm:p-7 ${i % 2 ? "sm:ml-7" : ""}`}
            >
              <span className="t-display grid h-11 w-11 shrink-0 place-items-center rounded-full border-[2.5px] border-[var(--mark)] text-m text-[var(--mark)]" style={{ transform: "rotate(-8deg)" }}>
                {s.n}
              </span>
              <div>
                <h3 className="t-head text-m">{s.title}</h3>
                <p className="mt-1.5 text-s leading-[1.6] text-[var(--ink-2)]">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

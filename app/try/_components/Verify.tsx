import Link from "next/link";
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
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="t-display h-sec">
            How we check <span className="swipe">every mark.</span>
          </h2>
          <p className="mt-5 max-w-[28rem] text-[18px] leading-[1.55] text-[var(--ink-2)]">
            Coaching ads claim toppers. We publish their numbers, and show our working.
          </p>
          <Link href="/content/data-methodology-and-editorial-standards" className="btn btn-paper mt-8">
            Read our data methodology <span className="knob">↗</span>
          </Link>
        </div>
        <ol className="space-y-4">
          {steps.map((s, i) => (
            <li
              key={s.n}
              className="relative flex gap-6 rounded-[24px] bg-white p-7 shadow-[0_0_0_1px_var(--line),0_18px_40px_-28px_rgba(11,12,16,0.4)]"
              style={{ marginLeft: `${(i % 2) * 28}px` }}
            >
              <span className="t-display grid h-14 w-14 shrink-0 place-items-center rounded-full border-[2.5px] border-[var(--mark)] text-[26px] text-[var(--mark)]" style={{ transform: "rotate(-8deg)" }}>
                {s.n}
              </span>
              <div>
                <h3 className="t-head text-[22px]">{s.title}</h3>
                <p className="mt-2 text-[15.5px] leading-[1.55] text-[var(--ink-2)]">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

import Link from "next/link";
import ReportLink from "./ReportLink";

export type QA = { q: string; a: string };

export default function TopperFaq({ first, faqs }: { first: string; faqs: QA[] }) {
  return (
    <section className="faq-section py-24 sm:py-32">
      <div className="mx-auto grid max-w-[1120px] gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="t-display h-sec">{`Questions about ${first}.`}</h2>
          <p className="mt-5 max-w-[24rem] text-[18px] leading-[1.55] text-[var(--ink-2)]">
            Every mark here is from UPSC&apos;s published result. Read{" "}
            <Link href="/content/data-methodology-and-editorial-standards" className="font-semibold text-[var(--accent)] underline decoration-[var(--accent-soft)] underline-offset-4 hover:decoration-[var(--accent)]">
              how we collect it
            </Link>
            .
          </p>
          <div className="mt-8">
            <ReportLink first={first} />
          </div>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <details
              key={f.q}
              open={i === 0}
              className="group rounded-[22px] bg-white p-6 shadow-[0_0_0_1px_var(--line),0_6px_16px_-10px_rgba(11,12,16,0.25)] open:bg-[#f7f8ff] sm:p-7"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 [&::-webkit-details-marker]:hidden">
                <h3 className="t-head text-[19px] sm:text-[21px]">{f.q}</h3>
                <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--canvas)] text-[18px] transition-transform duration-300 group-open:rotate-45 group-open:bg-[var(--accent)] group-open:text-white">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-[40rem] text-[16px] leading-[1.6] text-[var(--ink-2)]">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

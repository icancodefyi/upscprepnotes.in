import Link from "next/link";
import type { Counts } from "./types";
import { Pin } from "./Props";

const fmt = (n: number) => n.toLocaleString("en-IN");

/** Who runs the archive. Facts only, taken from /about. */
export default function Founder({ counts }: { counts: Counts }) {
  return (
    <section className="pb-24 sm:pb-32">
      <div className="mx-auto max-w-[1120px] px-6">
        <div className="grid items-center gap-12 rounded-[32px] bg-[var(--canvas)] p-8 sm:p-12 lg:grid-cols-[auto_1fr] lg:gap-16">
          {/* Photo pinned like an ID card on a booklet cover */}
          <div className="relative mx-auto w-[220px] rotate-[-3deg] rounded-[14px] bg-white p-3 pb-5 shadow-[0_0_0_1px_var(--line),0_8px_18px_-10px_rgba(11,12,16,0.35)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://zaid.impiclabs.com/_next/image?url=%2Fprofile.jpg&w=640&q=75"
              alt="Zaid Rakhange"
              loading="lazy"
              className="aspect-square w-full rounded-[8px] object-cover"
            />
            <p className="mt-3 text-center text-[15px] font-semibold tracking-[-0.01em] text-[var(--ink)]">Zaid Rakhange</p>
            <p className="t-meta text-center">Runs UPSCPrepNotes</p>
            <Pin tone="blue" className="absolute -top-5 left-1/2 h-11 w-10 -translate-x-1/2" />
          </div>

          <div>
            <h2 className="t-display h-sec">
              One person, <span className="text-[var(--accent)]">every result PDF.</span>
            </h2>
            <p className="mt-5 max-w-[36rem] text-[18px] leading-[1.55] text-[var(--ink-2)]">
              {`I'm Zaid, a software engineer. I've read every UPSC CSE result published since 2022 and entered the marks myself, paper by paper. That's how ${fmt(counts.toppers)} toppers ended up in one place you can compare.`}
            </p>
            <p className="mt-4 max-w-[36rem] text-[18px] leading-[1.55] text-[var(--ink-2)]">
              Not a coaching institute. If a number looks wrong, tell me and I&apos;ll check it against the result.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/about" className="btn btn-ink">
                About the archive <span className="knob">↗</span>
              </Link>
              <a href="mailto:hello@impiclabs.com" className="text-[15px] font-semibold text-[var(--accent)] hover:underline">
                hello@impiclabs.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

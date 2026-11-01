"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SectionHead from "@/components/brand/SectionHead";

export type StoryPaper = {
  key: string;
  label: string;
  max: number;
  score: number;
  average: number;
  position: number;
};

type Story = {
  name: string;
  rank: number;
  year: number;
  slug: string;
  optional: string;
  total: number;
  compared: number;
  papers: StoryPaper[];
};

const fmt = (n: number) => n.toLocaleString("en-IN");

/** Sentences built only from the numbers. */
function narrate(p: StoryPaper, s: Story, weakestKey: string) {
  const diff = p.score - p.average;
  const vs = diff === 0 ? "Exactly the topper average." : `${Math.abs(diff)} ${diff > 0 ? "above" : "below"} the topper average of ${p.average}.`;
  let note: string;
  if (p.position === 1) note = `The highest ${p.label} score in all ${s.compared} marksheets we hold.`;
  else if (p.position <= 10) note = `Only ${p.position - 1} of ${s.compared} toppers scored higher.`;
  else if (p.key === weakestKey) note = "The weakest paper on the sheet, and still a first-place finish.";
  else note = `Ranked ${p.position} of ${s.compared} toppers on this paper.`;
  return `${vs} ${note}`;
}

export default function MarksStory({ story }: { story: Story }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);
  const steps = story.papers.length;

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.i))),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const weakPaper = story.papers.filter((p) => p.max === 250).reduce((a, b) => (b.score < a.score ? b : a));
  const weakest = story.papers.filter((p) => p.max === 250).reduce((a, b) => (b.score < a.score ? b : a)).key;
  const done = active >= steps;
  const running = done ? story.total : story.papers.slice(0, active + 1).reduce((s, p) => s + p.score, 0);
  const first = story.name.split(" ")[0];
  const written = story.papers.filter((p) => p.key !== "interview").reduce((s, p) => s + p.score, 0);
  const interview = story.papers.find((p) => p.key === "interview")?.score ?? 0;

  return (
    <section className="panel grain relative bg-[var(--accent)] py-24 text-white sm:py-32">
      <div className="mx-auto max-w-[1120px] px-6">
        <SectionHead
          dark
          title={<>Even AIR&nbsp;{story.rank} had a <span className="text-[var(--hl)]">weak paper.</span></>}
          lead={`${story.name} scored ${weakPaper.score} in ${weakPaper.label} and still topped CSE ${story.year} with ${fmt(story.total)} marks. Scroll through every paper, compared with ${story.compared} topper marksheets.`}
        />
      </div>

      {/* Mobile: running total stays visible */}
      <div className="sticky top-[76px] z-20 mx-4 mt-10 rounded-[14px] bg-white px-4 py-3 text-[var(--ink)] shadow-[0_12px_30px_-12px_rgba(0,0,0,0.4)] lg:hidden">
        <div className="flex items-baseline justify-between">
          <span className="text-[13px] text-[var(--muted)]">{done ? "Final total" : story.papers[active]?.label}</span>
          <span className="t-head tab text-[22px]">
            {fmt(running)}
            <span className="ml-1 text-[12px] font-normal tracking-normal text-[var(--muted)]">/ 2,025</span>
          </span>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1120px] gap-10 px-6 lg:mt-8 lg:grid-cols-12">
        <ol className="lg:col-span-6">
          {story.papers.map((p, i) => (
            <li
              key={p.key}
              ref={(el) => { refs.current[i] = el; }}
              data-i={i}
              className={`fade flex min-h-[62vh] flex-col py-12 ${i === 0 ? "justify-start pt-6" : "justify-center"}`}
              style={{ opacity: active === i ? 1 : 0.28 }}
            >
              <p className="t-meta text-white/60">{`${String(i + 1).padStart(2, "0")} — ${p.label}`}</p>
              <p className="t-display tab mt-4 text-[96px] sm:text-[140px]">
                {p.score}
                <span className="ml-3 text-[24px] font-medium tracking-[-0.02em] text-white/55">{`/ ${p.max}`}</span>
              </p>
              <p className="mt-5 max-w-[28rem] text-[19px] leading-[1.55] text-white/80">{narrate(p, story, weakest)}</p>
            </li>
          ))}
          <li
            ref={(el) => { refs.current[steps] = el; }}
            data-i={steps}
            className="flex min-h-[66vh] flex-col justify-center py-12"
          >
            <p className="t-head text-[34px] sm:text-[44px]">{`${fmt(written)} written + ${interview} interview.`}</p>
            <p className="mt-5 max-w-[28rem] text-[19px] leading-[1.55] text-white/80">
              {`No single paper made ${first} AIR ${story.rank}. It was a steady score across all seven. Every topper in the archive has a sheet like this.`}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/upsc-topper/${story.slug}`} data-track="try-story-profile" className="btn bg-white text-[var(--accent)] hover:bg-white/90">
                {`${first}'s full profile`} <span className="knob bg-[var(--accent-soft)]">↗</span>
              </Link>
              <Link href="/toppers/marks-database" data-track="try-story-database" className="btn text-white shadow-[0_0_0_1px_rgba(255,255,255,0.35)] hover:shadow-[0_0_0_1px_#fff]">
                {`Compare all ${story.compared}`}
              </Link>
            </div>
          </li>
        </ol>

        <div className="hidden lg:col-span-6 lg:block">
          <div className="sticky top-[18vh] pb-24">
            <div className="paper ml-auto max-w-[480px] rotate-[1.5deg] p-8 text-[var(--ink)]">
              <div className="flex items-start justify-between border-b border-[var(--line)] pb-5">
                <div>
                  <p className="t-head text-[22px]">{story.name}</p>
                  <p className="t-meta mt-1.5">{`AIR ${story.rank} · CSE ${story.year} · ${story.optional}`}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-0.5">
                {story.papers.map((p, i) => {
                  const filled = i <= active || done;
                  return (
                    <li
                      key={p.key}
                      className="fade grid grid-cols-[1fr_6.5rem_3rem] items-center gap-4 rounded-[10px] px-3 py-2.5 text-[14px]"
                      style={{ background: i === active && !done ? "var(--hl)" : "transparent" }}
                    >
                      <span className={filled ? "" : "text-[var(--muted)]"}>{p.label}</span>
                      <span className="relative h-[6px] overflow-hidden rounded-full bg-[var(--canvas)] shadow-[inset_0_0_0_1px_var(--line)]">
                        <span className="bar absolute inset-0 rounded-full bg-[var(--accent)]" style={{ transform: `scaleX(${filled ? p.score / p.max : 0})` }} />
                      </span>
                      <span className={`tab text-right font-semibold ${filled ? "" : "text-[var(--line-2)]"}`}>{filled ? p.score : "—"}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-5 flex items-end justify-between border-t border-[var(--line)] pt-5">
                <span className="text-[13px] text-[var(--muted)]">Total, out of 2,025</span>
                <span className="relative">
                  <span className="t-display tab text-[52px]">{fmt(running)}</span>
                  {done && (
                    <svg aria-hidden viewBox="0 0 160 70" preserveAspectRatio="none" className="pen pointer-events-none absolute -left-4 -top-3 h-[calc(100%+24px)] w-[calc(100%+32px)] overflow-visible">
                      <path
                        d="M18 38 C 18 12, 90 4, 140 16 C 166 24, 156 58, 110 64 C 60 70, 10 60, 22 30"
                        pathLength={1}
                        fill="none"
                        stroke="var(--mark)"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </span>
              </div>
            </div>
            <p className="t-meta ml-auto mt-6 max-w-[480px] text-white/60">Averages use only marksheets with every paper on record.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

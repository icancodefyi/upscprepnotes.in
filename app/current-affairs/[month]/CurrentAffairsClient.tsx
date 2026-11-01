"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { getMonth } from "@/lib/current-affairs-utils";
import AskLink from "@/components/AskLink";
import HeroLeadForm from "@/components/hero/HeroLeadForm";

const card = "rounded-[24px] bg-white shadow-[0_0_0_1px_var(--line-2),0_1px_2px_rgba(11,12,16,0.04)]";

// Each section gets one of the brand's stationery tones, so the edition reads like tabbed notes.
const TONES = [
  { tone: "#DBE2FF", ink: "#13238A" },
  { tone: "#D4F1DF", ink: "#14532d" },
  { tone: "#FDE9C4", ink: "#7a4b00" },
  { tone: "#EBE2FF", ink: "#3b1d8f" },
  { tone: "#FFD8CF", ink: "#8a1f12" },
  { tone: "#FFE45C", ink: "#5C4A00" },
];
const toneOf = (i: number) => TONES[i % TONES.length];

function extractKeyData(body: string): string[] {
  const patterns = [
    /\d[\d,]*\s*(?:%|GW|MW|sq km|crore(?:\s*people)?|lakh(?:\s*crore)?|billion|trillion)/gi,
    /Rs\s[\d,]+(?:\s*(?:lakh|crore|billion|trillion))?/gi,
    /\b\d+(?:th|st|nd|rd)\s*(?:rank|position|place)?/gi,
    /(?:rank|position|No\.)\s*#?\d+/gi,
    /\$\s*[\d,]+(?:\s*(?:billion|trillion|million))?/gi,
  ];
  const results = new Set<string>();
  for (const pat of patterns) {
    const matches = body.match(pat);
    if (matches) matches.forEach((m) => results.add(m.trim()));
  }
  return [...results].slice(0, 4);
}

const SECTION_PRODUCTS: Record<string, { href: string; label: string } | null> = {
  "National News": null,
  "International Relations & Summits": { href: "/store/complete-gs-notes-bundle", label: "Master IR with notes from AIR 9, 16, 82, 86 →" },
  "Economy & Finance": { href: "/store/complete-gs-notes-bundle", label: "Economy prep: GS 3 notes from toppers →" },
  "Environment & Ecology": { href: "/store/complete-gs-notes-bundle", label: "Environment & geography: GS notes from toppers →" },
  "Science & Technology": { href: "/store/complete-gs-notes-bundle", label: "S&T prep with curated topper notes →" },
  "Government Schemes & Policies": { href: "/store/government-schemes-compilation", label: "Get the complete Government Schemes Compendium →" },
  "Important Reports & Indices": null,
  "Awards & Honours": null,
  "Appointments": null,
  "Obituaries": null,
  "Sports": null,
  "Summits, Conferences & Important Days": null,
};

type Section = { title: string; items: { headline: string; body: string }[] };

/** The monthly edition reader (original copy). Sections as tabbed notes; key figures marked with a highlighter. */
export default function CurrentAffairsPage({ slug }: { slug: string }) {
  const data = getMonth(slug);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const toggleCard = useCallback((key: string) => {
    setExpandedCards((p) => ({ ...p, [key]: !p[key] }));
  }, []);
  if (!data) return null;

  function SectionContent({ s, si }: { s: Section; si: number }) {
    const t = toneOf(si);
    const productCta = SECTION_PRODUCTS[s.title];
    return (
      <section className="scroll-mt-28" id={`section-${si}`}>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span aria-hidden className="h-3 w-3 rounded-full" style={{ background: t.tone, boxShadow: `inset 0 0 0 1px ${t.ink}33` }} />
          <h2 className="t-head text-l">{s.title}</h2>
          <span className="ml-auto text-s text-[var(--muted)]">{s.items.length} items</span>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {s.items.map((item, ii) => {
            const key = `${si}-${ii}`;
            const expanded = expandedCards[key];
            const kd = extractKeyData(item.body);
            return (
              <article key={ii} className={`${card} p-5`}>
                <div className="flex items-start gap-3">
                  <span className="tab mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-[8px] text-s font-bold" style={{ background: t.tone, color: t.ink }}>
                    {ii + 1}
                  </span>
                  <h3 className="flex-1 text-m font-bold leading-snug">{item.headline}</h3>
                </div>
                <p className="mt-3 text-s leading-[1.6] text-[var(--ink-2)]">{expanded ? item.body : item.body.length > 180 ? `${item.body.slice(0, 180)}…` : item.body}</p>
                {item.body.length > 180 && (
                  <button onClick={() => toggleCard(key)} className="mt-1 text-s font-bold text-[var(--accent)] hover:underline">
                    {expanded ? "Show less" : "Read more"}
                  </button>
                )}
                {kd.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {kd.map((d, di) => (
                      <span key={di} className="tab rounded-[6px] bg-[#fff8d6] px-2 py-0.5 text-s font-bold text-[var(--hl-ink)]">{d}</span>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {productCta && (
            <Link href={productCta.href} className="text-s font-bold text-[var(--ink)] hover:text-[var(--accent)]">
              {productCta.label}
            </Link>
          )}
          <AskLink query={`Ask about: ${s.title} current affairs`} className="text-s font-bold text-[var(--accent)] hover:underline">
            Ask AI about this section →
          </AskLink>
        </div>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-[1120px] px-6 pb-24">
      <div className={`${card} p-6 sm:p-8`}>
        <p className="text-m font-bold">Free weekly current affairs</p>
        <p className="mt-1 text-s text-[var(--ink-2)]">Get curated UPSC current affairs delivered to your inbox every week. Plus a free Government Schemes compendium (worth ₹99).</p>
        <HeroLeadForm variant="brand" />
        <a href="https://t.me/+2eV0YCTGdNcyNmFl" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-s font-bold text-[var(--accent)] hover:underline">
          Or join on Telegram for daily current affairs →
        </a>
      </div>

      <nav aria-label="Sections" className="sticky top-[76px] z-20 -mx-2 mt-8 overflow-x-auto rounded-[28px] bg-white/90 px-2 py-3 backdrop-blur [scrollbar-width:none]">
        <div className="flex gap-2">
          {data.sections.map((s, i) => (
            <a key={i} href={`#section-${i}`} className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3.5 py-2 text-s text-[var(--ink-2)] shadow-[0_0_0_1px_var(--line-2)] hover:text-[var(--ink)]">
              <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: toneOf(i).tone, boxShadow: `inset 0 0 0 1px ${toneOf(i).ink}55` }} />
              {s.title}
            </a>
          ))}
        </div>
      </nav>

      <div className="mt-10 space-y-16">
        {data.sections.map((s, si) => (
          <SectionContent key={si} s={s} si={si} />
        ))}
      </div>

      <div className="mt-16 grid gap-4 md:grid-cols-2">
        <div className={`${card} p-6 sm:p-8`}>
          <p className="text-m font-bold">Test your knowledge</p>
          <p className="mt-1 text-s text-[var(--ink-2)]">Ask our AI to generate practice questions from any section.</p>
          <Link href="/ask" className="btn btn-ink mt-5 h-11 px-5 [--btn-fs:14px]">
            Generate Quiz →
          </Link>
        </div>
        <div className={`${card} p-6 sm:p-8`}>
          <p className="text-m font-bold">Deepen your preparation</p>
          <p className="mt-1 text-s text-[var(--ink-2)]">Connect current affairs to the syllabus with curated notes from rank holders.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/store/government-schemes-compilation" className="btn btn-paper h-10 px-4 [--btn-fs:14px]">
              Schemes Compendium
            </Link>
            <Link href="/store/complete-gs-notes-bundle" className="btn btn-paper h-10 px-4 [--btn-fs:14px]">
              Complete GS Notes
            </Link>
            <Link href="/store" className="btn btn-ink h-10 px-4 [--btn-fs:14px]">
              Browse All Products →
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center">
        <p className="text-s text-[var(--muted)]">UPSCPrepNotes · {data.month} {data.year} Edition · Free for all</p>
        <div className="mt-2 flex flex-wrap justify-center gap-3 text-s">
          <Link href="/current-affairs" className="font-bold text-[var(--ink-2)] hover:text-[var(--accent)]">All Editions</Link>
          <span aria-hidden className="text-[var(--line-2)]">·</span>
          <Link href={`/api/generate-current-affairs?month=${slug}`} className="font-bold text-[var(--ink-2)] hover:text-[var(--accent)]">Download PDF</Link>
        </div>
      </div>
    </div>
  );
}

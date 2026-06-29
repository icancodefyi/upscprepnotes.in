"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { MAY_2026 } from "@/lib/current-affairs-content";
import HeroLeadForm from "@/components/hero/HeroLeadForm";

const CANVAS = "#f6f5f4";
const SURFACE = "#ffffff";
const INK = "#000000";
const INK_MUTED = "#615d59";
const INK_FAINT = "#a39e98";
const HAIRLINE = "#e6e6e6";

const STICKER: Record<string, string> = {
  sky: "#62aef0", purple: "#d6b6f6", pink: "#ff64c8",
  orange: "#dd5b00", teal: "#2a9d99", green: "#1aae39",
};

const SECTION_DOTS: Record<string, string> = {
  "National News": STICKER.sky,
  "International Relations & Summits": STICKER.purple,
  "Economy & Finance": STICKER.green,
  "Environment & Ecology": STICKER.teal,
  "Science & Technology": STICKER.orange,
  "Government Schemes & Policies": STICKER.pink,
  "Important Reports & Indices": STICKER.sky,
  "Awards & Honours": STICKER.purple,
  "Appointments": STICKER.teal,
  "Obituaries": INK_FAINT,
  "Sports": STICKER.orange,
  "Summits, Conferences & Important Days": STICKER.pink,
};

function dotColor(title: string) { return SECTION_DOTS[title] || INK_FAINT; }

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
  "Environment & Ecology": { href: "/store/places-in-news", label: "Environment & geography: Places in News compilation →" },
  "Science & Technology": { href: "/store/complete-gs-notes-bundle", label: "S&T prep with curated topper notes →" },
  "Government Schemes & Policies": { href: "/store/government-schemes-compilation", label: "Get the complete Government Schemes Compendium →" },
  "Important Reports & Indices": null,
  "Awards & Honours": null,
  "Appointments": null,
  "Obituaries": null,
  "Sports": null,
  "Summits, Conferences & Important Days": null,
};

export default function CurrentAffairsPage() {
  const data = MAY_2026;
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleCard = useCallback((key: string) => {
    setExpandedCards((p) => ({ ...p, [key]: !p[key] }));
  }, []);

  function SectionContent({ s, si }: { s: typeof data.sections[0]; si: number }) {
    const dot = dotColor(s.title);
    const productCta = SECTION_PRODUCTS[s.title];
    return (
      <div className="mb-20 last:mb-0 scroll-mt-24" id={`section-${si}`}>
        <div className="flex items-center gap-3 mb-6">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: dot }} />
          <h2 className="text-[22px] font-bold tracking-[-0.25px]" style={{ color: INK }}>{s.title}</h2>
          <span style={{ color: INK_FAINT }} className="ml-auto text-[14px]">{s.items.length} items</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {s.items.map((item, ii) => {
            const key = `${si}-${ii}`;
            const expanded = expandedCards[key];
            const kd = extractKeyData(item.body);
            return (
              <div key={ii} className="rounded-xl p-5 transition hover:shadow-[0_0.175px_1.041px_rgba(0,0,0,0.01),0_0.8px_2.925px_rgba(0,0,0,0.02),0_2.025px_7.847px_rgba(0,0,0,0.027),0_4px_18px_rgba(0,0,0,0.04)]" style={{ backgroundColor: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <div className="flex items-start justify-between gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white" style={{ backgroundColor: dot }}>{ii + 1}</span>
                  <h3 className="flex-1 text-[15px] font-bold leading-snug tracking-[-0.125px]" style={{ color: INK }}>{item.headline}</h3>
                </div>
                <p className={`mt-3 text-[14px] leading-[1.5] transition-all`} style={{ color: INK_MUTED }}>{expanded ? item.body : item.body.length > 180 ? `${item.body.slice(0, 180)}…` : item.body}</p>
                {item.body.length > 180 && (
                  <button onClick={() => toggleCard(key)} className="mt-1 text-[13px] font-medium transition" style={{ color: INK_FAINT }}>{expanded ? "Show less" : "Read more"}</button>
                )}
                {kd.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {kd.map((d, di) => (
                      <span key={di} className="rounded px-2 py-0.5 text-[12px] font-medium" style={{ backgroundColor: CANVAS, border: `1px solid ${HAIRLINE}`, color: INK_MUTED }}>{d}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {productCta && (
          <div className="mt-4">
            <Link
              href={productCta.href}
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold transition hover:opacity-70"
              style={{ color: INK }}
            >
              {productCta.label}
            </Link>
          </div>
        )}
        <div className="mt-4">
          <Link
            href={`/ask?q=${encodeURIComponent(`Ask about: ${s.title} current affairs`)}`}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium transition hover:opacity-70"
            style={{ color: INK_FAINT }}
          >
            Ask AI about this section →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main style={{ backgroundColor: CANVAS, minHeight: "100vh" }}>
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-8">
        {/* Title */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white px-3 py-1 text-[12px] font-semibold tracking-[0.125px]" style={{ color: INK_MUTED, borderColor: HAIRLINE }}>
            Monthly Edition
          </span>
          <h1 className="mt-4 text-[40px] font-bold leading-[1.08] tracking-[-1.5px]" style={{ color: INK }}>
            {data.month} {data.year}
          </h1>
          <p className="mt-3 text-[16px] leading-[1.6]" style={{ color: INK_MUTED }}>
            {data.sections.length} sections · {data.sections.reduce((a, s) => a + s.items.length, 0)} topics
          </p>
        </div>

        {/* Email Capture */}
        <div className="mt-8 rounded-xl p-6 sm:p-8" style={{ backgroundColor: SURFACE, border: `2px solid ${INK}` }}>
          <p className="text-[13px] font-bold uppercase tracking-wider" style={{ color: INK }}>Free weekly current affairs</p>
          <p className="mt-1 text-[14px]" style={{ color: INK_MUTED }}>Get curated UPSC current affairs delivered to your inbox every week. Plus a free Government Schemes compendium (worth ₹99).</p>
          <HeroLeadForm />
          <a
            href="https://t.me/+VYMxrig-a8AzZmNl"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 rounded-xl border-2 border-[#0088cc]/30 bg-[#e8f4fd] px-4 py-2.5 text-xs font-semibold text-[#0088cc] transition hover:bg-[#d4edfc]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            Or join on Telegram for daily current affairs →
          </a>
        </div>

        {/* Section Index */}
        <div className="mt-8 flex flex-wrap gap-2">
          {data.sections.map((s, i) => (
            <a
              key={i}
              href={`#section-${i}`}
              className="inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-[12px] font-medium transition hover:opacity-70"
              style={{ backgroundColor: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_MUTED }}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: dotColor(s.title) }} />
              {s.title}
            </a>
          ))}
        </div>

        {/* Content */}
        <div className="mt-10 space-y-4">
          {data.sections.map((s, si) => <SectionContent key={si} s={s} si={si} />)}
        </div>

        {/* Bottom: Quiz CTA + Store */}
        <div className="mt-16 space-y-4">
          <div className="rounded-xl p-6 sm:p-8" style={{ backgroundColor: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="text-[15px] font-bold" style={{ color: INK }}>Test your knowledge</p>
            <p className="mt-1 text-[14px]" style={{ color: INK_MUTED }}>Ask our AI to generate practice questions from any section.</p>
            <Link
              href="/ask"
              className="mt-3 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold text-white transition hover:scale-95"
              style={{ backgroundColor: INK }}
            >
              Generate Quiz →
            </Link>
          </div>

          <div className="rounded-xl p-6 sm:p-8" style={{ backgroundColor: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="text-[15px] font-bold" style={{ color: INK }}>Deepen your preparation</p>
            <p className="mt-1 text-[14px]" style={{ color: INK_MUTED }}>Connect current affairs to the syllabus with curated notes from rank holders.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/store/government-schemes-compilation" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold transition hover:scale-95" style={{ backgroundColor: CANVAS, border: `1px solid ${HAIRLINE}`, color: INK }}>
                Schemes Compendium
              </Link>
              <Link href="/store/places-in-news" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold transition hover:scale-95" style={{ backgroundColor: CANVAS, border: `1px solid ${HAIRLINE}`, color: INK }}>
                Places in News
              </Link>
              <Link href="/store/complete-gs-notes-bundle" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold transition hover:scale-95" style={{ backgroundColor: CANVAS, border: `1px solid ${HAIRLINE}`, color: INK }}>
                Complete GS Notes
              </Link>
              <Link href="/store" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold text-white transition hover:scale-95" style={{ backgroundColor: INK }}>
                Browse All Products →
              </Link>
            </div>
          </div>

          <div className="rounded-xl p-6 sm:p-8 text-center" style={{ backgroundColor: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="text-[13px]" style={{ color: INK_FAINT }}>UPSCPrepNotes · {data.month} {data.year} Edition · Free for all</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <Link href="/current-affairs/2025" className="text-[13px] font-medium underline-offset-4 hover:underline" style={{ color: INK_MUTED }}>2025 Yearly Compilation</Link>
              <span style={{ color: INK_FAINT }}>·</span>
              <Link href="/current-affairs" className="text-[13px] font-medium underline-offset-4 hover:underline" style={{ color: INK_MUTED }}>All Editions</Link>
              <span style={{ color: INK_FAINT }}>·</span>
              <Link href="/api/generate-current-affairs?month=may-2026" className="text-[13px] font-medium underline-offset-4 hover:underline" style={{ color: INK_MUTED }}>Download PDF</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

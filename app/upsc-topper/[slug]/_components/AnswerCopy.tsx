"use client";

import { useState } from "react";
import Link from "next/link";
import Lens from "@/components/brand/Lens";
import { Paperclip } from "@/components/brand/Props";
import SectionHead from "@/components/brand/SectionHead";

export type FreeTopper = { name: string; slug: string; rank: number; year: number; optional: string; same: boolean };
export type Compilation = { href: string; title: string; price: number; detail: string };

type Props = {
  name: string;
  first: string;
  slug: string;
  pdfCount: number;
  preview: string | null;
  others: FreeTopper[];
  compilation: Compilation | null;
};

/** Email gate for the free PDF. Posts to the existing /api/free-download, which records the lead and emails the files. */
function Unlock({ slug, first, pdfCount }: { slug: string; first: string; pdfCount: number }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [urls, setUrls] = useState<string[]>([]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/free-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), topperSlug: slug, source: "topper_page_v2", sourceUrl: window.location.href }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUrls(data.pdfUrls ?? []);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="mt-8">
        <p className="text-[15.5px] font-semibold text-[var(--ink)]">{`Here ${urls.length > 1 ? "they are" : "it is"}. We've also emailed the link${urls.length > 1 ? "s" : ""} to you.`}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {urls.map((u, i) => (
            <a key={u} href={u} target="_blank" rel="noopener noreferrer" data-track="topper-copy-download" className="btn btn-blue">
              {urls.length > 1 ? `Download booklet ${i + 1}` : "Download the PDF"} <span className="knob">↓</span>
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8 max-w-[30rem]">
      <label htmlFor="copy-email" className="text-[14px] font-medium text-[var(--ink-2)]">
        {`Enter your email to download ${first}'s ${pdfCount > 1 ? `${pdfCount} booklets` : "booklet"}, free.`}
      </label>
      <div className="mt-2.5 flex items-center rounded-full bg-white p-1.5 pl-5 shadow-[0_0_0_1px_var(--line-2)] focus-within:shadow-[0_0_0_2px_var(--accent)]">
        <input
          id="copy-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          disabled={status === "loading"}
          className="min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-[var(--muted)]"
        />
        <button type="submit" disabled={status === "loading"} data-track="topper-copy-unlock" className="btn btn-ink h-11">
          {status === "loading" ? "Getting it…" : "Get the PDF"}
        </button>
      </div>
      {status === "error" && <p className="mt-2 text-[14px] text-[var(--mark-deep)]">That didn&apos;t go through. Try again in a moment.</p>}
      <p className="mt-3 text-[13px] text-[var(--muted)]">The download opens here straight away. Occasional topper breakdowns by email; unsubscribe any time.</p>
    </form>
  );
}

/** A stack of booklets standing in for a PDF we have but haven't rendered a preview of. */
function Booklets({ name, count }: { name: string; count: number }) {
  return (
    <div aria-hidden className="relative mx-auto h-[380px] w-full max-w-[320px]">
      {Array.from({ length: Math.min(count, 3) }).map((_, k, arr) => (
        <div
          key={k}
          className="paper absolute inset-x-4 top-6 h-[330px] p-6"
          style={{ transform: `rotate(${(k - (arr.length - 1) / 2) * 5}deg) translateY(${k * -6}px)`, zIndex: k }}
        >
          {k === arr.length - 1 && (
            <>
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                <span className="t-meta">UPSC · CSE MAINS</span>
                <span className="t-meta">QCAB</span>
              </div>
              <p className="t-head mt-5 text-[22px]">{name}</p>
              <p className="t-meta mt-1">ANSWER BOOKLET</p>
              <div className="mt-6 space-y-3">
                {[92, 80, 88, 70, 84, 64].map((w, i) => (
                  <span key={i} className="block h-[2px] rounded-full bg-[rgba(31,63,214,0.18)]" style={{ width: `${w}%` }} />
                ))}
              </div>
            </>
          )}
        </div>
      ))}
      <Paperclip className="absolute -top-1 left-12 z-10 h-[76px] w-[28px] rotate-[6deg]" />
    </div>
  );
}

export default function AnswerCopy({ name, first, slug, pdfCount, preview, others, compilation }: Props) {
  const hasPdf = pdfCount > 0;

  const title = hasPdf ? (
    <>{`Read ${first}'s `}<span className="swipe">answer copy.</span></>
  ) : preview ? (
    <>{`A page from ${first}'s `}<span className="swipe">answer booklet.</span></>
  ) : (
    <>{`We don't hold ${first}'s `}<span className="text-[var(--accent)]">answer copy yet.</span></>
  );

  const lead = hasPdf
    ? `A real booklet in ${first}'s own handwriting: headings, diagrams, underlining and the examiner's marks. The header shows where it comes from, often a coaching test series.`
    : preview
      ? `A real page in ${first}'s own handwriting, with the examiner's marks. Move your cursor over it to read it closely. The header shows where it comes from.`
      : `We only link copies we actually hold, and we haven't found a scan of ${first}'s booklet. These toppers' copies are free to read right now.`;

  return (
    <section id="answer-copy" className="panel scroll-mt-24 bg-[var(--canvas)] py-24 sm:py-32">
      <div className="mx-auto max-w-[1120px] px-6">
        {hasPdf || preview ? (
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <h2 className="t-display h-sec">{title}</h2>
              <p className="mt-5 max-w-[32rem] text-[18px] leading-[1.55] text-[var(--ink-2)]">{lead}</p>
              {hasPdf ? (
                <Unlock slug={slug} first={first} pdfCount={pdfCount} />
              ) : (
                compilation && (
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link href={compilation.href} data-track="topper-copy-compilation" className="btn btn-blue">
                      {`See the ${compilation.title}`} <span className="knob">↗</span>
                    </Link>
                    <span className="text-[14px] text-[var(--muted)]">{compilation.detail}</span>
                  </div>
                )
              )}
            </div>
            <div className="relative">
              {preview ? (
                <div className="paper relative mx-auto max-w-[420px] rotate-[1.5deg] overflow-hidden p-2">
                  <Lens src={preview} imgClassName="aspect-[5/7] object-cover object-top" alt={`${name}'s UPSC Mains answer booklet, first page`} />
                  <Paperclip className="absolute -top-2 left-10 h-[76px] w-[28px] rotate-[4deg]" />
                </div>
              ) : (
                <Booklets name={name} count={pdfCount} />
              )}
            </div>
          </div>
        ) : (
          <SectionHead title={title} lead={lead} />
        )}

        {!hasPdf && others.length > 0 && (
          <div className="mt-14">
            {(hasPdf || preview) && <h3 className="t-head text-[24px]">Free answer copies from other toppers</h3>}
            <ul className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${hasPdf || preview ? "mt-6" : ""}`}>
              {others.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/upsc-topper/${t.slug}#answer-copy`}
                    data-track="topper-copy-other"
                    className="group flex h-full items-center gap-4 rounded-[20px] bg-white p-5 shadow-[0_0_0_1px_var(--line),0_6px_16px_-12px_rgba(11,12,16,0.25)] transition-transform duration-200 ease-[var(--ease)] hover:-translate-y-1"
                  >
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border-[2.5px] border-[var(--mark)] text-[var(--mark)]" style={{ transform: "rotate(-8deg)" }}>
                      <span className="text-center leading-none">
                        <span className="block text-[9px] font-bold tracking-[0.08em]">AIR</span>
                        <span className="t-display tab block text-[18px]">{t.rank}</span>
                      </span>
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[16px] font-semibold group-hover:text-[var(--accent)]">{t.name}</span>
                      <span className="block truncate text-[13.5px] text-[var(--ink-2)]">{`CSE ${t.year} · ${t.optional}`}</span>
                      {t.same && <span className="mt-1.5 inline-block rounded-full bg-[var(--hl)] px-2 py-0.5 text-[11px] font-semibold text-[var(--hl-ink)]">Same optional</span>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

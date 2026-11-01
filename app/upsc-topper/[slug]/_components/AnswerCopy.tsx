"use client";

import { useState } from "react";
import Link from "next/link";
import Lens from "@/components/brand/Lens";
import { Paperclip } from "@/components/brand/Props";
import { Avatar, card } from "@/components/brand/ui";

export type FreeTopper = { name: string; slug: string; rank: number; year: number; optional: string; same: boolean; avatar: string };
export type Compilation = { href: string; title: string; price: number; detail: string; image: string | null };

type Props = {
  name: string;
  first: string;
  slug: string;
  pdfCount: number;
  preview: string | null;
  requests: number;
  others: FreeTopper[];
  compilation: Compilation | null;
};

const fmt = (n: number) => n.toLocaleString("en-IN");

/** Email gate for the free PDF. Posts to /api/free-download, which records the lead and emails the files. */
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
      <div className="mt-5">
        <p className="text-m font-bold">{`Ready. We've also emailed the link${urls.length > 1 ? "s" : ""} to you.`}</p>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {urls.map((u, i) => (
            <a key={u} href={u} target="_blank" rel="noopener noreferrer" data-track="topper-copy-download" className="btn btn-blue h-11">
              {urls.length > 1 ? `Booklet ${i + 1}` : "Download PDF"} <span className="knob">↓</span>
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-5">
      <label htmlFor="copy-email" className="sr-only">Email address</label>
      <div className="flex items-center rounded-full bg-[var(--canvas)] p-1.5 pl-5 shadow-[inset_0_0_0_1px_var(--line)] focus-within:shadow-[inset_0_0_0_2px_var(--accent)]">
        <input
          id="copy-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          disabled={status === "loading"}
          className="min-w-0 flex-1 bg-transparent text-m outline-none placeholder:text-[var(--muted)]"
        />
        <button type="submit" disabled={status === "loading"} data-track="topper-copy-unlock" className="btn btn-blue h-11 px-5">
          {status === "loading" ? "Getting it…" : pdfCount > 1 ? `Get ${pdfCount} PDFs` : "Get the PDF"}
        </button>
      </div>
      {status === "error" && <p className="mt-2 text-s text-[var(--mark-deep)]">That didn&apos;t go through. Try again in a moment.</p>}
      <p className="mt-2.5 text-s text-[var(--muted)]">{`Free. The download opens here, and ${first}'s copy is also emailed to you.`}</p>
    </form>
  );
}

function Thumb({ name, preview }: { name: string; preview: string | null }) {
  if (preview) {
    return (
      <div className="paper relative overflow-hidden p-1.5">
        <Lens src={preview} size={120} imgClassName="aspect-[5/7] object-cover object-top" alt={`${name}'s answer booklet, first page`} />
        <Paperclip className="absolute -top-3 right-5 h-[56px] w-[22px] rotate-[6deg]" />
      </div>
    );
  }
  return (
    <div aria-hidden className="paper relative flex aspect-[5/7] flex-col p-4">
      <span className="t-head text-m leading-tight">{name}</span>
      <span className="t-meta mt-1">Answer copy</span>
      <span className="mt-4 space-y-2.5">
        {[90, 76, 84, 64, 80, 70].map((w, i) => (
          <span key={i} className="block h-[2px] rounded-full bg-[rgba(31,63,214,0.18)]" style={{ width: `${w}%` }} />
        ))}
      </span>
      <Paperclip className="absolute -top-3 right-5 h-[56px] w-[22px] rotate-[6deg]" />
    </div>
  );
}

export default function AnswerCopy({ name, first, slug, pdfCount, preview, requests, others, compilation }: Props) {
  const hasPdf = pdfCount > 0;
  const status = hasPdf ? `Free · ${pdfCount} booklet${pdfCount > 1 ? "s" : ""}` : preview ? "Sample page" : "Not in our archive yet";

  return (
    <div className="space-y-4">
      <div className={`${card} grid gap-6 p-5 sm:grid-cols-[180px_1fr] sm:p-6`}>
        <div className="mx-auto w-[160px] sm:w-full">
          <Thumb name={name} preview={preview} />
        </div>
        <div className="flex flex-col">
          <span
            className={`self-start rounded-full px-2.5 py-1 text-s font-bold ${
              hasPdf ? "bg-[#d4f1df] text-[#14532d]" : preview ? "bg-[#e9edff] text-[var(--accent-deep)]" : "bg-[var(--canvas)] text-[var(--ink-2)]"
            }`}
          >
            {status}
          </span>
          <h3 className="t-head mt-3 text-m">
            {hasPdf ? `${first}'s handwritten answer copy` : preview ? `A page from ${first}'s answer booklet` : `We don't hold ${first}'s answer copy`}
          </h3>
          <p className="mt-2 text-m leading-[1.6] text-[var(--ink-2)]">
            {hasPdf
              ? "Scanned as written, with the examiner's marks. The header shows where it comes from, often a coaching test series."
              : preview
                ? "A real scanned page with the examiner's marks. Hover over it to read the handwriting up close."
                : `We only link copies we actually hold. No scan of ${first}'s booklet has reached us yet, so there is nothing to download here.`}
          </p>
          {requests > 0 && (
            <p className="mt-4 flex items-center gap-2 text-s text-[var(--ink)]">
              <span className="flex -space-x-1.5" aria-hidden>
                {["#1f3fd6", "#ffe45c", "#ff4a3d"].map((c) => (
                  <span key={c} className="h-5 w-5 rounded-full border-2 border-white" style={{ background: c }} />
                ))}
              </span>
              <span>
                <span className="tab font-bold">{fmt(requests)}</span>
                {` aspirant${requests === 1 ? " has" : "s have"} requested ${first}'s copy`}
              </span>
            </p>
          )}
          {hasPdf ? (
            <Unlock slug={slug} first={first} pdfCount={pdfCount} />
          ) : (
            compilation && (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link href={compilation.href} data-track="topper-copy-compilation" className="btn btn-ink h-11">
                  {`Browse the ${compilation.title}`} <span className="knob">↗</span>
                </Link>
                <span className="text-s text-[var(--muted)]">{compilation.detail}</span>
              </div>
            )
          )}
        </div>
      </div>

      {!hasPdf && others.length > 0 && (
        <div className={`${card} p-5 sm:p-6`}>
          <p className="text-m font-bold">Free copies you can read right now</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {others.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/upsc-topper/${t.slug}#answer-copy`}
                  data-track="topper-copy-other"
                  className="group flex items-center gap-3 rounded-[16px] p-2.5 transition-colors hover:bg-[var(--canvas)]"
                >
                  <Avatar src={t.avatar} alt={t.name} size={44} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-m group-hover:text-[var(--accent)]">{t.name}</span>
                    <span className="block truncate text-s text-[var(--muted)]">{`AIR ${t.rank} · CSE ${t.year} · ${t.optional}`}</span>
                  </span>
                  {t.same && <span className="shrink-0 rounded-full bg-[var(--hl)] px-2 py-0.5 text-s font-bold text-[var(--hl-ink)]">Same optional</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

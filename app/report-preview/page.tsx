import type { Metadata } from "next";
import Link from "next/link";
import BrandShell from "@/components/brand/BrandShell";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const TOPPERS_FOR_TEST = [
  { name: "Ishita Kishore", rank: "1", slug: "ishita-kishore-rank-1-2022", sub: "PSIR" },
  { name: "Garima Lohia", rank: "2", slug: "garima-lohia-rank-2-2022", sub: "Commerce & Accountancy" },
  { name: "Harshita Goyal", rank: "2", slug: "harshita-goyal-rank-2-2024", sub: "PSIR" },
  { name: "Shivani Ettaboyina", rank: "11", slug: "shivani-ettaboyina-rank-11-2024", sub: "Anthropology" },
  { name: "Uma Harathi", rank: "3", slug: "uma-harathi-rank-3-2022", sub: "Anthropology" },
  { name: "Divya Tanwar", rank: "105", slug: "divya-tanwar-rank-105-2022", sub: "Hindi Literature" },
  { name: "Vaishali Chopra", rank: "23", slug: "vaishali-chopra-rank-23-2022", sub: "Mathematics" },
  { name: "Ayan Jain", rank: "16", slug: "ayan-jain-rank-16-2023", sub: "Mathematics" },
];

export default async function PreviewPage() {
  return (
    <BrandShell>
      <div className="mx-auto grid min-h-[80vh] max-w-md place-items-center px-6 pb-24 pt-28">
        <div className="w-full rounded-[28px] bg-white p-7 text-center shadow-[0_0_0_1px_var(--line-2),0_24px_56px_-24px_rgba(11,12,16,0.3)] sm:p-8">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-[#e9edff] text-[var(--accent)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
          <h1 className="t-head text-l">Strategy Report Preview</h1>
          <p className="mt-1 text-s text-[var(--muted)]">Select a topper to test</p>
          <div className="mt-6 space-y-2 text-left">
            {TOPPERS_FOR_TEST.map((tp) => (
              <Link
                key={tp.slug}
                href={`/api/report-preview?slug=${tp.slug}`}
                className="flex items-center justify-between gap-3 rounded-[14px] px-4 py-3 text-s font-bold text-[var(--ink-2)] shadow-[0_0_0_1px_var(--line-2)] transition-colors hover:text-[var(--accent)] hover:shadow-[0_0_0_1px_var(--accent)]"
              >
                {tp.name} — AIR {tp.rank}, {tp.sub}
                <span aria-hidden>→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </BrandShell>
  );
}

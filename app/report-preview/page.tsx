import type { Metadata } from "next";
import Link from "next/link";

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

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="rounded-2xl border border-gray-200 bg-white p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-600"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <h1 className="text-lg font-bold text-gray-900">Strategy Report Preview</h1>
          <p className="mt-1 text-sm text-gray-500">Select a topper to test</p>
          <div className="mt-6 space-y-2">
            {TOPPERS_FOR_TEST.map(tp => (
              <Link
                key={tp.slug}
                href={`/api/report-preview?slug=${tp.slug}`}
                className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                {tp.name} — AIR {tp.rank}, {tp.sub}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

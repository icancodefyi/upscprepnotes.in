import Link from "next/link";
import { getAllToppersList } from "@/services/topper.service";
import ToppersSearch from "./ToppersSearch";

export const metadata = {
  title: "UPSC Toppers List — Search All Rank Holders by Name, Rank, Year & Optional Subject",
  description:
    "Browse and search 280+ UPSC toppers. Search by name, rank, year, or optional subject. Access marks breakdowns, answer copies, and preparation strategies for every topper.",
  alternates: {
    canonical: "https://upscprepnotes.in/toppers",
  },
};

export default async function ToppersPage() {
  const toppers = await getAllToppersList();

  return (
    <main className="min-h-screen bg-[#F8F9FA]">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-10 text-center">
          <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-gray-400">
            UPSC Toppers
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Browse All UPSC Toppers
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-500">
            Search {toppers.length}+ rank holders by name, rank, year, or optional subject. View marks, answer copies, and preparation strategies.
          </p>
        </div>

        <ToppersSearch toppers={toppers} />

        {/* Free Materials CTA */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-100 border border-blue-200">
                <span className="text-2xl">📚</span>
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-blue-900">Free UPSC Study Material</h2>
                <p className="mt-1 text-sm text-blue-700">
                  2,700+ resources from top coaching institutes — test series, notes, books, magazines. All free to download.
                </p>
              </div>
              <Link
                href="/free-materials"
                data-track="toppers-free-materials-cta"
                className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-colors"
              >
                Browse Free Materials &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

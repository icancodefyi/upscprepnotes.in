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
      </div>
    </main>
  );
}

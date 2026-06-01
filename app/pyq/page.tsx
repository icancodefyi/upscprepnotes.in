import Link from "next/link";
import { Metadata } from "next";
import { getAllPYQYears } from "@/data/upsc/pyq/cse-pyq";
import {
  ArrowRight,
  Calendar,
  FileText,
  BookOpen,
  Target,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "UPSC Previous Year Question Papers (PYQ) - Prelims & Mains PDF",
  description:
    "Download official UPSC Civil Services Examination Previous Year Question Papers (PYQ) for Prelims and Mains. Archive of GS, CSAT, Essay, and Optional papers.",
  alternates: {
    canonical: "https://upscprepnotes.in/pyq",
  },
  openGraph: {
    title: "UPSC PYQ Archive - Download Official Question Papers",
    description:
      "Access the complete archive of UPSC CSE Previous Year Questions. Essential for understanding the exam pattern and trends.",
  },
};

export default async function PYQIndexPage() {
  const years = await getAllPYQYears();

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="mx-auto max-w-7xl px-4 pb-32">
        {/* Breadcrumb */}
        <div className="mb-8 pt-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-black transition-colors"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> Back to Home
          </Link>
        </div>

        {/* Hero */}
        <div className="max-w-4xl mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C4F9D7] text-black border border-black rounded-full text-xs font-bold tracking-wider uppercase mb-6">
            <FileText size={12} />
            Free Question Papers
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            UPSC{" "}
            <span className="bg-[#C4F9D7] px-2 border border-black">
              Previous Year Papers
            </span>
          </h1>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-3xl mb-8">
            Download official UPSC Civil Services Examination question papers.
            Access Prelims (GS + CSAT) and Mains (Essay + GS 1-4 + Optional) papers.
          </p>

          <div className="flex flex-wrap gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">3</span>
              Years Archive
            </span>
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">300+</span>
              Papers
            </span>
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">Free</span>
              Download
            </span>
          </div>
        </div>

        {/* Years Grid */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <Calendar className="w-6 h-6" />
            Browse by Year
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {years.map((year) => (
              <Link
                key={year}
                href={`/pyq/${year}`}
                className="group bg-white border-2 border-gray-200 p-8 hover:border-black transition-all flex flex-col justify-between"
              >
                <div className="text-5xl font-bold text-gray-300 group-hover:text-black/40 transition-colors mb-4">
                  {year}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:underline decoration-[#C4F9D7] decoration-4 underline-offset-4 transition-all">
                  UPSC CSE {year} Papers
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Includes Prelims (GS + CSAT) and Mains (Essay + GS 1-4) official papers.
                </p>
                <div className="flex items-center text-sm font-bold mt-auto">
                  Download Papers <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SEO Content */}
        <section className="grid md:grid-cols-12 gap-12 border-t border-gray-200 pt-16 mb-20">
          <div className="md:col-span-7">
            <h2 className="text-3xl font-bold mb-6">Why Solve PYQs?</h2>
            <div className="text-gray-600 leading-relaxed">
              <p className="mb-4 text-lg">
                Previous Year Questions (PYQs) are the compass for your UPSC preparation. They help you understand the demand of the examination and the mindset of the paper setters.
              </p>
              <ul className="space-y-4 mb-6">
                <li className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-[#C4F9D7] mt-0.5 shrink-0" />
                  <span><strong>Identify Themes:</strong> UPSC often repeats themes. Analyzing PYQs helps you identify high-yield topics.</span>
                </li>
                <li className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-[#C4F9D7] mt-0.5 shrink-0" />
                  <span><strong>Understand Pattern:</strong> Get accustomed to the changing nature of questions, especially in Prelims.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-[#C4F9D7] mt-0.5 shrink-0" />
                  <span><strong>Self Assessment:</strong> Solving past papers in a simulated environment is the best way to test your preparation level.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-5 space-y-6">
            <div className="bg-white border-2 border-gray-200 p-6 hover:border-black transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#C4F9D7] text-black border border-black">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Prelims Analysis</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Focus on the options as well. Often, options from previous years become questions in future years.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 p-6 hover:border-black transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-black text-white">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Mains Answer Writing</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Practice answer writing using PYQs to align your content and structure with UPSC standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C4F9D7]/20 border border-[#C4F9D7]/30 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-[#C4F9D7]" />
                <span className="text-xs text-[#C4F9D7] font-bold">RECOMMENDED</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                PYQs + Answer Copy Compilation
              </h2>
              <p className="text-gray-400 max-w-xl">
                See how toppers actually wrote their answers. 50+ verified copies across GS1-4 and Essay with marks-wise compilation.
              </p>
            </div>
            <a
              href="/toppers/toppers-copy-compilation"
              className="inline-flex items-center gap-2 bg-[#C4F9D7] text-black font-bold px-8 py-4 hover:bg-white transition-colors shrink-0"
            >
              Explore Compilation <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "About — UPSCPrepNotes",
  description:
    "UPSCPrepNotes is a structured educational intelligence platform focused on topper analysis, preparation insights, marksheet indexing, and optional subject research.",
  alternates: {
    canonical: "https://upscprepnotes.in/about",
  },
  openGraph: {
    title: "About — UPSCPrepNotes",
    description:
      "UPSCPrepNotes is a structured educational intelligence platform focused on topper analysis, preparation insights, marksheet indexing, and optional subject research.",
    url: "https://upscprepnotes.in/about",
  },
};

export default function AboutPage() {
  return (
    <LegalPage
      title="About"
      description="UPSCPrepNotes is a structured educational intelligence platform focused on topper analysis, preparation insights, marksheet indexing, and optional subject research."
    >
      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">What is UPSCPrepNotes?</h2>
        <p className="leading-8 text-zinc-700">
          UPSCPrepNotes is an independent research platform that systematically
          indexes, structures, and analyzes publicly available UPSC topper data.
          We transform raw marksheets, interview scores, and preparation strategies
          into actionable intelligence for serious UPSC aspirants.
        </p>
        <p className="leading-8 text-zinc-700">
          Unlike coaching portals or generic study sites, UPSCPrepNotes focuses
          exclusively on data-driven insights — marks distributions, optional subject
          trends, paper-wise score patterns, and rank-specific strategies. Every
          topper profile is a structured dataset, not just a story.
        </p>
        <p className="leading-8 text-zinc-700">
          Our platform covers 280+ topper profiles across 18 optional subjects,
          spanning multiple years of the UPSC Civil Services Examination. Each
          profile includes detailed marks breakdowns, preparation strategies,
          answer copy resources, and contextual insights.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Who Is It For?</h2>
        <p className="leading-8 text-zinc-700">
          UPSCPrepNotes is built for aspirants who want to move beyond generic advice
          and study real data. If you are preparing for UPSC CSE and want to understand
          what scores look like at different rank levels, which optional subjects
          produce top ranks, or how toppers approached specific papers — this platform
          is designed for you.
        </p>
        <p className="leading-8 text-zinc-700">
          We serve beginners exploring optional subject choices, intermediate aspirants
          refining their preparation strategy, and advanced candidates benchmarking
          their progress against verified topper data.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">What Makes It Different?</h2>
        <p className="leading-8 text-zinc-700">
          <strong>Data, not stories.</strong> Every topper page contains a complete,
          structured marks dataset — GS papers, optional subject scores, essay marks,
          interview performance, and final totals. You can compare, contrast, and
          analyze rather than just read.
        </p>
        <p className="leading-8 text-zinc-700">
          <strong>Cross-linked intelligence.</strong> Toppers are connected by year,
          rank, optional subject, and score patterns. One click takes you from a
          topper profile to everyone who scored similarly, opted for the same subject,
          or appeared in the same year.
        </p>
        <p className="leading-8 text-zinc-700">
          <strong>Answer copy compilation.</strong> We maintain a marks-wise compilation
          of 50+ verified topper answer copies across GS1–4 and Essay — organized by
          score, not rank — so you can study what a 120+ marks answer actually looks like.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Platform Features</h2>
        <p className="leading-8 text-zinc-700">
          <strong>Topper Profiles:</strong> 280+ detailed profiles with full marks
          breakdowns, preparation strategies, answer copy links, and JSON-LD structured
          data for search engines.
        </p>
        <p className="leading-8 text-zinc-700">
          <strong>Year Archives:</strong> Browse all toppers from a given year with
          aggregate statistics, score distributions, and optional subject trends.
        </p>
        <p className="leading-8 text-zinc-700">
          <strong>Optional Subject Hubs:</strong> Dedicated pages for each optional
          subject with topper lists, average scores, book recommendations, and
          preparation insights.
        </p>
        <p className="leading-8 text-zinc-700">
          <strong>Ask AI:</strong> An intelligent assistant trained on our topper
          database that answers specific questions about marks, strategies, and
          preparation approaches.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Platform Vision</h2>
        <p className="leading-8 text-zinc-700">
          The objective of UPSCPrepNotes is to create a deeply interconnected
          archive of preparation intelligence that helps aspirants discover
          patterns, preparation methods, optional subject trends, and
          high-performing strategies. We believe that structured data, freely
          accessible, is the most effective tool for informed UPSC preparation.
        </p>
        <p className="leading-8 text-zinc-700">
          We are not a coaching institute, a test series provider, or a content
          mill. We are an educational intelligence platform — and we measure our
          success by how well we help aspirants make data-backed decisions about
          their preparation.
        </p>
      </section>
    </LegalPage>
  );
}

import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "UPSCPrepNotes",
  "description": "UPSCPrepNotes is a structured educational intelligence platform focused on topper analysis, preparation insights, marksheet indexing, and optional subject research for UPSC CSE aspirants.",
  "url": "https://upscprepnotes.in",
  "email": "hello@impiclabs.com",
  "foundingDate": "2025",
  "areaServed": "IN",
  "knowsAbout": ["UPSC Civil Services Examination", "UPSC topper marks analysis", "UPSC optional subjects"],
};

export const metadata: Metadata = {
  title: "About — UPSCPrepNotes",
  description:
    "UPSCPrepNotes is a structured educational intelligence platform focused on topper analysis, preparation insights, marksheet indexing, and optional subject research for UPSC CSE aspirants.",
  alternates: {
    canonical: "https://upscprepnotes.in/about",
  },
  openGraph: {
  title: "About — UPSC Preparation Intelligence Platform",
    description:
      "UPSCPrepNotes is a structured educational intelligence platform focused on topper analysis, preparation insights, marksheet indexing, and optional subject research for UPSC CSE aspirants.",
    url: "https://upscprepnotes.in/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />
      <LegalPage
        title="About"
        description="UPSCPrepNotes is a structured educational intelligence platform focused on topper analysis, preparation insights, marksheet indexing, and optional subject research for UPSC CSE aspirants."
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
        />

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
          spanning four years (2022, 2023, 2024, 2025) of the UPSC Civil Services
          Examination. Each profile includes detailed marks breakdowns, preparation
          strategies, answer copy resources, and contextual insights.
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
          <strong>Topper Profiles (280+):</strong> Detailed profiles with full marks
          breakdowns, preparation strategies, answer copy links, and JSON-LD structured
          data for search engines.
        </p>
        <p className="leading-8 text-zinc-700">
          <strong>Year Archives (2022-2025):</strong> Browse all toppers from a given year with
          aggregate statistics, score distributions, and optional subject trends.
        </p>
        <p className="leading-8 text-zinc-700">
          <strong>Optional Subject Hubs (8 subjects):</strong> Dedicated pages for PSIR, Public
          Administration, Sociology, Geography, History, Anthropology, Mathematics, and
          Philosophy with topper lists, average scores, book recommendations, and
          preparation insights.
        </p>
        <p className="leading-8 text-zinc-700">
          <strong>PYQ Archives (2023-2025):</strong> Downloadable previous year question
          papers for Prelims and Mains with direct UPSC.gov.in PDF links.
        </p>
        <p className="leading-8 text-zinc-700">
          <strong>Content Library (4 guides):</strong> In-depth pages on UPSC full form,
          complete syllabus breakdown, free study material, and Hindi-language resources.
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

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Where does your topper data come from?</h3>
            <p className="mt-2 leading-8 text-zinc-700">
              All topper marks data is sourced from publicly available information on UPSC.gov.in
              and verified secondary sources. We do not generate or fabricate any marks data. Each
              profile references the source of its marks information.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">How often is the data updated?</h3>
            <p className="mt-2 leading-8 text-zinc-700">
              New topper profiles are added as soon as official UPSC results are published and
              marks data becomes available. Existing profiles are updated when corrections are
              verified against official sources. Our last major update included 2024 and 2025
              topper cohorts.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Is UPSCPrepNotes free to use?</h3>
            <p className="mt-2 leading-8 text-zinc-700">
              Yes. All topper profiles, year archives, optional subject hubs, PYQ archives,
              content guides, and the AI assistant are freely accessible. The only paid offering
              is the answer copy compilation (₹799), which includes 50+ verified topper
              answer copies across GS1-4 and Essay.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">How many toppers are currently on the platform?</h3>
            <p className="mt-2 leading-8 text-zinc-700">
              We currently host 280+ topper profiles spanning 2022 to 2025, covering 18 optional
              subjects. Each profile includes detailed marks breakdowns across GS papers, essay,
              optional, and interview scores.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Which optional subjects do you cover?</h3>
            <p className="mt-2 leading-8 text-zinc-700">
              We have dedicated subject hubs for 8 optionals: PSIR, Public Administration,
              Sociology, Geography, History, Anthropology, Mathematics, and Philosophy. These hubs
              include topper lists, average scores, book recommendations, syllabus topics, and
              preparation insights. Additional optionals are covered within topper profiles
              even without dedicated hub pages.
            </p>
          </div>
        </div>
      </section>
      </LegalPage>
    </>
  );
}

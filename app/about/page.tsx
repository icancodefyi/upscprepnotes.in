import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "UPSCPrepNotes",
  "description": "UPSCPrepNotes is a small site run by Zaid Rakhange, who manually extracts and verifies UPSC topper marks data from official UPSC result PDFs.",
  "url": "https://upscprepnotes.in",
  "email": "hello@impiclabs.com",
  "foundingDate": "2025",
  "areaServed": "IN",
  "founder": {
    "@type": "Person",
    "name": "Zaid Rakhange",
    "url": "https://zaid.impiclabs.com"
  },
  "knowsAbout": ["UPSC Civil Services Examination", "UPSC topper marks analysis", "UPSC optional subjects"],
};

export const metadata: Metadata = {
  title: "About UPSCPrepNotes — Run by Zaid Rakhange",
  description:
    "UPSCPrepNotes is a small site run by Zaid Rakhange. He manually extracts and verifies UPSC topper marks from official UPSC.gov.in result PDFs. Not a coaching site, not a content mill.",
  alternates: {
    canonical: "https://upscprepnotes.in/about",
  },
  openGraph: {
  title: "About — UPSCPrepNotes",
    description:
      "UPSCPrepNotes is a small site run by Zaid Rakhange. Every topper profile is manually extracted from UPSC's official result PDFs and cross-verified before publishing.",
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
        description="A small site run by Zaid Rakhange that indexes and analyzes UPSC topper marks data."
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
        />

        <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Hi, I am Zaid</h2>
        <div className="flex items-start gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <img
            src="https://zaid.impiclabs.com/_next/image?url=%2Fprofile.jpg&w=1080&q=75"
            alt="Zaid Rakhange"
            className="h-14 w-14 rounded-full object-cover shrink-0"
          />
          <div>
            <p className="font-semibold text-gray-900">
              <a href="https://zaid.impiclabs.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-700 transition-colors underline underline-offset-2">Zaid Rakhange</a>
            </p>
            <p className="text-sm text-emerald-700">Software engineer, founder of <a href="https://impiclabs.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-emerald-600 transition-colors">ImpicLabs</a></p>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              I am not a UPSC aspirant and I have never taken the exam. I am just someone who finds topper data genuinely interesting. I got curious about what the numbers actually look like — how much do rank holders score in each paper, which optionals perform best, what patterns emerge. So I started going through UPSC result PDFs manually, extracting marks one by one. This site is the result of that curiosity. No AI scraping, no outsourcing, no content mill.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">What Is This Site?</h2>
        <p className="leading-8 text-zinc-700">
          UPSCPrepNotes is where I put the topper data I have been collecting. Every marksheet, interview score, and strategy on this site is something I manually extracted and cross-verified before publishing. There is no AI generating these profiles, no one copying them from other sites.
        </p>
        <p className="leading-8 text-zinc-700">
          The site currently has 50+ indexed topper profiles with full marks breakdowns — GS papers, essay, optional, interview — and strategy pages that analyze patterns across this dataset. I add more as I work through the PDFs.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Who Is It For?</h2>
        <p className="leading-8 text-zinc-700">
          Honestly, anyone who wants to see real UPSC marks data instead of generic advice. If you are preparing and want to know what scores actually look like at different rank levels, which optionals produce top ranks, or how toppers performed paper by paper — this site has that.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">What Is Here</h2>
        <p className="leading-8 text-zinc-700">
          <strong>Topper profiles (50+):</strong> Full marks breakdowns with GS papers, essay, optional, interview, and total scores. Each number is manually extracted from UPSC's own result PDFs.
        </p>
        <p className="leading-8 text-zinc-700">
          <strong>Strategy pages (4):</strong> Paper-wise guides built by analyzing the marks dataset — not by rewriting coaching brochures. Covers GS1 through GS4 with topper data, topic weightage, and book recommendations.
        </p>
        <p className="leading-8 text-zinc-700">
          <strong>Year archives (2022-2025):</strong> Browse all toppers from a given year with stats and optional subject trends.
        </p>
        <p className="leading-8 text-zinc-700">
          <strong>Optional subject hubs (8 subjects):</strong> PSIR, Public Administration, Sociology, Geography, History, Anthropology, Mathematics, and Philosophy — with topper lists, average scores, and book recommendations.
        </p>
        <p className="leading-8 text-zinc-700">
          <strong>PYQ archives (2023-2025):</strong> Previous year question papers with direct UPSC.gov.in PDF links.
        </p>
        <p className="leading-8 text-zinc-700">
          <strong>Answer copy compilation:</strong> 50+ verified topper answer copies across GS1-4 and Essay — organized by score, so you can see what a 120+ answer actually looks like.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Why I Built This</h2>
        <p className="leading-8 text-zinc-700">
          I found it frustrating that UPSC topper data is scattered across a dozen different sites, interview transcripts, and PDFs. No single place had marks organized in a way you could actually compare and analyze. So I built one.
        </p>
        <p className="leading-8 text-zinc-700">
          The site is free to use. The only paid thing is the answer copy compilation (₹99), and that is because I spend time verifying and organizing those copies. Everything else — profiles, strategy pages, PYQs, optional hubs — is free.
        </p>
        <p className="leading-8 text-zinc-700">
          I am not a coaching institute, test series provider, or content mill. I am just someone who likes data and built a site around it.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Where does the topper data come from?</h3>
            <p className="mt-2 leading-8 text-zinc-700">
              UPSC's official result PDFs on upsc.gov.in. I download them, read through them, and extract marks manually. I do not generate or fabricate any data.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">How often is the data updated?</h3>
            <p className="mt-2 leading-8 text-zinc-700">
              I add new profiles as soon as UPSC publishes results and I have time to go through the PDFs. Corrections are handled as they come in through the Report button.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Is this site free?</h3>
            <p className="mt-2 leading-8 text-zinc-700">
              Yes. Profiles, strategy pages, year archives, optional hubs, PYQs, and the AI assistant are all free. The only paid thing is the answer copy compilation (₹99), which covers the time I spend verifying and organizing those copies.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">How many toppers are on the site?</h3>
            <p className="mt-2 leading-8 text-zinc-700">
              50+ indexed profiles spanning 2022 to 2025, covering 18 optional subjects. Each has detailed marks breakdowns.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Which optionals do you cover?</h3>
            <p className="mt-2 leading-8 text-zinc-700">
              8 dedicated hubs: PSIR, Public Administration, Sociology, Geography, History, Anthropology, Mathematics, and Philosophy. Each has topper lists, average scores, book recommendations, and syllabus topics. More optionals exist within topper profiles even without dedicated pages.
            </p>
          </div>
        </div>
      </section>
      </LegalPage>
    </>
  );
}

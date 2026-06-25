import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "UPSCPrepNotes",
  "description": "UPSCPrepNotes is run by Zaid Rakhange, who has manually extracted and cross-referenced marks from every UPSC CSE result PDF published since 2022.",
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
    "UPSCPrepNotes is run by Zaid Rakhange. He has manually extracted and cross-referenced marks from every UPSC CSE result PDF published since 2022. Not a coaching site — just someone who knows the data better than anyone.",
  alternates: {
    canonical: "https://upscprepnotes.in/about",
  },
  openGraph: {
  title: "About — UPSCPrepNotes",
    description:
      "UPSCPrepNotes is run by Zaid Rakhange. He has manually gone through every UPSC result PDF since 2022, extracting marks one by one. He probably knows topper marks data better than anyone outside UPSC.",
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
        description="Run by Zaid Rakhange. He has read every UPSC result PDF published since 2022 and extracted the marks himself."
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
        />

        <section className="space-y-5">
        <h2 className="text-2xl font-semibold">I am Zaid. I read UPSC result PDFs for fun.</h2>
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
              I have read every UPSC CSE result PDF published since 2022. Cover to cover. I have extracted marks from thousands of rows — GS1, GS2, GS3, GS4, Essay, Optional 1, Optional 2, Interview, Written Total, Grand Total. I know this data better than most people because I touched every single number with my own hands. No AI did this. No intern. Just me and a PDF reader.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">What Is This Site?</h2>
        <p className="leading-8 text-zinc-700">
          This is where I put everything I have extracted. Every marksheet, every interview score, every strategy — manually pulled from UPSC's own PDFs, cross-verified, and organized so you can actually compare things.
        </p>
        <p className="leading-8 text-zinc-700">
          50+ indexed topper profiles. Strategy pages built by analyzing patterns across the dataset — not by reading coaching blogs. Year archives, optional hubs, PYQs. All free.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Who Is This For?</h2>
        <p className="leading-8 text-zinc-700">
          People who want real numbers instead of generic advice. If you are deciding between optionals and want to know which one actually scores higher — the data is here. If you want to know what a 130+ GS1 score looks like across multiple toppers — the data is here. If you want motivational stories, go somewhere else.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">What Is Here</h2>
        <p className="leading-8 text-zinc-700">
          <strong>Topper profiles (50+):</strong> Full marks breakdowns. Every number manually extracted from UPSC result PDFs.
        </p>
        <p className="leading-8 text-zinc-700">
          <strong>Strategy pages (4):</strong> Paper-wise guides for GS1 through GS4. Built by analyzing the actual marks dataset, not by rewriting coaching brochures.
        </p>
        <p className="leading-8 text-zinc-700">
          <strong>Year archives (2022-2025):</strong> Browse every topper from a given year.
        </p>
        <p className="leading-8 text-zinc-700">
          <strong>Optional hubs (8 subjects):</strong> PSIR, Public Admin, Sociology, Geography, History, Anthropology, Mathematics, Philosophy.
        </p>
        <p className="leading-8 text-zinc-700">
          <strong>Answer copy compilation:</strong> 50+ verified topper answer copies organized by score.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Why I Built This</h2>
        <p className="leading-8 text-zinc-700">
          Because nobody had done it. Topper data was scattered across interview transcripts, coaching site articles, and random PDFs. No single place had it organized in a way you could actually analyze. So I built one.
        </p>
        <p className="leading-8 text-zinc-700">
          Everything is free except the answer copy compilation (₹99). I am not a coaching institute, a test series provider, or a content mill. I am just someone who got obsessed with UPSC data and built a site around it.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Where does the data come from?</h3>
            <p className="mt-2 leading-8 text-zinc-700">
              UPSC's official result PDFs. I download them, read every row, and extract marks manually. I do not generate or fabricate anything.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">How often is it updated?</h3>
            <p className="mt-2 leading-8 text-zinc-700">
              As soon as UPSC publishes new results and I finish going through the PDFs. Usually within a week.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Is this free?</h3>
            <p className="mt-2 leading-8 text-zinc-700">
              Yes. Profiles, strategies, year archives, optional hubs, PYQs, AI assistant — all free. Only the answer copy compilation costs ₹99 because verifying those copies takes real work.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">How many toppers?</h3>
            <p className="mt-2 leading-8 text-zinc-700">
              50+ indexed profiles from 2022-2025, 18 optional subjects.
            </p>
          </div>
        </div>
      </section>
      </LegalPage>
    </>
  );
}

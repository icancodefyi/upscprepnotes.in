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
  Search,
  BarChart3,
  PenLine,
  Lightbulb,
  ChevronDown,
} from "lucide-react";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many years of PYQs should I solve for UPSC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most toppers recommend solving at least the last 10 years' PYQs for Prelims and at least 5 years for Mains. However, solving 15-20 years of papers gives you a comprehensive understanding of UPSC's question patterns and helps identify high-yield topics across all subjects.",
      },
    },
    {
      "@type": "Question",
      name: "Are PYQs enough to clear UPSC Prelims?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PYQs are essential but not sufficient. They help you understand the exam pattern, question difficulty, and topic weighting, but you need standard textbooks (NCERTs, Laxmikanth, Spectrum, etc.) and current affairs for comprehensive coverage. PYQs should form about 30% of your preparation strategy, not 100%.",
      },
    },
    {
      "@type": "Question",
      name: "Where can I download UPSC previous year question papers PDF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can download official UPSC previous year question papers PDF for free on UPSCPrepNotes. We provide Prelims (GS + CSAT) and Mains (Essay + GS 1-4) papers for years 2022–2025. Each paper is available in its original PDF format as released by the UPSC commission.",
      },
    },
    {
      "@type": "Question",
      name: "Does UPSC repeat questions from previous years?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "UPSC rarely repeats exact questions, but they frequently repeat themes and concepts. For example, questions on Fundamental Rights, Panchayati Raj, and Climate Change appear in different forms across years. Analyzing PYQs helps you identify these recurring themes and prepare accordingly.",
      },
    },
    {
      "@type": "Question",
      name: "Should I solve Prelims and Mains PYQs together?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Prelims and Mains require different approaches. Solve Prelims PYQs during your Prelims preparation phase (focus on speed, accuracy, and elimination techniques). Solve Mains PYQs during your Mains answer writing practice (focus on structure, depth, and time management).",
      },
    },
    {
      "@type": "Question",
      name: "How should I analyze UPSC PYQs for maximum benefit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Start by categorizing questions by subject and topic. Identify which subjects carry the most weight. Note the year-wise distribution — some topics cycle in importance. Track the difficulty level and question format changes. Finally, align your study plan to prioritize high-weightage and frequently tested topics.",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "UPSC Previous Year Question Papers (PYQ) PDF - Prelims & Mains Free Download",
  description:
    "Download official UPSC Civil Services Examination Previous Year Question Papers (PYQ) PDF for Prelims and Mains. Free archive of GS, CSAT, Essay, and Optional papers from 2022-2025.",
  alternates: {
    canonical: "https://upscprepnotes.in/pyq",
  },
  openGraph: {
    title: "UPSC PYQ Archive PDF - Free Download Official Question Papers",
    description:
      "Access the complete archive of UPSC CSE Previous Year Questions PDF. Essential for understanding exam pattern, topic weighting, and trends.",
  },
};

export default async function PYQIndexPage() {
  const years = await getAllPYQYears();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 pb-32">
        {/* Breadcrumb */}
        <div className="mb-8 pt-8">
          <Link
            href="/"
            data-track="pyq-back-home"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> Back to Home
          </Link>
        </div>

        {/* Hero */}
        <div className="max-w-4xl mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-mint text-foreground border border-foreground rounded-full text-xs font-bold tracking-wider uppercase mb-6">
            <FileText size={12} />
            Free Question Papers PDF
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            UPSC{" "}
            <span className="bg-brand-mint px-2 border border-foreground">
              Previous Year Papers
            </span>{" "}
            PDF
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-3xl mb-8">
            Download official UPSC Civil Services Examination previous year question papers PDF
            for Prelims (GS + CSAT) and Mains (Essay + GS 1-4 + Optional subjects). 
            Free archive of UPSC PYQ PDF downloads from 2022 to 2025.
          </p>

          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-foreground text-white flex items-center justify-center text-xs font-bold">3+</span>
              Years Archive
            </span>
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-foreground text-white flex items-center justify-center text-xs font-bold">300+</span>
              Papers
            </span>
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-foreground text-white flex items-center justify-center text-xs font-bold">Free</span>
              PDF Download
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
                data-track={`pyq-year-card-${year}`}
                className="group bg-white border border-border p-8 hover:border-foreground transition-all flex flex-col justify-between"
              >
                <div className="text-5xl font-bold text-foreground/20 group-hover:text-foreground/40 transition-colors mb-4">
                  {year}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:underline decoration-brand-mint decoration-4 underline-offset-4 transition-all">
                  UPSC CSE {year} Papers
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  Includes Prelims (GS + CSAT) and Mains (Essay + GS 1-4) official papers.
                </p>
                <div className="flex items-center text-sm font-bold mt-auto">
                  Download Papers <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Paper Categories */}
        <section className="mb-20 border-t border-border pt-16">
          <h2 className="text-3xl font-bold mb-6">UPSC PYQ PDF Categories</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-3xl">
            Our UPSC previous year question papers PDF archive covers every paper released by the commission. 
            Download individual PDFs for each examination component.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FileText, title: "Prelims GS Paper 1", desc: "General Studies including History, Geography, Polity, Economy, Science & Technology, Environment, and Current Affairs." },
              { icon: FileText, title: "Prelims CSAT Paper 2", desc: "Civil Services Aptitude Test covering Comprehension, Interpersonal Skills, Logical Reasoning, and Quantitative Aptitude." },
              { icon: FileText, title: "Mains Essay Paper", desc: "Two essays to be written on philosophical, social, and contemporary topics totaling 250 marks." },
              { icon: FileText, title: "Mains GS Paper 1", desc: "Indian Heritage & Culture, History, Geography of India and the World, and Society." },
              { icon: FileText, title: "Mains GS Paper 2", desc: "Governance, Constitution, Polity, Social Justice, and International Relations." },
              { icon: FileText, title: "Mains GS Paper 3", desc: "Technology, Economic Development, Biodiversity, Environment, Security, and Disaster Management." },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-border p-6 hover:border-foreground transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-mint text-foreground border border-foreground shrink-0">
                    <item.icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Solve PYQs */}
        <section className="mb-20 border-t border-border pt-16">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold mb-6">Why Solve UPSC Previous Year Papers?</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Previous Year Questions (PYQs) are the most reliable tool for UPSC preparation. 
              They reveal the examiner&apos;s mindset, topic weighting, and evolving question patterns. 
              Every serious aspirant must integrate PYQ analysis into their study routine.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: Target, title: "Identify High-Yield Topics", desc: "UPSC consistently tests certain themes across years. PYQs reveal which topics carry the most marks, helping you prioritize your study time effectively." },
                { icon: BarChart3, title: "Understand Question Trends", desc: "Track how question formats evolve — from direct factual recall to application-based and analytical questions. Adapt your preparation accordingly." },
                { icon: PenLine, title: "Practice Time Management", desc: "Solving full papers under timed conditions builds the speed and accuracy needed for both Prelims (200 questions in 2 hours) and Mains (3-hour papers)." },
                { icon: Search, title: "Self-Assessment & Gap Analysis", desc: "Identify your weak areas by analyzing which questions you get wrong. PYQ practice reveals knowledge gaps that textbooks alone cannot highlight." },
                { icon: Lightbulb, title: "Develop Answer Writing Skills", desc: "For Mains, PYQs are the best answer writing practice. Structure your responses to match UPSC's expectations — introduction, body, conclusion with relevant examples." },
                { icon: BookOpen, title: "Build Exam Confidence", desc: "Regular PYQ practice reduces exam anxiety. Familiarity with the paper pattern, difficulty level, and question style builds the confidence needed on exam day." },
              ].map((item) => (
                <div key={item.title} className="bg-white border border-border p-6 hover:border-foreground transition-all">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-foreground text-white shrink-0">
                      <item.icon size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to Use PYQs */}
        <section className="mb-20 border-t border-border pt-16">
          <h2 className="text-3xl font-bold mb-6">How to Use UPSC PYQs Effectively</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-3xl">
            Simply downloading UPSC previous year question papers PDF is not enough. 
            Follow this systematic approach to maximize your learning from every paper.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Categorize & Analyze", desc: "Group questions by subject and topic. Create a topic-wise frequency chart to identify which areas UPSC tests most often. This data-driven approach ensures you focus on high-yield topics first." },
              { step: "02", title: "Solve & Review", desc: "Attempt each paper under exam conditions — strictly timed, no distractions. After solving, review every incorrect answer in detail. Maintain an error log tracking recurring mistakes." },
              { step: "03", title: "Align Your Strategy", desc: "Use PYQ insights to refine your study plan. Increase time on frequently tested topics, adjust your note-making style to match question demands, and practice answer writing for identified weak areas." },
            ].map((item) => (
              <div key={item.step} className="bg-white border border-border p-6 hover:border-foreground transition-all">
                <span className="text-5xl font-black text-foreground/15 mb-4 block">{item.step}</span>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20 border-t border-border pt-16">
          <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions about UPSC PYQs</h2>
          <div className="max-w-4xl space-y-4">
            {[
              { q: "How many years of PYQs should I solve for UPSC?", a: "Most toppers recommend at least 10 years of Prelims PYQs and 5 years of Mains PYQs. For comprehensive coverage, 15-20 years is ideal. This helps you identify all recurring themes and question patterns." },
              { q: "Are PYQs enough to clear UPSC Prelims?", a: "PYQs are essential but not sufficient alone. They should form about 30% of your preparation. You still need NCERTs, standard reference books, and current affairs for full syllabus coverage." },
              { q: "Does UPSC repeat questions?", a: "UPSC rarely repeats exact questions but frequently repeats themes. Concepts from Polity (Fundamental Rights, DPSPs), Environment (Climate Change, Conservation), and Modern History appear in different forms across years." },
              { q: "Should I solve Prelims and Mains PYQs differently?", a: "Yes. Prelims PYQs focus on speed, accuracy, and elimination techniques. Mains PYQs focus on answer structure, depth of content, and time management across 3-hour papers." },
              { q: "Where can I download UPSC previous year question papers PDF?", a: "You can download UPSC previous year question papers PDF for free right here on UPSCPrepNotes. We provide official PDFs for Prelims (GS + CSAT) and Mains (Essay + GS 1-4) for 2022, 2023, 2024, and 2025." },
              { q: "How do I analyze PYQs for topic weighting?", a: "Create a spreadsheet with columns for year, subject, topic, and marks. After solving 5+ years of papers, sort by topic to see which areas carry the most weight. Allocate study time proportionally to this data." },
            ].map((faq, i) => (
              <details key={i} className="group bg-white border border-border [&>summary]:open:border-foreground">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none font-bold hover:bg-secondary transition-colors">
                  {faq.q}
                  <ChevronDown className="w-4 h-4 shrink-0 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-5 pb-5 text-muted-foreground leading-relaxed text-sm border-t border-border pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        {/* Free Materials CTA */}
        <section className="p-8 md:p-12 bg-white border-b border-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-muted border border-brand/20">
              <span className="text-2xl">📚</span>
            </div>
            <div className="flex-1">
              <h2 className="text-base font-bold text-foreground">Free Study Material</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Practice with test series, revise with notes, and stay updated with current affairs compilations — all free.
              </p>
            </div>
            <Link
              href="/free-materials"
              data-track="pyq-browse-free-materials"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-brand px-6 py-2.5 text-xs font-bold text-white hover:bg-brand transition-colors"
            >
              Browse Free Materials &rarr;
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-foreground p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-mint/20 border border-brand-mint/30 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-brand-mint" />
                <span className="text-xs text-brand-mint font-bold">RECOMMENDED</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                PYQs + Answer Copy Compilation
              </h2>
              <p className="text-muted-foreground max-w-xl">
                See how toppers actually wrote their answers. 50+ verified copies across GS1-4 and Essay with marks-wise compilation.
              </p>
            </div>
            <a
              href="/store"
              data-track="pyq-main-cta"
              className="inline-flex items-center gap-2 bg-brand-mint text-foreground font-bold px-8 py-4 hover:bg-white transition-colors shrink-0"
            >
              Browse Store <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

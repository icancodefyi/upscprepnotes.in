import Link from "next/link";

import { getFeaturedToppers } from "@/services/topper.service";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { topperImageSrc } from "@/lib/utils";

export const revalidate = 86400;

const OPTIONAL_SUBJECTS = [
  "PSIR",
  "Anthropology",
  "Sociology",
  "Mathematics",
  "Geography",
  "History",
  "Public Administration",
  "Philosophy",
];

const YEARS = [2022, 2023, 2024, 2025];

const IBEC_STEPS = [
  {
    letter: "I",
    title: "Introductions",
    points: [
      "Start with clear, focused introductions for strong impact",
      "Use quotes or data to set context quickly",
      "Align introductions precisely with the question's demand",
    ],
  },
  {
    letter: "B",
    title: "Body",
    points: [
      "Write concise, direct answers without extra details",
      "Use tables, diagrams, and bullet points for clarity",
      "Include relevant facts, examples, and visuals effectively",
    ],
  },
  {
    letter: "E",
    title: "Enhancements",
    points: [
      "Use quick diagrams and maps to boost answers",
      "Recycle points for multidimensional coverage",
      "Integrate perspectives from multiple subjects easily",
    ],
  },
  {
    letter: "C",
    title: "Conclusions",
    points: [
      "Summarize key points without repeating content",
      "End with solutions or forward-looking statements",
      "Keep conclusions concise and impactful",
    ],
  },
];

const PAPER_BENEFITS = [
  {
    paper: "GS1",
    highlights: [
      "Maps & diagrams in answers",
      "Visual storytelling techniques",
      "Micro-diagrams for complex topics",
    ],
  },
  {
    paper: "GS2",
    highlights: [
      "Policy-based crisp answers",
      "Real-world case studies",
      "Tabular data presentation",
    ],
  },
  {
    paper: "GS3",
    highlights: [
      "Argument & counter-argument",
      "Data-driven answers",
      "Current affairs integration",
    ],
  },
  {
    paper: "GS4",
    highlights: [
      "Stakeholder approach",
      "Ethical frameworks",
      "Case study structure",
    ],
  },
  {
    paper: "Essay",
    highlights: [
      "Brainstorming techniques",
      "Connecting phrases",
      "Multi-dimensional essays",
    ],
  },
];

export default async function HomePage() {
  const toppers = await getFeaturedToppers();

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-6 pb-32 pt-6 md:px-10">
        {/* NAVBAR */}
        <header className="mb-20 flex items-center justify-between md:mb-24">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-foreground" />
            <p className="text-xs uppercase tracking-[0.35em] text-foreground/70 md:text-sm font-medium">
              UPSCPREPNOTES
            </p>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground lg:flex">
            <Link href="/" className="transition hover:text-foreground">
              Toppers
            </Link>
            <Link href="/optional/psir" className="transition hover:text-foreground">
              Optional Subjects
            </Link>
            <Link href="/ask" className="transition hover:text-foreground">
              Ask AI
            </Link>
          </nav>
        </header>

        {/* HERO */}
        <section className="mb-20">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-medium">
              50+ Topper Copies
            </Badge>
            <Badge className="rounded-full px-3 py-1 text-xs font-medium">
              Marks Wise &bull; Not Rank Wise
            </Badge>
          </div>

          <h1 className="max-w-4xl text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            Score 120+ Marks in Each GS Paper
            <br />
            <span className="text-muted-foreground">
              with 50+ Topper Answer Copies
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            India&apos;s first marks-wise UPSC topper answer copy compilation.
            Learn the IBEC Method from toppers who scored in the top 1 percentile.
            Verified copies across GS1&ndash;4 and Essay.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20">
              <Link href="/toppers/toppers-copy-compilation">
                Explore the Compilation &rarr;
              </Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-xs text-muted-foreground">
            <span>Instant Digital Access</span>
            <span>Verified Copies</span>
            <span>Lifetime Updates</span>
            <span>PDF Format</span>
          </div>

          {/* BENEFIT CARDS */}
          <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Get answer copies of toppers in each paper (Verified Only)",
              "Handwritten Answers from 20+ toppers",
              "Includes Micro-diagrams, Data, Facts, Examples",
              "All GS Papers — GS1, GS2, GS3, GS4 & Essay Covered",
            ].map((text) => (
              <Card key={text} className="rounded-2xl border-border/50">
                <CardContent className="flex items-start gap-3 p-5">
                  <span className="mt-0.5 shrink-0 text-primary">
                    &#10003;
                  </span>
                  <p className="text-sm leading-6 text-muted-foreground">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* IBEC METHOD */}
        <section className="mb-20 border-t border-border pt-12 md:pt-16">
          <div className="mb-10">
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              The Framework
            </p>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              What Is the IBEC Method?
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
              A proven answer-writing framework used by top 1% scorers. Four
              stages that transform average answers into high-scoring responses.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {IBEC_STEPS.map((step) => (
              <Card key={step.letter} className="rounded-3xl border-border/50 transition duration-300 hover:-translate-y-[2px]">
                <CardContent className="p-6 md:p-8">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">
                    {step.letter}
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    Learn the Perfect {step.title}
                  </h3>
                  <ul className="mt-5 space-y-3">
                    {step.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
                      >
                        <span className="mt-0.5 shrink-0 text-primary">&#10003;</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button asChild className="rounded-full px-8">
              <Link href="/toppers/toppers-copy-compilation">
                See Examples in the Compilation &rarr;
              </Link>
            </Button>
          </div>
        </section>

        {/* FEATURED TOPPERS */}
        <section className="mb-20 border-t border-border pt-12 md:pt-16">
          <div className="mb-10">
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              Featured Toppers
            </p>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Learn from the Best
            </h2>
          </div>

          <div className="grid gap-3">
            {toppers.slice(0, 6).map((topper: any) => (
              <Link
                key={topper.slug}
                href={`/upsc-topper/${topper.slug}`}
                className="flex items-center gap-4 rounded-2xl border border-transparent bg-transparent px-4 py-4 transition hover:border-border/50 hover:bg-card md:gap-6 md:px-6"
              >
                <img
                  src={topperImageSrc(topper)}
                  alt={`${topper.firstName} ${topper.lastName}`}
                  className="h-12 w-12 shrink-0 rounded-xl border border-border/50 bg-background md:h-14 md:w-14"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-lg font-semibold md:text-xl">
                      {topper.firstName} {topper.lastName}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      AIR {topper.rank} &middot; {topper.year}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {topper.optionalSubject} &middot; Total {topper.marks.total}
                  </p>
                </div>
                <span className="hidden shrink-0 text-sm text-muted-foreground md:block">
                  View Profile &rarr;
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-6">
            <Link
              href="/year/2025"
              className="text-sm font-medium text-foreground underline underline-offset-4 transition hover:text-foreground/70"
            >
              Browse all 280+ topper profiles &rarr;
            </Link>
          </div>
        </section>

        {/* PAPER-WISE BREAKDOWN */}
        <section className="mb-20 border-t border-border pt-12 md:pt-16">
          <div className="mb-10 text-center">
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              Paper-wise Expertise
            </p>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              What Each Paper Covers
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {PAPER_BENEFITS.map((p) => (
              <Card key={p.paper} className="rounded-3xl border-border/50">
                <CardContent className="p-6 md:p-8">
                  <Badge className="mb-4 rounded-full px-4 py-1 text-xs font-medium">
                    {p.paper}
                  </Badge>
                  <ul className="space-y-4">
                    {p.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
                      >
                        <span className="mt-0.5 shrink-0 text-primary">&#10003;</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button asChild className="rounded-full px-8">
              <Link href="/toppers/toppers-copy-compilation">
                Start Learning &rarr;
              </Link>
            </Button>
          </div>
        </section>

        {/* BROWSE TOPPERS BY YEAR */}
        <section className="mb-20 border-t border-border pt-12 md:pt-16">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              Browse Toppers by Year
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Explore structured profiles of 280+ UPSC toppers. Filter by rank,
              year, or subject.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {YEARS.map((year) => (
              <Button key={year} variant="outline" asChild className="rounded-full">
                <Link href={`/year/${year}`}>{year}</Link>
              </Button>
            ))}
            <Button asChild className="rounded-full">
              <Link href="/year/2025">View All Toppers &rarr;</Link>
            </Button>
          </div>
        </section>

        {/* OPTIONAL SUBJECTS */}
        <section className="mb-20 border-t border-border pt-12 md:pt-16">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">
              Optional Subjects
            </h2>
          </div>

          <div className="grid gap-x-16 gap-y-10 md:grid-cols-2">
            {OPTIONAL_SUBJECTS.map((subject) => (
              <Link
                key={subject}
                href={`/optional/${subject.toLowerCase()}`}
                className="group border-b border-border pb-5 transition"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold tracking-tight transition group-hover:translate-x-1 group-hover:text-primary">
                    {subject}
                  </h3>
                  <span className="text-muted-foreground transition group-hover:translate-x-1">
                    &rarr;
                  </span>
                </div>
                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  Topper strategies, score trends, and performance analysis for{" "}
                  {subject}.
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* COMPILATION CTA */}
        <section className="mb-20 border-t border-border pt-12 md:pt-16">
          <div className="overflow-hidden rounded-3xl bg-primary p-8 md:p-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold leading-[1.1] tracking-tight text-primary-foreground md:text-5xl">
                50+ Topper Answer Copies
              </h2>
              <p className="mt-4 max-w-lg text-base leading-7 text-primary-foreground/70 md:text-lg md:leading-8">
                Marks-wise compilation across GS1&ndash;4 and Essay. Learn the
                IBEC Method from toppers who scored 120+ marks.
              </p>
              <Button asChild variant="secondary" className="mt-8 rounded-full px-8">
                <Link href="/toppers/toppers-copy-compilation">
                  Learn More &rarr;
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <Footer />
      </div>
    </main>
  );
}

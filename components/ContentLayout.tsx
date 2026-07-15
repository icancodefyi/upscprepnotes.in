import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import type { ContentPage } from "@/data/content";
import type { Components } from "react-markdown";

const DEFAULTS = {
  ctaIntro: "Starting at ₹99. Strategy compilations, answer copies, notes bundles, test series, and more.",
  ctaIntroBtn: "Shop Now →",
  ctaIntroHref: "/store",
  ctaMid: "Get the detailed strategy report with topper marks data, subject-wise breakdown, and answer templates.",
  ctaMidSub: "Includes verified marks from 280+ UPSC toppers across all subjects.",
  ctaMidBtn: "Shop Now →",
  ctaMidHref: "/store",
  ctaFinal: "Ready to Master Your UPSC Preparation?",
  ctaFinalSub: "Access the complete topper intelligence database with marks, strategies, and answer copies — everything you need to optimize your preparation.",
  ctaFinalBtn: "Shop Now →",
  ctaFinalHref: "/store",
};

const markdownComponents: Components = {
  a({ href, children }) {
    if (href?.startsWith("/")) {
      return <Link href={href} className="text-brand underline underline-offset-2 hover:text-brand">{children}</Link>;
    }
    return <a href={href} className="text-brand underline underline-offset-2 hover:text-brand" target="_blank" rel="noopener noreferrer">{children}</a>;
  },
  table({ children }) {
    return (
      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">{children}</table>
      </div>
    );
  },
  thead({ children }) {
    return <thead className="border-b border-border bg-secondary">{children}</thead>;
  },
  tbody({ children }) {
    return <tbody className="divide-y divide-border">{children}</tbody>;
  },
  tr({ children }) {
    return <tr className="transition-colors hover:bg-secondary">{children}</tr>;
  },
  th({ children }) {
    return <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">{children}</th>;
  },
  td({ children }) {
    return <td className="px-4 py-3 text-muted-foreground">{children}</td>;
  },
  ul({ children }) {
    return <ul className="mt-2 list-disc space-y-1 pl-5">{children}</ul>;
  },
  ol({ children }) {
    return <ol className="mt-2 list-decimal space-y-1 pl-5">{children}</ol>;
  },
  li({ children }) {
    return <li className="text-base leading-7 text-muted-foreground">{children}</li>;
  },
  strong({ children }) {
    return <strong className="font-semibold text-foreground">{children}</strong>;
  },
  em({ children }) {
    return <em className="italic text-muted-foreground">{children}</em>;
  },
};

export default function ContentLayout({ page }: { page: ContentPage }) {
  const t = { ...DEFAULTS, ...page };

  return (
    <main className="min-h-screen bg-white">
      <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28">
        <nav className="mb-8 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-muted-foreground transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-muted-foreground">{page.h1}</span>
        </nav>

        <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-5xl">
          {page.h1}
        </h1>

        <div className="mt-6 flex items-center gap-3 border-b border-border pb-6">
          <img
            src="https://zaid.impiclabs.com/_next/image?url=%2Fprofile.jpg&w=1080&q=75"
            alt="Zaid Rakhange"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="text-sm">
            <p className="font-semibold text-foreground">
              <a
                href="https://zaid.impiclabs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand transition-colors underline"
              >
                Zaid Rakhange
              </a>
            </p>
            <p className="text-muted-foreground">Zaid Rakhange — I manually extract every data point from UPSC's official result PDFs. Updated {new Date(page.lastUpdated).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
        </div>

        <div className="prose prose-gray max-w-none mt-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{page.intro}</ReactMarkdown>
        </div>

        {/* Inline CTA after intro */}
        <div className="mt-8 rounded-2xl border border-brand/20 bg-brand-muted p-5">
          <p className="text-sm font-semibold text-foreground">{t.ctaIntro}</p>
          <Link
            href={t.ctaIntroHref}
            data-track="content-cta-intro"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand px-6 py-2 text-xs font-bold text-white hover:bg-brand transition-colors"
          >
            {t.ctaIntroBtn}
          </Link>
        </div>

        {page.sections.map((section, i) => (
          <section key={i} className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {section.heading}
            </h2>
            <div className="prose prose-gray max-w-none mt-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{section.body}</ReactMarkdown>
            </div>

            {(i + 1) % 2 === 0 && i < page.sections.length - 1 && (
              <div className="mt-8 rounded-2xl border border-brand/20 bg-brand-muted p-5">
                <p className="text-sm font-semibold text-foreground">{t.ctaMid}</p>
                <p className="mt-1 text-xs text-brand">{t.ctaMidSub}</p>
                <Link
                  href={t.ctaMidHref}
                  data-track={`content-cta-mid-${i}`}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand px-6 py-2 text-xs font-bold text-white hover:bg-brand transition-colors"
                >
                  {t.ctaMidBtn}
                </Link>
              </div>
            )}
          </section>
        ))}

        {page.faq && page.faq.length > 0 && (
          <>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: page.faq.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                  })),
                }),
              }}
            />
            <section className="mt-16 border-t border-border pt-12">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {page.lang === "hi" ? "अक्सर पूछे जाने वाले प्रश्न" : "Frequently Asked Questions"}
            </h2>
            <div className="mt-6 divide-y divide-border">
              {page.faq.map((item, i) => (
                <div key={i} className="py-5 first:pt-0 last:pb-0">
                  <h3 className="text-sm font-semibold text-foreground sm:text-base">{item.q}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
          </>
        )}

        {page.relatedPages && page.relatedPages.length > 0 && (
          <section className="mt-16 border-t border-border pt-12">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {page.lang === "hi" ? "संबंधित पेज" : "Related Pages"}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {page.relatedPages.map((rp, i) => (
                <Link
                  key={i}
                  href={rp.href}
                  className="group rounded-xl border border-border p-4 transition-all hover:border-brand/20 hover:bg-brand-muted"
                >
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-brand transition-colors">
                    {rp.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">{rp.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {page.sources && page.sources.length > 0 && (
          <section className="mt-12 border-t border-border pt-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Data Sources</h2>
            <ul className="mt-3 space-y-1.5">
              {page.sources.map((s, i) => (
                <li key={i}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground underline underline-offset-2 hover:text-brand transition-colors"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Free Materials CTA */}
        <section className="mt-16 rounded-2xl border border-brand/20 bg-brand-muted p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-muted border border-brand/20">
              <span className="text-2xl">📚</span>
            </div>
            <div className="flex-1">
              <h2 className="text-base font-bold text-foreground">Free UPSC Study Material</h2>
              <p className="mt-1 text-sm text-brand">
                2,700+ resources — test series, notes, books, magazines. Download free from top coaching institutes.
              </p>
            </div>
            <Link
              href="/free-materials"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-brand px-6 py-2.5 text-xs font-bold text-white hover:bg-brand transition-colors"
            >
              Browse Free Materials &rarr;
            </Link>
          </div>
        </section>

        <section className="mt-16 rounded-3xl bg-foreground p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{t.ctaFinal}</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">{t.ctaFinalSub}</p>
          <Link
            href={t.ctaFinalHref}
            data-track="content-cta-final"
            className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-brand px-10 py-3 text-sm font-bold text-white shadow-lg shadow-brand/25 hover:bg-brand transition-colors"
          >
            {t.ctaFinalBtn}
          </Link>
        </section>
      </article>
    </main>
  );
}

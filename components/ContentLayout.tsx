import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import type { ContentPage } from "@/data/content";
import type { Components } from "react-markdown";

const DEFAULTS = {
  ctaIntro: "Starting at ₹99. Strategy compilations, answer copies, notes bundles, test series, and more.",
  ctaIntroBtn: "Shop Now →",
  ctaMidBtn: "Shop Now →",
  ctaFinalBtn: "Shop Now →",
};

const markdownComponents: Components = {
  a({ href, children }) {
    if (href?.startsWith("/")) {
      return <Link href={href} className="text-emerald-700 underline underline-offset-2 hover:text-emerald-600">{children}</Link>;
    }
    return <a href={href} className="text-emerald-700 underline underline-offset-2 hover:text-emerald-600" target="_blank" rel="noopener noreferrer">{children}</a>;
  },
  table({ children }) {
    return (
      <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left text-sm">{children}</table>
      </div>
    );
  },
  thead({ children }) {
    return <thead className="border-b border-gray-200 bg-gray-50">{children}</thead>;
  },
  tbody({ children }) {
    return <tbody className="divide-y divide-gray-100">{children}</tbody>;
  },
  tr({ children }) {
    return <tr className="transition-colors hover:bg-gray-50">{children}</tr>;
  },
  th({ children }) {
    return <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">{children}</th>;
  },
  td({ children }) {
    return <td className="px-4 py-3 text-gray-600">{children}</td>;
  },
  ul({ children }) {
    return <ul className="mt-2 list-disc space-y-1 pl-5">{children}</ul>;
  },
  ol({ children }) {
    return <ol className="mt-2 list-decimal space-y-1 pl-5">{children}</ol>;
  },
  li({ children }) {
    return <li className="text-base leading-7 text-gray-600">{children}</li>;
  },
  strong({ children }) {
    return <strong className="font-semibold text-gray-900">{children}</strong>;
  },
  em({ children }) {
    return <em className="italic text-gray-600">{children}</em>;
  },
};

export default function ContentLayout({ page }: { page: ContentPage }) {
  const t = { ...DEFAULTS, ...page };

  return (
    <main className="min-h-screen bg-white">
      <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28">
        <nav className="mb-8 text-xs text-gray-400">
          <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{page.h1}</span>
        </nav>

        <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-gray-900 sm:text-5xl">
          {page.h1}
        </h1>

        <div className="mt-6 flex items-center gap-3 border-b border-gray-100 pb-6">
          <img
            src="https://zaid.impiclabs.com/_next/image?url=%2Fprofile.jpg&w=1080&q=75"
            alt="Zaid Rakhange"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="text-sm">
            <p className="font-semibold text-gray-900">
              <a
                href="https://zaid.impiclabs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-700 transition-colors underline"
              >
                Zaid Rakhange
              </a>
            </p>
            <p className="text-gray-500">UPSCPrepNotes — Updated June 2026</p>
          </div>
        </div>

        <div className="prose prose-gray max-w-none mt-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{page.intro}</ReactMarkdown>
        </div>

        {/* Inline CTA after intro */}
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-semibold text-emerald-900">{t.ctaIntro}</p>
          <Link
            href="/store"
            data-track="content-cta-intro"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-6 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-colors"
          >
            {t.ctaIntroBtn}
          </Link>
        </div>

        {page.sections.map((section, i) => (
          <section key={i} className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {section.heading}
            </h2>
            <div className="prose prose-gray max-w-none mt-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{section.body}</ReactMarkdown>
            </div>

            {(i + 1) % 2 === 0 && i < page.sections.length - 1 && (
              <div className="mt-8 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
                <p className="text-sm font-semibold text-emerald-900">{t.ctaMid}</p>
                <p className="mt-1 text-xs text-emerald-700">{t.ctaMidSub}</p>
                <Link
                  href="/store"
                  data-track={`content-cta-mid-${i}`}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-6 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-colors"
                >
                  {t.ctaMidBtn}
                </Link>
              </div>
            )}
          </section>
        ))}

        {page.faq && page.faq.length > 0 && (
          <section className="mt-16 border-t border-gray-100 pt-12">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {page.lang === "hi" ? "अक्सर पूछे जाने वाले प्रश्न" : "Frequently Asked Questions"}
            </h2>
            <div className="mt-6 divide-y divide-gray-100">
              {page.faq.map((item, i) => (
                <div key={i} className="py-5 first:pt-0 last:pb-0">
                  <h3 className="text-sm font-semibold text-gray-900 sm:text-base">{item.q}</h3>
                  <p className="mt-2 text-sm leading-7 text-gray-500">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {page.relatedPages && page.relatedPages.length > 0 && (
          <section className="mt-16 border-t border-gray-100 pt-12">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {page.lang === "hi" ? "संबंधित पेज" : "Related Pages"}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {page.relatedPages.map((rp, i) => (
                <Link
                  key={i}
                  href={rp.href}
                  className="group rounded-xl border border-gray-200 p-4 transition-all hover:border-emerald-200 hover:bg-emerald-50"
                >
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {rp.title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">{rp.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Free Materials CTA */}
        <section className="mt-16 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-100 border border-blue-200">
              <span className="text-2xl">📚</span>
            </div>
            <div className="flex-1">
              <h2 className="text-base font-bold text-blue-900">Free UPSC Study Material</h2>
              <p className="mt-1 text-sm text-blue-700">
                2,700+ resources — test series, notes, books, magazines. Download free from top coaching institutes.
              </p>
            </div>
            <Link
              href="/free-materials"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-colors"
            >
              Browse Free Materials &rarr;
            </Link>
          </div>
        </section>

        <section className="mt-16 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{t.ctaFinal}</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-400">{t.ctaFinalSub}</p>
          <Link
            href="/store"
            data-track="content-cta-final"
            className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-10 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-500 transition-colors"
          >
            {t.ctaFinalBtn}
          </Link>
        </section>
      </article>
    </main>
  );
}

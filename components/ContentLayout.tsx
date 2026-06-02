import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ContentPage } from "@/data/content";

export default function ContentLayout({ page }: { page: ContentPage }) {
  return (
    <main className="min-h-screen bg-white">
      <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28">
        {/* Breadcrumb */}
        <nav className="mb-8 text-xs text-gray-400">
          <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{page.h1}</span>
        </nav>

        {/* H1 */}
        <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-gray-900 sm:text-5xl">
          {page.h1}
        </h1>

        {/* Intro — renders markdown-like bold/paragraphs */}
        <div className="mt-6 text-base leading-8 text-gray-600">
          {page.intro.split("\n\n").map((p, i) => (
            <p key={i} className={i > 0 ? "mt-4" : ""}>
              {parseInline(p)}
            </p>
          ))}
        </div>

        {/* Inline CTA after intro */}
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-semibold text-emerald-900">
            Preparing for UPSC? Get actual answer copies from 50+ toppers with verified marks.
          </p>
          <Button asChild size="sm" className="mt-3 rounded-full bg-emerald-600 px-6 text-xs font-bold text-white hover:bg-emerald-500">
            <Link href="/toppers/toppers-copy-compilation" data-track="content-cta-intro">
              Get the Bundle at ₹799 →
            </Link>
          </Button>
        </div>

        {/* Sections */}
        {page.sections.map((section, i) => (
          <section key={i} className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {section.heading}
            </h2>
            <div className="mt-4 space-y-4 text-base leading-8 text-gray-600">
              {section.body.split("\n\n").map((p, j) => (
                <p key={j}>{parseInline(p)}</p>
              ))}
            </div>

            {/* Mid-page CTA after every 2 sections */}
            {(i + 1) % 2 === 0 && i < page.sections.length - 1 && (
              <div className="mt-8 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
                <p className="text-sm font-semibold text-emerald-900">
                  🎯 Study Actual Topper Answer Copies — Not Just Strategy Guides
                </p>
                <p className="mt-1 text-xs text-emerald-700">
                  21 strategy guides • 50+ topper copies • Interview prep • Ethics case studies — all at ₹799.
                </p>
                <Button asChild size="sm" className="mt-3 rounded-full bg-emerald-600 px-6 text-xs font-bold text-white hover:bg-emerald-500">
                  <Link href="/toppers/toppers-copy-compilation" data-track={`content-cta-mid-${i}`}>
                    Get the Complete Bundle →
                  </Link>
                </Button>
              </div>
            )}
          </section>
        ))}

        {/* FAQ */}
        {page.faq && page.faq.length > 0 && (
          <section className="mt-16 border-t border-gray-100 pt-12">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Frequently Asked Questions
            </h2>
            <div className="mt-6 divide-y divide-gray-100">
              {page.faq.map((item, i) => (
                <div key={i} className="py-5 first:pt-0 last:pb-0">
                  <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                    {item.q}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-gray-500">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="mt-16 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Get 50+ Topper Answer Copies at ₹799
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-400">
            Actual answer sheets with verified marks + 21 strategy guides + interview prep. Price moves to ₹4,999 after launch.
          </p>
          <Button asChild size="lg" className="mt-6 rounded-full bg-emerald-600 px-10 py-5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-500">
            <Link href="/toppers/toppers-copy-compilation" data-track="content-cta-final">
              Claim Bundle at ₹799 →
            </Link>
          </Button>
        </section>
      </article>
    </main>
  );
}

function parseInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

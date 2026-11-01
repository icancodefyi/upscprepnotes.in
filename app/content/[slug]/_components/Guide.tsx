import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ContentPage } from "@/data/content";
import { card } from "@/components/brand/ui";
import Toc from "@/components/brand/Toc";
import type { OptionalStats, PaperStats } from "@/lib/paper-stats";
import PaperData from "./PaperData";
import OptionalData from "./OptionalData";
import ReadingProgress from "./ReadingProgress";

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9ऀ-ॿ]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "section";

const linkCls = "font-bold text-[var(--accent)] underline decoration-[var(--accent)]/30 decoration-2 underline-offset-[3px] hover:decoration-[var(--accent)]";

const md: Components = {
  // A paragraph that opens with a bold phrase ("**Underlining.** …") is a point: give it a margin rule so it scans.
  p: ({ node, children }) => {
    const first = node?.children?.[0];
    const text = first && first.type === "text" ? first.value : first && first.type === "element" && first.children[0]?.type === "text" ? first.children[0].value : "";
    // "The practical takeaway: …", "Key insight: …" — the one line to remember from a section.
    if (/^(the practical takeaway|key insight|takeaway|the bottom line|tip)\b/i.test(text.trim())) {
      return (
        <p className="mt-6 rounded-[16px] bg-[#fff8d6] px-5 py-4 text-m leading-[1.65] text-[var(--ink)] shadow-[inset_0_0_0_1px_rgba(92,74,0,0.12)] first:mt-0">
          {children}
        </p>
      );
    }
    const point = first && first.type === "element" && first.tagName === "strong";
    return point ? (
      <p className="mt-5 border-l-[3px] border-[var(--accent)] pl-4 text-m leading-[1.7] text-[var(--ink-2)] first:mt-0">{children}</p>
    ) : (
      <p className="mt-4 text-m leading-[1.7] text-[var(--ink-2)] first:mt-0">{children}</p>
    );
  },
  a: ({ href, children }) =>
    href?.startsWith("/") ? (
      <Link href={href} className={linkCls}>{children}</Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkCls}>{children}</a>
    ),
  ul: ({ children }) => <ul className="mt-4 space-y-2.5">{children}</ul>,
  ol: ({ children }) => <ol className="mt-5 space-y-3 [counter-reset:step]">{children}</ol>,
  // Markers come from .guide-li in brand.css: blue dots for lists, numbered discs for steps.
  li: ({ children }) => <li className="guide-li text-m leading-[1.65] text-[var(--ink-2)]">{children}</li>,
  strong: ({ children }) => <strong className="font-bold text-[var(--ink)]">{children}</strong>,
  h3: ({ children }) => <h3 className="mt-8 text-m font-bold">{children}</h3>,
  blockquote: ({ children }) => (
    <blockquote className="relative mt-5 rounded-[16px] bg-[#fff8d6] px-5 py-4 [&_p]:mt-0 [&_p]:border-0 [&_p]:pl-0 [&_p]:text-[var(--ink)]">{children}</blockquote>
  ),
  table: ({ children }) => (
    <div className={`${card} mt-5 overflow-x-auto`}>
      <table className="w-full min-w-[480px] text-left text-s">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-[var(--canvas)]/60 text-[var(--muted)]">{children}</thead>,
  th: ({ children }) => <th className="px-4 py-2.5 font-normal">{children}</th>,
  td: ({ children }) => <td className="tab border-t border-[var(--line)] px-4 py-2.5 text-[var(--ink-2)]">{children}</td>,
};

const Md = ({ text }: { text: string }) => (
  <ReactMarkdown remarkPlugins={[remarkGfm]} components={md}>
    {text}
  </ReactMarkdown>
);

const fmtDate = (iso: string, hi: boolean) => new Date(iso).toLocaleDateString(hi ? "hi-IN" : "en-IN", { year: "numeric", month: "long", day: "numeric" });

/** One chapter of a guide. */
function Chapter({ id, title, meta, children }: { id: string; title: string; meta?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
        <h2 className="t-head max-w-[30ch] text-l">{title}</h2>
        {meta && <p className="text-s text-[var(--muted)]">{meta}</p>}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

/**
 * A guide as a document: title and byline with the lead, numbered chapters, and a sticky sidebar that
 * starts beside the title (at-a-glance card + contents). Strategy guides get their live marks data as
 * the second chapter; every guide ends on a clear "up next".
 */
export default function Guide({
  page,
  stats,
  optionals = null,
  alt = null,
}: {
  page: ContentPage;
  stats: PaperStats | null;
  optionals?: OptionalStats | null;
  alt?: { href: string; label: string } | null;
}) {
  const hi = page.lang === "hi";
  const sections = page.sections.map((s) => ({ ...s, id: slugify(s.heading) }));
  const [lead, ...restIntro] = page.intro.split(/\n{2,}/);
  const hasData = !!(stats || optionals);

  // Chapter list: first section, the live data, then the rest, then questions.
  const chapters = [
    ...sections.slice(0, 1).map((s) => ({ id: s.id, label: s.heading })),
    ...(hasData ? [{ id: "the-numbers", label: hi ? "आँकड़े" : "The numbers" }] : []),
    ...sections.slice(1).map((s) => ({ id: s.id, label: s.heading })),
    ...(page.faq?.length ? [{ id: "faq", label: hi ? "प्रश्न" : "Questions" }] : []),
  ];

  const words = [page.intro, ...page.sections.map((s) => s.body), ...(page.faq ?? []).map((f) => f.a)].join(" ").split(/\s+/).length;
  const minutes = Math.max(2, Math.round(words / 220));
  const [next, ...more] = page.relatedPages ?? [];

  const glance = stats
    ? [
        { k: hi ? "मीडियन" : "Median topper", v: stats.median },
        { k: hi ? "टॉप 10%" : "Top 10% from", v: stats.top10 },
        { k: hi ? "सर्वाधिक" : "Highest", v: stats.best, mark: true },
      ]
    : null;

  return (
    <div className="pb-24 pt-28 sm:pt-32">
      <ReadingProgress target="guide-body" />
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <nav aria-label="Breadcrumb" className="t-meta flex flex-wrap items-center gap-x-2">
              <Link href="/" className="hover:text-[var(--ink)]">{hi ? "होम" : "Home"}</Link>
              <span aria-hidden>/</span>
              <span className="text-[var(--ink-2)]">{hi ? "गाइड" : "Guides"}</span>
            </nav>

            <header className="mt-8 max-w-[48rem]">
              <h1 className={`t-display ${page.h1.length > 46 ? "text-l" : "text-h1"}`}>{page.h1}</h1>
              <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://zaid.impiclabs.com/_next/image?url=%2Fprofile.jpg&w=96&q=75" alt="Zaid Rakhange" width={36} height={36} className="h-9 w-9 rounded-full object-cover shadow-[0_0_0_1px_var(--line)]" />
                <p className="text-s text-[var(--muted)]">
                  <a href="https://zaid.impiclabs.com" target="_blank" rel="noopener noreferrer" className="font-bold text-[var(--ink)] hover:text-[var(--accent)]">Zaid Rakhange</a>
                  {` · ${hi ? "अपडेट" : "Updated"} ${fmtDate(page.lastUpdated, hi)} · ${minutes} ${hi ? "मिनट" : "min read"}`}
                </p>
                {alt && (
                  <Link href={alt.href} hrefLang={hi ? "en" : "hi"} className="rounded-full bg-white px-3 py-1 text-s font-bold text-[var(--ink-2)] shadow-[0_0_0_1px_var(--line-2)] hover:text-[var(--accent)] hover:shadow-[0_0_0_1px_var(--accent)]">
                    {alt.label}
                  </Link>
                )}
              </div>
              <div className="mt-7 border-l-[3px] border-[var(--hl)] pl-5 [&_p]:border-0 [&_p]:pl-0 [&_p]:text-m [&_p]:leading-[1.65] [&_p]:text-[var(--ink)]">
                <Md text={lead} />
              </div>
            </header>

            {/* Mobile contents */}
            {chapters.length > 2 && (
              <details className={`${card} group mt-8 lg:hidden`}>
                <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-s font-bold [&::-webkit-details-marker]:hidden">
                  {`${hi ? "इस गाइड में" : "In this guide"} · ${chapters.length} ${hi ? "भाग" : "parts"}`}
                  <span aria-hidden className="transition-transform duration-200 group-open:rotate-180">▾</span>
                </summary>
                <ol className="border-t border-[var(--line)] px-5 py-3">
                  {chapters.map((c, i) => (
                    <li key={c.id}>
                      <a href={`#${c.id}`} className="flex gap-3 py-2 text-s text-[var(--ink-2)] hover:text-[var(--accent)]">
                        <span className="t-meta tab w-5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                        {c.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
            )}

            <article id="guide-body" className="mt-12 max-w-[46rem] space-y-16">
              {restIntro.length > 0 && <div><Md text={restIntro.join("\n\n")} /></div>}

              {sections.map((s, i) => (
                <div key={s.id} className="space-y-16">
                  <Chapter id={s.id} title={s.heading}>
                    <Md text={s.body} />
                  </Chapter>
                  {i === 0 && stats && (
                    <Chapter id="the-numbers" title={hi ? "आँकड़े" : `${stats.label}: the numbers`} meta={`${stats.n} marksheets · CSE ${stats.years}`}>
                      <PaperData s={stats} />
                    </Chapter>
                  )}
                  {i === 0 && optionals && (
                    <Chapter id="the-numbers" title="Optional marks, compared" meta={`${optionals.marksheets} complete marksheets`}>
                      <OptionalData o={optionals} />
                    </Chapter>
                  )}
                </div>
              ))}

              {page.faq && page.faq.length > 0 && (
                <Chapter id="faq" title={hi ? "अक्सर पूछे जाने वाले प्रश्न" : "Questions"}>
                  <div className={`${card} divide-y divide-[var(--line)]`}>
                    {page.faq.map((f, i) => (
                      <details key={f.q} open={i === 0} className="group px-6 py-5">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                          <h3 className="text-m font-bold">{f.q}</h3>
                          <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--canvas)] transition-transform duration-200 group-open:rotate-45 group-open:bg-[var(--accent)] group-open:text-white">+</span>
                        </summary>
                        <p className="mt-3 text-m leading-[1.6] text-[var(--ink-2)]">{f.a}</p>
                      </details>
                    ))}
                  </div>
                </Chapter>
              )}

              {/* Up next: one clear next read, then the rest */}
              {next && (
                <div>
                  <Link
                    href={next.href}
                    data-track="guide-up-next"
                    className="group relative block overflow-hidden rounded-[28px] bg-[var(--accent)] p-7 text-white shadow-[0_18px_40px_-20px_rgba(19,35,138,0.8)] sm:p-9"
                  >
                    <p className="t-head max-w-[24ch] text-l">{next.title}</p>
                    <p className="mt-2 max-w-[40ch] text-m text-white/80">{next.description}</p>
                    <span className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-s font-bold text-[var(--accent)] transition-transform duration-200 ease-[var(--ease)] group-hover:translate-x-1">
                      {hi ? "आगे पढ़ें" : "Read next"} <span aria-hidden>→</span>
                    </span>
                  </Link>
                  {more.length > 0 && (
                    <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                      {more.map((r) => (
                        <li key={r.href}>
                          <Link href={r.href} className={`${card} group flex h-full items-start justify-between gap-3 p-5 transition-transform duration-200 ease-[var(--ease)] hover:-translate-y-0.5`}>
                            <span>
                              <span className="block text-m font-bold group-hover:text-[var(--accent)]">{r.title}</span>
                              <span className="mt-1 block text-s leading-[1.5] text-[var(--muted)]">{r.description}</span>
                            </span>
                            <span aria-hidden className="mt-1 text-[var(--muted)] group-hover:text-[var(--accent)]">→</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {page.sources && page.sources.length > 0 && (
                <div className="border-t border-[var(--line)] pt-6">
                  <p className="text-s font-bold">{hi ? "स्रोत" : "Sources"}</p>
                  <ul className="mt-2 space-y-1">
                    {page.sources.map((s) => (
                      <li key={s.label}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-s text-[var(--muted)] underline underline-offset-2 hover:text-[var(--accent)]">{s.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          </div>

          <aside className="hidden space-y-4 lg:sticky lg:top-24 lg:block lg:self-start">
            {/* At a glance (guides with live numbers only) */}
            {glance && (
            <div className={`${card} p-5`}>
              <p className="text-m font-bold">{hi ? "एक नज़र में" : `${stats?.label} at a glance`}</p>
              {glance && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {glance.map((g) => (
                    <div key={g.k}>
                      <p className={`t-display tab text-l leading-none ${g.mark ? "text-[var(--accent)]" : ""}`}>{g.v}</p>
                      <p className="mt-1 text-s leading-[1.3] text-[var(--muted)]">{g.k}</p>
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-3 border-t border-[var(--line)] pt-3 text-s text-[var(--muted)]">{`${stats?.label}, of ${stats?.max} · ${minutes} min read`}</p>
            </div>
            )}

            {chapters.length > 2 && (
              <nav aria-label="On this page" className={`${card} p-5`}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-m font-bold">{hi ? "इस पेज पर" : "On this page"}</p>
                  {!glance && <p className="text-s text-[var(--muted)]">{`${minutes} ${hi ? "मिनट" : "min read"}`}</p>}
                </div>
                <Toc items={chapters} />
              </nav>
            )}

            <div className={`${card} p-5`}>
              <p className="text-m font-bold">{hi ? "टॉपर्स ने कैसे लिखा, देखें" : "See how toppers wrote it"}</p>
              <p className="mt-1 text-s leading-[1.5] text-[var(--muted)]">
                {hi ? "असली आंसर कॉपी, हर पेपर के अंकों के साथ।" : "Real answer copies, next to the marks each paper earned."}
              </p>
              <Link href="/toppers" data-track="guide-side-toppers" className="btn btn-blue mt-4 w-full justify-between [--btn-fs:14px]">
                {hi ? "टॉपर्स देखें" : "Browse toppers"} <span className="knob">→</span>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

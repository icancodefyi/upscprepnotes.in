import Link from "next/link";
import Outline from "@/components/brand/Outline";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ContentPage } from "@/data/content";
import { card } from "@/components/brand/ui";
import Toc from "@/components/brand/Toc";
import type { OptionalStats, PaperStats } from "@/lib/paper-stats";
import PaperData from "./PaperData";
import OptionalData from "./OptionalData";
import ReadingProgress from "./ReadingProgress";
import SidebarPromo from "./SidebarPromo";

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9ऀ-ॿ]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "section";

const linkCls = "font-bold text-[var(--accent)] underline decoration-[var(--accent)]/30 decoration-2 underline-offset-[3px] hover:decoration-[var(--accent)]";

const md: Components = {
  // A paragraph that opens with a bold phrase ("**Underlining.** …") is a point: give it a margin rule so it scans.
  p: ({ node, children }) => {
    // A paragraph that holds only an image is the image itself: a figure cannot sit inside a <p>.
    const only = node?.children?.length === 1 ? node.children[0] : null;
    if (only && only.type === "element" && only.tagName === "img") return <>{children}</>;
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
  // Images: ![alt|1200x630](/path.png "caption"). The size after the bar stops the page jumping while it loads.
  img: ({ src, alt, title }) => {
    const [text, size] = String(alt ?? "").split("|");
    // ![Gilu says|gilu](/quiz/gilu-hello.png "Tip text"): the mascot beside a short tip, as real text.
    if (size === "gilu") {
      return (
        <span className="mt-6 flex items-center gap-4 rounded-[20px] bg-[#fff8d6] p-4 shadow-[inset_0_0_0_1px_rgba(92,74,0,0.12)] sm:gap-5 sm:p-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={typeof src === "string" ? src : undefined} alt="Gilu the squirrel" width={88} height={97} loading="lazy" decoding="async" className="h-auto w-[72px] shrink-0 sm:w-[88px]" />
          <span className="min-w-0">
            <span className="block text-s font-bold text-[var(--ink)]">{text}</span>
            <span className="mt-1 block text-m leading-[1.55] text-[var(--ink-2)]">{title}</span>
          </span>
        </span>
      );
    }
    const [w, h] = (size ?? "").split("x").map((n) => Number(n));
    return (
      <figure className="mt-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={typeof src === "string" ? src : undefined} alt={text} width={w || undefined} height={h || undefined} loading="lazy" decoding="async" className="h-auto w-full rounded-[20px] shadow-[0_0_0_1px_var(--line-2)]" />
        {title && <figcaption className="mt-2 text-s leading-[1.5] text-[var(--muted)]">{title}</figcaption>}
      </figure>
    );
  },
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

// Original promo copy, shown wherever a page doesn't set its own.
const DEFAULTS = {
  ctaIntro: "Starting at ₹49. Strategy compilations, answer copies, notes bundles, test series, and more.",
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

/** A promo box in the brand style: a quiet card with one button. */
function Promo({ text, sub, btn, href, track }: { text: string; sub?: string; btn: string; href: string; track: string }) {
  return (
    <div className={`${card} flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6`}>
      <div className="min-w-0">
        <p className="text-m font-bold leading-[1.45]">{text}</p>
        {sub && <p className="mt-1 text-s text-[var(--muted)]">{sub}</p>}
      </div>
      <Link href={href} data-track={track} className="btn btn-blue h-11 shrink-0 self-start px-5 [--btn-fs:14px] sm:self-center">
        {btn}
      </Link>
    </div>
  );
}

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
  const t = { ...DEFAULTS, ...page };
  const sections = page.sections.map((s) => ({ ...s, id: slugify(s.heading) }));
  const [lead, ...restIntro] = page.intro.split(/\n{2,}/);
  const hasData = !!(stats || optionals);

  // Chapter list: first section, the live data, then the rest, then questions.
  const chapters = [
    ...sections.slice(0, 1).map((s) => ({ id: s.id, label: s.heading })),
    ...(hasData ? [{ id: "the-numbers", label: hi ? "आँकड़े" : "The numbers" }] : []),
    ...sections.slice(1).map((s) => ({ id: s.id, label: s.heading })),
    ...(page.faq?.length ? [{ id: "faq", label: hi ? "अक्सर पूछे जाने वाले प्रश्न" : "Frequently Asked Questions" }] : []),
  ];

  const words = [page.intro, ...page.sections.map((s) => s.body), ...(page.faq ?? []).map((f) => f.a)].join(" ").split(/\s+/).length;
  const minutes = Math.max(2, Math.round(words / 220));

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
              <Link href="/" className="hover:text-[var(--ink)]">Home</Link>
              <span aria-hidden>/</span>
              <span className="text-[var(--ink-2)]">{page.h1}</span>
            </nav>

            <header className="mt-8 max-w-[48rem]">
              <h1 className={`t-display ${page.h1.length > 46 ? "text-l" : "text-h1"}`}>{page.h1}</h1>
              <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://zaid.impiclabs.com/_next/image?url=%2Fprofile.jpg&w=96&q=75" alt="Zaid Rakhange" width={36} height={36} className="h-9 w-9 rounded-full object-cover shadow-[0_0_0_1px_var(--line)]" />
                <p className="text-s text-[var(--muted)]">
                  <a href="https://zaid.impiclabs.com" target="_blank" rel="noopener noreferrer" className="font-bold text-[var(--ink)] hover:text-[var(--accent)]">Zaid Rakhange</a>
                  {` · ${page.byline ?? "I manually extract every data point from UPSC's official result PDFs."} Updated ${fmtDate(page.lastUpdated, false)}`}
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
              {restIntro.length > 0 && (
                <div className="mt-5">
                  <Md text={restIntro.join("\n\n")} />
                </div>
              )}
              <div className="mt-8">
                <Promo text={t.ctaIntro} btn={t.ctaIntroBtn} href={t.ctaIntroHref} track="content-cta-intro" />
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

              {sections.map((s, i) => (
                <div key={s.id} className="space-y-16">
                  <Chapter id={s.id} title={s.heading}>
                    <Md text={s.body} />
                  </Chapter>
                  {(i + 1) % 2 === 0 && i < sections.length - 1 && (
                    <Promo text={t.ctaMid} sub={t.ctaMidSub} btn={t.ctaMidBtn} href={t.ctaMidHref} track={`content-cta-mid-${i}`} />
                  )}
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
                <Chapter id="faq" title={hi ? "अक्सर पूछे जाने वाले प्रश्न" : "Frequently Asked Questions"}>
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

              {page.relatedPages && page.relatedPages.length > 0 && (
                <section id="related" className="scroll-mt-28">
                  <h2 className="t-head text-l">{hi ? "संबंधित पेज" : "Related Pages"}</h2>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {page.relatedPages.map((r) => (
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
                </section>
              )}

              {page.sources && page.sources.length > 0 && (
                <div className="border-t border-[var(--line)] pt-6">
                  <p className="text-s font-bold">{page.sourcesTitle ?? "Data Sources"}</p>
                  <ul className="mt-2 space-y-1">
                    {page.sources.map((src) => (
                      <li key={src.url + src.label}>
                        <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-s text-[var(--muted)] underline underline-offset-2 hover:text-[var(--accent)]">{src.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Free materials (original copy) */}
              <div className={`${card} flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between`}>
                <div>
                  <h2 className="text-m font-bold">Free UPSC Study Material</h2>
                  <p className="mt-1 text-s leading-[1.5] text-[var(--ink-2)]">2,700+ resources — test series, notes, books, magazines. Download free from top coaching institutes.</p>
                </div>
                <Link href="/free-materials" className="btn btn-paper h-11 shrink-0 self-start px-5 [--btn-fs:14px] sm:self-center">
                  Browse Free Materials →
                </Link>
              </div>

              {/* Closing call to action (original copy) */}
              <section className="relative overflow-hidden rounded-[28px] bg-[var(--accent)] p-8 text-center text-white sm:p-12">
                <Outline kind="book" className="-left-8 -top-6 h-40 w-56 rotate-[-10deg] text-white/[0.09]" />
                <Outline kind="pen" className="-bottom-8 -right-6 h-40 w-52 rotate-[10deg] text-white/[0.09]" />
                <h2 className="t-head relative mx-auto max-w-[22ch] text-l">{t.ctaFinal}</h2>
                <p className="relative mx-auto mt-3 max-w-[34rem] text-m leading-[1.6] text-white/80">{t.ctaFinalSub}</p>
                <Link href={t.ctaFinalHref} data-track="content-cta-final" className="relative mt-7 inline-flex h-12 items-center rounded-full bg-white px-7 text-m font-bold text-[var(--accent)] transition-transform duration-200 ease-[var(--ease)] hover:-translate-y-0.5">
                  {t.ctaFinalBtn}
                </Link>
              </section>
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
                <div className="mt-3 max-h-[26vh] overflow-y-auto pr-1">
                  <Toc items={chapters} />
                </div>
              </nav>
            )}

            {!hi && <SidebarPromo slug={page.slug} productSlug={page.promoProduct} />}
          </aside>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ContentPage } from "@/data/content";
import { Section, card } from "@/components/brand/ui";
import Toc from "@/components/brand/Toc";
import type { PaperStats } from "@/lib/paper-stats";
import PaperData from "./PaperData";

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9ऀ-ॿ]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "section";

const md: Components = {
  p: ({ children }) => <p className="mt-4 text-m leading-[1.7] text-[var(--ink-2)] first:mt-0">{children}</p>,
  a: ({ href, children }) =>
    href?.startsWith("/") ? (
      <Link href={href} className="font-bold text-[var(--accent)] underline decoration-[var(--accent)]/30 decoration-2 underline-offset-[3px] hover:decoration-[var(--accent)]">{children}</Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" className="font-bold text-[var(--accent)] underline decoration-[var(--accent)]/30 decoration-2 underline-offset-[3px] hover:decoration-[var(--accent)]">{children}</a>
    ),
  ul: ({ children }) => <ul className="mt-4 space-y-2 pl-5 [&>li]:list-disc [&>li]:marker:text-[var(--muted)]">{children}</ul>,
  ol: ({ children }) => <ol className="mt-4 space-y-2 pl-5 [&>li]:list-decimal [&>li]:marker:font-bold [&>li]:marker:text-[var(--accent)]">{children}</ol>,
  li: ({ children }) => <li className="pl-1 text-m leading-[1.65] text-[var(--ink-2)]">{children}</li>,
  strong: ({ children }) => <strong className="font-bold text-[var(--ink)]">{children}</strong>,
  h3: ({ children }) => <h3 className="mt-7 text-m font-bold">{children}</h3>,
  blockquote: ({ children }) => <blockquote className="mt-5 rounded-[16px] bg-[#fff8d6] px-5 py-4 [&_p]:mt-0 [&_p]:text-[var(--ink)]">{children}</blockquote>,
  table: ({ children }) => (
    <div className={`${card} mt-5 overflow-x-auto`}>
      <table className="w-full min-w-[480px] text-left text-s">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="text-[var(--muted)]">{children}</thead>,
  th: ({ children }) => <th className="px-4 py-2.5 font-normal">{children}</th>,
  td: ({ children }) => <td className="tab border-t border-[var(--line)] px-4 py-2.5 text-[var(--ink-2)]">{children}</td>,
};

const Md = ({ text }: { text: string }) => (
  <ReactMarkdown remarkPlugins={[remarkGfm]} components={md}>
    {text}
  </ReactMarkdown>
);

const fmtDate = (iso: string, hi: boolean) => new Date(iso).toLocaleDateString(hi ? "hi-IN" : "en-IN", { year: "numeric", month: "long", day: "numeric" });

/**
 * A guide as a document: title and byline, the intro as a lead, sections with a sticky contents
 * list, and (on strategy guides) the live marks data placed after the first section.
 */
export default function Guide({ page, stats }: { page: ContentPage; stats: PaperStats | null }) {
  const hi = page.lang === "hi";
  const sections = page.sections.map((s) => ({ ...s, id: slugify(s.heading) }));
  const toc = [
    ...sections.slice(0, 1).map((s) => ({ id: s.id, label: s.heading })),
    ...(stats ? [{ id: "the-numbers", label: hi ? "आँकड़े" : "The numbers" }] : []),
    ...sections.slice(1).map((s) => ({ id: s.id, label: s.heading })),
    ...(page.faq?.length ? [{ id: "faq", label: hi ? "प्रश्न" : "Questions" }] : []),
  ];
  const long = page.h1.length > 46;

  return (
    <div className="pb-24 pt-28 sm:pt-32">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <nav aria-label="Breadcrumb" className="t-meta flex flex-wrap items-center gap-x-2">
          <Link href="/" className="hover:text-[var(--ink)]">{hi ? "होम" : "Home"}</Link>
          <span aria-hidden>/</span>
          <span className="text-[var(--ink-2)]">{hi ? "गाइड" : "Guides"}</span>
        </nav>

        <header className="mt-8 max-w-[52rem]">
          <h1 className={`t-display ${long ? "text-l" : "text-h1"}`}>{page.h1}</h1>
          <div className="mt-6 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://zaid.impiclabs.com/_next/image?url=%2Fprofile.jpg&w=96&q=75" alt="Zaid Rakhange" width={40} height={40} className="h-10 w-10 rounded-full object-cover shadow-[0_0_0_1px_var(--line)]" />
            <p className="text-s leading-[1.45] text-[var(--muted)]">
              <a href="https://zaid.impiclabs.com" target="_blank" rel="noopener noreferrer" className="font-bold text-[var(--ink)] hover:text-[var(--accent)]">Zaid Rakhange</a>
              <br />
              {`${hi ? "अपडेट" : "Updated"} ${fmtDate(page.lastUpdated, hi)}`}
              {stats && <>{` · ${hi ? "अंक" : "Marks from"} ${stats.n} ${hi ? "टॉपर्स की मार्कशीट" : "complete marksheets"}`}</>}
            </p>
          </div>
          <div className="mt-7 border-l-[3px] border-[var(--hl)] pl-5 [&_p]:text-m [&_p]:text-[var(--ink)]">
            <Md text={page.intro} />
          </div>
        </header>

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article className="min-w-0 max-w-[48rem] space-y-14">
            {sections.map((s, i) => (
              <div key={s.id} className="space-y-14">
                <Section id={s.id} title={s.heading}>
                  <Md text={s.body} />
                </Section>
                {i === 0 && stats && (
                  <Section id="the-numbers" title={hi ? "आँकड़े" : `${stats.label}: the numbers`} meta={`CSE ${stats.years}`}>
                    <PaperData s={stats} />
                  </Section>
                )}
              </div>
            ))}

            {page.faq && page.faq.length > 0 && (
              <Section id="faq" title={hi ? "अक्सर पूछे जाने वाले प्रश्न" : "Questions"}>
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
              </Section>
            )}

            {page.relatedPages && page.relatedPages.length > 0 && (
              <Section id="related" title={hi ? "आगे पढ़ें" : "Read next"}>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {page.relatedPages.map((r) => (
                    <li key={r.href}>
                      <Link href={r.href} className={`${card} group flex h-full flex-col p-5 transition-transform duration-200 ease-[var(--ease)] hover:-translate-y-0.5`}>
                        <span className="text-m font-bold group-hover:text-[var(--accent)]">{r.title}</span>
                        <span className="mt-1 text-s leading-[1.5] text-[var(--muted)]">{r.description}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {page.sources && page.sources.length > 0 && (
              <div className="border-t border-[var(--line)] pt-6">
                <p className="text-s font-bold">{hi ? "स्रोत" : "Sources"}</p>
                <ul className="mt-2 space-y-1">
                  {page.sources.map((s) => (
                    <li key={s.url}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-s text-[var(--muted)] underline underline-offset-2 hover:text-[var(--accent)]">{s.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {toc.length > 2 && (
              <nav aria-label="On this page" className={`${card} hidden p-5 lg:block`}>
                <p className="t-meta">{hi ? "इस पेज पर" : "ON THIS PAGE"}</p>
                <Toc items={toc} />
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
            <div className={`${card} p-5`}>
              <p className="t-meta">{hi ? "और देखें" : "EXPLORE"}</p>
              <ul className="mt-3 space-y-1 text-s">
                {[
                  { href: "/toppers/marks-database", label: hi ? "मार्क्स डेटाबेस" : "Marks database" },
                  { href: "/free-materials", label: hi ? "मुफ़्त स्टडी मटेरियल" : "Free study material" },
                  { href: "/pyq", label: hi ? "पिछले वर्ष के प्रश्न पत्र" : "Previous year papers" },
                  { href: "/store", label: hi ? "स्टोर" : "Store" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="flex items-center justify-between rounded-[10px] px-2 py-1.5 text-[var(--ink-2)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]">
                      {l.label} <span aria-hidden>→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

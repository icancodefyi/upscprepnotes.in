import { Children } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { card } from "@/components/brand/ui";

/** Splits strategy markdown into its sections; top-level "##" titles are dropped and repeated lines removed. */
export function strategySections(md: string) {
  const out: { title: string; body: string }[] = [];
  let cur: { title: string; lines: string[] } | null = null;
  const seen = new Set<string>();
  for (const line of md.split(/\r?\n/)) {
    const h = line.match(/^(#{2,6})\s*(.+)$/);
    if (h) {
      if (h[1] === "##" && md.includes("###")) continue;
      if (cur) out.push({ title: cur.title, body: cur.lines.join("\n").trim() });
      cur = { title: h[2].trim(), lines: [] };
      continue;
    }
    const t = line.trim();
    if (t && seen.has(t)) continue;
    if (t) seen.add(t);
    (cur ??= { title: "", lines: [] }).lines.push(line);
  }
  if (cur) out.push({ title: cur.title, body: cur.lines.join("\n").trim() });
  return out.filter((s) => s.body);
}

const md: Components = {
  p: ({ children }) => <p className="mt-3 text-m leading-[1.7] text-[var(--ink-2)] first:mt-0">{children}</p>,
  ul: ({ children }) => <ul className="mt-3 space-y-2">{children}</ul>,
  ol: ({ children }) => <ol className="mt-3 list-decimal space-y-2 pl-5 text-m leading-[1.6] text-[var(--ink-2)]">{children}</ol>,
  li: ({ children }) => (
    <li className="relative pl-5 text-m leading-[1.6] text-[var(--ink-2)] [ol_&]:pl-1">
      <span aria-hidden className="absolute left-0 top-[0.6em] h-[6px] w-[6px] rounded-full bg-[var(--accent)] [ol_&]:hidden" />
      {children}
    </li>
  ),
  strong: ({ children }) => <strong className="font-bold text-[var(--ink)]">{children}</strong>,
  a: ({ href, children }) => (
    <a href={href} className="text-[var(--accent)] underline underline-offset-2" target={href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
      {children}
    </a>
  ),
};

export function Prose({ children }: { children: string }) {
  return <ReactMarkdown components={md}>{children}</ReactMarkdown>;
}

/** Bio as a short article card. */
export function About({ bio }: { bio: string }) {
  return (
    <div className={`${card} p-6 sm:p-7`}>
      <Prose>{bio}</Prose>
    </div>
  );
}

const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "section";

// Strategy typography: lists with a bold label ("Polity (GS2): Laxmikanth…") become label / resources rows.
const strat: Components = {
  ...md,
  p: ({ children }) => <p className="mt-4 max-w-[46rem] text-m leading-[1.75] text-[var(--ink-2)] first:mt-0">{children}</p>,
  ul: ({ children }) => <ul className="mt-4 divide-y divide-[var(--line)] first:mt-0">{children}</ul>,
  li: ({ node, children }) => {
    const first = node?.children?.[0] as { type?: string; tagName?: string } | undefined;
    const kids = Children.toArray(children);
    if (first?.type === "element" && first.tagName === "strong" && kids.length > 1) {
      return (
        <li className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[10.5rem_1fr] sm:gap-5">
          <span className="text-s font-bold leading-[1.5] text-[var(--ink)] sm:pt-[2px]">{kids[0]}</span>
          <span className="text-m leading-[1.6] text-[var(--ink-2)]">{kids.slice(1)}</span>
        </li>
      );
    }
    return (
      <li className="relative py-2 pl-5 text-m leading-[1.65] text-[var(--ink-2)] first:pt-0 last:pb-0">
        <span aria-hidden className="absolute left-0 top-[1.05em] h-[6px] w-[6px] rounded-full bg-[var(--accent)] first:top-[0.6em]" />
        {children}
      </li>
    );
  },
  blockquote: ({ children }) => <blockquote className="mt-4 border-l-[3px] border-[var(--hl)] bg-[#fffbe6] py-3 pl-4 pr-3 text-m leading-[1.65] text-[var(--ink)] [&_p]:mt-0">{children}</blockquote>,
};

/** Strategy: jump chips, then one numbered card per section. Empty sections are skipped. */
export function Strategy({ first, strategy, heading }: { first: string; strategy: string; heading?: (title: string) => string }) {
  const parts = strategySections(strategy).map((s, i) => ({ ...s, short: s.title, title: heading ? heading(s.title) : s.title, id: `strategy-${slugify(s.title || "overview")}-${i}` }));
  if (!parts.length) return null;
  return (
    <div>
      {parts.length > 2 && (
        <nav aria-label={`${first}'s strategy sections`} className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
          {parts.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="shrink-0 rounded-full bg-white px-4 py-2 text-s font-bold text-[var(--ink-2)] shadow-[0_0_0_1px_var(--line-2)] transition-colors hover:text-[var(--accent)] hover:shadow-[0_0_0_1px_var(--accent)]">
              {s.short || "Overview"}
            </a>
          ))}
        </nav>
      )}
      <div className={`${parts.length > 2 ? "mt-5" : ""} space-y-4`}>
        {parts.map((s, i) => (
          <article key={s.id} id={s.id} className={`${card} scroll-mt-28 p-6 sm:p-8`}>
            <header className="flex items-center gap-3.5">
              <span className="tab grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-s font-bold text-[var(--accent)]">{i + 1}</span>
              <h3 className="t-head text-m sm:text-[20px]">{s.title || "Overview"}</h3>
            </header>
            <div className="mt-5 sm:pl-[50px]">
              <ReactMarkdown components={strat}>{s.body}</ReactMarkdown>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function Insights({ items }: { items: string[] }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2">
      {items.map((text, i) => (
        <li key={i} className={`${card} flex gap-4 p-5`}>
          <span className="t-display tab text-l leading-none text-[var(--accent)]">{String(i + 1).padStart(2, "0")}</span>
          <p className="text-m leading-[1.6] text-[var(--ink-2)]">{text}</p>
        </li>
      ))}
    </ol>
  );
}

export type QA = { q: string; a: string };

export function Faq({ items }: { items: QA[] }) {
  return (
    <div className={`${card} faq-section divide-y divide-[var(--line)]`}>
      {items.map((f, i) => (
        <details key={f.q} open={i === 0} className="group px-6 py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
            <h3 className="text-m font-bold tracking-[-0.01em]">{f.q}</h3>
            <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--canvas)] text-m transition-transform duration-200 group-open:rotate-45 group-open:bg-[var(--accent)] group-open:text-white">+</span>
          </summary>
          <p className="mt-3 max-w-[44rem] text-m leading-[1.6] text-[var(--ink-2)]">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

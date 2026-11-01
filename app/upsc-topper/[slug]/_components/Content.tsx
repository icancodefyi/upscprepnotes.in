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

/** Strategy, one block per section. Machine-written first-person text is labelled, never passed off as a quote. */
export function StrategyBlock({ first, strategy, generated }: { first: string; strategy: string; generated: boolean }) {
  const parts = strategySections(strategy);
  if (!parts.length) return null;
  return (
    <div className={`${card} overflow-hidden`}>
      {!generated && (
        <p className="flex items-start gap-2.5 border-b border-[var(--line)] bg-[var(--canvas)] px-6 py-3.5 text-s leading-[1.5] text-[var(--ink-2)]">
          {`Put together from ${first}'s public interviews and reports, in our words.`}
        </p>
      )}
      <div className="divide-y divide-[var(--line)]">
        {parts.map((s, i) => (
          <details key={s.title || i} open={i < 2} className="group px-6 py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
              <h3 className="t-head text-m">{s.title || "Overview"}</h3>
              <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--canvas)] text-m transition-transform duration-200 group-open:rotate-45">+</span>
            </summary>
            <div className="mt-3">
              <Prose>{s.body}</Prose>
            </div>
          </details>
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

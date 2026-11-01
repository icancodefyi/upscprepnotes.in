import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Splits the strategy into its ### sections; top-level ## titles are dropped (the page supplies its own). */
function sections(md: string) {
  const out: { title: string; body: string }[] = [];
  let cur: { title: string; lines: string[] } | null = null;
  const seen = new Set<string>();
  for (const line of md.split(/\r?\n/)) {
    const h = line.match(/^#{2,6}\s*(.+)$/);
    if (h) {
      if (/^##\s/.test(line) && !/^###/.test(line)) continue;
      if (cur) out.push({ title: cur.title, body: cur.lines.join("\n").trim() });
      cur = { title: h[1].trim(), lines: [] };
      continue;
    }
    // Some records repeat paragraphs; keep the first of each.
    const t = line.trim();
    if (t && seen.has(t)) continue;
    if (t) seen.add(t);
    (cur ??= { title: "", lines: [] }).lines.push(line);
  }
  if (cur) out.push({ title: cur.title, body: cur.lines.join("\n").trim() });
  return out.filter((s) => s.body);
}

const md: Components = {
  p: ({ children }) => <p className="mt-4 text-[17px] leading-[1.7] text-[var(--ink-2)] first:mt-0">{children}</p>,
  ul: ({ children }) => <ul className="mt-4 space-y-2.5">{children}</ul>,
  ol: ({ children }) => <ol className="mt-4 list-decimal space-y-2.5 pl-5 text-[17px] leading-[1.6] text-[var(--ink-2)]">{children}</ol>,
  li: ({ children }) => (
    <li className="relative pl-6 text-[16.5px] leading-[1.6] text-[var(--ink-2)] [ol_&]:pl-1">
      <span aria-hidden className="absolute left-0 top-[0.62em] h-[7px] w-[7px] rounded-full bg-[var(--accent)] [ol_&]:hidden" />
      {children}
    </li>
  ),
  strong: ({ children }) => <strong className="font-semibold text-[var(--ink)]">{children}</strong>,
  a: ({ href, children }) => (
    <a href={href} className="text-[var(--accent)] underline underline-offset-2" target={href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
      {children}
    </a>
  ),
};

export default function Strategy({ first, strategy, insights }: { first: string; strategy: string; insights: string[] }) {
  const parts = sections(strategy);
  if (!parts.length) return null;

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-[1120px] px-6">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="t-display h-sec">
              {`How ${first} `}
              <span className="text-[var(--accent)]">prepared.</span>
            </h2>
            <p className="mt-5 max-w-[26rem] text-[18px] leading-[1.55] text-[var(--ink-2)]">
              {`Put together from public interviews and reports, in our words, not ${first}'s. Spot something wrong? Tell us below.`}
            </p>
            <nav aria-label="Strategy sections" className="mt-8 hidden lg:block">
              <ol className="space-y-1 border-l border-[var(--line-2)]">
                {parts.filter((s) => s.title).map((s, i) => (
                  <li key={s.title}>
                    <a href={`#s-${slugify(s.title)}`} className="-ml-px flex gap-3 border-l-2 border-transparent py-1.5 pl-4 text-[14.5px] text-[var(--ink-2)] hover:border-[var(--accent)] hover:text-[var(--ink)]">
                      <span className="t-meta tab pt-[2px]">{String(i + 1).padStart(2, "0")}</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <div className="space-y-5">
            {parts.map((s) => (
              <article key={s.title || "intro"} id={s.title ? `s-${slugify(s.title)}` : undefined} className="scroll-mt-28 rounded-[24px] bg-white p-7 shadow-[0_0_0_1px_var(--line),0_6px_16px_-12px_rgba(11,12,16,0.22)] sm:p-9">
                {s.title && <h3 className="t-head text-[24px]">{s.title}</h3>}
                <div className={s.title ? "mt-4" : ""}>
                  <ReactMarkdown components={md}>{s.body}</ReactMarkdown>
                </div>
              </article>
            ))}
          </div>
        </div>

        {insights.length > 0 && (
          <div className="mt-20">
            <h3 className="t-head text-[28px]">{`What stands out about ${first}'s result`}</h3>
            <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {insights.slice(0, 6).map((text, i) => (
                <li
                  key={i}
                  className="relative rounded-[22px] p-7 pt-9 shadow-[0_0_0_1px_var(--line),0_6px_16px_-10px_rgba(11,12,16,0.25)]"
                  style={{
                    background: ["#ffffff", "#e9edff", "#fff6c2"][i % 3],
                    backgroundImage: "repeating-linear-gradient(to bottom, transparent 0, transparent 31px, rgba(31,63,214,0.08) 31px, rgba(31,63,214,0.08) 32px)",
                    backgroundPosition: "0 4px",
                    transform: `rotate(${[-0.8, 0.6, -0.4][i % 3]}deg)`,
                  }}
                >
                  <span className="t-display tab absolute left-7 top-5 text-[13px] text-[var(--mark-deep)]">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-[15.5px] leading-[32px] text-[var(--ink)]">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

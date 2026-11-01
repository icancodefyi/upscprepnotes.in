import Link from "next/link";
import ComparePicker, { type PickItem } from "@/components/brand/ComparePicker";
import { Avatar, card } from "@/components/brand/ui";

export type Suggestion = { slug: string; name: string; rank: number; year: number; optional: string; total: number; avatar: string; reason: string };

const fmt = (n: number) => n.toLocaleString("en-IN");

/** "Compare with…": ready-made pairs people check most, plus a search for any topper. */
export function CompareBox({ base, first, items, picks }: { base: string; first: string; items: PickItem[]; picks: Suggestion[] }) {
  return (
    <div className={`${card} p-5 sm:p-6`}>
      <p className="text-m leading-[1.55] text-[var(--ink-2)]">
        {`Put ${first}'s marksheet next to any other topper's, paper by paper.`}
      </p>
      <div className="mt-4">
        <ComparePicker base={base} items={items} />
      </div>
      {picks.length > 0 && (
        <ul className="mt-5 grid gap-2 sm:grid-cols-3">
          {picks.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/compare/${base}-vs-${p.slug}`}
                data-track="topper-compare-pick"
                className="group flex h-full items-center gap-3 rounded-[16px] bg-[var(--canvas)] p-3 transition-colors hover:bg-[#e9edff]"
              >
                <Avatar src={p.avatar} alt={p.name} size={40} />
                <span className="min-w-0">
                  <span className="block truncate text-s font-bold group-hover:text-[var(--accent)]">{`vs ${p.name}`}</span>
                  <span className="block truncate text-s text-[var(--muted)]">{p.reason}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** End of the profile: one strong next read, plus the ranks either side in the same year. */
export function ContinueReading({ main, prev, next }: { main: Suggestion | null; prev: Suggestion | null; next: Suggestion | null }) {
  if (!main && !prev && !next) return null;
  return (
    <div className="space-y-3">
      {main && (
        <Link
          href={`/upsc-topper/${main.slug}`}
          data-track="topper-continue-main"
          className="group relative flex flex-col gap-6 overflow-hidden rounded-[28px] bg-[var(--accent)] p-6 text-white shadow-[0_12px_30px_-16px_rgba(31,63,214,0.7)] sm:flex-row sm:items-center sm:p-8"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={main.avatar} alt={main.name} loading="lazy" className="h-24 w-24 shrink-0 rounded-[26px] bg-white object-cover object-top shadow-[0_0_0_4px_rgba(255,255,255,0.25)]" />
          <span className="min-w-0 flex-1">
            <span className="t-meta text-white/65">{`UP NEXT · ${main.reason.toUpperCase()}`}</span>
            <span className="t-head mt-2 block text-l">{main.name}</span>
            <span className="mt-1 block text-m text-white/75">{`AIR ${main.rank} · CSE ${main.year} · ${main.optional}`}</span>
          </span>
          <span className="flex items-center gap-5 sm:flex-col sm:items-end sm:gap-3">
            {main.total > 0 && (
              <span className="tab text-right">
                <span className="t-display block text-l leading-none">{fmt(main.total)}</span>
                <span className="text-s text-white/60">of 2,025 marks</span>
              </span>
            )}
            <span className="btn bg-white text-[var(--accent)] group-hover:bg-white/90">
              Read profile <span className="knob bg-[var(--accent-soft)]">→</span>
            </span>
          </span>
        </Link>
      )}
      {(prev || next) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {[prev, next].map((t, i) =>
            t ? (
              <Link
                key={t.slug}
                href={`/upsc-topper/${t.slug}`}
                data-track={i === 0 ? "topper-continue-prev" : "topper-continue-next"}
                className={`${card} group flex items-center gap-4 p-4 ${i === 1 ? "sm:flex-row-reverse sm:text-right" : ""}`}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--canvas)] text-m transition-transform group-hover:scale-105">{i === 0 ? "←" : "→"}</span>
                <Avatar src={t.avatar} alt={t.name} size={44} />
                <span className="min-w-0 flex-1">
                  <span className="t-meta block">{t.reason.toUpperCase()}</span>
                  <span className="block truncate text-m font-bold group-hover:text-[var(--accent)]">{t.name}</span>
                </span>
              </Link>
            ) : (
              <span key={i} className="hidden sm:block" />
            ),
          )}
        </div>
      )}
    </div>
  );
}

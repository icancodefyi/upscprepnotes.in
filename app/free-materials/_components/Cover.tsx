import Link from "next/link";
import { CATEGORY, type Collection } from "@/lib/materials-meta";

const fmt = (n: number) => n.toLocaleString("en-IN");

/** A study-material collection drawn as a folder in its category's stock colour, with the publisher on the tab. */
export function Folder({ c, size = "md" }: { c: Collection; size?: "md" | "lg" }) {
  const cat = CATEGORY[c.category] ?? CATEGORY.other;
  const big = size === "lg";
  return (
    <div aria-hidden className={`relative pt-[18px] ${big ? "w-[200px] sm:w-[220px]" : "w-full"}`}>
      {/* back of the folder, with its tab */}
      <span className="absolute inset-x-0 bottom-0 top-[18px] rounded-[16px]" style={{ background: cat.back }} />
      <span
        className={`absolute left-0 top-0 flex h-[26px] items-start rounded-t-[12px] px-3 pt-[5px] font-bold ${big ? "text-s" : "text-s"}`}
        style={{ background: cat.back, color: cat.ink }}
      >
        {cat.short}
      </span>
      {/* sheets tucked inside */}
      <span className="absolute inset-x-3 top-[26px] h-[46%] rotate-[-2.5deg] rounded-[6px] bg-white shadow-[0_1px_3px_rgba(11,12,16,0.18)]" />
      <span className="absolute inset-x-4 top-[24px] h-[46%] rotate-[2deg] rounded-[6px] bg-[#fbfbfd] shadow-[0_1px_3px_rgba(11,12,16,0.18)]">
        <span className="absolute inset-x-3 top-2.5 space-y-1.5">
          <span className="block h-[2px] w-[70%] rounded bg-[rgba(31,63,214,0.25)]" />
          <span className="block h-[2px] w-[55%] rounded bg-[rgba(31,63,214,0.18)]" />
        </span>
      </span>
      {/* front cover */}
      <div
        className={`relative mt-[22px] flex flex-col justify-between rounded-[14px] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_-2px_6px_-2px_rgba(11,12,16,0.12),0_8px_16px_-10px_rgba(11,12,16,0.35)] ${big ? "aspect-[4/3]" : "aspect-[4/2.4]"}`}
        style={{ background: cat.tone, color: cat.ink }}
      >
        <span className={`t-display leading-[0.95] ${big ? "text-l" : "text-m sm:text-m"} line-clamp-2`}>{c.brand || cat.label}</span>
        <span className="flex items-end justify-between gap-2">
          <span className="t-meta" style={{ color: cat.ink, opacity: 0.75 }}>{c.year ? `${c.year}` : "PDF"}</span>
          <span className={`tab font-bold ${big ? "text-m" : "text-s"}`}>{`${c.files} resource${c.files === 1 ? "" : "s"}`}</span>
        </span>
      </div>
    </div>
  );
}

export function CollectionCard({ c }: { c: Collection }) {
  return (
    <Link
      href={`/free-materials/${c.slug}`}
      data-track={`free-materials-card-${c.slug}`}
      className="group flex h-full flex-col rounded-[20px] bg-white p-3 shadow-[0_0_0_1px_var(--line-2)] transition-transform duration-200 ease-[var(--ease)] hover:-translate-y-1"
    >
      <Folder c={c} />
      <h3 className="mt-3 line-clamp-2 text-s font-bold sm:mt-4 sm:text-m leading-[1.3] tracking-[-0.01em] group-hover:text-[var(--accent)]">{c.title}</h3>
      {c.description && <p className="mt-1.5 line-clamp-2 hidden text-s sm:block leading-[1.5] text-[var(--ink-2)]">{c.description}</p>}
      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-4 text-s text-[var(--muted)]">
        {c.requests > 0 && (
          <span>
            <span className="tab font-bold text-[var(--ink)]">{fmt(c.requests)}</span> downloads
          </span>
        )}
        {c.hindi && <span className="rounded-full bg-[#FDE9C4] px-2 py-0.5 font-bold text-[#7a4b00]">हिंदी</span>}
        {c.fileSize && <span>{c.fileSize}</span>}
      </div>
    </Link>
  );
}

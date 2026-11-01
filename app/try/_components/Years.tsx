import Link from "next/link";
import SectionHead from "./SectionHead";

export type YearCard = {
  year: number;
  count: number;
  air1: { name: string; slug: string; total: number; optional: string } | null;
  top3: { name: string; rank: number; slug: string }[];
};

const fmt = (n: number) => n.toLocaleString("en-IN");

/** One "result notice" per exam year, like the lists pinned outside UPSC's gate. */
export default function Years({ years }: { years: YearCard[] }) {
  return (
    <section className="panel grain relative bg-[var(--ink)] py-24 text-white sm:py-32">
      <div className="mx-auto max-w-[1120px] px-6">
        <SectionHead
          dark
          title={<>Every year, the list <span className="text-[var(--hl)]">gets new names.</span></>}
          lead="UPSC toppers from CSE 2022 to 2025, with every rank holder's marks. The next list is still being written."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {years.map((y, i) => (
            <div
              key={y.year}
              className="group relative flex flex-col rounded-[24px] bg-white p-6 text-[var(--ink)] shadow-[0_10px_24px_-14px_rgba(11,12,16,0.35)] transition-transform duration-300 ease-[var(--ease)] hover:-translate-y-1.5"
              style={{ transform: `rotate(${[-1.5, 1, -0.8, 1.6][i % 4]}deg)` }}
            >
              {/* pin */}
              <span aria-hidden className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-[var(--mark)] shadow-[0_3px_6px_rgba(0,0,0,0.4),inset_0_-2px_0_rgba(0,0,0,0.2)]" />
              <Link href={`/year/${y.year}`} className="block">
                <p className="t-meta">{`${fmt(y.count)} toppers on record`}</p>
                <p className="t-display tab mt-2 text-[72px] group-hover:text-[var(--accent)]">{y.year}</p>
                <h3 className="sr-only">{`UPSC CSE ${y.year} toppers`}</h3>
              </Link>
              {y.air1 && (
                <Link href={`/upsc-topper/${y.air1.slug}`} className="mt-4 block rounded-[14px] bg-[var(--hl)] p-4 hover:brightness-95">
                  <p className="t-meta text-[var(--hl-ink)]">AIR 1</p>
                  <p className="mt-1 text-[17px] font-semibold tracking-[-0.01em]">{y.air1.name}</p>
                  <p className="text-[13px] text-[rgba(11,12,16,0.65)]">
                    {y.air1.total > 0 ? `${fmt(y.air1.total)} marks · ${y.air1.optional}` : y.air1.optional}
                  </p>
                </Link>
              )}
              <ul className="mt-4 space-y-1.5 text-[14px]">
                {y.top3.filter((t) => t.rank !== 1).map((t) => (
                  <li key={t.slug}>
                    <Link href={`/upsc-topper/${t.slug}`} className="flex justify-between gap-3 text-[var(--ink-2)] hover:text-[var(--accent)]">
                      <span className="truncate">{t.name}</span>
                      <span className="tab shrink-0 font-semibold text-[var(--ink)]">{`AIR ${t.rank}`}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={`/year/${y.year}`} className="mt-auto pt-6 text-[14px] font-semibold text-[var(--accent)]">
                {`All CSE ${y.year} toppers →`}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

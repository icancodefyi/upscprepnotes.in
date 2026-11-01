import Link from "next/link";
import SectionHead from "./SectionHead";

export type ShelfItem = { slug: string; title: string; tagline: string; price: number; image: string | null };

/** Store products on a shelf: real titles and prices, no star ratings. */
export default function StoreShelf({ items }: { items: ShelfItem[] }) {
  return (
    <section className="panel bg-[var(--canvas)] py-24 sm:py-32">
      <div className="mx-auto max-w-[1120px] px-6">
        <SectionHead
          title={<>Topper compilations, <span className="text-[var(--accent)]">in one file.</span></>}
          lead="Everything stays free to read online. These are one-time downloads for offline study."
          action={
            <Link href="/store" className="btn btn-ink">
              Visit the store <span className="knob">↗</span>
            </Link>
          }
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <Link
              key={p.slug}
              href={`/store/${p.slug}`}
              className="group flex flex-col overflow-hidden rounded-[26px] bg-white shadow-[0_0_0_1px_var(--line),0_24px_48px_-30px_rgba(11,12,16,0.45)] transition-transform duration-300 ease-[var(--ease)] hover:-translate-y-1.5"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#e9edff]">
                {p.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease)] group-hover:scale-[1.04]"
                  />
                )}
                <span
                  className="absolute left-5 top-5 rounded-full bg-[var(--hl)] px-3.5 py-1.5 text-[15px] font-bold text-[var(--ink)] shadow-[0_6px_14px_-6px_rgba(0,0,0,0.4)]"
                  style={{ transform: `rotate(${i % 2 ? 3 : -3}deg)` }}
                >
                  {`₹${p.price}`}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="t-head text-[22px] group-hover:text-[var(--accent)]">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.5] text-[var(--ink-2)]">{p.tagline}</p>
                <span className="mt-auto pt-5 text-[14px] font-semibold text-[var(--accent)]">See what&apos;s inside →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

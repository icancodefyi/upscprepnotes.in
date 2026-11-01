import Link from "next/link";

export type OfferData = {
  href: string;
  title: string;
  tagline: string;
  price: number;
  image: string | null;
  features: string[];
};

const PAGES = [2, 3].map((n) => `https://ik.imagekit.io/impiclabs/sample-answers/${n}.png?tr=w-500,f-auto,q-75`);

/** One store offer, the one that matches why people land on a topper page: answer copies. */
export default function Offer({ p, first }: { p: OfferData; first: string }) {
  return (
    <section className="pb-24 sm:pb-32">
      <div className="mx-auto max-w-[1120px] px-6">
        <Link
          href={p.href}
          data-track="topper-offer"
          className="group grid overflow-hidden rounded-[32px] bg-[var(--ink)] text-white shadow-[0_10px_24px_-14px_rgba(11,12,16,0.5)] lg:grid-cols-[0.95fr_1.05fr]"
        >
          <div className="flex flex-col p-8 sm:p-12">
            <h2 className="t-display h-sec">
              {`Done with ${first}? `}
              <span className="text-[var(--hl)]">Keep every booklet offline.</span>
            </h2>
            <p className="mt-5 max-w-[30rem] text-[17px] leading-[1.55] text-white/70">{`${p.title}: ${p.tagline.toLowerCase()}.`}</p>
            <ul className="mt-7 space-y-2.5">
              {p.features.slice(0, 3).map((f) => (
                <li key={f} className="flex gap-3 text-[15px] leading-[1.5] text-white/85">
                  <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--hl)]" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap items-center gap-4 pt-10">
              <span className="btn bg-[var(--hl)] text-[var(--ink)] group-hover:brightness-95">
                {`Get it for ₹${p.price}`} <span className="knob bg-white/60">↗</span>
              </span>
              <span className="text-[14px] text-white/55">One-time · instant download · 7-day refund</span>
            </div>
          </div>
          <div className="relative min-h-[320px] overflow-hidden bg-[var(--accent)] sm:min-h-[400px]">
            {PAGES.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt=""
                aria-hidden
                loading="lazy"
                className="paper absolute top-[14%] w-[40%] transition-transform duration-700 ease-[var(--ease)]"
                style={{ left: i ? "54%" : "6%", transform: `rotate(${i ? 8 : -9}deg)` }}
              />
            ))}
            {p.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.image}
                alt={p.title}
                loading="lazy"
                className="paper absolute left-1/2 top-[9%] w-[52%] -translate-x-1/2 rounded-[10px] transition-transform duration-700 ease-[var(--ease)] group-hover:-translate-y-2 group-hover:rotate-[-1.5deg]"
              />
            )}
          </div>
        </Link>
      </div>
    </section>
  );
}

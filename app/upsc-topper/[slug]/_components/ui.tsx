/** Small building blocks shared by the topper profile. */

export const card = "rounded-[24px] bg-white shadow-[0_0_0_1px_var(--line-2),0_1px_2px_rgba(11,12,16,0.04)]";

export function Section({
  id,
  title,
  meta,
  children,
}: {
  id: string;
  title: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
        <h2 className="t-head text-[24px] sm:text-[28px]">{title}</h2>
        {meta && <div className="text-[13.5px] text-[var(--muted)]">{meta}</div>}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

/** Round photo or avatar with a thin paper ring. */
export function Avatar({ src, alt, size = 48, className = "" }: { src: string; alt: string; size?: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      className={`shrink-0 rounded-full bg-[#e9edff] object-cover object-top shadow-[0_0_0_1px_var(--line)] ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function RankStamp({ rank, size = 56 }: { rank: number; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full border-[2.5px] border-[var(--mark)] text-center text-[var(--mark)]"
      style={{ width: size, height: size, transform: "rotate(-10deg)" }}
    >
      <span className="leading-none">
        <span className="block font-bold tracking-[0.08em]" style={{ fontSize: size * 0.17 }}>AIR</span>
        <span className="t-display tab block" style={{ fontSize: size * (rank > 99 ? 0.3 : 0.38) }}>{rank}</span>
      </span>
    </span>
  );
}

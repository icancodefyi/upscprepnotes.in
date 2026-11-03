import Link from "next/link";
import { card } from "@/components/brand/ui";
import { Paperclip } from "@/components/brand/Props";
import { getProductBySlug } from "@/lib/store-products";
import { INTERVIEW_PACK_SLUG, INTERVIEW_URL } from "@/lib/interview-marks";

/** Median interview mark of the toppers on /toppers/upsc-interview-marks. Kept in step with that page's data. */
export const IV_MEDIAN = 182;

const pack = () => getProductBySlug(INTERVIEW_PACK_SLUG);
const HREF = `/store/${INTERVIEW_PACK_SLUG}`;

/** Two real pages of the pack, fanned like printed sheets, with the brand paperclip holding them. */
export function PackGlimpse({ className = "" }: { className?: string }) {
  return (
    <Link href={HREF} data-track="interview-pack-glimpse" aria-label="See inside the UPSC Interview Pack" className={`relative block aspect-[909/1287] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/store/interview-pack/page-4.jpg" alt="" aria-hidden loading="lazy" className="absolute inset-0 h-full w-full translate-x-[8%] translate-y-[3%] rotate-[6deg] rounded-[6px] object-cover shadow-[0_18px_40px_-18px_rgba(11,12,16,0.55),0_0_0_1px_rgba(11,12,16,0.08)]" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/store/interview-pack/page-1.jpg" alt="Cover of the UPSC Interview Pack" loading="lazy" className="absolute inset-0 h-full w-full -rotate-[3deg] rounded-[6px] object-cover shadow-[0_22px_44px_-16px_rgba(11,12,16,0.6),0_0_0_1px_rgba(11,12,16,0.08)]" />
      <Paperclip className="absolute -top-6 left-[18%] h-[72px] w-[27px] rotate-[-8deg]" />
    </Link>
  );
}

/**
 * The UPSC Interview Pack, offered wherever topper data is read. Three shapes:
 * - `line`: one sentence and a link, for page headers and listings
 * - `card`: the full offer, placed under a marksheet (personalised when an interview mark is given)
 * - `side`: a compact sidebar card with the cover
 */
export default function InterviewPackPromo({
  variant = "card",
  first,
  interview,
  track,
}: {
  variant?: "line" | "card" | "side";
  first?: string;
  interview?: number;
  track: string;
}) {
  const p = pack();
  if (!p) return null;

  if (variant === "line") {
    return (
      <Link
        href={HREF}
        data-track={track}
        className="group inline-flex max-w-full items-center gap-3 rounded-full bg-[var(--hl)] py-2 pl-4 pr-2 text-s font-bold text-[var(--ink)] hover:shadow-[0_0_0_1px_var(--ink)]"
      >
        <span className="min-w-0 truncate">
          <span className="sm:hidden">Preparing for the interview?</span>
          <span className="hidden sm:inline">Preparing for the UPSC interview? Get the Interview Pack</span>
        </span>
        <span className="shrink-0 rounded-full bg-white px-2.5 py-1">{`₹${p.price} →`}</span>
      </Link>
    );
  }

  if (variant === "side") {
    return (
      <Link href={HREF} data-track={track} className={`${card} group flex gap-4 p-4`}>
        {p.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image} alt="" aria-hidden loading="lazy" className="h-[92px] w-[72px] shrink-0 rounded-[8px] object-cover object-top shadow-[0_0_0_1px_var(--line)]" />
        )}
        <span className="min-w-0">
          <span className="block text-m font-bold leading-tight group-hover:text-[var(--accent)]">{p.title}</span>
          <span className="mt-1 block text-s leading-[1.45] text-[var(--muted)]">What boards asked in 14 real interviews, a DAF worksheet and 150 questions</span>
          <span className="mt-2 inline-block rounded-[6px] bg-[var(--hl)] px-2 py-0.5 text-s font-bold">{`₹${p.price}`}</span>
        </span>
      </Link>
    );
  }

  const valid = interview && interview > 0 && interview <= 275;
  const diff = valid ? interview - IV_MEDIAN : 0;
  const lead = valid
    ? `${first ?? "This topper"} scored ${interview} of 275 in the interview, ${diff === 0 ? "exactly the median" : `${Math.abs(diff)} ${diff > 0 ? "above" : "below"} the median of ${IV_MEDIAN}`} for rank holders.`
    : `The median rank holder scored ${IV_MEDIAN} of 275 in the interview.`;

  return (
    <div className="grid items-center gap-8 rounded-[24px] bg-[var(--accent)] p-6 text-white sm:grid-cols-[1fr_170px] sm:p-7 md:grid-cols-[1fr_200px]">
      <div className="min-w-0">
      <p className="t-head text-l">Preparing for the interview? It can move your rank by hundreds</p>
      <p className="mt-3 max-w-[38rem] text-m leading-[1.55] text-white/85">
        {`${lead} Candidates with the same written marks finish 500 ranks apart because of it.`}
      </p>
      <p className="mt-3 max-w-[38rem] text-m leading-[1.55] text-white/85">
        The Interview Pack shows what boards asked in 14 real 2026 interviews, and gives you a DAF worksheet, questions for your degree and home state, 150 practice questions and a 30-day plan.
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link href={HREF} data-track={track} className="btn btn-paper h-11 px-5 [--btn-fs:15px]">
          {`See the Interview Pack · ₹${p.price}`}
        </Link>
        <Link href={INTERVIEW_URL} data-track={`${track}-free`} className="text-s font-bold text-white underline underline-offset-4">
          Free: interview marks of 282 toppers
        </Link>
      </div>
      </div>
      <PackGlimpse className="mx-auto mt-4 w-[150px] sm:mt-0 sm:w-full" />
    </div>
  );
}

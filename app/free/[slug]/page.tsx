import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BrandShell from "@/components/brand/BrandShell";
import FreeCopyForm from "@/components/free/FreeCopyForm";
import { displayName, fmt, freeCopiesOf, subjectOf, totalOf, type LeanTopper } from "@/lib/topper-stats";
import { getTopperBySlug } from "@/services/topper.service";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTopperBySlug(slug);
  if (!t) return { title: "Answer copy not found" };
  const name = displayName(t);
  return {
    title: `${name}'s UPSC answer copy, free | UPSCPrepNotes`,
    description: `Get ${name}'s handwritten Mains answer copy by email, free.`,
    alternates: { canonical: `https://upscprepnotes.in/upsc-topper/${t.slug}` },
    robots: { index: false, follow: true },
  };
}

export default async function FreeCopyPage({ params }: Props) {
  const { slug } = await params;
  const t = await getTopperBySlug(slug);
  if (!t) notFound();

  const name = displayName(t);
  const lean = t as unknown as LeanTopper;
  const optional = subjectOf(t.optionalSubject);
  const total = totalOf(lean);
  const copies = freeCopiesOf(lean).length;
  const ready = copies > 0;

  return (
    <BrandShell>
      <div className="mx-auto max-w-[1080px] px-5 pb-16 pt-24 sm:px-6 sm:pt-28">
        <nav aria-label="Breadcrumb" className="t-meta hidden flex-wrap items-center gap-x-2 gap-y-1 sm:flex">
          <Link href="/" className="hover:text-[var(--ink)]">Home</Link>
          <span aria-hidden>/</span>
          <Link href={`/upsc-topper/${t.slug}`} className="hover:text-[var(--ink)]">{name}</Link>
          <span aria-hidden>/</span>
          <span className="text-[var(--ink-2)]">Free answer copy</span>
        </nav>

        <div data-track-view="free_copy_page" className="mt-2 grid items-start gap-6 sm:mt-6 lg:grid-cols-[1fr_540px] lg:gap-14">
          <header className="text-center lg:pt-6 lg:text-left">
            <h1 className="t-display text-[clamp(30px,6vw,50px)]">{`${name}'s answer copy`}</h1>
            <p className="mt-3 hidden max-w-[44ch] text-m leading-[1.6] text-[var(--ink-2)] sm:block sm:text-[18px] lg:mx-0">
              {ready
                ? "The full handwritten Mains booklet, scanned as submitted. Free, sent to your email."
                : "The handwritten Mains booklet is being scanned. Answer a few questions and the link arrives by email."}
            </p>
            <ul className="mt-3 flex flex-wrap justify-center gap-1.5 sm:mt-5 sm:gap-2 lg:justify-start">
              {[`AIR ${t.rank}`, `UPSC ${t.year}`, optional ? `${optional} optional` : "", total ? `${fmt(total)} marks` : ""].filter(Boolean).map((c, i) => (
                <li key={c} className={`${i > 1 ? "hidden sm:block " : ""}rounded-full bg-white px-3 py-1 text-[13px] font-bold shadow-[0_0_0_1px_var(--line-2)] sm:px-4 sm:py-1.5 sm:text-s`}>{c}</li>
              ))}
              <li className={`rounded-full px-3 py-1 text-[13px] font-bold sm:px-4 sm:py-1.5 sm:text-s ${ready ? "bg-[#e3e8fb] text-[#172fa3]" : "bg-[var(--hl)] text-[var(--hl-ink)]"}`}>{ready ? "Ready to send" : "Being scanned"}</li>
            </ul>

            {/* Desktop only: what happens next, and the promise. On phones the form carries both. */}
            <ol className="mt-8 hidden max-w-[44ch] space-y-3 text-left lg:block">
              {["Answer seven quick questions", "We email you the link", "Read it on any phone or laptop"].map((t, i) => (
                <li key={t} className="flex items-center gap-3 text-m font-bold">
                  <span aria-hidden className="tab grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-s text-[var(--accent)]">{i + 1}</span>
                  {t}
                </li>
              ))}
            </ol>
            <div className="mt-8 hidden max-w-[44ch] gap-3 rounded-[20px] bg-[#e3e8fb] p-4 text-left text-[#172fa3] lg:flex">
              <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z" /><path d="M8.5 12l2.5 2.5 4.5-4.5" /></svg>
              <p className="text-s leading-[1.55]"><strong>No spam.</strong> Your email and WhatsApp number are used only to send this copy and a few study updates that match your answers. You can stop them any time.</p>
            </div>
          </header>

          <div id="get" className="rounded-[28px] bg-white p-5 shadow-[0_0_0_1px_var(--line-2),0_24px_56px_-24px_rgba(11,12,16,0.35)] sm:p-7 lg:sticky lg:top-28">
            <FreeCopyForm topperSlug={t.slug} topperName={name} />
          </div>
        </div>
      </div>
    </BrandShell>
  );
}

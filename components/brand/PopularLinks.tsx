import Link from "next/link";
import { MARKSHEET_PAGES } from "@/lib/marksheet-pages";
import { ANSWER_COPY_PAGES } from "@/lib/answer-copy-pages";

const title = (k: string) => k.split("-").map((w) => (w.length > 1 ? w[0].toUpperCase() + w.slice(1) : w.toUpperCase())).join(" ");

type L = { href: string; label: string };

const chip = "rounded-full px-2.5 py-1 font-bold text-[var(--ink-2)] shadow-[0_0_0_1px_var(--line-2)] hover:text-[var(--accent)]";

function Row({ label, links, track }: { label: string; links: L[]; track: string }) {
  if (!links.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
      <span className="mr-1 text-[var(--muted)]">{label}</span>
      {links.map((l) => (
        <Link key={l.href} href={l.href} data-track={`${track}-${l.href.split("/").pop()}`} className={chip}>
          {l.label}
        </Link>
      ))}
    </div>
  );
}

/**
 * The most-searched topper answer copies and marksheets, plus the Mains marks and papers pages.
 * Placed on the strongest pages (topper profiles, free materials, guides, marks pages) so their
 * ranking passes to these. `exclude` is the current topper's profile slug, so a page never links to itself.
 */
export default function PopularLinks({ track, exclude }: { track: string; exclude?: string }) {
  const copies = ANSWER_COPY_PAGES.filter((p) => p.slug !== exclude).map((p) => ({ href: `/upsc-topper/${p.slug}`, label: `${p.name} answer copy` }));
  const marksheets = Object.entries(MARKSHEET_PAGES)
    .filter(([, slug]) => slug !== exclude)
    .map(([k]) => ({ href: `/toppers/marksheets/${k}`, label: `${title(k)} marksheet` }));
  const more = [
    { href: "/toppers/upsc-mains-marks-needed", label: "Mains marks needed for a rank" },
    { href: "/pyq/2026", label: "UPSC Mains 2026 questions" },
    { href: "/pyq", label: "Previous year papers" },
  ];
  return (
    <nav aria-label="Most searched topper answer copies and marksheets" className="mt-4 space-y-2 text-s">
      <Row label="Answer copies:" links={copies} track={track} />
      <Row label="Marksheets:" links={marksheets} track={track} />
      <Row label="Also searched:" links={more} track={track} />
    </nav>
  );
}

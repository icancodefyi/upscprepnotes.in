import Link from "next/link";
import { MARKSHEET_PAGES } from "@/lib/marksheet-pages";

const title = (k: string) => k.split("-").map((w) => (w.length > 1 ? w[0].toUpperCase() + w.slice(1) : w.toUpperCase())).join(" ");

/** The most-searched marksheets and the newest Mains questions, linked from the marks pages. */
export default function PopularLinks({ track }: { track: string }) {
  const links = [
    ...Object.keys(MARKSHEET_PAGES).map((k) => ({ href: `/toppers/marksheets/${k}`, label: `${title(k)} marksheet` })),
    { href: "/toppers/upsc-mains-marks-needed", label: "Mains marks needed for a rank" },
    { href: "/pyq/2026", label: "UPSC Mains 2026 questions" },
    { href: "/pyq", label: "Previous year papers" },
  ];
  return (
    <nav aria-label="Popular marksheets" className="mt-4 flex flex-wrap items-center gap-x-1 gap-y-2 text-s">
      <span className="mr-1 text-[var(--muted)]">Most searched:</span>
      {links.map((l) => (
        <Link key={l.href} href={l.href} data-track={`${track}-${l.href.split("/").pop()}`} className="rounded-full px-2.5 py-1 font-bold text-[var(--ink-2)] shadow-[0_0_0_1px_var(--line-2)] hover:text-[var(--accent)]">
          {l.label}
        </Link>
      ))}
    </nav>
  );
}

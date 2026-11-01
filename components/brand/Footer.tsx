import Link from "next/link";
import { Mark } from "./Nav";

const fmt = (n: number) => n.toLocaleString("en-IN");
const FOOTER = [
  { title: "Archive", links: [
    { href: "/toppers", label: "UPSC toppers" },
    { href: "/toppers/marks-database", label: "Marks database" },
    { href: "/toppers/toppers-copy-compilation", label: "Topper answer copies" },
    { href: "/pyq", label: "Previous year questions" },
    { href: "/current-affairs", label: "Current affairs" },
    { href: "/free-materials", label: "Free study material" },
    { href: "/ask", label: "Ask AI mentor" },
  ] },
  { title: "By year", links: [
    { href: "/year/2025", label: "CSE 2025 toppers" },
    { href: "/year/2024", label: "CSE 2024 toppers" },
    { href: "/year/2023", label: "CSE 2023 toppers" },
    { href: "/year/2022", label: "CSE 2022 toppers" },
  ] },
  { title: "Optionals", links: [
    { href: "/optional/psir", label: "PSIR" },
    { href: "/optional/sociology", label: "Sociology" },
    { href: "/optional/anthropology", label: "Anthropology" },
    { href: "/optional/geography", label: "Geography" },
    { href: "/optional/mathematics", label: "Mathematics" },
    { href: "/optional/history", label: "History" },
    { href: "/optional/public-administration", label: "Public Administration" },
    { href: "/optional/philosophy", label: "Philosophy" },
  ] },
  { title: "Strategy", links: [
    { href: "/content/how-to-score-130-plus-in-gs1", label: "GS I strategy" },
    { href: "/content/how-to-score-120-plus-in-gs2", label: "GS II strategy" },
    { href: "/content/how-to-score-120-plus-in-gs3", label: "GS III strategy" },
    { href: "/content/how-to-score-100-plus-in-gs4", label: "GS IV ethics strategy" },
    { href: "/content/how-to-score-300-plus-in-psir-optional", label: "Score 300+ in PSIR Optional" },
    { href: "/content/upsc-optional-subject-marks-analysis", label: "Optional Marks Data" },
    { href: "/content/upsc-topper-answer-copies", label: "How to use answer copies" },
    { href: "/content/upsc-syllabus", label: "UPSC syllabus" },
    { href: "/content/upsc-free-material", label: "Free UPSC material guide" },
    { href: "/content/upsc-full-form", label: "UPSC full form" },
    { href: "/content/upsc-full-form-hindi", label: "UPSC full form (Hindi)" },
    { href: "/resources", label: "All resources" },
  ] },
  { title: "Store", links: [
    { href: "/store/answer-copies-compilation", label: "Answer copies compilation" },
    { href: "/store/top-10-rankers-strategy", label: "Top 10 rankers strategy" },
    { href: "/store/government-schemes-compilation", label: "Government schemes" },
    { href: "/store/all-strategy-reports", label: "All strategy reports" },
    { href: "/store", label: "All products" },
  ] },
  { title: "Company", links: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
    { href: "/content/data-methodology-and-editorial-standards", label: "Data methodology" },
    { href: "/privacy-policy", label: "Privacy policy" },
    { href: "/terms", label: "Terms of use" },
    { href: "/disclaimer", label: "Disclaimer" },
    { href: "/llms.txt", label: "llms.txt (for AI)" },
  ] },
];

const RING = "REAL BOOKLETS • REAL MARKS • REAL TOPPERS • ";

function Badge() {
  return (
    <div className="relative h-[150px] w-[150px] sm:h-[180px] sm:w-[180px]">
      <svg viewBox="0 0 200 200" className="spin absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <path id="ring" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text style={{ fontFamily: "var(--up-sans)", fontSize: 13, letterSpacing: 2.2 }} fill="var(--ink)">
          <textPath href="#ring">{RING}</textPath>
        </text>
      </svg>
      <div className="absolute inset-[34px] grid place-items-center rounded-full bg-[var(--mark)] text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.3),0_12px_24px_-10px_rgba(255,74,61,0.8)] sm:inset-[40px]">
        <span className="t-display text-l">AIR</span>
      </div>
    </div>
  );
}

export default function Footer({ counts, featured = [] }: { counts: { toppers: number }; featured?: { href: string; label: string }[] }) {
  return (
    <footer className="panel relative bg-[var(--hl)]">
      <div className="mx-auto max-w-[1120px] px-6 pt-24 sm:pt-32">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div className="max-w-[40rem]">
            <h2 className="t-display h-sec">Your three hours are coming.</h2>
            <p className="mt-6 max-w-[30rem] text-m leading-[1.55] text-[rgba(11,12,16,0.72)]">
              {`Every topper on this page once sat where you are. Study the ${fmt(counts.toppers)} who made it, free.`}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/toppers" data-track="footer-start-topper" className="btn btn-ink">
                Start with a topper <span className="knob">↗</span>
              </Link>
              <Link href="/free-materials" data-track="footer-free-material" className="btn btn-paper">
                Free study material
              </Link>
            </div>
          </div>
          <Badge />
        </div>

        <div className="mt-24 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-[rgba(11,12,16,0.15)] pt-12 text-s sm:grid-cols-3 lg:grid-cols-7">
          <Link href="/" className="col-span-2 flex items-center gap-2.5 text-m font-bold sm:col-span-3 lg:col-span-7">
            <Mark size={22} /> UPSCPrepNotes
          </Link>
          {[...FOOTER.slice(0, 2), ...(featured.length ? [{ title: "Featured toppers", links: featured }] : []), ...FOOTER.slice(2)].map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-s font-bold text-[var(--ink)]">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:underline">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className="mt-10 text-s text-[rgba(11,12,16,0.6)]">
          UPSCPrepNotes is independent and not affiliated with the Union Public Service Commission. Marks are taken from published UPSC results.
        </p>
      </div>

      {/* Giant wordmark, cropped by the page edge */}
      <p aria-hidden className="t-display mt-16 select-none whitespace-nowrap px-4 text-center text-[17.5vw] leading-[0.78] tracking-[-0.06em] text-[var(--ink)]">
        UPSCPrep
      </p>
    </footer>
  );
}

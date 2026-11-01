import Link from "next/link";
import type { Counts } from "./types";
import SectionHead from "@/components/brand/SectionHead";

const fmt = (n: number) => n.toLocaleString("en-IN");

type Tile = {
  href: string;
  value: string;
  title: string;
  desc: string;
  span: string;
  tone: "blue" | "yellow" | "paper" | "ink" | "sky";
  art?: "table" | "years" | "files" | "chat";
};

const TONES = {
  blue: "bg-[var(--accent)] text-white",
  yellow: "bg-[var(--hl)] text-[var(--ink)]",
  paper: "bg-white text-[var(--ink)] shadow-[0_0_0_1px_var(--line),0_6px_16px_-10px_rgba(11,12,16,0.25)]",
  ink: "bg-[var(--ink)] text-white",
  sky: "bg-[#e9edff] text-[var(--ink)]",
};

/** Small drawn objects that say what each tile holds, without stock icons. */
function Art({ kind, light }: { kind: Tile["art"]; light: boolean }) {
  const line = light ? "rgba(255,255,255,0.25)" : "rgba(11,12,16,0.12)";
  const fill = light ? "rgba(255,255,255,0.14)" : "rgba(11,12,16,0.06)";
  if (kind === "table")
    return (
      <div aria-hidden className="mt-6 space-y-1.5">
        {[78, 92, 64, 86].map((w, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-2 w-12 rounded-full" style={{ background: fill }} />
            <span className="h-2 rounded-full" style={{ width: `${w}%`, maxWidth: 260, background: i === 1 ? "var(--hl)" : line }} />
          </div>
        ))}
      </div>
    );
  if (kind === "years")
    return (
      <div aria-hidden className="mt-6 flex gap-1.5">
        {["2023", "2024", "2025"].map((y) => (
          <span key={y} className="t-meta rounded-[6px] px-2 py-1" style={{ background: fill, color: "inherit" }}>{y}</span>
        ))}
      </div>
    );
  if (kind === "files")
    return (
      <div aria-hidden className="relative mt-6 h-12">
        {[0, 1, 2].map((i) => (
          <span key={i} className="absolute top-0 h-12 w-9 rounded-[4px] bg-white shadow-[0_4px_10px_-4px_rgba(0,0,0,0.3)]" style={{ left: i * 18, transform: `rotate(${(i - 1) * 7}deg)` }} />
        ))}
      </div>
    );
  if (kind === "chat")
    return (
      <div aria-hidden className="mt-6 space-y-1.5">
        <span className="block w-fit rounded-[12px] rounded-bl-[4px] px-3 py-1.5 text-s" style={{ background: fill }}>Best optional for engineers?</span>
        <span className="ml-auto block w-fit rounded-[12px] rounded-br-[4px] bg-[var(--hl)] px-3 py-1.5 text-s text-[var(--ink)]">Here is what toppers chose…</span>
      </div>
    );
  return null;
}

export default function Pillars({ counts }: { counts: Counts }) {
  const pyqRange = counts.pyqYears.length ? `${counts.pyqYears[0]}–${counts.pyqYears[counts.pyqYears.length - 1]}` : "";
  const tiles: Tile[] = [
    { href: "/toppers/marks-database", value: fmt(counts.full), title: "UPSC marks database", desc: "Complete paper-wise marksheets: essay, GS I–IV, optional and interview, sortable by any paper.", span: "lg:col-span-7", tone: "blue", art: "table" },
    { href: "/toppers/toppers-copy-compilation", value: fmt(counts.freeCopies), title: "Topper answer copies", desc: "Toppers with free handwritten answer copies to read, plus the full compilation.", span: "lg:col-span-5", tone: "yellow", art: "files" },
    { href: "/toppers", value: fmt(counts.toppers), title: "Topper profiles", desc: "Rank, marks, optional and strategy for every rank holder, CSE 2022–2025.", span: "lg:col-span-4", tone: "paper" },
    { href: "/content/upsc-optional-subject-marks-analysis", value: String(counts.optionals), title: "Optional subjects analysed", desc: "Which optional scores highest, compared with real topper marks.", span: "lg:col-span-4", tone: "sky" },
    { href: "/pyq", value: fmt(counts.pyqs), title: "Previous year questions", desc: `UPSC Mains PYQs ${pyqRange}, organised by year and paper.`, span: "lg:col-span-4", tone: "paper", art: "years" },
    { href: "/free-materials", value: `${fmt(Math.floor(counts.resources / 100) * 100)}+`, title: "Free UPSC study material", desc: "Test series, notes, books and magazines in one free library.", span: "lg:col-span-4", tone: "ink", art: "files" },
    { href: "/current-affairs", value: "Monthly", title: "Current affairs", desc: "Month-wise UPSC current affairs compilations for prelims and mains.", span: "lg:col-span-4", tone: "paper" },
    { href: "/ask", value: "Ask AI", title: "UPSC mentor, built on topper data", desc: "Ask about optionals, papers or strategy and get answers grounded in the archive.", span: "lg:col-span-4", tone: "blue", art: "chat" },
  ];

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1120px] px-6">
        <SectionHead
          title={<>Everything you need, <span className="text-[var(--accent)]">in one place.</span></>}
          lead="The UPSC topper archive: marksheets, answer copies, optional analysis, PYQs and free study material."
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          {tiles.map((t) => {
            const light = t.tone === "blue" || t.tone === "ink";
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`group relative flex min-h-[230px] flex-col justify-between overflow-hidden rounded-[28px] p-7 transition-transform duration-300 ease-[var(--ease)] hover:-translate-y-1 sm:p-8 ${TONES[t.tone]} ${t.span}`}
              >
                <div>
                  <p className="t-display tab text-l">{t.value}</p>
                  <h3 className="t-head mt-3 text-l">{t.title}</h3>
                  <p className={`mt-2 max-w-[30rem] text-m leading-[1.5] ${light ? "text-white/75" : "text-[var(--ink-2)]"}`}>{t.desc}</p>
                  <Art kind={t.art} light={light} />
                </div>
                <span
                  aria-hidden
                  className={`absolute right-6 top-6 grid h-10 w-10 place-items-center rounded-full text-m transition-transform duration-300 group-hover:rotate-45 ${light ? "bg-white/15" : "bg-[rgba(11,12,16,0.06)]"}`}
                >
                  ↗
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

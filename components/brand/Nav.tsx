"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/** Brand mark: an answer booklet — margin rule, three written lines, the last in ballpoint blue. */
export function Mark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <rect x="1" y="1" width="22" height="22" rx="6" fill="var(--ink)" />
      <path d="M7.5 5v14" stroke="var(--mark)" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M10.5 8.5h7M10.5 12h7" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M10.5 15.5h4.5" stroke="#8fa2ff" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export type NavProduct = { slug: string; title: string; price: number; image?: string };
type NavProps = { products?: NavProduct[]; toppers?: number };

const YEARS = [2025, 2024, 2023, 2022];
const OPTIONALS = [
  { href: "/optional/psir", label: "PSIR" },
  { href: "/optional/sociology", label: "Sociology" },
  { href: "/optional/anthropology", label: "Anthropology" },
  { href: "/optional/geography", label: "Geography" },
  { href: "/optional/history", label: "History" },
  { href: "/optional/mathematics", label: "Mathematics" },
];
const GUIDES = [
  { href: "/content/how-to-score-130-plus-in-gs1", label: "Score 130+ in GS Paper I" },
  { href: "/content/how-to-score-120-plus-in-gs2", label: "Score 120+ in GS Paper II" },
  { href: "/content/how-to-score-300-plus-in-psir-optional", label: "Score 300+ in PSIR optional" },
  { href: "/content/how-to-write-upsc-mains-answers", label: "How to write Mains answers" },
];

type Link2 = { href: string; title: string; desc: string };
const ARCHIVE: Link2[] = [
  { href: "/toppers", title: "All toppers", desc: "Every rank holder, CSE 2022–2025" },
  { href: "/toppers/marks-database", title: "Marks database", desc: "Paper-wise marks, sortable by any paper" },
  { href: "/toppers/highest-marks-in-upsc", title: "Highest marks in UPSC", desc: "Records and medians for every paper" },
  { href: "/toppers/upsc-interview-marks", title: "Interview marks", desc: "What toppers scored and what boards ask" },
  { href: "/toppers/toppers-copy-compilation", title: "Answer copies", desc: "Handwritten scans to read and compare" },
  { href: "/search", title: "Search the archive", desc: "Find a topper by name, rank or optional" },
];
const STUDY: Link2[] = [
  { href: "/pyq", title: "Previous year questions", desc: "Mains PYQs by year and paper" },
  { href: "/current-affairs", title: "Current affairs", desc: "Monthly and yearly compilations" },
  { href: "/free-materials", title: "Free study material", desc: "Test series, notes, books and magazines" },
  { href: "/resources", title: "Guides and resources", desc: "Syllabus, answer writing, strategy" },
];
const COMPANY: Link2[] = [
  { href: "/about", title: "About", desc: "Who reads every result PDF" },
  { href: "/content/data-methodology-and-editorial-standards", title: "Data methodology", desc: "How every mark is checked" },
  { href: "/faq", title: "FAQ", desc: "Answers to common questions" },
  { href: "/contact", title: "Contact", desc: "Corrections, feedback, partnerships" },
  { href: "/advertise", title: "Advertise", desc: "Sponsor slots and pricing" },
];

const is = (path: string, ...prefixes: string[]) => prefixes.some((p) => path === p || path.startsWith(p + "/"));
const MENUS = [
  { id: "more", match: (p: string) => is(p, "/about", "/faq", "/contact", "/advertise", "/content/data-methodology-and-editorial-standards") },
  { id: "ask", match: (p: string) => is(p, "/ask") },
  { id: "store", match: (p: string) => is(p, "/store", "/download") },
  { id: "toppers", match: (p: string) => is(p, "/toppers", "/year", "/optional", "/upsc-topper", "/compare") },
  { id: "study", match: (p: string) => is(p, "/pyq", "/current-affairs", "/free-materials", "/resources", "/content", "/search") },
] as const;
type MenuId = (typeof MENUS)[number]["id"];

const fmt = (n: number) => n.toLocaleString("en-IN");
const thumb = (src?: string) => (src ? src.replace(/tr=w-\d+,h-\d+/, "tr=w-120,h-156") : undefined);

function Chevron({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 transition-transform duration-200 ease-[var(--ease)] ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** A link row inside a panel: bold title, one muted line, accent when it is the current page. */
function Row({ l, path, i, onNavigate }: { l: Link2; path: string; i: number; onNavigate?: () => void }) {
  const current = path === l.href;
  return (
    <Link
      href={l.href}
      onClick={onNavigate}
      aria-current={current ? "page" : undefined}
      style={{ "--i": i } as React.CSSProperties}
      className="nav-item group flex items-start gap-3 rounded-[16px] px-3 py-2.5 transition-colors duration-150 hover:bg-[var(--canvas)]"
    >
      <span aria-hidden className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${current ? "bg-[var(--accent)]" : "bg-[var(--line-2)] group-hover:bg-[var(--accent)]"}`} />
      <span className="min-w-0">
        <span className={`block text-s font-bold leading-snug ${current ? "text-[var(--accent)]" : "text-[var(--ink)]"}`}>{l.title}</span>
        <span className="mt-0.5 block text-s leading-snug text-[var(--muted)]">{l.desc}</span>
      </span>
    </Link>
  );
}

function Chip({ href, children, path, i }: { href: string; children: React.ReactNode; path: string; i: number }) {
  const current = path === href;
  return (
    <Link
      href={href}
      style={{ "--i": i } as React.CSSProperties}
      aria-current={current ? "page" : undefined}
      className={`nav-item rounded-full px-3 py-1.5 text-s font-bold shadow-[0_0_0_1px_var(--line-2)] transition-[background-color,color,box-shadow] duration-150 hover:bg-white hover:text-[var(--accent)] hover:shadow-[0_0_0_1px_var(--accent)] ${current ? "bg-white text-[var(--accent)] shadow-[0_0_0_1px_var(--accent)]" : "bg-white/60 text-[var(--ink-2)]"}`}
    >
      {children}
    </Link>
  );
}

function ToppersPanel({ path, toppers }: { path: string; toppers?: number }) {
  return (
    <div className="grid w-[660px] grid-cols-[1.1fr_1fr] gap-2 p-2">
      <div className="p-1">
        {ARCHIVE.map((l, i) => (
          <Row key={l.href} i={i} path={path} l={i === 0 && toppers ? { ...l, desc: `${fmt(toppers)} rank holders, CSE 2022–2025` } : l} />
        ))}
      </div>
      <div className="relative overflow-hidden rounded-[20px] bg-[var(--canvas)] p-4">
        <p className="nav-item text-s font-bold text-[var(--muted)]" style={{ "--i": 1 } as React.CSSProperties}>By exam year</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {YEARS.map((y, i) => (
            <Chip key={y} href={`/year/${y}`} path={path} i={i + 2}>
              CSE {y}
            </Chip>
          ))}
        </div>
        <p className="nav-item mt-4 text-s font-bold text-[var(--muted)]" style={{ "--i": 4 } as React.CSSProperties}>By optional</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {OPTIONALS.map((o, i) => (
            <Chip key={o.href} href={o.href} path={path} i={i + 5}>
              {o.label}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudyPanel({ path }: { path: string }) {
  return (
    <div className="grid w-[640px] grid-cols-[1.1fr_1fr] gap-2 p-2">
      <div className="p-1">
        {STUDY.map((l, i) => (
          <Row key={l.href} l={l} i={i} path={path} />
        ))}
      </div>
      <div className="rounded-[20px] bg-[var(--canvas)] p-4">
        <p className="nav-item text-s font-bold text-[var(--muted)]" style={{ "--i": 1 } as React.CSSProperties}>Popular strategy guides</p>
        <ul className="mt-2 space-y-0.5">
          {GUIDES.map((g, i) => (
            <li key={g.href}>
              <Link
                href={g.href}
                style={{ "--i": i + 2 } as React.CSSProperties}
                aria-current={path === g.href ? "page" : undefined}
                className="nav-item group flex items-center justify-between gap-2 rounded-[12px] px-2.5 py-2 text-s text-[var(--ink-2)] transition-colors hover:bg-white hover:text-[var(--accent)] aria-[current=page]:text-[var(--accent)]"
              >
                {g.label}
                <span className="text-[var(--muted)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"><Arrow /></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MorePanel({ path }: { path: string }) {
  return (
    <div className="w-[340px] p-2">
      {COMPANY.map((l, i) => (
        <Row key={l.href} l={l} i={i} path={path} />
      ))}
    </div>
  );
}

function StorePanel({ path, products, show }: { path: string; products: NavProduct[]; show: boolean }) {
  return (
    <div className="w-[420px] p-2">
      <ul>
        {products.map((p, i) => {
          const current = path === `/store/${p.slug}`;
          return (
            <li key={p.slug}>
              <Link
                href={`/store/${p.slug}`}
                style={{ "--i": i } as React.CSSProperties}
                aria-current={current ? "page" : undefined}
                className="nav-item group flex items-center gap-3 rounded-[16px] px-2.5 py-2 transition-colors duration-150 hover:bg-[var(--canvas)]"
              >
                <span className="paper grid h-[52px] w-10 shrink-0 place-items-center overflow-hidden !rounded-[4px]">
                  {show && p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb(p.image)} alt="" width={40} height={52} className="h-full w-full object-cover object-top" />
                  ) : null}
                </span>
                <span className={`min-w-0 flex-1 text-s font-bold leading-snug group-hover:text-[var(--accent)] ${current ? "text-[var(--accent)]" : "text-[var(--ink)]"}`}>{p.title}</span>
                <span className="tab shrink-0 rounded-[6px] bg-[var(--hl)] px-2 py-0.5 text-s font-bold text-[var(--ink)]">₹{fmt(p.price)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <Link
        href="/store"
        style={{ "--i": products.length } as React.CSSProperties}
        className="nav-item mt-1 flex items-center justify-between rounded-[16px] bg-[var(--canvas)] px-4 py-3 text-s font-bold text-[var(--ink)] transition-colors hover:text-[var(--accent)]"
      >
        Browse the whole store
        <Arrow />
      </Link>
    </div>
  );
}

const TRIGGERS: { id: MenuId; label: string; href?: string }[] = [
  { id: "toppers", label: "Toppers" },
  { id: "study", label: "Study" },
  { id: "ask", label: "Ask AI", href: "/ask" },
  { id: "more", label: "More" },
];

export default function Nav({ products = [], toppers }: NavProps) {
  const pathname = usePathname() ?? "/";
  const [scrolled, setScrolled] = useState(false);
  const [openId, setOpenId] = useState<MenuId | null>(null);
  const [mobile, setMobile] = useState(false);
  const [group, setGroup] = useState<string | null>(null);
  const [storeSeen, setStoreSeen] = useState(false);
  const [hl, setHl] = useState<{ x: number; w: number } | null>(null);
  const [seenPath, setSeenPath] = useState(pathname);

  const navRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openedBy = useRef<"hover" | "click">("hover");

  // Close everything when the route changes.
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setOpenId(null);
    setMobile(false);
  }

  const activeId = MENUS.find((m) => m.match(pathname))?.id ?? null;

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // Outside click / Escape close the open panel; the mobile drawer also locks page scroll.
  useEffect(() => {
    if (!openId && !mobile) return;
    const down = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.parentElement?.contains(e.target as Node)) {
        setOpenId(null);
        setMobile(false);
      }
    };
    const key = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenId(null);
      setMobile(false);
    };
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    const prev = document.body.style.overflow;
    if (mobile) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("keydown", key);
      document.body.style.overflow = prev;
    };
  }, [openId, mobile]);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const enter = useCallback((id: MenuId, el?: HTMLElement | null) => {
    cancelClose();
    openedBy.current = "hover";
    setOpenId(id);
    if (id === "store") setStoreSeen(true);
    if (!el) setHl(null);
    if (el && navRef.current) {
      const r = navRef.current.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      setHl({ x: b.left - r.left, w: b.width });
    }
  }, []);
  const leave = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      setOpenId(null);
      setHl(null);
    }, 140);
  };
  const click = (id: MenuId) => {
    if (openId === id && openedBy.current === "click") {
      setOpenId(null);
      return;
    }
    openedBy.current = "click";
    setOpenId(id);
    if (id === "store") setStoreSeen(true);
  };
  // Keyboard users tabbing out of a menu close it.
  const onBlur = (e: React.FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpenId(null);
  };

  const panel = (id: MenuId) => {
    switch (id) {
      case "toppers":
        return <ToppersPanel path={pathname} toppers={toppers} />;
      case "study":
        return <StudyPanel path={pathname} />;
      case "more":
        return <MorePanel path={pathname} />;
      case "store":
        return <StorePanel path={pathname} products={products} show={storeSeen} />;
      default:
        return null;
    }
  };

  const anyOpen = openId !== null || mobile;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-[max(10px,env(safe-area-inset-top))] sm:px-4">
      <nav
        ref={navRef}
        data-scrolled={scrolled || anyOpen}
        aria-label="Main"
        className="nav pointer-events-auto relative mx-auto flex h-[60px] max-w-[1080px] items-center justify-between rounded-full pl-4 pr-2"
      >
        <Link href="/" className="group flex shrink-0 items-center gap-2.5 text-m font-bold tracking-[-0.02em]" aria-label="UPSCPrepNotes home">
          <span className="transition-transform duration-300 ease-[var(--spring)] group-hover:-rotate-6 group-hover:scale-105"><Mark size={28} /></span>
          UPSCPrepNotes
        </Link>

        {/* Desktop links */}
        <div ref={rowRef} className="hidden items-center lg:flex" onMouseLeave={leave}>
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-[10px] top-[10px] rounded-full bg-[var(--canvas)] transition-[left,width,opacity] duration-300 ease-[var(--ease)]"
            style={{ left: hl?.x ?? 0, width: hl?.w ?? 0, opacity: hl ? 1 : 0 }}
          />
          {TRIGGERS.map((t) => {
            const active = activeId === t.id;
            const open = openId === t.id;
            const cls = `relative inline-flex items-center gap-1 rounded-full px-4 py-2 text-s font-bold transition-colors duration-150 ${active || open ? "text-[var(--ink)]" : "text-[var(--ink-2)] hover:text-[var(--ink)]"}`;
            const underline = (
              <span aria-hidden className={`absolute inset-x-4 -bottom-0.5 h-[3px] origin-center rounded-full bg-[var(--accent)] transition-transform duration-300 ease-[var(--ease)] ${active ? "scale-x-100" : "scale-x-0"}`} />
            );
            return (
              <div
                key={t.id}
                onMouseEnter={(e) => {
                  if (t.href) {
                    cancelClose();
                    setOpenId(null);
                    if (navRef.current) {
                      const r = navRef.current.getBoundingClientRect();
                      const b = e.currentTarget.getBoundingClientRect();
                      setHl({ x: b.left - r.left, w: b.width });
                    }
                  } else enter(t.id, e.currentTarget);
                }}
                onBlur={onBlur}
              >
                {t.href ? (
                  <Link href={t.href} aria-current={active ? "page" : undefined} className={cls}>
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-[var(--accent)]" fill="currentColor" aria-hidden>
                      <path d="M12 2l1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9z" />
                      <path d="M19 15l.8 2.2 2.2.8-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" opacity=".7" />
                    </svg>
                    {t.label}
                    {underline}
                  </Link>
                ) : (
                  <>
                    <button
                      type="button"
                      aria-haspopup="true"
                      aria-expanded={open}
                      aria-controls={`nav-${t.id}`}
                      onClick={() => click(t.id)}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          openedBy.current = "click";
                          setOpenId(t.id);
                          requestAnimationFrame(() => document.querySelector<HTMLElement>(`#nav-${t.id} a`)?.focus());
                        }
                      }}
                      className={cls}
                    >
                      {t.label}
                      <Chevron open={open} />
                      {underline}
                    </button>
                    <div id={`nav-${t.id}`} data-open={open} className="nav-panel inset-x-0 mx-auto w-max" onMouseEnter={cancelClose}>
                      <div className="rounded-[28px] bg-white shadow-[0_0_0_1px_var(--line),0_28px_60px_-24px_rgba(11,12,16,0.4),0_8px_20px_-12px_rgba(11,12,16,0.18)]">{panel(t.id)}</div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Right cluster */}
        <div className="flex shrink-0 items-center gap-1.5">
          <Link
            href="/search"
            aria-label="Search toppers, guides and materials"
            className="hidden h-10 w-10 place-items-center rounded-full text-[var(--ink-2)] transition-colors hover:bg-[var(--canvas)] hover:text-[var(--ink)] sm:grid"
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </Link>

          <div className="hidden lg:block" onMouseEnter={() => enter("store")} onMouseLeave={leave} onBlur={onBlur}>
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={openId === "store"}
              aria-controls="nav-store"
              onClick={() => click("store")}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  openedBy.current = "click";
                  setOpenId("store");
                  setStoreSeen(true);
                  requestAnimationFrame(() => document.querySelector<HTMLElement>("#nav-store a")?.focus());
                }
              }}
              className={`btn btn-ink h-11 gap-1.5 pl-5 pr-4 [--btn-fs:14px] ${activeId === "store" ? "ring-2 ring-[var(--accent)] ring-offset-2" : ""}`}
            >
              Store
              <Chevron open={openId === "store"} />
            </button>
            <div id="nav-store" data-open={openId === "store"} className="nav-panel right-0" style={{ transformOrigin: "top right" }} onMouseEnter={cancelClose}>
              <div className="rounded-[28px] bg-white shadow-[0_0_0_1px_var(--line),0_28px_60px_-24px_rgba(11,12,16,0.4),0_8px_20px_-12px_rgba(11,12,16,0.18)]">
                {panel("store")}
              </div>
            </div>
          </div>

          <Link href="/store" className="btn btn-ink h-10 px-4 [--btn-fs:14px] lg:hidden">
            Store
          </Link>
          <button
            type="button"
            onClick={() => setMobile((v) => !v)}
            aria-expanded={mobile}
            aria-controls="brand-menu"
            aria-label={mobile ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center rounded-full text-[var(--ink)] transition-colors hover:bg-[var(--canvas)] lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d={mobile ? "M6 6l12 12" : "M4 8h16"} className="transition-all duration-200" />
              <path d={mobile ? "M18 6L6 18" : "M4 16h16"} className="transition-all duration-200" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        id="brand-menu"
        data-open={mobile}
        className="nav-drawer pointer-events-auto mx-auto mt-2 max-w-[1080px] overflow-hidden rounded-[28px] bg-white shadow-[0_0_0_1px_var(--line),0_16px_40px_-18px_rgba(11,12,16,0.4)] lg:hidden"
      >
        <div className="max-h-[calc(100dvh-96px)] overflow-y-auto overscroll-contain p-2">
          <Link
            href="/ask"
            onClick={() => setMobile(false)}
            className="flex items-center justify-between rounded-[18px] bg-[var(--accent)] px-4 py-3.5 text-m font-bold text-white"
          >
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                <path d="M12 2l1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9z" />
              </svg>
              Ask the AI mentor
            </span>
            <Arrow />
          </Link>

          {(
            [
              { id: "toppers", label: "Toppers", links: [...ARCHIVE, ...YEARS.map((y) => ({ href: `/year/${y}`, title: `CSE ${y} toppers`, desc: "" })), ...OPTIONALS.map((o) => ({ href: o.href, title: `${o.label} optional`, desc: "" }))] },
              { id: "study", label: "Study", links: [...STUDY, ...GUIDES.map((g) => ({ href: g.href, title: g.label, desc: "" }))] },
              { id: "store", label: "Store", links: [...products.map((p) => ({ href: `/store/${p.slug}`, title: p.title, desc: `₹${fmt(p.price)}` })), { href: "/store", title: "Browse the whole store", desc: "" }] },
              { id: "more", label: "More", links: COMPANY },
            ] as { id: string; label: string; links: Link2[] }[]
          ).map((g) => {
            const open = group === g.id;
            const active = activeId === g.id;
            return (
              <div key={g.id} className="mt-1">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setGroup(open ? null : g.id)}
                  className="flex w-full items-center justify-between rounded-[16px] px-4 py-3.5 text-m font-bold hover:bg-[var(--canvas)]"
                >
                  <span className="flex items-center gap-2.5">
                    {g.label}
                    {active && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />}
                  </span>
                  <Chevron open={open} />
                </button>
                <div className="grid transition-[grid-template-rows] duration-300 ease-[var(--ease)]" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
                  <ul className="min-h-0 overflow-hidden">
                    {g.links.map((l) => (
                      <li key={l.href + l.title}>
                        <Link
                          href={l.href}
                          onClick={() => setMobile(false)}
                          tabIndex={open ? 0 : -1}
                          aria-current={pathname === l.href ? "page" : undefined}
                          className="flex items-center justify-between gap-3 rounded-[14px] py-2.5 pl-8 pr-4 text-s text-[var(--ink-2)] hover:bg-[var(--canvas)] hover:text-[var(--ink)] aria-[current=page]:font-bold aria-[current=page]:text-[var(--accent)]"
                        >
                          <span>{l.title}</span>
                          {l.desc.startsWith("₹") && <span className="tab rounded-[6px] bg-[var(--hl)] px-2 py-0.5 font-bold text-[var(--ink)]">{l.desc}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}

          <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[var(--line)] p-2 pt-3">
            <Link href="/search" onClick={() => setMobile(false)} className="btn btn-paper h-11 justify-center [--btn-fs:14px]">
              Search
            </Link>
            <Link href="/store" onClick={() => setMobile(false)} className="btn btn-ink h-11 justify-center [--btn-fs:14px]">
              Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

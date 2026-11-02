"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/store-products";
import { fmt, folderOf, Star, Meta, BuyButton, Price, Sheet, Badge, ProductCard } from "./Shelf";
import { Paperclip, Pin } from "@/components/brand/Props";
import EmailCapture from "./EmailCapture";
import FlashSaleBanner from "./FlashSaleBanner";

const VISIBLE = PRODUCTS.filter((p) => !p.comingSoon);
type Product = (typeof PRODUCTS)[number];

/** Shelf filters (UI only): the categories already on each product. */
const SHELVES: { key: string; label: string; match: (p: Product) => boolean }[] = [
  { key: "all", label: "All", match: () => true },
  { key: "original", label: "Topper originals", match: (p) => p.category === "original" },
  { key: "notes", label: "Notes", match: (p) => p.category === "notes-bundle" },
  { key: "optional", label: "Optional", match: (p) => p.category === "optional" },
  { key: "tests", label: "Test series", match: (p) => p.category === "test-series" },
];

/** The lead product, opened out: big cover with a paperclip, full description. */
function Spotlight({ product }: { product: Product }) {
  return (
    <div
      data-track-view="store_spotlight"
      className="group relative grid overflow-hidden rounded-[28px] bg-white shadow-[0_0_0_1px_var(--line-2),0_1px_2px_rgba(11,12,16,0.04)] transition-shadow duration-300 hover:shadow-[0_0_0_1px_var(--line-2),0_24px_56px_-24px_rgba(11,12,16,0.3)] md:grid-cols-[1fr_1.1fr]"
    >
      <div className="grain relative min-h-[300px] overflow-hidden sm:min-h-[380px]" style={{ background: folderOf(product) }}>
        <Badge product={product} />
        <div className="absolute left-1/2 top-[12%] w-[46%] max-w-[250px] -translate-x-[62%] rotate-[-7deg] opacity-90">
          <Sheet product={VISIBLE.find((p) => p.slug === "top-10-rankers-strategy") ?? product} />
        </div>
        <div className="absolute left-1/2 top-[9%] w-[50%] max-w-[270px] -translate-x-[40%] rotate-[3deg] transition-transform duration-500 ease-[var(--ease)] group-hover:-translate-y-2 group-hover:rotate-[1deg]">
          <Sheet product={product} eager />
          <Paperclip className="absolute -top-5 left-6 h-16 w-8 rotate-[-6deg]" />
        </div>
      </div>
      <div className="flex flex-col p-6 sm:p-9">
        <Meta product={product} />
        <h3 className="t-display mt-3 text-l group-hover:text-[var(--accent)]">
          <Link href={`/store/${product.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {product.title}
          </Link>
        </h3>
        <p className="mt-2 text-m font-bold text-[var(--ink-2)]">{product.tagline}</p>
        <p className="mt-4 max-w-[38rem] text-m leading-[1.65] text-[var(--ink-2)]">{product.description}</p>
        <div className="mt-auto flex flex-wrap items-center gap-4 pt-8">
          <Price product={product} big />
          <div className="relative z-10">
            <BuyButton product={product} label={`Buy now`} className="btn btn-blue h-12 px-6" track={`spotlight-buy-${product.slug}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** The hero desk: three real covers fanned out, the answer copies on top. */
function Desk() {
  const lead = VISIBLE.find((p) => p.slug === "answer-copies-compilation");
  const left = VISIBLE.find((p) => p.slug === "government-schemes-compilation");
  const right = VISIBLE.find((p) => p.slug === "top-10-rankers-strategy");
  if (!lead) return null;
  return (
    <Link href={`/store/${lead.slug}`} aria-label={lead.title} className="group relative mx-auto block h-[330px] w-full max-w-[460px] sm:h-[420px]">
      {left && <Sheet product={left} className="absolute left-[2%] top-[12%] w-[44%] rotate-[-9deg] transition-transform duration-500 ease-[var(--ease)] group-hover:-translate-x-2 group-hover:rotate-[-11deg]" />}
      {right && <Sheet product={right} className="absolute right-[2%] top-[8%] w-[44%] rotate-[8deg] transition-transform duration-500 ease-[var(--ease)] group-hover:translate-x-2 group-hover:rotate-[10deg]" />}
      <div className="absolute left-1/2 top-0 w-[50%] -translate-x-1/2 rotate-[-1.5deg] transition-transform duration-500 ease-[var(--ease)] group-hover:-translate-y-2">
        <Sheet product={lead} eager />
        <Paperclip className="absolute -top-6 right-7 h-16 w-8 rotate-[8deg]" />
        <span aria-hidden className="tab absolute -bottom-3 -right-6 rotate-[-6deg] rounded-[8px] bg-[var(--hl)] px-3 py-1.5 text-m font-bold text-[var(--hl-ink)] shadow-[0_6px_14px_-6px_rgba(92,74,0,0.5)]">
          ₹{fmt(lead.price)}
        </span>
      </div>
    </Link>
  );
}

/** A note pinned to the shelf. */
function Testimonial() {
  return (
    <figure className="relative col-span-2 flex flex-col rounded-[24px] bg-[#fffbea] p-6 pt-9 shadow-[0_0_0_1px_rgba(92,74,0,0.12),0_1px_2px_rgba(11,12,16,0.04)] sm:p-7 sm:pt-10 lg:col-span-1">
      <Pin tone="red" className="absolute -top-3 left-1/2 h-9 w-9 -translate-x-1/2" />
      <div className="flex gap-0.5 text-[var(--accent)]">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className="h-4 w-4" />
        ))}
      </div>
      <blockquote className="mt-4 text-m leading-[1.65] text-[var(--ink)]">
        <span aria-hidden>&ldquo;</span>The answer copies were the closest thing to having a mentor sit beside you. Seeing exactly how AIR 9 and AIR 16 structured their answers changed how I approached every paper.<span aria-hidden>&rdquo;</span>
      </blockquote>
      <figcaption className="mt-auto pt-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-s font-bold text-[var(--accent-deep)] shadow-[0_0_0_1px_var(--line)]">AS</div>
          <div>
            <p className="text-m font-bold">Ankita S.</p>
            <p className="text-s text-[var(--muted)]">UPSC Aspirant · Purchased Answer Copies</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-s font-bold">Answer Copies Compilation</span>
          <span className="rounded-full bg-[#e3e8fb] px-3 py-1 text-s font-bold text-[#172fa3]">Verified Purchase</span>
        </div>
      </figcaption>
    </figure>
  );
}

function StoreFooter() {
  return (
    <section className="mx-auto max-w-[1120px] px-6 text-center">
      <p className="t-display mx-auto max-w-[22ch] text-l">
        Every resource on this site was used by someone who <span className="swipe">made it.</span>
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-s">
        {[
          { href: "/store", label: "Store" },
          { href: "/free-materials", label: "Free Materials" },
          { href: "/toppers", label: "Toppers" },
          { href: "/privacy-policy", label: "Privacy" },
          { href: "/terms", label: "Terms" },
        ].map((l) => (
          <Link key={l.href} href={l.href} className="font-bold text-[var(--ink-2)] hover:text-[var(--accent)]">
            {l.label}
          </Link>
        ))}
      </div>
      <p className="mt-3 text-s text-[var(--muted)]">© {new Date().getFullYear()} upscprepnotes.in · Instant delivery · 7-day refund</p>
    </section>
  );
}

export default function StoreClient() {
  const [search, setSearch] = useState("");
  const [shelf, setShelf] = useState("all");

  const filtered = useMemo(() => {
    const s = SHELVES.find((x) => x.key === shelf) ?? SHELVES[0];
    const q = search.trim().toLowerCase();
    const searching = q.length >= 2;
    if (!searching && shelf === "all") return null;
    return VISIBLE.filter((p) => s.match(p) && (!searching || p.title.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)));
  }, [search, shelf]);

  const featured = VISIBLE.find((p) => p.slug === "answer-copies-compilation");
  const rest = VISIBLE.filter((p) => p.slug !== "answer-copies-compilation");
  const count = (key: string) => VISIBLE.filter((SHELVES.find((x) => x.key === key) ?? SHELVES[0]).match).length;

  return (
    <>
      <FlashSaleBanner />
      <div className="pb-24 pt-28 sm:pt-32">
        <div className="mx-auto max-w-[1120px] px-6">
          <nav aria-label="Breadcrumb" className="t-meta flex items-center gap-2">
            <Link href="/" className="hover:text-[var(--ink)]">Home</Link>
            <span aria-hidden>/</span>
            <span className="text-[var(--ink-2)]">Store</span>
          </nav>

          {!search && (
            <header className="mt-8 grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
              <div>
                <h1 className="t-display text-h1">
                  Everything a topper used, <span className="swipe">in one place.</span>
                </h1>
                <p className="mt-5 max-w-[34rem] text-m leading-[1.6] text-[var(--ink-2)]">
                  Strategy reports, answer copies, and notes from AIR 1–1249. Curated, verified, delivered instantly.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/store/answer-copies-compilation" className="btn btn-blue">
                    Shop answer copies <span className="knob">→</span>
                  </Link>
                  <Link href="#products" className="btn btn-paper">
                    View all products
                  </Link>
                </div>
                <p className="mt-5 flex items-center gap-2 text-s text-[var(--muted)]">
                  <span className="flex gap-0.5 text-[var(--accent)]">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} />
                    ))}
                  </span>
                  Trusted by 1,400+ UPSC students
                </p>
              </div>
              <Desk />
            </header>
          )}

          {/* Search, shelves, cart */}
          <div className="sticky top-[76px] z-20 -mx-2 mt-12 rounded-[28px] bg-white/90 px-2 py-3 backdrop-blur">
            <div className="flex items-center gap-3">
              <label className="flex min-w-0 flex-1 items-center gap-3 rounded-full bg-white pl-5 pr-1.5 shadow-[0_0_0_1px_var(--line-2)] focus-within:shadow-[0_0_0_2px_var(--accent)]">
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[var(--muted)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>
                <input
                  type="search"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search products"
                  className="h-11 min-w-0 flex-1 bg-transparent text-m outline-none placeholder:text-[var(--muted)]"
                />
              </label>
            </div>
            <div role="tablist" aria-label="Filter products" className="mt-3 flex gap-2 overflow-x-auto [scrollbar-width:none]">
              {SHELVES.filter((s) => count(s.key) > 0).map((s) => {
                const on = shelf === s.key;
                return (
                  <button
                    key={s.key}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setShelf(s.key)}
                    className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-s font-bold transition-colors ${
                      on ? "bg-[var(--ink)] text-white" : "bg-white text-[var(--ink-2)] shadow-[0_0_0_1px_var(--line-2)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {s.label}
                    <span className={`tab ${on ? "text-white/60" : "text-[var(--muted)]"}`}>{count(s.key)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {filtered !== null ? (
            <section id="products" className="mt-8 scroll-mt-48">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="t-head text-l">{filtered.length === 0 ? "No results" : `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}</h2>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setShelf("all");
                  }}
                  className="text-s font-bold text-[var(--accent)] hover:underline"
                >
                  Clear
                </button>
              </div>
              {filtered.length === 0 ? (
                <div className="mt-6 rounded-[24px] bg-[var(--canvas)] p-10 text-center">
                  <p className="text-m font-bold">No products found</p>
                  <p className="mt-1 text-s text-[var(--muted)]">Try a different search term</p>
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
                  {filtered.map((p) => (
                    <ProductCard key={p.slug} product={p} />
                  ))}
                </div>
              )}
            </section>
          ) : (
            <section id="products" className="mt-8 scroll-mt-48">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="t-head text-l">Featured</h2>
                <span className="text-s text-[var(--muted)]">{VISIBLE.length} products</span>
              </div>
              {featured && (
                <div className="mt-6">
                  <Spotlight product={featured} />
                </div>
              )}
              <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
                {rest.map((p, i) => (
                  <ProductCard key={p.slug} product={p} className={rest.length % 2 === 1 && i === rest.length - 1 ? "col-span-2 lg:col-span-1" : ""} />
                ))}
                <Testimonial />
              </div>
            </section>
          )}
        </div>

        <div className="mt-20">
          <EmailCapture />
        </div>
        <div className="mt-20">
          <StoreFooter />
        </div>
      </div>
    </>
  );
}

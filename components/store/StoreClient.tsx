"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/store-products";
import { CartProvider, useCart } from "@/lib/cart-context";
import CartSlideover from "./CartSlideover";
import EmailCapture from "./EmailCapture";
import FlashSaleBanner from "./FlashSaleBanner";

const VISIBLE = PRODUCTS.filter((p) => !p.comingSoon);
type Product = (typeof PRODUCTS)[number];

const fmt = (n: number) => n.toLocaleString("en-IN");

const BADGE: Record<string, string> = {
  amber: "bg-[var(--hl)] text-[var(--hl-ink)]",
  emerald: "bg-[#d4f1df] text-[#14532d]",
};

function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={`h-3.5 w-3.5 ${className}`} fill="currentColor" aria-hidden>
      <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
    </svg>
  );
}

/** A product as a booklet on the shelf: its cover on paper, then title, price and one action. */
function ProductCard({ product, variant = "standard" }: { product: Product; variant?: "standard" | "featured" | "wide" }) {
  const { addItem } = useCart();
  const cover = (product.images && product.images[0]) || product.image;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  }

  const featured = variant === "featured";
  const wide = variant === "wide";

  return (
    <Link
      href={`/store/${product.slug}`}
      className={`group flex rounded-[24px] bg-white p-3 shadow-[0_0_0_1px_var(--line-2)] transition-transform duration-200 ease-[var(--ease)] hover:-translate-y-1 ${
        featured ? "col-span-2 flex-col sm:row-span-2 sm:flex-row sm:gap-6 sm:p-5" : wide ? "col-span-2 flex-col sm:flex-row sm:gap-5" : "flex-col"
      }`}
    >
      {/* Cover */}
      <div className={`relative shrink-0 overflow-hidden rounded-[16px] bg-[var(--canvas)] ${featured ? "aspect-[4/3] sm:aspect-auto sm:w-[44%]" : wide ? "aspect-[16/10] sm:aspect-auto sm:w-[42%]" : "aspect-[4/5]"}`}>
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt={product.title} loading={featured ? "eager" : "lazy"} className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]" />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <span className="t-display text-l text-[var(--muted)]">{product.title.charAt(0)}</span>
          </div>
        )}
        {product.badge && (
          <span className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-s font-bold ${BADGE[product.badgeColor ?? ""] ?? "bg-white text-[var(--ink)] shadow-[0_0_0_1px_var(--line-2)]"}`}>
            {product.badge}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex min-w-0 flex-1 flex-col px-1 pb-1 pt-4 sm:pt-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-s text-[var(--muted)]">
          {product.rating && (
            <span className="inline-flex items-center gap-1 font-bold text-[var(--ink)]">
              <Star className="text-[var(--accent)]" />
              {product.rating.toFixed(1)}
            </span>
          )}
          {product.fileCount && (
            <span>
              {product.fileCount} files{product.totalSizeMB ? ` · ${Math.round(product.totalSizeMB / 1000)} GB` : ""}
            </span>
          )}
        </div>
        <h3 className={`mt-2 font-bold leading-[1.25] group-hover:text-[var(--accent)] ${featured ? "t-head text-l" : "text-m"}`}>{product.title}</h3>
        {variant !== "standard" && <p className="mt-1.5 text-s leading-[1.5] text-[var(--ink-2)]">{product.tagline}</p>}
        {featured && <p className="mt-3 text-m leading-[1.6] text-[var(--ink-2)]">{product.description}</p>}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="tab rounded-[6px] bg-[var(--hl)] px-2 py-0.5 text-m font-bold">₹{fmt(product.price)}</span>
          <button type="button" onClick={handleAdd} className="btn btn-ink h-9 px-4 [--btn-fs:14px]">
            Add
          </button>
        </div>
      </div>
    </Link>
  );
}

function CartButton({ onOpen }: { onOpen: () => void }) {
  const { totalItems } = useCart();
  return (
    <button type="button" onClick={onOpen} aria-label="Open cart" className="btn btn-paper relative h-11 shrink-0 px-4 [--btn-fs:14px]">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M6 7h12l-1 13H7L6 7z" />
        <path d="M9 7a3 3 0 016 0" />
      </svg>
      Cart
      {totalItems > 0 && (
        <span className="tab grid h-5 min-w-5 place-items-center rounded-full bg-[var(--accent)] px-1.5 text-s font-bold text-white">{totalItems > 99 ? "99+" : totalItems}</span>
      )}
    </button>
  );
}

function Testimonial() {
  return (
    <section className="mx-auto max-w-[1120px] px-6">
      <div className="grid gap-6 rounded-[28px] bg-white p-7 shadow-[0_0_0_1px_var(--line-2)] sm:p-10 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p aria-hidden className="t-display text-l leading-none text-[var(--accent)]">&ldquo;</p>
          <p className="mt-3 max-w-[44rem] text-m leading-[1.7] text-[var(--ink)]">
            The answer copies were the closest thing to having a mentor sit beside you. Seeing exactly how AIR 9 and AIR 16 structured their answers changed how I approached every paper.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[#e9edff] text-s font-bold text-[var(--accent-deep)]">AS</div>
            <div>
              <p className="text-m font-bold">Ankita S.</p>
              <p className="text-s text-[var(--muted)]">UPSC Aspirant · Purchased Answer Copies</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start gap-2 md:items-end">
          <p className="rounded-full bg-[var(--canvas)] px-3 py-1 text-s font-bold">Answer Copies Compilation</p>
          <div className="flex gap-0.5 text-[var(--accent)]">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} />
            ))}
          </div>
          <p className="rounded-full bg-[#d4f1df] px-3 py-1 text-s font-bold text-[#14532d]">Verified Purchase</p>
        </div>
      </div>
    </section>
  );
}

function StoreFooter() {
  return (
    <section className="mx-auto max-w-[1120px] px-6">
      <div className="border-t border-[var(--line)] pt-12">
        <p className="t-head max-w-[24ch] text-l">
          Every resource on this site was used by someone who <span className="swipe">made it.</span>
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-s">
            {[
              { href: "/store", label: "Store" },
              { href: "/free-materials", label: "Free Materials" },
              { href: "/toppers", label: "Toppers" },
              { href: "/privacy-policy", label: "Privacy" },
              { href: "/terms", label: "Terms" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="text-[var(--ink-2)] hover:text-[var(--accent)]">
                {l.label}
              </Link>
            ))}
          </div>
          <p className="text-s text-[var(--muted)]">© {new Date().getFullYear()} upscprepnotes.in · Instant delivery · 7-day refund</p>
        </div>
      </div>
    </section>
  );
}

export default function StoreClient() {
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim() || search.trim().length < 2) return null;
    const q = search.toLowerCase();
    return VISIBLE.filter((p) => p.title.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }, [search]);

  const featured = VISIBLE.find((p) => p.slug === "answer-copies-compilation");
  const strategy = VISIBLE.find((p) => p.slug === "all-strategy-reports");
  const gsBundle = VISIBLE.find((p) => p.slug === "complete-gs-notes-bundle");
  const rest = VISIBLE.filter((p) => !["answer-copies-compilation", "all-strategy-reports", "complete-gs-notes-bundle"].includes(p.slug));

  return (
    <CartProvider>
      <FlashSaleBanner />
      <div className="pb-24 pt-28 sm:pt-32">
        <div className="mx-auto max-w-[1120px] px-6">
          <nav aria-label="Breadcrumb" className="t-meta flex items-center gap-2">
            <Link href="/" className="hover:text-[var(--ink)]">Home</Link>
            <span aria-hidden>/</span>
            <span className="text-[var(--ink-2)]">Store</span>
          </nav>

          {!search && (
            <header className="mt-8 max-w-[44rem]">
              <h1 className="t-display text-h1">Everything a topper used, in one place.</h1>
              <p className="mt-5 text-m leading-[1.6] text-[var(--ink-2)]">
                Strategy reports, answer copies, and notes from AIR 1–1249. Curated, verified, delivered instantly.
              </p>
              <p className="mt-2 text-s text-[var(--muted)]">Trusted by 1,400+ UPSC students</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/store/answer-copies-compilation" className="btn btn-blue">
                  Shop answer copies <span className="knob">→</span>
                </Link>
                <Link href="/store/all-strategy-reports" className="btn btn-paper">
                  View all products
                </Link>
              </div>
            </header>
          )}

          {/* Search + cart */}
          <div className="sticky top-[76px] z-20 -mx-2 mt-10 rounded-[28px] bg-white/90 px-2 py-3 backdrop-blur">
            <div className="flex items-center gap-3">
              <label className="flex min-w-0 flex-1 items-center gap-3 rounded-full bg-white py-0 pl-5 pr-1.5 shadow-[0_0_0_1px_var(--line-2)] focus-within:shadow-[0_0_0_2px_var(--accent)]">
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
              <CartButton onOpen={() => setCartOpen(true)} />
            </div>
          </div>

          {filtered !== null ? (
            <section className="mt-8">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="t-head text-l">{filtered.length === 0 ? "No results" : `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}</h2>
                {search && (
                  <button type="button" onClick={() => setSearch("")} className="text-s font-bold text-[var(--accent)] hover:underline">
                    Clear
                  </button>
                )}
              </div>
              {filtered.length === 0 ? (
                <div className="mt-6 rounded-[24px] bg-[var(--canvas)] p-10 text-center">
                  <p className="text-m font-bold">No products found</p>
                  <p className="mt-1 text-s text-[var(--muted)]">Try a different search term</p>
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                  {filtered.map((p) => (
                    <ProductCard key={p.slug} product={p} />
                  ))}
                </div>
              )}
            </section>
          ) : (
            <section className="mt-8">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="t-head text-l">Featured</h2>
                <span className="text-s text-[var(--muted)]">{VISIBLE.length} products</span>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {featured && <ProductCard product={featured} variant="featured" />}
                {strategy && <ProductCard product={strategy} variant="wide" />}
                {gsBundle && <ProductCard product={gsBundle} variant="wide" />}
                {rest.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>

        {filtered === null && (
          <div className="mt-20">
            <Testimonial />
          </div>
        )}

        <div className="mt-16">
          <EmailCapture />
        </div>
        <div className="mt-16">
          <StoreFooter />
        </div>
      </div>
      <CartSlideover open={cartOpen} onClose={() => setCartOpen(false)} />
    </CartProvider>
  );
}

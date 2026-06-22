"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { IconStarFilled, IconCheck, IconDownload, IconRefresh, IconShieldCheck } from "@tabler/icons-react";
import { PRODUCTS } from "@/lib/store-products";
import { useCart } from "@/lib/cart-context";
import CartSlideover from "./CartSlideover";
import "@/app/store/store-list.css";

const VISIBLE = PRODUCTS.filter((p) => !p.comingSoon);

/* ============================================================
   PRODUCT ROW — list variant
   ============================================================ */
function ListRow({ product }: { product: (typeof PRODUCTS)[number] }) {
  const { addItem } = useCart();

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem(product);
  }

  return (
    <div className="list-row">
      {/* Thumbnail */}
      <div className="list-row__image">
        <Link href={`/store/${product.slug}`}>
          {product.image || (product.images && product.images[0]) ? (
            <img
              src={(product.images && product.images[0]) || product.image!}
              alt={product.title}
              loading="lazy"
            />
          ) : (
            <div className="list-row__placeholder">
              {product.title.charAt(0)}
            </div>
          )}
        </Link>
      </div>

      {/* Info */}
      <div className="list-row__body">
        <div className="list-row__meta">
          {product.badge && (
            <span className={[
              "list-row__badge",
              product.badgeColor === "amber" ? "list-row__badge--amber" : "",
            ].filter(Boolean).join(" ")}>
              {product.badge}
            </span>
          )}
          {product.rating && (
            <span className="list-row__rating">
              <IconStarFilled size={10} />
              {product.rating.toFixed(1)} ({product.reviewCount})
            </span>
          )}
        </div>
        <h3 className="list-row__title">
          <Link href={`/store/${product.slug}`}>{product.title}</Link>
        </h3>
        <p className="list-row__tagline">{product.tagline}</p>
        {product.fileCount && (
          <p className="list-row__files">
            {product.fileCount} files
            {product.totalSizeMB ? ` · ${Math.round(product.totalSizeMB / 1000)} GB` : ""}
          </p>
        )}
      </div>

      {/* Price + CTA */}
      <div className="list-row__actions">
        <span className="list-row__price">
          ₹{product.price}
          {product.originalPrice && (
            <span className="list-row__price-original">
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </span>
        <button type="button" onClick={handleAdd} className="list-row__cta">
          Add to Cart
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   SECTION HEAD
   ============================================================ */
function ListSectionHead({ label, title }: { label: string; title: string }) {
  return (
    <div className="list-section-head">
      <p className="list-section-head__label">{label}</p>
      <h2 className="list-section-head__title">{title}</h2>
    </div>
  );
}

/* ============================================================
   TESTIMONIAL
   ============================================================ */
function ListTestimonial() {
  return (
    <section className="list-testimonial">
      <div className="list-testimonial-card">
        <p className="list-testimonial__quote-mark">&ldquo;</p>
        <p className="list-testimonial__text">
          The answer copies were the closest thing to having a mentor sit beside you. Seeing exactly how AIR 9 and AIR 16 structured their answers changed how I approached every paper.
        </p>
        <div className="list-testimonial__source">
            <div className="list-testimonial__avatar">SR</div>
          <div>
            <p className="list-testimonial__name">Sample Reviewer</p>
            <p className="list-testimonial__meta">
              Preview · Not a verified purchase
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   TRUST STRIP
   ============================================================ */
function ListTrust() {
  const items = [
    { icon: IconDownload, text: "Instant download after payment" },
    { icon: IconRefresh, text: "7-day refund guarantee" },
    { icon: IconShieldCheck, text: "Verified UPSC content" },
  ];
  return (
    <div className="list-trust">
      {items.map(({ icon: Icon, text }) => (
        <div key={text} className="list-trust-item">
          <Icon size={15} />
          {text}
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   SEARCH RESULTS
   ============================================================ */
function ListSearchResults({ query, products, onClear }: { query: string; products: (typeof PRODUCTS)[number][]; onClear: () => void }) {
  if (products.length === 0) {
    return (
      <div className="list-search-empty">
        <p className="list-search-empty__title">No results for &ldquo;{query}&rdquo;</p>
        <p className="list-search-empty__sub">Try a different search term</p>
        <button type="button" onClick={onClear} className="list-search-empty__clear">Clear search</button>
      </div>
    );
  }
  return (
    <div>
      <div className="list-search-header">
        <h2>{products.length} product{products.length !== 1 ? "s" : ""}</h2>
        <p>for &ldquo;{query}&rdquo;</p>
      </div>
      {products.map((p) => <ListRow key={p.slug} product={p} />)}
    </div>
  );
}

/* ============================================================
   STORE LIST — editorial one-per-row layout (B variant)
   Renders inside AppShell — no nav, no footer
   ============================================================ */
export default function StoreList() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim() || search.trim().length < 2) return null;
    const q = search.toLowerCase();
    return VISIBLE.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [search]);

  const [cartOpen, setCartOpen] = useState(false);

  const bestSellers = VISIBLE.filter((p) =>
    ["answer-copies-compilation", "all-strategy-reports", "complete-gs-notes-bundle"].includes(p.slug)
  );
  const otherProducts = VISIBLE.filter((p) =>
    !["answer-copies-compilation", "all-strategy-reports", "complete-gs-notes-bundle"].includes(p.slug)
  );

  return (
    <>
      {/* Search bar */}
      <div className="list-search-bar">
        <div className="list-search-bar__inner">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="list-search-bar__icon">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-6 -6"/>
          </svg>
          <input
            type="search"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="list-search-bar__input"
            aria-label="Search products"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} className="list-search-bar__clear">
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="list-main">
        {/* Hero */}
        <section className="list-hero">
          <p className="list-hero__eyebrow">
            <span className="list-hero__eyebrow-dot" />
            Trusted by 1,400+ UPSC students
          </p>
          <h1 className="list-hero__headline">Everything a topper used, in one place.</h1>
          <p className="list-hero__sub">
            Strategy reports, answer copies, and notes from AIR 1–1249. Curated, verified, delivered instantly.
          </p>
        </section>

        {filtered !== null ? (
          <ListSearchResults query={search} products={filtered} onClear={() => setSearch("")} />
        ) : (
          <>
            <ListSectionHead label="Most popular" title="What students are buying" />
            {bestSellers.map((p) => <ListRow key={p.slug} product={p} />)}

            <ListTrust />

            <ListSectionHead label="All products" title="Browse the full catalog" />
            {otherProducts.map((p) => <ListRow key={p.slug} product={p} />)}

            <ListTrust />
            <ListTestimonial />
          </>
        )}
      </div>

      <CartSlideover open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { IconSearch, IconShoppingBag, IconStarFilled, IconCheck } from "@tabler/icons-react";
import { PRODUCTS } from "@/lib/store-products";
import { CartProvider, useCart } from "@/lib/cart-context";
import CartSlideover from "./CartSlideover";
import FakePurchaseToast from "./FakePurchaseToast";
import "@/app/store/store.css";

const VISIBLE = PRODUCTS.filter((p) => !p.comingSoon);

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="product-card__rating">
      <IconStarFilled size={10} />
      {rating.toFixed(1)}
    </span>
  );
}

function ProductCard({
  product,
  variant = "standard",
}: {
  product: (typeof PRODUCTS)[number];
  variant?: "standard" | "featured" | "wide";
}) {
  const { addItem } = useCart();

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  }

  const cardClass = [
    "product-card",
    variant === "featured" ? "product-card--featured" : "",
    variant === "wide" ? "product-card--wide" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href={`/store/${product.slug}`} className={cardClass}>
      {/* Image */}
      <div className="product-card__image-wrap">
        {product.image || (product.images && product.images[0]) ? (
          <img
            src={(product.images && product.images[0]) || product.image}
            alt={product.title}
            className="product-card__image"
            loading={variant === "featured" ? "eager" : "lazy"}
          />
        ) : (
          <div className="product-card__placeholder">
            <span className="product-card__placeholder-letter">{product.title.charAt(0)}</span>
          </div>
        )}
        {product.badge && (
          <span
            className={[
              "product-card__badge",
              product.badgeColor === "amber" ? "product-card__badge--amber" : "",
              product.badgeColor === "emerald" ? "product-card__badge--emerald" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {product.badge}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="product-card__body">
        {/* Meta row */}
        <div className="product-card__meta">
          {product.rating && <StarRating rating={product.rating} />}
          {product.fileCount && (
            <span className="product-card__files">
              {product.fileCount} files{product.totalSizeMB ? ` · ${Math.round(product.totalSizeMB / 1000)} GB` : ""}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="product-card__title">{product.title}</h3>

        {/* Tagline */}
        {variant !== "standard" && (
          <p className="product-card__tagline">{product.tagline}</p>
        )}

        {/* Desc (featured only) */}
        {variant === "featured" && (
          <p className="product-card__desc">{product.description}</p>
        )}

        {/* Footer */}
        <div className="product-card__footer">
          <span className="product-card__price">
            ₹{product.price}
            {product.originalPrice && (
              <span className="product-card__price-original">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </span>
          <button
            type="button"
            onClick={handleAdd}
            className="product-card__cta"
          >
            Add
          </button>
        </div>
      </div>
    </Link>
  );
}

function StoreNav({ search, onSearch }: { search: string; onSearch: (v: string) => void }) {
  const { totalItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <nav className="nav">
        <div className="nav__inner">
          <Link href="/store" className="nav__wordmark">
            upsc<span>prep</span>notes
          </Link>
          <div className="nav__divider" />
          <div className="nav__search">
            <IconSearch size={13} className="nav__search-icon" />
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              className="nav__search-input"
              aria-label="Search products"
            />
          </div>
          <div className="nav__actions">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="cart-btn"
              aria-label="Open cart"
            >
              <IconShoppingBag size={16} />
              {totalItems > 0 && (
                <span className="cart-btn__count">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
      <CartSlideover open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

function StoreHero() {
  return (
    <section className="hero">
      <p className="hero__label">
        <span className="hero__label-dot" />
        Trusted by 1,400+ UPSC students
      </p>
      <h1 className="hero__headline">
        Everything a topper used, in one place.
      </h1>
      <p className="hero__sub">
        Strategy reports, answer copies, and notes from AIR 1–1249. Curated, verified, delivered instantly.
      </p>
      <div className="hero__actions">
        <Link href="/store/answer-copies-compilation" className="btn-primary">
          Shop answer copies
        </Link>
        <Link href="/store/all-strategy-reports" className="btn-ghost">
          View all products
        </Link>
      </div>
    </section>
  );
}

function Testimonial() {
  return (
    <section className="testimonial-section">
      <div className="testimonial-card">
        {/* Main quote */}
        <div>
          <p className="testimonial__quote-mark">"</p>
          <p className="testimonial__text">
            The answer copies were the closest thing to having a mentor sit beside you. Seeing exactly how AIR 9 and AIR 16 structured their answers changed how I approached every paper.
          </p>
          <div className="testimonial__source">
            <div className="testimonial__avatar">AG</div>
            <div>
              <p className="testimonial__name">Anupama Gaur</p>
              <p className="testimonial__meta">
                Verified buyer · Anthropology Optional
                <span className="testimonial__verified">
                  <IconCheck size={8} />
                  Verified
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="testimonial__sidebar">
          <p className="testimonial__product-badge">Purchased</p>
          <div className="testimonial__stars">
            {[1, 2, 3, 4, 5].map((i) => (
              <IconStarFilled key={i} size={12} />
            ))}
          </div>
          <p className="testimonial__product-badge">Answer Copies Compilation</p>
        </div>
      </div>
    </section>
  );
}

function StoreFooter() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__statement">
          Every resource on this site was used by someone who <em>made it.</em>
        </p>
        <div className="footer__bottom">
          <div className="footer__links">
            <Link href="/store" className="footer__link">Store</Link>
            <Link href="/free-materials" className="footer__link">Free Materials</Link>
            <Link href="/toppers" className="footer__link">Toppers</Link>
            <Link href="/privacy-policy" className="footer__link">Privacy</Link>
            <Link href="/terms" className="footer__link">Terms</Link>
          </div>
          <p className="footer__copy">
            © {new Date().getFullYear()} upscprepnotes.in · Instant delivery · 7-day refund
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function StoreClient() {
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

  const featured = VISIBLE.find((p) => p.slug === "answer-copies-compilation");
  const strategy = VISIBLE.find((p) => p.slug === "all-strategy-reports");
  const gsBundle = VISIBLE.find((p) => p.slug === "complete-gs-notes-bundle");
  const rest = VISIBLE.filter(
    (p) => !["answer-copies-compilation", "all-strategy-reports", "complete-gs-notes-bundle"].includes(p.slug)
  );

  return (
    <CartProvider>
      <div>
        <StoreNav search={search} onSearch={setSearch} />

        {!search && <StoreHero />}

        <main>
          {filtered !== null ? (
            <div className="bento-section">
              <div className="bento-section__header">
                <span className="bento-section__title">
                  {filtered.length === 0 ? "No results" : `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}
                </span>
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="btn-ghost"
                    style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
                  >
                    Clear
                  </button>
                )}
              </div>

              {filtered.length === 0 ? (
                <div className="search-empty">
                  <IconSearch size={32} className="search-empty__icon" />
                  <p className="search-empty__title">No products found</p>
                  <p className="search-empty__sub">Try a different search term</p>
                </div>
              ) : (
                <div className="bento-grid">
                  {filtered.map((p) => (
                    <ProductCard key={p.slug} product={p} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* ── Featured products — 3 slots ── */}
              <section className="bento-section">
                <div className="bento-section__header">
                  <span className="bento-section__title">Featured</span>
                  <span className="bento-section__count">{VISIBLE.length} products</span>
                </div>

                <div className="bento-grid">
                  {/* Featured: Answer Copies — 2×2 */}
                  {featured && (
                    <ProductCard product={featured} variant="featured" />
                  )}

                  {/* Wide: Strategy Reports */}
                  {strategy && (
                    <ProductCard product={strategy} variant="wide" />
                  )}

                  {/* Wide: GS Notes Bundle */}
                  {gsBundle && (
                    <ProductCard product={gsBundle} variant="wide" />
                  )}

                  {/* Standard: rest */}
                  {rest.map((p) => (
                    <ProductCard key={p.slug} product={p} />
                  ))}
                </div>
              </section>

              <div className="section-divider">
                <hr className="section-divider__line" />
              </div>

              <Testimonial />

              {/* ── Trust strip — integrated into footer statement ── */}
            </>
          )}
        </main>

        <StoreFooter />
      </div>

      <FakePurchaseToast />
    </CartProvider>
  );
}

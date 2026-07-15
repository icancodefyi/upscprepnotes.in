"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import CartIcon from "@/components/store/CartIcon";
import CartSlideover from "@/components/store/CartSlideover";

const CURRENT_AFFAIRS_SUB = [
  { label: "Current Affairs Hub", href: "/current-affairs" },
  { label: "May 2026 Edition", href: "/current-affairs/may-2026" },
  { label: "2025 Yearly Compilation", href: "/current-affairs/2025" },
  { label: "Download PDFs", href: "/current-affairs/download" },
];

const FREE_MATERIALS_CATEGORIES = [
  { label: "Test Series", href: "/free-materials?category=test-series" },
  { label: "Notes & Material", href: "/free-materials?category=notes" },
  { label: "Books", href: "/free-materials?category=books" },
  { label: "Magazines", href: "/free-materials?category=magazines" },
  { label: "Current Affairs", href: "/free-materials?category=current-affairs" },
  { label: "Optional Subjects", href: "/free-materials?category=optional" },
];

const PYQ_YEARS = ["2023", "2024", "2025"];

interface SearchResult {
  title: string;
  subtitle?: string;
  href: string;
  category: "Topper" | "Store" | "Page";
  meta?: string;
}

function DropdownItem({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      role="menuitem"
      className="block whitespace-nowrap rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      {label}
    </Link>
  );
}

function NavDropdown({
  label,
  dataTrack,
  children,
}: {
  label: string;
  dataTrack: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
    } else if (e.key === "Escape") {
      setOpen(false);
      buttonRef.current?.focus();
    }
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        ref={buttonRef}
        data-track={dataTrack}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(!open)}
        onKeyDown={handleKeyDown}
        className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {label}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 pt-2">
          <div
            role="menu"
            className="min-w-48 rounded-xl border border-border bg-card p-2 shadow-lg"
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

function SearchSuggestions({
  results,
  query,
  activeIndex,
  onSelect,
}: {
  results: SearchResult[];
  query: string;
  activeIndex: number;
  onSelect: () => void;
}) {
  const router = useRouter();
  const grouped = results.reduce((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  const order = ["Topper", "Store", "Page"];

  return (
    <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-border bg-card p-2 shadow-xl">
      {results.length === 0 ? (
        <div className="px-3 py-4 text-center text-sm text-muted-foreground">
          No results for &ldquo;{query}&rdquo;
        </div>
      ) : (
        <div className="max-h-[70vh] overflow-auto">
          {order.map(
            (cat) =>
              grouped[cat] && (
                <div key={cat} className="mb-2 last:mb-0">
                  <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {cat}
                  </p>
                  {grouped[cat].map((r, idx) => {
                    const globalIndex = results.indexOf(r);
                    const isActive = globalIndex === activeIndex;
                    return (
                      <Link
                        key={`${r.href}-${idx}`}
                        href={r.href}
                        onClick={onSelect}
                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                          isActive ? "bg-brand-muted text-brand" : "hover:bg-secondary"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{r.title}</p>
                          {r.subtitle && (
                            <p className={`truncate text-xs ${isActive ? "text-brand/80" : "text-muted-foreground"}`}>
                              {r.subtitle}
                            </p>
                          )}
                        </div>
                        {r.meta && (
                          <span className="ml-3 shrink-0 text-xs font-semibold text-brand">
                            {r.meta}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ),
          )}
          <Link
            href={`/search?q=${encodeURIComponent(query)}`}
            onClick={onSelect}
            className="block rounded-lg px-3 py-2 text-center text-xs font-medium text-brand hover:bg-brand-muted"
          >
            View all results for &ldquo;{query}&rdquo;
          </Link>
        </div>
      )}
    </div>
  );
}

export default function Header({ bannerOpen = true }: { bannerOpen?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setActiveIndex(-1);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      setResults(data.results || []);
      setActiveIndex(-1);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchResults(query), 180);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchResults]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    if (activeIndex >= 0 && results[activeIndex]) {
      router.push(results[activeIndex].href);
    } else {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
    setSearchOpen(false);
    setQuery("");
    setResults([]);
    setActiveIndex(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setSearchOpen(false);
    }
  }

  return (
    <header className={`sticky z-40 bg-background border-b border-border ${bannerOpen ? "top-[36px]" : "top-0"}`}>
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <Link href="/" data-track="nav-logo" className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="UPSCPrepNotes"
            width={32}
            height={32}
            className="h-8 w-auto"
            priority
          />
          <span className="font-bold text-lg tracking-tight">
            UPSCPrepNotes
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium" aria-label="Main navigation">
          <Link
            href="/store"
            data-track="nav-store"
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Store
            <span className="rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-bold text-brand-foreground leading-none">New</span>
          </Link>
          <Link
            href="/toppers"
            data-track="nav-toppers"
            className="rounded-lg px-2 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Toppers
          </Link>
          <NavDropdown label="Current Affairs" dataTrack="nav-current-affairs">
            {CURRENT_AFFAIRS_SUB.map((item) => (
              <DropdownItem key={item.href} href={item.href} label={item.label} />
            ))}
          </NavDropdown>

          <NavDropdown label="Free Materials" dataTrack="nav-free-materials">
            {FREE_MATERIALS_CATEGORIES.map((cat) => (
              <DropdownItem key={cat.href} href={cat.href} label={cat.label} />
            ))}
            <div className="mt-1 border-t border-border pt-1">
              <DropdownItem href="/free-materials" label="View All →" />
            </div>
          </NavDropdown>

          <NavDropdown label="PYQs" dataTrack="nav-pyq">
            {PYQ_YEARS.map((year) => (
              <DropdownItem key={year} href={`/pyq/${year}`} label={year} />
            ))}
            <div className="mt-1 border-t border-border pt-1">
              <DropdownItem href="/pyq" label="View All →" />
            </div>
          </NavDropdown>

          <Link
            href="/ask"
            data-track="nav-ask-ai"
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Ask AI
            <span className="rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-bold text-brand-foreground leading-none">New</span>
          </Link>
        </nav>

        {/* Desktop Search */}
        <div ref={searchContainerRef} className="hidden md:block relative">
          <form onSubmit={handleSearchSubmit}>
            <div className={`flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 transition-all ${searchOpen ? "w-72" : "w-48"}`}>
              <Search size={16} className="text-muted-foreground" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder="Search..."
                aria-label="Search toppers, products, and pages"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                autoComplete="off"
              />
              {loading && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-brand" />
              )}
            </div>
          </form>
          {searchOpen && query.trim().length > 0 && (
            <SearchSuggestions
              results={results}
              query={query}
              activeIndex={activeIndex}
              onSelect={() => {
                setSearchOpen(false);
                setQuery("");
                setResults([]);
                setActiveIndex(-1);
              }}
            />
          )}
        </div>

        <div className="flex items-center gap-3">
          <CartIcon onClick={() => setCartOpen(true)} />

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            data-track="nav-mobile-toggle"
            className="md:hidden flex h-11 w-11 items-center justify-center rounded-xl hover:bg-secondary transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <CartSlideover open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-4 py-4 space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-4 py-3">
              <Search size={18} className="text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search toppers, products, pages..."
                aria-label="Search"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </form>

            <div className="flex items-center justify-between py-2">
              <Link
                href="/store"
                onClick={() => setMobileOpen(false)}
                data-track="nav-mobile-store"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Store
                <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-brand-foreground leading-none">New</span>
              </Link>
              <div onClick={() => setMobileOpen(false)}>
                <CartIcon onClick={() => setCartOpen(true)} />
              </div>
            </div>

            <Link
              href="/toppers"
              onClick={() => setMobileOpen(false)}
              data-track="nav-mobile-toppers"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Toppers
            </Link>

            <div className="py-2">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Current Affairs</p>
              <div className="ml-2 space-y-1">
                {CURRENT_AFFAIRS_SUB.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm text-muted-foreground hover:text-foreground py-2"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="py-2">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Free Materials</p>
              <div className="ml-2 space-y-1">
                {FREE_MATERIALS_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm text-muted-foreground hover:text-foreground py-2"
                  >
                    {cat.label}
                  </Link>
                ))}
                <Link
                  href="/free-materials"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium text-brand hover:text-brand/80 py-2"
                >
                  View All →
                </Link>
              </div>
            </div>

            <div className="py-2">
              <p className="text-xs font-semibold text-muted-foreground mb-2">PYQs</p>
              <div className="ml-2 space-y-1">
                {PYQ_YEARS.map((year) => (
                  <Link
                    key={year}
                    href={`/pyq/${year}`}
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm text-muted-foreground hover:text-foreground py-2"
                  >
                    {year}
                  </Link>
                ))}
                <Link
                  href="/pyq"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium text-brand hover:text-brand/80 py-2"
                >
                  View All →
                </Link>
              </div>
            </div>

            <Link
              href="/ask"
              onClick={() => setMobileOpen(false)}
              data-track="nav-mobile-ask-ai"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Ask AI
              <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-brand-foreground leading-none">New</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

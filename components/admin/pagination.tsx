import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  search: string;
}

export function Pagination({ currentPage, totalPages, search }: PaginationProps) {
  if (totalPages <= 1) return null;

  function href(page: number) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", String(page));
    return `/admin?${params.toString()}`;
  }

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center justify-center gap-1.5 pt-6">
      {currentPage > 1 ? (
        <Link
          href={href(currentPage - 1)}
          className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium transition hover:bg-black hover:text-white"
        >
          ← Prev
        </Link>
      ) : (
        <span className="rounded-full border border-black/[0.04] px-3 py-1.5 text-xs text-zinc-300">
          ← Prev
        </span>
      )}

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-xs text-zinc-400">
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              p === currentPage
                ? "bg-black text-white"
                : "border border-black/10 bg-white hover:bg-black hover:text-white"
            }`}
          >
            {p}
          </Link>
        ),
      )}

      {currentPage < totalPages ? (
        <Link
          href={href(currentPage + 1)}
          className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium transition hover:bg-black hover:text-white"
        >
          Next →
        </Link>
      ) : (
        <span className="rounded-full border border-black/[0.04] px-3 py-1.5 text-xs text-zinc-300">
          Next →
        </span>
      )}
    </div>
  );
}

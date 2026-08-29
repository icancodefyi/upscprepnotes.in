import { NextRequest, NextResponse } from "next/server";
import { getAllToppersList } from "@/services/topper.service";
import { PRODUCTS } from "@/lib/store-products";
import { checkRateLimit } from "@/lib/rate-limit";
import { matchesQuery, matchesTopper } from "@/lib/search-match";

const STATIC_PAGES = [
  { title: "Store", href: "/store", category: "Page", keywords: "products, buy, notes, test series, optional" },
  { title: "Toppers", href: "/toppers", category: "Page", keywords: "topper profiles, rank holders, strategy" },
  { title: "Current Affairs", href: "/current-affairs", category: "Page", keywords: "current affairs, monthly, yearly, pdf" },
  { title: "Free Materials", href: "/free-materials", category: "Page", keywords: "free download, test series, notes, books" },
  { title: "PYQs", href: "/pyq", category: "Page", keywords: "previous year questions, pyq, prelims, mains" },
  { title: "AI Mentor", href: "/ask", category: "Page", keywords: "ai, ask, mentor, chat" },
  { title: "Optional Subjects", href: "/optional", category: "Page", keywords: "optional subject, sociology, geography, psir" },
];

export async function GET(request: NextRequest) {
  const rl = await checkRateLimit(request, "search");
  if (rl) return rl;

  const q = request.nextUrl.searchParams.get("q")?.trim() || "";
  if (!q) return NextResponse.json({ results: [] });

  try {
    const toppers = await getAllToppersList();

    const topperResults = toppers
      .filter((t) => matchesTopper(t, q))
      .slice(0, 5)
      .map((t) => ({
        title: `${t.firstName} ${t.lastName}`,
        subtitle: `AIR ${t.rank} · ${t.year}${t.optionalSubject ? ` · ${t.optionalSubject}` : ""}`,
        href: `/upsc-topper/${t.slug}`,
        category: "Topper",
      }));

    const productResults = PRODUCTS.filter(
      (p) =>
        !p.comingSoon &&
        matchesQuery(q, [p.title, p.tagline, p.description, p.category]),
    )
      .slice(0, 4)
      .map((p) => ({
        title: p.title,
        subtitle: p.tagline,
        href: `/store/${p.slug}`,
        category: "Store",
        meta: `₹${p.price}`,
      }));

    const pageResults = STATIC_PAGES.filter((p) =>
      matchesQuery(q, [p.title, p.keywords]),
    ).map((p) => ({
      title: p.title,
      subtitle: p.href,
      href: p.href,
      category: p.category,
    }));

    const results = [...topperResults, ...productResults, ...pageResults];
    return NextResponse.json({ results });
  } catch (err) {
    // Previously this swallowed the throw and returned an empty result set,
    // making a real backend failure look identical to a genuine "no matches".
    // Log it and return a 500 so the client can tell the two apart.
    console.error("[/api/search] failed:", err);
    return NextResponse.json(
      { error: "Search is temporarily unavailable.", results: [] },
      { status: 500 },
    );
  }
}

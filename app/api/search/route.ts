import { NextRequest, NextResponse } from "next/server";
import { getAllToppersList } from "@/services/topper.service";
import { PRODUCTS } from "@/lib/store-products";
import { checkRateLimit } from "@/lib/rate-limit";

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
  const rl = await checkRateLimit(request, "form");
  if (rl) return rl;

  const q = request.nextUrl.searchParams.get("q")?.toLowerCase().trim() || "";
  if (!q) return NextResponse.json({ results: [] });

  try {
    const toppers = await getAllToppersList();

    const topperResults = toppers
      .filter(
        (t) =>
          t.firstName.toLowerCase().includes(q) ||
          t.lastName.toLowerCase().includes(q) ||
          `${t.firstName} ${t.lastName}`.toLowerCase().includes(q) ||
          t.optionalSubject.toLowerCase().includes(q) ||
          t.rank.toString().includes(q) ||
          t.year.toString().includes(q),
      )
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
        (p.title.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.category && p.category.toLowerCase().includes(q))),
    )
      .slice(0, 4)
      .map((p) => ({
        title: p.title,
        subtitle: p.tagline,
        href: `/store/${p.slug}`,
        category: "Store",
        meta: `₹${p.price}`,
      }));

    const pageResults = STATIC_PAGES.filter(
      (p) =>
        p.title.toLowerCase().includes(q) || p.keywords.toLowerCase().includes(q),
    ).map((p) => ({
      title: p.title,
      subtitle: p.href,
      href: p.href,
      category: p.category,
    }));

    const results = [...topperResults, ...productResults, ...pageResults];
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}

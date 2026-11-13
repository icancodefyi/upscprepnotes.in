import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";
import { PDFModel } from "@/models/pdf.model";
import { PYQModel } from "@/models/pyq.model";
import { PRODUCTS } from "@/lib/store-products";
import { COPY_PRODUCT_SLUG, COPY_TOPPERS, copyFor } from "@/lib/ai/answer-copies";
import { searchWeb, formatSearchResults } from "@/lib/ai/websearch";
import { cleanMarks } from "@/lib/marks-clean";

/* ───────── topper cache (≈380 rows, refreshed every 10 minutes) ───────── */

type T = {
  name: string;
  slug: string;
  rank: number;
  year: number;
  optional: string;
  marks: Record<string, number>;
  bio: string;
  strategy: string;
  insights: string[];
};

let cache: { at: number; rows: T[] } | null = null;

async function toppers(): Promise<T[]> {
  if (cache && Date.now() - cache.at < 10 * 60_000) return cache.rows;
  await connectDB();
  const docs = await TopperModel.find({})
    .select("firstName lastName firstname lastname slug rank year optionalSubject marks bio strategy insights")
    .lean();
  const rows: T[] = (docs as any[]).map((d) => ({
    name: `${d.firstName || d.firstname || ""} ${d.lastName || d.lastname || ""}`.replace(/\s+/g, " ").trim(),
    slug: d.slug,
    rank: d.rank,
    year: d.year,
    optional: d.optionalSubject || "",
    marks: cleanMarks(d.marks).marks,
    bio: d.bio || "",
    strategy: d.strategy || "",
    insights: d.insights || [],
  }));
  cache = { at: Date.now(), rows };
  return rows;
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

function lev(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

/** Forgiving name match, so "Devya Tanwar" and "Banna Venktash" still find the right person. */
function nameScore(query: string, name: string): number {
  const q = norm(query).split(" ").filter((w) => w.length > 1);
  const parts = norm(name).split(" ");
  if (!q.length) return 0;
  let score = 0;
  for (const w of q) {
    let best = 0;
    for (const p of parts) {
      if (p === w) best = Math.max(best, 3);
      else if (p.startsWith(w) || w.startsWith(p)) best = Math.max(best, 2);
      else if (w.length > 3 && lev(w, p) <= (w.length > 6 ? 2 : 1)) best = Math.max(best, 1.5);
    }
    score += best;
  }
  return score / (q.length * 3);
}

const marksLine = (m: Record<string, number>) =>
  Object.entries({
    GS1: m.gs1,
    GS2: m.gs2,
    GS3: m.gs3,
    GS4: m.gs4,
    Essay: m.essay,
    "Optional paper 1": m.optional1,
    "Optional paper 2": m.optional2,
    "Written total": m.written,
    Interview: m.interview,
    "Final total": m.total,
  })
    .filter(([, v]) => v)
    .map(([k, v]) => `${k} ${v}`)
    .join(", ");

function brief(t: T) {
  return {
    name: t.name,
    air: t.rank,
    year: t.year,
    optional: t.optional || "not recorded",
    marks: marksLine(t.marks) || "marks not recorded",
    profile: `/upsc-topper/${t.slug}`,
    answer_copy: copyFor(t.name)
      ? `Yes, ${copyFor(t.name)!.files} real copy file(s) inside the Answer Copies Compilation (/store/${COPY_PRODUCT_SLUG})`
      : "No scanned copy in our collection yet",
  };
}

/* ───────── tools ───────── */

export const TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "find_topper",
      description:
        "Look up a UPSC topper by name (spelling mistakes are fine). Returns rank, year, optional subject, paper-wise marks, strategy, insights and profile link, and whether we hold their answer copy.",
      parameters: { type: "object", properties: { name: { type: "string" } }, required: ["name"] },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "list_toppers",
      description:
        "List or rank toppers with filters: optional subject, exam year, best rank, and sorting by rank or by a marks column. Use it for questions like highest marks ever, toppers of an optional, or all toppers of a year.",
      parameters: {
        type: "object",
        properties: {
          optional: { type: "string", description: "Part of the optional subject name, for example sociology" },
          year: { type: "number" },
          max_rank: { type: "number", description: "Only toppers with AIR up to this number" },
          sort_by: { type: "string", enum: ["rank", "total", "written", "interview", "essay", "gs1", "gs2", "gs3", "gs4", "optional1", "optional2"] },
          limit: { type: "number", description: "Default 10, at most 25" },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "optional_stats",
      description: "How many toppers took each optional subject, and their average marks. Use it to help choose an optional.",
      parameters: { type: "object", properties: { optional: { type: "string" } } },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "answer_copy_info",
      description:
        "Which toppers' real mains answer copies we hold, and how a student can get them (the paid compilation and the free copy request). Use it whenever someone asks for a topper's copy, answer sheet or handwritten answers.",
      parameters: { type: "object", properties: { topper: { type: "string" } } },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_products",
      description:
        "Our paid store products with price, what is inside and the link. Use it when the student needs material, a pack, test series, notes or interview or mains help. Pass a topic to filter, or nothing for all.",
      parameters: { type: "object", properties: { topic: { type: "string" } } },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "search_free_materials",
      description: "Search our free library of notes, books, magazines, current affairs PDFs and test series. Returns titles and links.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string" },
          category: { type: "string", enum: ["notes", "books", "magazines", "current-affairs", "test-series"] },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_pyq",
      description: "Previous year question papers we host, by exam year, with links.",
      parameters: { type: "object", properties: { year: { type: "number" } } },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "web_search",
      description:
        "Search the web for current information: notifications, results, cutoffs, dates, news and policy changes. Do not use it for toppers, marks, products or our own material.",
      parameters: { type: "object", properties: { query: { type: "string" } }, required: ["query"] },
    },
  },
];

type Ctx = { webAllowed: boolean };
export type ToolOut = { text: string; topperSlugs?: { slug: string; name: string }[]; webSources?: { domain: string; label: string }[] };

const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s);

export async function runTool(name: string, args: any, ctx: Ctx): Promise<ToolOut> {
  try {
    switch (name) {
      case "find_topper": {
        const all = await toppers();
        const q = String(args?.name || "");
        const hits = all
          .map((t) => ({ t, s: nameScore(q, t.name) }))
          .filter((x) => x.s >= 0.5)
          .sort((a, b) => b.s - a.s || a.t.rank - b.t.rank)
          .slice(0, 3);
        if (!hits.length) return { text: JSON.stringify({ found: false, note: "No topper matches that name in our database. Do not guess; offer list_toppers or ask for the full name." }) };
        const out = hits.map(({ t }) => ({
          ...brief(t),
          strategy: clip(t.strategy, 1500) || "Strategy not written up for this topper yet",
          insights: t.insights.slice(0, 5),
          bio: clip(t.bio, 400),
        }));
        return { text: JSON.stringify({ found: true, matches: out }), topperSlugs: hits.slice(0, 2).map(({ t }) => ({ slug: t.slug, name: t.name })) };
      }
      case "list_toppers": {
        const all = await toppers();
        const opt = args?.optional ? norm(String(args.optional)) : "";
        let rows = all.filter(
          (t) =>
            (!opt || norm(t.optional).includes(opt)) &&
            (!args?.year || t.year === Number(args.year)) &&
            (!args?.max_rank || t.rank <= Number(args.max_rank)),
        );
        const key = String(args?.sort_by || "rank");
        const val = (t: T) => (key === "rank" ? t.rank : t.marks[key] || 0);
        rows = rows.filter((t) => key === "rank" || val(t) > 0).sort((a, b) => (key === "rank" ? val(a) - val(b) : val(b) - val(a)));
        const limit = Math.min(Number(args?.limit) || 10, 25);
        return {
          text: JSON.stringify({ total_matches: rows.length, sorted_by: key, toppers: rows.slice(0, limit).map(brief) }),
          topperSlugs: rows.slice(0, 2).map((t) => ({ slug: t.slug, name: t.name })),
        };
      }
      case "optional_stats": {
        const all = await toppers();
        const opt = args?.optional ? norm(String(args.optional)) : "";
        const by = new Map<string, { n: number; sum: number; k: number; best: T }>();
        for (const t of all) {
          if (!t.optional || (opt && !norm(t.optional).includes(opt))) continue;
          const o = by.get(t.optional) || { n: 0, sum: 0, k: 0, best: t };
          o.n++;
          const m = ((t.marks.optional1 || 0) + (t.marks.optional2 || 0)) || 0;
          if (m > 0) {
            o.sum += m;
            o.k++;
          }
          if (t.rank < o.best.rank) o.best = t;
          by.set(t.optional, o);
        }
        const rows = [...by.entries()]
          .map(([optional, o]) => ({ optional, toppers_in_database: o.n, average_optional_marks_out_of_500: o.k ? Math.round(o.sum / o.k) : null, best_air: `${o.best.name} (AIR ${o.best.rank}, ${o.best.year})` }))
          .sort((a, b) => b.toppers_in_database - a.toppers_in_database)
          .slice(0, 20);
        return { text: JSON.stringify({ note: "Counts are of toppers in our database, not of all candidates.", rows, more: "/optional and /toppers/marks-database show the full comparison" }) };
      }
      case "answer_copy_info": {
        const q = args?.topper ? String(args.topper) : "";
        const all = await toppers();
        let who: any = null;
        if (q) {
          const hit = all.map((t) => ({ t, s: nameScore(q, t.name) })).filter((x) => x.s >= 0.5).sort((a, b) => b.s - a.s)[0];
          if (hit) who = { name: hit.t.name, air: hit.t.rank, year: hit.t.year, profile: `/upsc-topper/${hit.t.slug}`, free_copy_request: `/free/${hit.t.slug}`, have_copy: !!copyFor(hit.t.name) };
        }
        const p = PRODUCTS.find((x) => x.slug === COPY_PRODUCT_SLUG);
        return {
          text: JSON.stringify({
            asked_about: who || (q ? { name: q, in_database: false } : null),
            compilation: { title: p?.title, price: p?.price, mrp: p?.originalPrice, link: `/store/${COPY_PRODUCT_SLUG}`, contents: `${COPY_TOPPERS.reduce((s, c) => s + c.files, 0)} real scanned mains copies from ${COPY_TOPPERS.length} toppers` },
            toppers_with_copies: COPY_TOPPERS.map((c) => `${c.name} (AIR ${c.air}, ${c.year}, ${c.files} file${c.files > 1 ? "s" : ""})`),
            free_option: "Each topper page has a free copy request at /free/<topper-slug>; the student fills a short form and we send it by email.",
            rule: "Only say a copy exists if have_copy is true or the name is in toppers_with_copies. Otherwise say we do not have that copy yet and offer the compilation or the free request.",
          }),
        };
      }
      case "get_products": {
        const topic = args?.topic ? norm(String(args.topic)) : "";
        let rows = PRODUCTS.filter((p) => !p.comingSoon && p.price > 0);
        if (topic) {
          const words = topic.split(" ").filter((w) => w.length > 2);
          const scored = rows
            .map((p) => {
              const hay = norm([p.title, p.tagline, p.description, ...(p.features || [])].join(" "));
              return { p, s: words.reduce((n, w) => n + (hay.includes(w) ? 1 : 0), 0) };
            })
            .filter((x) => x.s > 0)
            .sort((a, b) => b.s - a.s);
          if (scored.length) rows = scored.map((x) => x.p);
        }
        return {
          text: JSON.stringify(
            rows.slice(0, 5).map((p) => ({ title: p.title, price: `₹${p.price}`, mrp: p.originalPrice ? `₹${p.originalPrice}` : undefined, for: p.tagline, includes: (p.features || []).slice(0, 4), link: `/store/${p.slug}` })),
          ),
        };
      }
      case "search_free_materials": {
        await connectDB();
        const words = norm(String(args?.query || "")).split(" ").filter((w) => w.length > 2).slice(0, 5);
        const filter: any = {};
        if (args?.category) filter.category = args.category;
        if (words.length) filter.$or = words.flatMap((w) => [{ title: { $regex: w, $options: "i" } }, { tags: { $regex: w, $options: "i" } }, { description: { $regex: w, $options: "i" } }]);
        const docs = await (PDFModel as any).find(filter).select("title slug category year language fileSize").sort({ downloadCount: -1 }).limit(6).lean();
        return { text: JSON.stringify(docs.length ? docs.map((d: any) => ({ title: d.title, type: d.category, year: d.year, language: d.language, size: d.fileSize, link: `/free-materials/${d.slug}` })) : { found: false, browse: "/free-materials" }) };
      }
      case "get_pyq": {
        await connectDB();
        const filter: any = args?.year ? { year: Number(args.year) } : {};
        const docs = await (PYQModel as any).find(filter).select("year category title").limit(40).lean();
        const years = [...new Set(docs.map((d: any) => d.year))].sort();
        return { text: JSON.stringify({ note: "These are the papers we host, not question-by-question analysis.", years_available: years, papers: docs.slice(0, 12).map((d: any) => `${d.year} ${d.category}: ${d.title}`), link: args?.year ? `/pyq/${args.year}` : "/pyq/2025" }) };
      }
      case "web_search": {
        if (!ctx.webAllowed) return { text: "Web search is switched off for this question. Answer from our own data and say it may be out of date." };
        const q = String(args?.query || "").slice(0, 200);
        const data = await searchWeb(q);
        const sources = data.results
          .map((r) => {
            let domain = r.url;
            try {
              domain = new URL(r.url).hostname.replace(/^www\./, "");
            } catch {}
            return { domain, label: r.title.slice(0, 70) || domain };
          })
          .slice(0, 5);
        return { text: formatSearchResults(q, data.results) + "\n\nCite with markdown links using the real URLs.", webSources: sources };
      }
    }
    return { text: "Unknown tool." };
  } catch (e) {
    console.error(`[ask-tool] ${name} failed:`, e);
    return { text: "That lookup failed. Answer from what you already know and do not invent data." };
  }
}

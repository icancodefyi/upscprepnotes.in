import { config } from "dotenv";
config({ path: ".env.local" });
import * as fs from "fs";

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const SITE_URL = "https://upscprepnotes.in";

const SEARCH_QUERIES = [
  `site:*.in "recommended websites" UPSC preparation FREE`,
  `"UPSC study material" "submit your website" resource`,
  `"best websites for UPSC" list blog education india`,
  `"UPSC preparation" "useful links" "recommended sites"`,
  `"UPSC resources" "free" compiled list`,
  `"civil services" preparation "helpful websites"`,
  `UPSC "resource page" "links" education`,
];

interface SearchResult {
  title: string;
  url: string;
  content: string;
}

async function searchTavily(query: string): Promise<SearchResult[]> {
  if (!TAVILY_API_KEY) {
    console.log(`  SKIP: No TAVILY_API_KEY set`);
    return [];
  }

  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query,
        search_depth: "advanced",
        max_results: 10,
        include_answer: false,
      }),
    });

    if (!res.ok) {
      console.error(`  Tavily error: ${res.status}`);
      return [];
    }

    const data = await res.json() as { results: SearchResult[] };
    return data.results || [];
  } catch (err) {
    console.error(`  Tavily error: ${err}`);
    return [];
  }
}

function isRelevant(result: SearchResult): boolean {
  const url = result.url.toLowerCase();
  const title = result.title.toLowerCase();
  const content = result.content.toLowerCase();

  // Skip our own site
  if (url.includes("upscprepnotes")) return false;

  // Must be about UPSC or civil services
  const keywordCheck = /upsc|civil service|ias|ips|ifs|cse exam|preparation/i;
  if (!keywordCheck.test(title) && !keywordCheck.test(content)) return false;

  // Skip social media, forums (can't submit there)
  const skipDomains = /facebook|twitter|x\.com|instagram|reddit|youtube|quora/i;
  if (skipDomains.test(url)) return false;

  // Skip news articles (not resource pages)
  if (/timesofindia|indiatoday|hindustan|indianexpress|thehindu/.test(url)) return false;

  return true;
}

function categorize(url: string): string {
  if (/blog|article|post/.test(url)) return "blog";
  if (/resource|link|list|directory/.test(url)) return "resource-page";
  if (/forum|community|discussion/.test(url)) return "forum";
  if (/gov|ac\.in|nic/.test(url)) return "government";
  if (/coach|academy|classes|institute/.test(url)) return "coaching";
  return "other";
}

async function main() {
  console.log("Searching for UPSC resource pages that accept submissions...\n");

  const allResults: Map<string, { result: SearchResult; query: string }> = new Map();

  for (const query of SEARCH_QUERIES) {
    console.log(`Query: ${query}`);
    const results = await searchTavily(query);
    console.log(`  Found ${results.length} results`);

    for (const r of results) {
      if (isRelevant(r) && !allResults.has(r.url)) {
        allResults.set(r.url, { result: r, query });
      }
    }
  }

  if (allResults.size === 0) {
    console.log("\nNo relevant resource pages found. Try running again or manually searching.");
    return;
  }

  const resourcePages = Array.from(allResults.values());
  const resourceCategory = resourcePages.filter(({ result }) => categorize(result.url) === "resource-page");
  const blogCategory = resourcePages.filter(({ result }) => categorize(result.url) === "blog");
  const coachingCategory = resourcePages.filter(({ result }) => categorize(result.url) === "coaching");
  const otherCategory = resourcePages.filter(({ result }) => {
    const c = categorize(result.url);
    return c !== "resource-page" && c !== "blog" && c !== "coaching";
  });

  console.log(`\n=== Found ${resourcePages.length} unique relevant pages ===\n`);

  const lines: string[] = [];
  lines.push("# UPSC Resource Pages — Backlink Opportunities");
  lines.push("");
  lines.push(`Found ${resourcePages.length} pages (deduplicated) that could accept submissions or list resources.`);
  lines.push("");
  lines.push(`**Your site**: ${SITE_URL}`);
  lines.push("");
  lines.push("## How to use");
  lines.push("");
  lines.push("1. Visit each URL and look for 'Submit Resource', 'Suggest Link', 'Contact', or similar.");
  lines.push("2. Submit your URL with a brief description (e.g., 'UPSCPrepNotes — verified topper marks and strategy guides').");
  lines.push("3. These are manual submissions — one-time effort per site.");
  lines.push("");

  if (resourceCategory.length > 0) {
    lines.push("## Resource Pages (highest value, directly accept links)");
    lines.push("");
    lines.push("| # | Title | URL |");
    lines.push("|---|-------|-----|");
    resourceCategory.forEach(({ result }, i) => {
      lines.push(`| ${i + 1} | ${result.title} | ${result.url} |`);
    });
    lines.push("");
  }

  if (blogCategory.length > 0) {
    lines.push("## Blog Posts & Articles (comment / suggest link)");
    lines.push("");
    lines.push("| # | Title | URL |");
    lines.push("|---|-------|-----|");
    blogCategory.forEach(({ result }, i) => {
      lines.push(`| ${i + 1} | ${result.title} | ${result.url} |`);
    });
    lines.push("");
  }

  if (coachingCategory.length > 0) {
    lines.push("## Coaching / Academy Sites (potential partnerships)");
    lines.push("");
    lines.push("| # | Title | URL |");
    lines.push("|---|-------|-----|");
    coachingCategory.forEach(({ result }, i) => {
      lines.push(`| ${i + 1} | ${result.title} | ${result.url} |`);
    });
    lines.push("");
  }

  if (otherCategory.length > 0) {
    lines.push("## Other Relevant Pages");
    lines.push("");
    lines.push("| # | Title | URL |");
    lines.push("|---|-------|-----|");
    otherCategory.forEach(({ result }, i) => {
      lines.push(`| ${i + 1} | ${result.title} | ${result.url} |`);
    });
    lines.push("");
  }

  lines.push("---");
  lines.push(`Generated by scripts/find-resource-pages.ts on ${new Date().toISOString().split("T")[0]}`);

  const outPath = "backlink-opportunities.md";
  fs.writeFileSync(outPath, lines.join("\n"));
  console.log(`Written to ${outPath}`);
}

main();

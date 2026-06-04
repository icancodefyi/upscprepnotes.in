// Run: node -r dotenv/config scripts/scrape-drishti-pdfs.mjs dotenv_config_path=.env.local
// Scrapes Drishti IAS for free answer copy PDFs matching our 48 indexed toppers

import mongoose from "mongoose";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, "..");
const CACHE_FILE = join(PROJECT_ROOT, "scripts", ".drishti-cache.json");

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) { console.error("MONGODB_URI not set"); process.exit(1); }

async function fetchText(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; UPSCPrepNotes/1.0)" },
      });
      if (res.ok) return await res.text();
    } catch {}
    await new Promise((r) => setTimeout(r, 2000));
  }
  return null;
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function normalizeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
}

// Extract slug from Drishti detail URL for matching
function slugFromUrl(url) {
  const parts = url.replace(/https?:\/\//, "").split("/");
  return parts[parts.length - 1].replace(/-gs$/, "").toLowerCase();
}

// Scrape all topper entries from the Drishti GS listing page
async function scrapeDrishtiListing() {
  const html = await fetchText("https://www.drishtiias.com/hindi/free-downloads/toppers-general-studies-copy");
  if (!html) { console.error("Failed to fetch Drishti GS listing"); return []; }

  const entries = [];
  // Match hrefs pointing to free-downloads (avoids header false positives)
  // Format: <a href="https://www.drishtiias.com/hindi/free-downloads/..." class="slide">
  //            <strong>name | रैंक-rank (UPSC CSE year)</strong>
  //         </a>
  const regex = /<a\s+href="(https?:\/\/[^"]*free-downloads\/[^"]+)"[^>]*>[\s\S]*?<strong>([^<]+)<\/strong>[\s\S]*?<\/a>/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const innerText = match[2].trim();
    // Parse: "name | रैंक-rank (UPSC CSE year)"
    const parts = innerText.split(/\s*\|\s*/);
    if (parts.length < 2) continue;
    const fullName = parts[0].replace(/<\/?[^>]+>/g, "").trim();
    const rankYearPart = parts[1].trim();
    const rankMatch = rankYearPart.match(/रैंक-(\d+)/);
    const yearMatch = rankYearPart.match(/UPSC CSE (\d+)/);
    if (!rankMatch || !yearMatch) continue;
    const rank = parseInt(rankMatch[1]);
    const year = parseInt(yearMatch[1]);
    const detailUrl = match[1].startsWith("http") ? match[1] : `https://www.drishtiias.com${match[1]}`;
    const slug = slugFromUrl(detailUrl);

    // Parse first and last name from the Hindi name
    const nameParts = fullName.split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");

    entries.push({ fullName, firstName, lastName, rank, year, detailUrl, slug });
  }

  console.log(`Found ${entries.length} toppers on Drishti GS listing`);
  writeFileSync(CACHE_FILE, JSON.stringify(entries, null, 2));
  return entries;
}

// Build English name variations from our toppers for slug matching
function generateNameVariations(firstName, lastName) {
  const fullName = `${firstName} ${lastName}`.toLowerCase().trim();
  const variations = new Set();
  variations.add(slugify(fullName));
  // Remove middle parts for 3+ word names
  const parts = fullName.split(/\s+/);
  if (parts.length >= 3) {
    // First + Last
    variations.add(slugify(`${parts[0]} ${parts[parts.length - 1]}`));
  }
  // Single name
  variations.add(slugify(firstName));
  // Handle names with special patterns
  if (lastName) variations.add(slugify(lastName));
  return variations;
}

// Scrape a topper's detail page for PDF download links
async function scrapeDrishtiDetail(url) {
  const html = await fetchText(url);
  if (!html) return [];

  const pdfs = [];
  // Match: <a href="...pdf" download>
  const regex = /<a\s+href="([^"]*\.pdf)"[^>]*>\s*(.*?)\s*<\/a>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    let pdfUrl = match[1];
    if (pdfUrl.startsWith("//")) pdfUrl = "https:" + pdfUrl;
    if (pdfUrl.startsWith("/")) pdfUrl = "https://www.drishtiias.com" + pdfUrl;
    const label = match[2].trim();
    pdfs.push({ url: pdfUrl, label });
  }
  return pdfs;
}

async function main() {
  await mongoose.connect(MONGO_URI, {
    dbName: process.env.DB_NAME || "upscprepnotes",
    serverSelectionTimeoutMS: 10000,
  });

  // Get our 48 indexed toppers
  const ourToppers = await mongoose.connection.db.collection("toppers")
    .find({ isIndexed: true })
    .project({ firstName: 1, lastName: 1, rank: 1, year: 1, slug: 1, freeAnswerCopyUrl: 1 })
    .toArray();

  console.log(`Our indexed toppers: ${ourToppers.length}`);

  // Scrape Drishti listing
  console.log("\nScraping Drishti GS listing...");
  const drishtiEntries = await scrapeDrishtiListing();

  // Build slug-to-Drishti map for matching
  const slugToDrishti = new Map();
  for (const d of drishtiEntries) {
    slugToDrishti.set(d.slug, d);
    // Also store the slug without trailing numbers (some have -gs suffix, etc.)
    const baseSlug = d.slug.replace(/-\d+$/, "");
    if (baseSlug !== d.slug) slugToDrishti.set(baseSlug, d);
  }

  // Match toppers by rank + year + slug overlap
  const matched = [];
  const unmatched = [];

  for (const ours of ourToppers) {
    const name = `${ours.firstName} ${ours.lastName}`.trim();
    const slug = slugify(name);
    const variations = generateNameVariations(ours.firstName, ours.lastName);

    // Try exact rank+year match with slug overlap
    let match = null;

    // Strategy 1: Match by rank + year + slug variation
    const candidates = drishtiEntries.filter((d) => d.rank === ours.rank && d.year === ours.year);
    for (const cand of candidates) {
      const candSlug = cand.slug;
      for (const v of variations) {
        if (candSlug.includes(v) || v.includes(candSlug)) {
          match = cand;
          break;
        }
      }
      if (match) break;
    }

    // Strategy 2: Match by slug only (relaxed — no rank/year check)
    // Skipping to avoid false positives

    if (match) {
      matched.push({ ours, drishti: match });
    } else {
      unmatched.push(ours);
    }
  }

  console.log(`\nMatched: ${matched.length}/${ourToppers.length}`);
  console.log(`Unmatched: ${unmatched.length}/${ourToppers.length}`);

  if (unmatched.length > 0) {
    console.log("\nUnmatched toppers:");
    unmatched.forEach((t) => console.log(`  ${t.firstName} ${t.lastName} (AIR ${t.rank}, ${t.year})`));
  }

  // Scrape detail pages and seed PDFs
  console.log("\nScraping detail pages & seeding...\n");

  for (const { ours, drishti } of matched) {
    const name = `${ours.firstName} ${ours.lastName}`;

    if (ours.freeAnswerCopyUrl) {
      console.log(`✓ ${name} — already seeded: ${ours.freeAnswerCopyUrl}`);
      continue;
    }

    console.log(`→ ${name} (AIR ${drishti.rank}, ${drishti.year}) — scraping ${drishti.detailUrl}`);
    const pdfs = await scrapeDrishtiDetail(drishti.detailUrl);

    if (pdfs.length === 0) {
      console.log(`  No PDFs found`);
      continue;
    }

    // Pick the first GS PDF (typically labelled "सामान्य अध्ययन")
    const gsPdf = pdfs.find((p) => p.label.includes("सामान्य")) || pdfs[0];

    console.log(`  PDF: ${gsPdf.url}`);

    // Seed in MongoDB
    const result = await mongoose.connection.db.collection("toppers").updateOne(
      { slug: ours.slug },
      { $set: { freeAnswerCopyUrl: gsPdf.url } }
    );
    console.log(`  ${result.matchedCount > 0 ? "✓" : "✗"} Seeded`);

    // Be polite
    await new Promise((r) => setTimeout(r, 1000));
  }

  // Summary
  const seeded = matched.filter((m) => m.ours.freeAnswerCopyUrl).length;
  const newSeeded = matched.length - seeded;
  console.log(`\n=== SUMMARY ===`);
  console.log(`Previously seeded: ${seeded}`);
  console.log(`Newly seeded: ${newSeeded}`);
  console.log(`Total with PDFs now: ${seeded + newSeeded}`);
  console.log(`Still missing (not on Drishti): ${unmatched.length}`);

  await mongoose.disconnect();
  console.log("Done!");
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});

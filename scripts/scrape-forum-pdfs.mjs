// Run: node -r dotenv/config scripts/scrape-forum-pdfs.mjs dotenv_config_path=.env.local
// Scrapes ForumIAS for free answer copy PDFs matching our 48 indexed toppers

import mongoose from "mongoose";
import { writeFileSync } from "fs";

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) { console.error("MONGODB_URI not set"); process.exit(1); }

async function fetchText(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; UPSCPrepNotes/1.0)" },
      });
      if (res.ok) {
        return await res.text();
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 2000));
  }
  return null;
}

// Extract PDF links from a ForumIAS topper blog post
function extractForumPDFs(html) {
  const pdfs = new Set();
  // Pattern 1: Direct wp-content PDF URLs
  const regex1 = /https:\/\/forumias\.com\/blog\/wp-content\/uploads\/\d{4}\/\d{2}\/[^"'\s]+\.pdf/g;
  let m;
  while ((m = regex1.exec(html)) !== null) pdfs.add(m[0]);
  // Pattern 2: Google Drive links
  const regex2 = /https:\/\/drive\.google\.com\/[^"'\s]+/g;
  while ((m = regex2.exec(html)) !== null) pdfs.add(m[0]);
  return [...pdfs];
}

function normalizeName(n) {
  return n.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
}

// Parse the ForumIAS testimonials page
async function scrapeForumListing() {
  const html = await fetchText("https://forumias.com/blog/testimonials/");
  if (!html) { console.error("Failed to fetch ForumIAS testimonials page"); return null; }

  const years = ["2025", "2024", "2023", "2022", "2021"];
  const allEntries = [];

  for (const year of years) {
    // Find the h2 for this year and extract content up to the next h2
    let yearAnchor;
    if (year === "2021") {
      yearAnchor = 'id="UPSC_Toppers_2021_Testimonials_and_Test_Copies"';
    } else if (year === "2024" || year === "2025") {
      yearAnchor = `id="UPSC_IAS_Toppers_${year}_Answer_CopiesSheets_andTestimonials"`;
    } else {
      yearAnchor = `id="UPSC_IAS_Toppers_${year}Answer_CopiesSheets_andTestimonials"`;
    }

    const startIdx = html.indexOf(yearAnchor);
    if (startIdx === -1) continue;

    // Find next h2 after this section
    const nextH2 = html.indexOf("<h2", startIdx + 100);
    if (nextH2 === -1) continue;

    const section = html.substring(startIdx, nextH2);

    // Extract entries: "CSE Rank N Name, Download MGP Copies [ + Testimonial] <a href='...'>Click Here</a>"
    // Use [^,]+ to prevent matching across entries (AIR 68 has "Testimonial" not "Download MGP Copies")
    const entryRegex = /CSE Rank (\d+)\s+([^,]+),\s*Download MGP Copies(?:\s*\+\s*Testimonial)?\s*<a\s+href="([^"]+)"[^>]*>/g;
    let m;
    while ((m = entryRegex.exec(section)) !== null) {
      const rank = parseInt(m[1]);
      const name = m[2].trim();
      const detailUrl = m[3].split("#")[0]; // strip anchor
      allEntries.push({ fullName: name, rank, year: parseInt(year), detailUrl });
    }
  }

  return allEntries;
}

async function main() {
  await mongoose.connect(MONGO_URI, {
    dbName: process.env.DB_NAME || "upscprepnotes",
    serverSelectionTimeoutMS: 10000,
  });

  const ourToppers = await mongoose.connection.db.collection("toppers")
    .find({ isIndexed: true })
    .project({ firstName: 1, lastName: 1, rank: 1, year: 1, slug: 1, freeAnswerCopyUrl: 1 })
    .toArray();

  console.log(`Our indexed toppers: ${ourToppers.length}`);

  console.log("\nScraping ForumIAS testimonials page...");
  const forumEntries = await scrapeForumListing();
  if (!forumEntries) { console.error("Failed to parse ForumIAS"); process.exit(1); }

  console.log(`Found ${forumEntries.length} toppers on ForumIAS`);

  // Cache
  writeFileSync("scripts/.forum-cache.json", JSON.stringify(forumEntries, null, 2));

  // Match by rank + year + fuzzy name
  const matched = [];
  const unmatched = [];

  for (const ours of ourToppers) {
    const ourName = normalizeName(`${ours.firstName} ${ours.lastName}`);

    const candidates = forumEntries.filter(f => f.rank === ours.rank && f.year === ours.year);
    let match = null;

    for (const cand of candidates) {
      const candName = normalizeName(cand.fullName);
      // Check if either name contains the other's significant parts
      const first = ours.firstName.toLowerCase().replace(/[^a-z]/g, "");
      const last = (ours.lastName || "").toLowerCase().replace(/[^a-z]/g, "");

      if (
        candName.includes(first) ||
        candName.includes(last) ||
        first.length > 2 && candName.includes(first.substring(0, Math.min(4, first.length)))
      ) {
        match = cand;
        break;
      }
    }

    if (match) {
      matched.push({ ours, forum: match });
    } else {
      unmatched.push(ours);
    }
  }

  console.log(`\nMatched: ${matched.length}/${ourToppers.length}`);

  if (matched.length > 0) {
    console.log("\nMatched toppers:");
    matched.forEach(({ ours, forum }) => {
      console.log(`  ✓ ${ours.firstName} ${ours.lastName} (AIR ${ours.rank}, ${ours.year}) → ${forum.detailUrl}`);
    });
  }

  if (unmatched.length > 0) {
    console.log(`\nUnmatched: ${unmatched.length}`);
    unmatched.forEach(t => console.log(`  ✗ ${t.firstName} ${t.lastName} (AIR ${t.rank}, ${t.year})`));
  }

  // Scrape detail pages and seed
  console.log("\nScraping detail pages & seeding...\n");
  let newSeeded = 0;

  for (const { ours, forum } of matched) {
    const name = `${ours.firstName} ${ours.lastName}`;

    if (ours.freeAnswerCopyUrl) {
      console.log(`✓ ${name} — already seeded`);
      continue;
    }

    console.log(`→ ${name} — scraping ${forum.detailUrl}`);
    const html = await fetchText(forum.detailUrl);
    if (!html) { console.log(`  Failed`); continue; }

    const pdfs = extractForumPDFs(html);
    console.log(`  Found ${pdfs.length} PDFs`);

    if (pdfs.length === 0) continue;

    // Pick a GS paper copy as the free download
    let chosen = pdfs.find(p => /gs.*copy-?1/i.test(p)) || pdfs.find(p => /gs/i.test(p)) || pdfs[0];
    console.log(`  Chosen: ${chosen.substring(0, 120)}`);

    await mongoose.connection.db.collection("toppers").updateOne(
      { slug: ours.slug },
      { $set: { freeAnswerCopyUrl: chosen } }
    );
    newSeeded++;
    console.log(`  ✓ Seeded`);

    await new Promise((r) => setTimeout(r, 1500));
  }

  const already = matched.filter(m => m.ours.freeAnswerCopyUrl).length;
  console.log(`\n=== SUMMARY ===`);
  console.log(`Already seeded: ${already}`);
  console.log(`Newly seeded: ${newSeeded}`);
  console.log(`Total with PDFs now: ${already + newSeeded}`);
  console.log(`Still missing: ${ourToppers.length - (already + newSeeded)}`);

  await mongoose.disconnect();
}

main().catch((err) => { console.error("Fatal:", err.message); process.exit(1); });

// Run: node -r dotenv/config scripts/scrape-pdfco-pdfs.mjs dotenv_config_path=.env.local
// Phase 1: Discover PDF links from pdfnotes.co for all 48 indexed toppers
// Phase 2: Download PDFs locally
// Phase 3: Seed freeAnswerCopyUrl in MongoDB

import mongoose from "mongoose";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, "..");
const DOWNLOAD_DIR = join(PROJECT_ROOT, "public", "pdfs", "answer-copies");

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) { console.error("MONGODB_URI not set"); process.exit(1); }

const RESULTS = [];

async function fetchWithTimeout(url, timeoutMs = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; UPSCPrepNotes/1.0)" },
      redirect: "follow",
    });
    return res.ok ? res : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function determinePdfSlug(topper) {
  const firstName = (topper.firstName || "").toLowerCase().trim().replace(/\s+/g, "-");
  const lastName = (topper.lastName || "").toLowerCase().trim().replace(/\s+/g, "-");
  return `${firstName}-${lastName}`;
}

function extractPdfLinks(html) {
  const links = [];
  // <a href="...pdf">
  const aRegex = /<a[^>]+href="([^"]*\.pdf)"[^>]*>/gi;
  let match;
  while ((match = aRegex.exec(html)) !== null) {
    let url = match[1];
    if (url.startsWith("//")) url = "https:" + url;
    if (url.startsWith("/")) url = "https://pdfnotes.co" + url;
    links.push(url);
  }
  return [...new Set(links)];
}

async function downloadPdf(url, filepath) {
  const dir = dirname(filepath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  if (existsSync(filepath)) return true;

  try {
    const res = await fetchWithTimeout(url);
    if (!res) return false;
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.slice(0, 4).toString() !== "%PDF") return false;
    createWriteStream(filepath).write(buffer);
    console.log(`  Downloaded (${(buffer.length / 1024).toFixed(0)}KB)`);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  await mongoose.connect(MONGO_URI, {
    dbName: process.env.DB_NAME || "upscprepnotes",
    serverSelectionTimeoutMS: 10000,
  });

  const toppers = await mongoose.connection.db.collection("toppers")
    .find({ isIndexed: true })
    .project({ firstName: 1, lastName: 1, slug: 1, freeAnswerCopyUrl: 1 })
    .toArray();

  console.log(`Found ${toppers.length} indexed toppers\n`);

  // Phase 1: Discover
  console.log("=== PHASE 1: DISCOVER PDF LINKS ===\n");

  for (const topper of toppers) {
    const name = `${topper.firstName || ""} ${topper.lastName || ""}`.trim();
    const pdfSlug = determinePdfSlug(topper);

    if (topper.freeAnswerCopyUrl) {
      console.log(`✓ ${name} — already seeded: ${topper.freeAnswerCopyUrl}`);
      RESULTS.push({ slug: topper.slug, url: topper.freeAnswerCopyUrl, skipDownload: true });
      continue;
    }

    const patterns = [pdfSlug, `ias-${pdfSlug}`];
    let html = null;

    for (const pattern of patterns) {
      const res = await fetchWithTimeout(`https://pdfnotes.co/${pattern}/`);
      if (res) {
        html = await res.text();
        break;
      }
    }

    if (!html) {
      // Try search as fallback
      const searchRes = await fetchWithTimeout(
        `https://pdfnotes.co/?s=${encodeURIComponent(`${topper.firstName} ${topper.lastName}`)}`
      );
      if (searchRes) {
        const searchHtml = await searchRes.text();
        const linkMatch = searchHtml.match(/href="(https:\/\/pdfnotes\.co\/[^"]+?(?:ias-)?[a-z-]+)"/i);
        if (linkMatch && !linkMatch[1].includes("?s=") && !linkMatch[1].includes("/category/")) {
          const subRes = await fetchWithTimeout(linkMatch[1]);
          if (subRes) html = await subRes.text();
        }
      }
    }

    if (!html) {
      console.log(`✗ ${name} — not found`);
      RESULTS.push({ slug: topper.slug, url: null, skipDownload: true });
      await new Promise((r) => setTimeout(r, 300));
      continue;
    }

    const pdfLinks = extractPdfLinks(html);
    console.log(`→ ${name} — ${pdfLinks.length} PDF(s) found`);

    if (pdfLinks.length > 0) {
      // Prefer Drishti or ForumIAS links
      const preferred = pdfLinks.find((u) => u.includes("drishtiias")) ||
                        pdfLinks.find((u) => u.includes("forumias")) ||
                        pdfLinks[0];
      RESULTS.push({ slug: topper.slug, url: preferred, skipDownload: false });
    } else {
      RESULTS.push({ slug: topper.slug, url: null, skipDownload: true });
    }

    await new Promise((r) => setTimeout(r, 500));
  }

  // Phase 2: Download
  console.log("\n=== PHASE 2: DOWNLOAD PDFs ===\n");

  for (const r of RESULTS) {
    if (r.skipDownload || !r.url) continue;

    const topper = toppers.find((t) => t.slug === r.slug);
    const pdfSlug = determinePdfSlug(topper);
    const destPath = join(DOWNLOAD_DIR, pdfSlug, "gs1.pdf");
    const localUrl = `/pdfs/answer-copies/${pdfSlug}/gs1.pdf`;

    console.log(`  ${topper.firstName} ${topper.lastName}: ${r.url}`);
    const downloaded = await downloadPdf(r.url, destPath);
    r.finalUrl = downloaded ? localUrl : r.url;
    if (!downloaded) console.log(`  → Using external URL: ${r.url}`);

    await new Promise((r) => setTimeout(r, 300));
  }

  // Phase 3: Seed
  console.log("\n=== PHASE 3: SEED MongoDB ===\n");

  for (const r of RESULTS) {
    if (!r.url) continue;
    const url = r.finalUrl || r.url;
    const result = await mongoose.connection.db.collection("toppers").updateOne(
      { slug: r.slug },
      { $set: { freeAnswerCopyUrl: url } }
    );
    console.log(`${result.matchedCount > 0 ? "✓" : "✗"} ${r.slug} → ${url}`);
  }

  await mongoose.disconnect();

  // Summary
  const seeded = RESULTS.filter((r) => r.url).length;
  const notFound = RESULTS.filter((r) => !r.url).length;
  console.log(`\n=== SUMMARY ===`);
  console.log(`Seeded: ${seeded}/${toppers.length}`);
  console.log(`Not found: ${notFound}/${toppers.length}`);
  console.log(`Done!`);
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});

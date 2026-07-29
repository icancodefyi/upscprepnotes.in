import { config } from "dotenv";
config({ path: ".env.local" });

import { getAllSlugs, getPage } from "../data/content/registry";
import type { ContentPage } from "../data/content/index";

const DEVTO_API_KEY = process.env.DEVTO_API_KEY;
const SITE_URL = "https://upscprepnotes.in";

const CONTENT_TO_SYNDICATE = [
  "upsc-syllabus",
  "upsc-full-form",
  "upsc-free-material",
  "upsc-topper-answer-copies",
  "how-to-write-upsc-mains-answers",
  "forum-ias-test-series-review",
  "upsc-optional-subject-marks-analysis",
  "data-methodology-and-editorial-standards",
  "how-to-score-130-plus-in-gs1",
  "how-to-score-120-plus-in-gs2",
  "how-to-score-120-plus-in-gs3",
  "how-to-score-100-plus-in-gs4",
  "how-to-score-300-plus-in-psir-optional",
];

const TAG_MAP: Record<string, string[]> = {
  "upsc-syllabus": ["upsc", "syllabus", "civilservices", "education"],
  "upsc-full-form": ["upsc", "civilservices", "india", "education"],
  "upsc-free-material": ["upsc", "freestudy", "civilservices", "education"],
  "upsc-topper-answer-copies": ["upsc", "topper", "answerwriting", "civilservices"],
  "how-to-write-upsc-mains-answers": ["upsc", "answerwriting", "mains", "civilservices"],
  "forum-ias-test-series-review": ["upsc", "testseries", "forumias", "review"],
  "upsc-optional-subject-marks-analysis": ["upsc", "optional", "marks", "civilservices"],
  "data-methodology-and-editorial-standards": ["upsc", "data", "analytics", "education"],
};

const DEFAULT_TAGS = ["upsc", "civilservices", "education", "india"];

function pageToMarkdown(page: ContentPage): string {
  const parts: string[] = [];

  if (page.intro) parts.push(page.intro);
  parts.push("");

  for (const section of page.sections) {
    parts.push(`## ${section.heading}`);
    parts.push("");
    parts.push(section.body);
    parts.push("");
  }

  if (page.faq && page.faq.length > 0) {
    parts.push("## Frequently Asked Questions");
    parts.push("");
    for (const faq of page.faq) {
      parts.push(`### ${faq.q}`);
      parts.push("");
      parts.push(faq.a);
      parts.push("");
    }
  }

  return parts.join("\n").trim();
}

function getTags(slug: string): string[] {
  return TAG_MAP[slug] || DEFAULT_TAGS;
}

async function postToDevto(slug: string, page: ContentPage): Promise<void> {
  if (!DEVTO_API_KEY) {
    console.log(`SKIP ${slug}: No DEVTO_API_KEY set`);
    return;
  }

  const bodyMarkdown = pageToMarkdown(page);
  const canonicalUrl = `${SITE_URL}/${slug}`;

  const body = JSON.stringify({
    article: {
      title: page.title,
      body_markdown: bodyMarkdown,
      canonical_url: canonicalUrl,
      tags: getTags(slug),
      published: false,
    },
  });

  try {
    const res = await fetch("https://dev.to/api/articles", {
      method: "POST",
      headers: {
        "api-key": DEVTO_API_KEY,
        "Content-Type": "application/json",
      },
      body,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`FAIL ${slug}: ${res.status} — ${errText}`);
      return;
    }

    const data = await res.json() as { id: number; url: string };
    console.log(`OK ${slug}: https://dev.to${data.url} (id: ${data.id})`);
  } catch (err) {
    console.error(`FAIL ${slug}: ${err}`);
  }
}

async function main() {
  const slugs = CONTENT_TO_SYNDICATE;

  console.log(`Syncing ${slugs.length} pages...\n`);

  for (const slug of slugs) {
    const loader = getPage(slug);
    if (!loader) {
      console.log(`SKIP ${slug}: not found in registry`);
      continue;
    }

    const mod = await loader();
    const page = mod.default;

    console.log(`\n--- ${slug} ---`);
    console.log(`Title: ${page.title}`);
    console.log(`Content length: ${page.sections.reduce((a, s) => a + s.body.length, 0)} chars`);

    await postToDevto(slug, page);
  }

  console.log("\nDone.");
}

main();

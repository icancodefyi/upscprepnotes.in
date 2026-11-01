interface PDFMeta {
  title: string;
  slug: string;
  category: string;
  brand: string | null;
  description: string;
  year?: string;
  resources?: Array<{
    name: string;
    section?: string;
    language?: string;
  }>;
}

function getSections(resources: PDFMeta["resources"]): Map<string, number> {
  const sections = new Map<string, number>();
  if (!resources) return sections;
  for (const r of resources) {
    const sec = r.section || "All Resources";
    sections.set(sec, (sections.get(sec) || 0) + 1);
  }
  return sections;
}

function pickFirst<T>(arr: T[], count: number): T[] {
  return arr.slice(0, count);
}

function sampleSectionItems(
  resources: PDFMeta["resources"],
  sectionName: string,
  max: number
): string[] {
  if (!resources) return [];
  const items = resources
    .filter((r) => (r.section || "All Resources") === sectionName)
    .map((r) => r.name);
    return pickFirst(items, max);
}

export function generateWhatsIncluded(p: PDFMeta): string {
  const sections = getSections(p.resources);
  const totalItems = p.resources?.length || 0;
  const brand = p.brand || "";

  if (p.category === "test-series" && sections.size > 0) {
    const parts = Array.from(sections.entries())
      .slice(0, 4)
      .map(([name, count]) => `${count} ${name.toLowerCase()}`);
    const summary = parts.join(", ");
    const extra = sections.size > 4 ? ` and ${sections.size - 4} more sections` : "";
    const firstSection = Array.from(sections.keys())[0];
    const sampleItems = sampleSectionItems(p.resources, firstSection, 3);

    let text = `This collection gives you ${summary}${extra} — ${totalItems} test papers in total`;
    if (brand) text += ` from ${brand}`;
    text += ". ";

    if (sampleItems.length > 0) {
      text += `In the ${firstSection.toLowerCase()} section alone, you get papers like "${sampleItems.join('", "')}". `;
    }
    text += "Each paper follows the actual UPSC pattern with detailed solutions that explain the reasoning behind every answer.";
    return text;
  }

  if (p.category === "notes" && sections.size > 0) {
    const firstSec = Array.from(sections.entries())[0];
    const sampleItems = sampleSectionItems(p.resources, firstSec[0], 4);
    let text = `These notes`;
    if (brand) text += ` by ${brand}`;
    text += ` contain ${totalItems} topic-wise resources organized into ${sections.size} sections. `;

    if (sampleItems.length > 0) {
      text += `Topics include ${sampleItems.slice(0, 3).join(", ")}${sampleItems.length > 3 ? ", and more" : ""}. `;
    }
    text += "Designed for quick revision and concept clarity — use them alongside your standard textbooks to reinforce what you study.";
    return text;
  }

  if (p.category === "books") {
    let text = "This book";
    if (brand) text += ` by ${brand}`;
    text += " is a well-known reference for UPSC preparation. It covers the subject comprehensively with clear explanations, diagrams, and practice material.";
    if (totalItems > 1) {
      text += ` The download includes ${totalItems} resources covering different chapters and topics.`;
    }
    return text;
  }

  if (p.category === "magazines" && sections.size > 0) {
    const firstSec = Array.from(sections.entries())[0];
    const sampleItems = sampleSectionItems(p.resources, firstSec[0], 3);
    let text = `This magazine`;
    if (brand) text += ` from ${brand}`;
    text += ` covers ${totalItems} topics across ${sections.size} sections. `;
    if (sampleItems.length > 0) {
      text += `It includes analysis on ${sampleItems.join(", ")} and more. `;
    }
    text += "Each issue focuses on current developments relevant to UPSC GS papers.";
    return text;
  }

  if (p.category === "current-affairs") {
    let text = `This current affairs compilation`;
    if (brand) text += ` by ${brand}`;
    text += ` covers ${totalItems} important events and topics. `;
    if (sections.size > 0) {
      text += `It is organized into ${Array.from(sections.keys()).slice(0, 4).join(", ")}${sections.size > 4 ? " and more" : ""}. `;
    }
    text += "Use it to stay updated with national and international events for Prelims and Mains.";
    return text;
  }

  let text = "This study material";
  if (brand) text += ` from ${brand}`;
  text += ` includes ${totalItems} resources`;
  if (sections.size > 0) {
    text += ` across ${Array.from(sections.keys()).slice(0, 3).join(", ")}`;
  }
  text += ". Ideal for UPSC preparation.";
  return text;
}

export function generateHowToUse(p: PDFMeta): string {
  const sections = getSections(p.resources);
  const sectionCount = sections.size;
  const totalItems = p.resources?.length || 0;

  if (p.category === "test-series") {
    const firstSection = Array.from(sections.keys())[0] || "";
    if (sectionCount > 3) {
      return `Start with the ${firstSection.toLowerCase()} section — attempt one paper at a time under timed conditions. After completing all papers in a section, move to the next. Review solutions thoroughly after each test, noting recurring mistakes. With ${totalItems} papers across ${sectionCount} sections, pace yourself: aim for 2-3 tests per week. Revisit difficult questions after 2-3 weeks to check improvement.`;
    }
    return `Attempt each paper under strict timed conditions. After finishing, review the solutions in detail — focus on understanding why you got questions wrong, not just the correct answer. Track your scores across tests to spot weak areas.${totalItems > 5 ? ` With ${totalItems} papers available, you have enough material to practice consistently for several weeks.` : ""}`;
  }

  if (p.category === "notes") {
    const firstSection = Array.from(sections.keys())[0] || "";
    return `Start with the ${firstSection.toLowerCase()} section. Read the corresponding chapter from your standard textbook first, then revise using these notes for quick recall. Mark points you find difficult and create your own shorthand.${sectionCount > 2 ? ` Move through all ${sectionCount} sections systematically.` : ""} Revisit these notes weekly — spaced repetition is key to retention.`;
  }

  if (p.category === "books") {
    return "Read the book chapter by chapter. Mark important sections, definitions, and data points as you go. After finishing a chapter, close the book and recall the key points — this strengthens memory. For subjects with diagrams (geography, environment), trace and label them without looking. Revisit marked sections during revision phases.";
  }

  if (p.category === "magazines") {
    return "Read the magazine issue by issue. For each article, note how it connects to the UPSC syllabus — which GS paper does it relate to? Create one-page summaries for each major topic. During revision, these summaries will save hours. Focus on government schemes, committee recommendations, and policy shifts — these are frequently asked in Prelims and Mains.";
  }

  if (p.category === "current-affairs") {
    return `Go through the compilation topic-wise. For each entry, ask: "Which GS paper does this belong to? Is it relevant for Prelims or Mains?" Make brief notes linking current events to static subjects.${totalItems > 20 ? ` With ${totalItems} entries, pace yourself — cover 5-10 entries per day.` : ""} Revise these notes weekly rather than re-reading the entire compilation.`;
  }

  return "Go through the material systematically. Focus on understanding concepts, not memorization. Revise periodically and practice applying what you learn through answer writing.";
}

export function generateKeyTopics(p: PDFMeta): string[] {
  const sections = getSections(p.resources);
  const topics: string[] = [];

  if (p.category === "test-series") {
    for (const section of sections.keys()) {
      const cleaned = section.replace(/test|paper|set|section/gi, "").trim();
      if (cleaned.length > 2) topics.push(cleaned);
    }
  }

  if (p.resources) {
    const seen = new Set<string>();
    for (const r of p.resources) {
      const name = r.name.replace(/PDF|pdf|download|free/gi, "").trim();
      if (name.length > 5 && !seen.has(name)) {
        seen.add(name);
        topics.push(name);
      }
      if (topics.length >= 10) break;
    }
  }

  return [...new Set(topics)].slice(0, 10);
}

export function generateFAQs(p: PDFMeta): Array<{ q: string; a: string }> {
  const brand = p.brand || "this material";
  const sections = getSections(p.resources);
  const totalItems = p.resources?.length || 0;

  if (p.category === "test-series") {
    const sectionList = Array.from(sections.keys()).slice(0, 3).join(", ");
    return [
      {
        q: `How many test papers are included?`,
        a: `${totalItems} test papers across ${sections.size} sections: ${sectionList}${sections.size > 3 ? " and more" : ""}. Each paper comes with detailed solutions.`,
      },
      {
        q: `Are these tests based on the latest UPSC pattern?`,
        a: `Yes. These tests follow the current UPSC exam pattern — both Prelims (objective) and Mains (descriptive) formats. The solutions include step-by-step reasoning.`,
      },
      {
        q: `Do I need to pay for these test papers?`,
        a: `No — all ${totalItems} test papers in this collection are available for free download. Click the download button next to each paper to save it. If you want verified topper answer copies with real scores, check the ₹799 bundle.`,
      },
      {
        q: `Can I use these for answer writing practice?`,
        a: `Yes — especially the Mains papers. Attempt writing full answers under timed conditions, then compare with the solutions provided. This is one of the most effective ways to improve your answer writing.`,
      },
    ];
  }

  if (p.category === "notes") {
    const sectionNames = Array.from(sections.keys()).slice(0, 3).join(", ");
    return [
      {
        q: `Are these notes enough for UPSC preparation?`,
        a: `These notes are great for revision, but pair them with standard textbooks for depth. Use the combination: textbook → notes → practice questions.`,
      },
      {
        q: `What topics do these notes cover?`,
        a: `${totalItems} resources across ${sections.size} sections including ${sectionNames}. Each topic is presented in a concise format optimized for quick revision.`,
      },
      {
        q: `Can I download and print these notes?`,
        a: `Yes, all resources are free to download. Save them for offline study or print them — whatever works best for your preparation style.`,
      },
    ];
  }

  if (p.category === "books") {
    return [
      {
        q: `Is this book useful for UPSC preparation?`,
        a: `Yes${brand ? `, "${p.title}" by ${brand}` : ""} is a recommended reference for UPSC. It covers the subject in depth with clear explanations suitable for both Prelims and Mains.`,
      },
      {
        q: `Should I read the full book or only specific chapters?`,
        a: `Read the full book once to build a strong foundation. During revision, focus on chapters that align with the UPSC syllabus and your weak areas.`,
      },
      {
        q: `Does this include practice questions?`,
        a: `The book includes exercises and practice material. Work through them after completing each chapter to test your understanding.`,
      },
    ];
  }

  if (p.category === "magazines" || p.category === "current-affairs") {
    const hasHindi = p.resources?.some((r) => r.language === "hi");
    return [
      {
        q: `How does this help with UPSC current affairs?`,
        a: `This compilation${brand ? ` from ${brand}` : ""} covers important current events mapped to the UPSC syllabus. It saves you the effort of tracking news daily — everything is compiled topic-wise.`,
      },
      {
        q: `What is the best way to use this material?`,
        a: `Read topic by topic. For each issue, note its relevance to specific GS papers. Create brief one-page summaries for revision. Revise these summaries weekly.`,
      },
      {
        q: `Is this available in Hindi?`,
        a: hasHindi
          ? "Yes, this compilation includes resources in Hindi. Look for the 'HI' tag next to Hindi-language items in the resources section above."
          : "This compilation is primarily in English. Some topics may have Hindi resources — check for the 'HI' tag in the resource list.",
      },
    ];
  }

  return [
    {
      q: `What is included in this collection?`,
      a: `This collection includes ${totalItems} resources${sections.size > 0 ? ` across ${sections.size} sections` : ""}. Check the resources section above for the complete list with download links.`,
    },
    {
      q: `Is this really free to download?`,
      a: "Yes — every resource here is available for free. No signup, no payment required. Just click the download button next to each item.",
    },
  ];
}

export function generateStudyTips(p: PDFMeta): string[] {
  const totalItems = p.resources?.length || 0;

  if (p.category === "test-series") {
    const tips = [
      "Attempt one paper under timed conditions without interruptions — simulate the real exam hall.",
      "After marking, analyze each wrong answer: was it a concept gap, misinterpretation, or silly mistake?",
      "Maintain a mistake log. Review it before each test to avoid repeating errors.",
    ];
    if (totalItems > 10) {
      tips.push(`With ${totalItems} papers, create a study schedule: 2 tests per week with dedicated review days.`);
    }
    return tips;
  }

  if (p.category === "notes") {
    return [
      "Read the relevant textbook chapter first, then revise using these notes — this dual approach improves retention significantly.",
      "Use active recall: read a section, close the notes, and write down what you remember from memory.",
      "Schedule weekly revision slots. Revisiting notes after 1 day, 1 week, and 1 month locks concepts into long-term memory.",
    ];
  }

  if (p.category === "books") {
    return [
      "Read one chapter at a time. After each chapter, write a brief summary without looking at the book.",
      "Pay special attention to diagrams, tables, and data points — these are gold for Prelims questions.",
      "Mark pages you find difficult. Revisit them after completing the full book — concepts often click on second reading.",
    ];
  }

  if (p.category === "magazines") {
    return [
      "Don't just read — engage. For each article, write one paragraph connecting it to a GS paper or static topic.",
      "Create a 'Current Affairs' notebook with topic-wise pages. Add relevant points from each magazine issue.",
      "Focus on government schemes, committee recommendations, and policy changes — these are frequently tested in UPSC.",
    ];
  }

  if (p.category === "current-affairs") {
    return [
      "Classify each event by GS paper relevance — this trains your brain to think like the exam.",
      "Link current events to static subjects. For example, a climate summit → environment + geography + international relations.",
      "Revise weekly, not monthly. A 30-minute weekly review of current affairs is more effective than a 4-hour session before the exam.",
    ];
  }

  return [
    "Go through the material systematically.",
    "Revise periodically using active recall techniques.",
    "Practice applying concepts through answer writing.",
  ];
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    "test-series": "Test Series",
    "notes": "Notes & Material",
    "books": "Books",
    "magazines": "Magazines",
    "current-affairs": "Current Affairs",
    "optional": "Optional Subjects",
  };
  return labels[category] || "Resources";
}

export function generateEditorialContent(p: PDFMeta): string {
  const totalItems = p.resources?.length || 0;
  const brand = p.brand || "";
  const title = p.title || "";
  const categoryLabel = getCategoryLabel(p.category);

  if (p.category === "test-series") {
    let text = `${title} is a ${brand ? brand + " " : ""}UPSC test series designed to help aspirants practice rigorously before the actual examination. `;
    text += `This collection includes ${totalItems} test papers covering the full UPSC syllabus — Prelims (objective) and Mains (descriptive) formats. `;
    text += `Each test paper follows the official UPSC examination pattern, making it an excellent resource for timed practice. `;
    if (p.resources && p.resources.length > 0) {
      const sections = [...new Set(p.resources.map(r => r.section).filter(Boolean))];
      if (sections.length > 0) {
        text += `The papers are organized across ${sections.length} sections including ${sections.slice(0, 3).join(", ")}${sections.length > 3 ? ", and more" : ""}. `;
      }
    }
    text += `Regular practice with these test papers helps identify weak areas, improves time management, and builds the stamina needed for the 3-hour Mains paper format. `;
    text += `For best results, attempt each paper under strict exam conditions — no interruptions, no extra time, and no reference material. `;
    text += `After each test, analyze your mistakes systematically and track your score progression over time.`;
    return text;
  }

  if (p.category === "notes") {
    let text = `${title}${brand ? ` by ${brand}` : ""} is a comprehensive set of UPSC study notes covering essential topics across the Civil Services Examination syllabus. `;
    text += `These notes are designed for quick revision and concept clarity, making them ideal for aspirants who have already completed their standard textbooks. `;
    if (totalItems > 0) {
      text += `The collection includes ${totalItems} topic-wise resources that break down complex subjects into digestible sections. `;
    }
    text += `Unlike bulky textbooks, these notes present information in a concise, structured format that facilitates faster revision. `;
    text += `Each topic is organized to highlight key facts, definitions, and analytical points that are most relevant for UPSC GS papers. `;
    text += `Use these notes alongside your standard reference books — read the textbook for depth, then revise with these notes for retention. `;
    text += `Spaced repetition is key: revisit these notes after 1 day, 1 week, and 1 month to lock concepts into long-term memory. `;
    text += `The GS1-4 syllabus coverage ensures that these notes complement preparation across all General Studies papers.`;
    return text;
  }

  if (p.category === "books") {
    let text = `${title}${brand ? ` by ${brand}` : ""} is a well-regarded reference book for UPSC Civil Services Examination preparation. `;
    text += `This book provides in-depth coverage of its subject matter with clear explanations, structured chapters, and practice material. `;
    text += `It is suitable for both Prelims (objective) and Mains (descriptive) preparation, making it a versatile addition to any aspirant's study list. `;
    text += `The book follows a logical progression from foundational concepts to advanced topics, allowing candidates to build understanding step by step. `;
    if (totalItems > 1) {
      text += `The download includes ${totalItems} resources covering different chapters and supplementary material. `;
    }
    text += `Recommended approach: read one chapter at a time, write brief summaries after each chapter without looking at the book, `;
    text += `and revisit difficult sections during revision phases. Pay special attention to tables, diagrams, and data points — these are frequently tested in Prelims.`;
    return text;
  }

  if (p.category === "magazines") {
    let text = `${title}${brand ? ` from ${brand}` : ""} is a curated UPSC magazine covering current affairs and in-depth analysis of national and international developments. `;
    text += `This magazine${totalItems > 0 ? ` features ${totalItems} articles and analyses ` : " "}`;
    text += `that are mapped to the UPSC syllabus, helping aspirants connect current events with static subjects. `;
    text += `Each issue covers government schemes, policy changes, committee recommendations, and global events relevant to GS Papers 1-4. `;
    text += `Magazines are an essential resource for UPSC current affairs preparation because they provide expert analysis rather than just news headlines. `;
    text += `Use this magazine to build a topic-wise current affairs notebook — for each article, write a one-page summary linking it to specific GS paper topics. `;
    text += `Focus on understanding the "why" behind events rather than memorizing facts, as UPSC increasingly tests analytical understanding of current issues.`;
    return text;
  }

  if (p.category === "current-affairs") {
    let text = `${title}${brand ? ` by ${brand}` : ""} is a comprehensive current affairs compilation for UPSC preparation. `;
    text += `This resource covers ${totalItems} key events and developments organized topic-wise for easy revision. `;
    text += `Current affairs form a critical component of all three stages of UPSC — Prelims (GS and CSAT), Mains (GS Papers 1-4, Essay), and the Interview. `;
    text += `A well-structured current affairs compilation saves aspirants the effort of tracking news daily and ensures comprehensive coverage. `;
    text += `The compilation is organized by GS paper relevance, helping candidates connect current events to specific syllabus topics. `;
    text += `Best practice: classify each event by GS paper, create brief notes linking events to static subjects, and revise weekly rather than monthly. `;
    text += `For Mains preparation, practice writing 150-word analytical notes on significant current events — this directly improves your answer writing quality in the exam.`;
    return text;
  }

  let text = `${title}${brand ? ` by ${brand}` : ""} is a valuable UPSC study resource. `;
  text += `This collection includes ${totalItems} resources designed to help aspirants prepare effectively for the Civil Services Examination. `;
  text += `Whether you are preparing for Prelims, Mains, or both, this material provides structured content aligned with the UPSC syllabus. `;
  text += `Download the resources, study systematically, and supplement your preparation with answer writing practice and revision.`;
  return text;
}

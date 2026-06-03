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

function getBrandKey(brand: string | null): string {
  if (!brand) return "general";
  return brand.toLowerCase().replace(/[^a-z]+/g, "-");
}

export function generateWhatsIncluded(p: PDFMeta): string {
  const sections = getSections(p.resources);
  const totalItems = p.resources?.length || 0;

  if (p.category === "test-series") {
    const sectionList = Array.from(sections.entries())
      .map(([name, count]) => `${name} (${count} test${count > 1 ? "s" : ""})`)
      .join(", ");
    return `This collection includes ${totalItems} individual test papers and solutions from ${p.brand || "leading UPSC coaching institutes"}. It covers ${sectionList}. Each test follows the actual UPSC pattern with detailed solutions and explanations.`;
  }

  if (p.category === "notes") {
    const topics = Array.from(sections.keys()).slice(0, 5).join(", ");
    return `These ${p.brand || ""} notes contain ${totalItems} individual resources covering key UPSC topics. The material is organized into sections including ${topics}. Perfect for revision and concept clarity.`;
  }

  if (p.category === "books") {
    return `This book${p.brand ? ` by ${p.brand}` : ""} is a standard reference for UPSC preparation. It covers the complete syllabus with detailed explanations, diagrams, and practice questions. Essential reading for both Prelims and Mains.`;
  }

  if (p.category === "magazines") {
    return `This monthly magazine${p.brand ? ` from ${p.brand}` : ""} provides in-depth analysis of current affairs and contemporary issues relevant to UPSC. It covers government schemes, policies, and important developments across various sectors.`;
  }

  if (p.category === "current-affairs") {
    return `This current affairs compilation${p.brand ? ` by ${p.brand}` : ""} covers important national and international events. It includes ${totalItems} entries organized for easy revision. Essential for UPSC Prelims and Mains current affairs preparation.`;
  }

  return `This study material${p.brand ? ` from ${p.brand}` : ""} includes ${totalItems} resources covering important UPSC topics. Ideal for comprehensive preparation.`;
}

export function generateHowToUse(p: PDFMeta): string {
  const sections = getSections(p.resources);

  if (p.category === "test-series") {
    const sectionCount = sections.size;
    return `Plan to solve ${sectionCount > 1 ? "one section per week starting with the first topic" : "this test under timed conditions to simulate the actual exam"}. After completing each test, thoroughly review the solutions and note down mistakes. Track your progress across tests to identify weak areas. Re-attempt difficult questions after a gap of 2-3 weeks.`;
  }

  if (p.category === "notes") {
    return "Use these notes alongside your standard textbooks. First read the chapter from the textbook, then revise using these notes for quick recall. Mark important points and create your own shorthand. Revisit these notes weekly to reinforce retention.";
  }

  if (p.category === "books") {
    return "Read this book systematically chapter by chapter. Mark important sections and create notes for revision. For subjects like environment and geography, focus on diagrams and tables. Solve the practice questions at the end of each chapter.";
  }

  if (p.category === "magazines" || p.category === "current-affairs") {
    return "Read the magazine/compilation monthly to stay updated with current affairs. Mark issues relevant to GS papers. Create topic-wise notes from the material for revision before the exam. Focus on government schemes, reports, and policy changes.";
  }

  return "Go through the material systematically. Focus on understanding concepts rather than memorization. Revise periodically and practice answer writing using the knowledge gained.";
}

export function generateKeyTopics(p: PDFMeta): string[] {
  const sections = getSections(p.resources);
  const topics: string[] = [];

  if (p.category === "test-series") {
    for (const section of sections.keys()) {
      const topic = section
        .replace(/test|paper|set|section/gi, "")
        .trim();
      if (topic.length > 2) topics.push(topic);
    }
  }

  if (p.resources) {
    for (const r of p.resources.slice(0, 12)) {
      const name = r.name.replace(/PDF|pdf|download|free/gi, "").trim();
      if (name.length > 5 && !topics.includes(name)) {
        topics.push(name);
      }
    }
  }

  const generic = getGenericTopics(p.category, p.brand);
  return [...new Set([...topics, ...generic])].slice(0, 8);
}

function getGenericTopics(category: string, brand: string | null): string[] {
  const brandLower = brand?.toLowerCase() || "";

  if (category === "test-series") {
    const t = ["UPSC Prelims mock tests", "UPSC Mains practice papers", "answer writing practice"];
    if (brandLower.includes("vision")) t.unshift("Vision IAS test series analysis");
    if (brandLower.includes("forum")) t.unshift("Forum IAS test papers");
    if (brandLower.includes("insights")) t.unshift("Insights IAS mock tests");
    return t;
  }

  if (category === "notes") {
    const t = ["UPSC revision notes", "concept clarity material", "quick revision guides"];
    if (brandLower.includes("drishti")) t.unshift("Drishti IAS classroom notes");
    if (brandLower.includes("mk") || brandLower.includes("yadav")) t.unshift("MK Yadav handwritten notes");
    if (brandLower.includes("forum")) t.unshift("Forum IAS ethics notes");
    return t;
  }

  if (category === "books") {
    return ["UPSC reference books", "standard textbooks for civil services", "Prelims and Mains booklist"];
  }

  if (category === "magazines") {
    const t = ["monthly current affairs", "government schemes analysis", "policy developments"];
    if (brandLower.includes("yojana")) t.unshift("Yojana magazine analysis");
    if (brandLower.includes("kurukshetra")) t.unshift("Kurukshetra rural development");
    if (brandLower.includes("insights")) t.unshift("Insights Prime magazine");
    if (brandLower.includes("vision")) t.unshift("Vision IAS monthly compilation");
    return t;
  }

  if (category === "current-affairs") {
    return ["daily current affairs", "yearly current affairs compilation", "national and international events"];
  }

  return ["UPSC study material", "civil services preparation"];
}

export function generateFAQs(p: PDFMeta): Array<{ q: string; a: string }> {
  const brand = p.brand || "this material";
  const title = p.title;

  if (p.category === "test-series") {
    return [
      {
        q: `How many tests are included in ${title}?`,
        a: `This collection includes ${p.resources?.length || "multiple"} individual test papers. The tests are organized across different sections covering the complete UPSC syllabus.`,
      },
      {
        q: `Are solutions provided with ${brand} test series?`,
        a: `Yes, detailed solutions and explanations are provided for each test paper. This helps you understand the reasoning behind each answer and learn from your mistakes.`,
      },
      {
        q: `Is this ${title} suitable for both Prelims and Mains?`,
        a: `${p.resources?.some(r => r.section?.toLowerCase().includes("mains")) ? "Yes, it covers both Prelims and Mains papers." : "This test series focuses on specific papers. Check the section breakdown above to see which papers are included."}`,
      },
    ];
  }

  if (p.category === "notes") {
    return [
      {
        q: `Are these ${brand} notes sufficient for UPSC preparation?`,
        a: `These notes are excellent for revision and concept clarity, but should be used alongside standard textbooks and current affairs reading for comprehensive preparation.`,
      },
      {
        q: `What topics do these notes cover?`,
        a: `The notes cover ${Array.from(getSections(p.resources).keys()).slice(0, 3).join(", ")} and related areas. Each topic is explained in a concise manner suitable for quick revision.`,
      },
      {
        q: `Can I download these notes for offline study?`,
        a: `Yes, all resources in this collection are available for download. You can save them for offline study and revision.`,
      },
    ];
  }

  if (p.category === "books") {
    return [
      {
        q: `Is ${title} recommended for UPSC preparation?`,
        a: `Yes, ${title}${brand ? ` by ${brand}` : ""} is widely used by UPSC aspirants. It covers the essential topics required for both Prelims and Mains examination.`,
      },
      {
        q: `Which edition of this book is this?`,
        a: `Please check the file details above for edition and publication information. The PDF includes the complete content as published.`,
      },
      {
        q: `Should I read the full book or specific chapters?`,
        a: `It is recommended to read the full book at least once, then focus on specific chapters based on the UPSC syllabus and your preparation needs.`,
      },
    ];
  }

  if (p.category === "magazines" || p.category === "current-affairs") {
    return [
      {
        q: `How is ${title} useful for UPSC?`,
        a: `This compilation covers important current events and issues relevant to UPSC GS papers. It helps you stay updated with government schemes, policies, and international developments.`,
      },
      {
        q: `How should I use this for current affairs preparation?`,
        a: `Read it monthly and make topic-wise notes. Link the current affairs to static subjects in the syllabus. Focus on issues relevant to GS Paper 1, 2, and 3.`,
      },
      {
        q: `Is this available in both Hindi and English?`,
        a: `${p.resources?.some(r => r.language === "hi") ? "Yes, this compilation includes resources in both Hindi and English." : "This compilation is primarily in English. Look for the Hindi tag next to individual resources for Hindi-language content."}`,
      },
    ];
  }

  return [
    {
      q: `What is included in ${title}?`,
      a: `This collection includes UPSC study material${p.resources?.length ? ` with ${p.resources.length} individual resources` : ""}. Check the sections above for a complete breakdown.`,
    },
    {
      q: `Is this material free to download?`,
      a: `Yes, all resources in this collection are available for free download. Click the download button next to each resource to save it.`,
    },
  ];
}

export function generateStudyTips(p: PDFMeta): string[] {
  const totalItems = p.resources?.length || 0;

  if (p.category === "test-series") {
    const tips = [
      "Attempt tests under strict timed conditions to simulate the actual exam experience.",
      "Review each test thoroughly — analyze mistakes, not just scores.",
      "Create a mistake log and revisit it before the next test.",
    ];
    if (totalItems > 10) {
      tips.push(`With ${totalItems} tests available, create a schedule to attempt 1-2 tests per week.`);
    }
    return tips;
  }

  if (p.category === "notes") {
    return [
      "Use these notes for revision after completing each topic from standard textbooks.",
      "Create your own shorthand and margin notes for faster revision.",
      "Review these notes at least 3 times before the exam for maximum retention.",
    ];
  }

  if (p.category === "books") {
    return [
      "Read the book cover to cover once, then focus on weak areas.",
      "Create chapter-wise summaries for quick revision before the exam.",
      "Mark and revise important definitions, diagrams, and data points.",
    ];
  }

  if (p.category === "magazines" || p.category === "current-affairs") {
    return [
      "Set aside dedicated time each week to read current affairs compilations.",
      "Link current events to static syllabus topics for better retention.",
      "Practice writing concise notes on important issues — this helps in Mains answer writing.",
    ];
  }

  return [
    "Go through the material systematically.",
    "Revise periodically to reinforce learning.",
    "Use alongside answer writing practice for best results.",
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

import { connectDB } from "@/lib/mongodb";
import { PYQModel } from "@/models/pyq.model";
import groupedData from './cse-pyq-grouped.json';

export type PYQPaper = {
  title: string;
  url: string;
};

export type PYQCategoryData = {
  [category: string]: PYQPaper[];
};

export type CSEPYQ = {
  [year: string]: PYQCategoryData;
};

async function getDataFromDB(): Promise<CSEPYQ | null> {
  try {
    await connectDB();
    const papers = await PYQModel.find({}).lean();
    if (papers.length === 0) return null;

    const result: CSEPYQ = {};

    for (const paper of papers) {
      const year = String(paper.year);
      if (!result[year]) result[year] = {};
      if (!result[year][paper.category]) result[year][paper.category] = [];
      result[year][paper.category].push({
        title: paper.title,
        url: paper.url,
      });
    }

    return result;
  } catch {
    return null;
  }
}

function getDataFromJSON(): CSEPYQ {
  return groupedData as CSEPYQ;
}

function normalizeCategory(category: string) {
  const c = category.toLowerCase();

  if (c.includes("prelims") || c.includes("csat")) return "Prelims";
  if (c.includes("general studies")) return "Mains GS";
  if (c.includes("essay")) return "Mains Essay";
  if (c.includes("optional")) return "Optional Subjects";

  return category;
}

export async function getAllPYQYears(): Promise<string[]> {
  const data = await getDataFromDB();
  const source = data || getDataFromJSON();
  return Object.keys(source).sort((a, b) => Number(b) - Number(a));
}

export async function getPYQByYear(year: string): Promise<PYQCategoryData | null> {
  const data = await getDataFromDB();
  const source = data || getDataFromJSON();
  return source[year] || null;
}

export async function getFormattedYearData(year: string) {
  const pyqData = await getPYQByYear(year);
  if (!pyqData) return null;

  const papers = Object.entries(pyqData).flatMap(([category, items]) => {
    const normalized = normalizeCategory(category);

    return items.map(item => ({
      category: normalized,
      subject: item.title,
      paper: `${normalized} - ${item.title}`,
      pdfUrl: item.url,
      description: `${item.title} Official UPSC ${normalized} Question Paper`
    }));
  });

  return {
    year,
    description: `Download Official UPSC CSE ${year} Previous Year Question Papers for Prelims & Mains.`,
    papers
  };
}

import type { ContentPage } from "./index";

// Guides — longer-form educational content
import upscFullForm from "./upsc-full-form";
import upscSyllabus from "./upsc-syllabus";
import upscFreeMaterial from "./upsc-free-material";
import upscFullFormHindi from "./upsc-full-form-hindi";
import howToWriteAnswers from "./how-to-write-upsc-mains-answers";
import topperAnswerCopies from "./upsc-topper-answer-copies";
import upscSyllabusHindi from "./upsc-syllabus-hindi";
import upscFreeMaterialHindi from "./upsc-free-material-hindi";
import howToWriteAnswersHindi from "./how-to-write-upsc-mains-answers-hindi";

// Strategies — short, fact-dense, LLM-targeted pages
import strategies from "./strategies/registry";

type PageModule = { default: ContentPage };

const guides: Record<string, () => Promise<PageModule>> = {
  "upsc-full-form": () => Promise.resolve({ default: upscFullForm }),
  "upsc-syllabus": () => Promise.resolve({ default: upscSyllabus }),
  "upsc-free-material": () => Promise.resolve({ default: upscFreeMaterial }),
  "upsc-full-form-hindi": () => Promise.resolve({ default: upscFullFormHindi }),
  "how-to-write-upsc-mains-answers": () => Promise.resolve({ default: howToWriteAnswers }),
  "upsc-topper-answer-copies": () => Promise.resolve({ default: topperAnswerCopies }),
  "upsc-syllabus-hindi": () => Promise.resolve({ default: upscSyllabusHindi }),
  "upsc-free-material-hindi": () => Promise.resolve({ default: upscFreeMaterialHindi }),
  "how-to-write-upsc-mains-answers-hindi": () => Promise.resolve({ default: howToWriteAnswersHindi }),
};

const EN_TO_HI: Record<string, string> = {
  "upsc-full-form": "upsc-full-form-hindi",
  "upsc-syllabus": "upsc-syllabus-hindi",
  "upsc-free-material": "upsc-free-material-hindi",
  "how-to-write-upsc-mains-answers": "how-to-write-upsc-mains-answers-hindi",
};

export function getPage(slug: string): (() => Promise<PageModule>) | undefined {
  return guides[slug] || strategies[slug];
}

export function getAllSlugs(): string[] {
  return [...Object.keys(guides), ...Object.keys(strategies)];
}

export function getEnglishSlug(slug: string): string {
  // If it's a Hindi slug, map back to English
  for (const [en, hi] of Object.entries(EN_TO_HI)) {
    if (hi === slug) return en;
  }
  return slug;
}

export function getHindiSlug(slug: string): string | undefined {
  // If it's an English slug with a Hindi variant
  return EN_TO_HI[slug];
}

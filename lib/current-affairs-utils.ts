import { JUNE_2026, MAY_2026, type CAMonthlyContent } from "./current-affairs-content";

export const MONTHS: Record<string, CAMonthlyContent> = {
  "june-2026": JUNE_2026,
  "may-2026": MAY_2026,
};

export function getMonth(slug: string): CAMonthlyContent | null {
  return MONTHS[slug] ?? null;
}

export function getSlug(content: CAMonthlyContent): string {
  const m = content.month.toLowerCase();
  return `${m}-${content.year}`;
}

export function getCanonical(slug: string): string {
  return `https://upscprepnotes.in/current-affairs/${slug}`;
}

export function monthMeta(slug: string, content: CAMonthlyContent) {
  const totalTopics = content.sections.reduce((a, s) => a + s.items.length, 0);
  return {
    title: `Current Affairs ${content.month} ${content.year} – Latest Monthly Current Affairs for UPSC`,
    description: `Current affairs ${content.month.toLowerCase()} ${content.year} for UPSC preparation. ${content.sections.length} sections, ${totalTopics} topics across national news, international relations, economy, environment, science & tech, schemes, awards, sports. Includes interactive quiz, AI explanations, and free PDF download.`,
  };
}

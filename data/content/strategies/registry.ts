import type { ContentPage } from "../index";
import scoreGs1 from "./score-130-gs1";

const entries: Record<string, ContentPage> = {
  "how-to-score-130-plus-in-gs1": scoreGs1,
};

const strategyMap: Record<string, () => Promise<{ default: ContentPage }>> = {};
for (const [slug, page] of Object.entries(entries)) {
  strategyMap[slug] = () => Promise.resolve({ default: page });
}

export default strategyMap;

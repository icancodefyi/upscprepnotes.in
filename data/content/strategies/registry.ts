import type { ContentPage } from "../index";
import scoreGs1 from "./score-130-gs1";
import scoreGs2 from "./score-120-gs2";

const entries: Record<string, ContentPage> = {
  "how-to-score-130-plus-in-gs1": scoreGs1,
  "how-to-score-120-plus-in-gs2": scoreGs2,
};

const strategyMap: Record<string, () => Promise<{ default: ContentPage }>> = {};
for (const [slug, page] of Object.entries(entries)) {
  strategyMap[slug] = () => Promise.resolve({ default: page });
}

export default strategyMap;

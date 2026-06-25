import type { ContentPage } from "../index";
import scoreGs1 from "./score-130-gs1";
import scoreGs2 from "./score-120-gs2";
import scoreGs3 from "./score-120-gs3";
import scoreGs4 from "./score-100-gs4";
import scorePsir from "./score-300-psir";

const entries: Record<string, ContentPage> = {
  "how-to-score-130-plus-in-gs1": scoreGs1,
  "how-to-score-120-plus-in-gs2": scoreGs2,
  "how-to-score-120-plus-in-gs3": scoreGs3,
  "how-to-score-100-plus-in-gs4": scoreGs4,
  "how-to-score-300-plus-in-psir-optional": scorePsir,
};

const strategyMap: Record<string, () => Promise<{ default: ContentPage }>> = {};
for (const [slug, page] of Object.entries(entries)) {
  strategyMap[slug] = () => Promise.resolve({ default: page });
}

export default strategyMap;

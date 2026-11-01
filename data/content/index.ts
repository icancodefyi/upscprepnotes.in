export type ContentSection = {
  heading: string;
  body: string;
};

export type RelatedPage = {
  title: string;
  href: string;
  description: string;
};

export type ContentPage = {
  slug: string;
  title: string;
  description: string;
  lastUpdated: string; // ISO date string
  h1: string;
  intro: string;
  sections: ContentSection[];
  faq?: { q: string; a: string }[];
  lang?: "en" | "hi";
  relatedPages?: RelatedPage[];
  sources?: { label: string; url: string }[];
  noindex?: boolean;
  /** Strategy guides: which paper's live marks data to show. Text may use {{median}}, {{top10}}, {{best}}, {{atLeast:120}} etc. */
  paper?: "essay" | "gs1" | "gs2" | "gs3" | "gs4" | "psir";
  /** Guides that compare optionals: show the live optional table. Text may use {{optHighest}}, {{gsOptCorr}} etc. */
  dataset?: "optionals";
};



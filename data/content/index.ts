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
  ctaIntro?: string;
  ctaIntroBtn?: string;
  ctaMid?: string;
  ctaMidSub?: string;
  ctaMidBtn?: string;
  ctaFinal?: string;
  ctaFinalSub?: string;
  ctaFinalBtn?: string;
  relatedPages?: RelatedPage[];
};



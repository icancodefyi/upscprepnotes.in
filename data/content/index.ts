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
  ctaIntroHref?: string;
  ctaMid?: string;
  ctaMidSub?: string;
  ctaMidBtn?: string;
  ctaMidHref?: string;
  ctaFinal?: string;
  ctaFinalSub?: string;
  ctaFinalBtn?: string;
  ctaFinalHref?: string;
  relatedPages?: RelatedPage[];
  sources?: { label: string; url: string }[];
  /** Heading above the sources list. Defaults to "Data Sources". */
  sourcesTitle?: string;
  /** Store product slug for the sidebar promo. Defaults to the Answer Copies Compilation. */
  promoProduct?: string;
  noindex?: boolean;
  /** Share image and Article image, a path on this site (1200 x 630). */
  image?: string;
  imageAlt?: string;
  /** Named author for the Article markup. Defaults to the organisation. */
  author?: { name: string; url?: string };
  /** Text after the author name in the byline. Defaults to the marks-data line used on strategy guides. */
  byline?: string;
  /** First publication date (ISO). Defaults to lastUpdated. */
  datePublished?: string;
  /** For list-style articles: the entries, marked up as an ItemList. */
  itemList?: { name: string; url?: string }[];
};



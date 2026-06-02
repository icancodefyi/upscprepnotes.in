export type ContentSection = {
  heading: string;
  body: string;
};

export type ContentPage = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: ContentSection[];
  faq?: { q: string; a: string }[];
};

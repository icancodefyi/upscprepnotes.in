export type Booklet = {
  name: string;
  rank: number;
  year: number;
  slug: string;
  optional: string;
  total: number;
  src: string;
  papers: {
    essay: number;
    gs1: number;
    gs2: number;
    gs3: number;
    gs4: number;
    optional: number;
    interview: number;
  } | null;
};

export type Counts = {
  toppers: number;
  full: number;
  aspirants: number;
  freeCopies: number;
  optionals: number;
  resources: number;
  pyqs: number;
  pyqYears: number[];
};

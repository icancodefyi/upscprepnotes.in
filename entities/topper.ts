export interface Topper {
  firstName: string;
  lastName: string;

  rank: number;
  year: number;

  optionalSubject: string;

  marks: {
    gs1: number;
    gs2: number;
    gs3: number;
    gs4: number;

    essay: number;

    optional1: number;
    optional2: number;

    interview: number;
    written: number;
    total: number;
  };

  bio: string;
  strategy: string;

  slug: string;
  imageUrl: string;

  insights: string[];

  answerCopies: {
    gs1: string[];
    gs2: string[];
    gs3: string[];
    gs4: string[];
    essay: string[];
  };
}

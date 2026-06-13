export interface TopperMarks {
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
}

export interface TopperResources {
  essayLinks: string[];
  gs1Links: string[];
  gs2Links: string[];
  gs3Links: string[];
  gs4Links: string[];
}

export interface TopperImage {
  profileImage?: string;
  imageUrl?: string;
}

export interface TopperMetadata {
  migratedAt?: Date;
  enrichedAt?: Date;
  lastTriedAt?: Date;
}

export interface Topper {
  _id: string;
  firstName: string;
  lastName: string;
  rank: number;
  year: number;
  optionalSubject: string;
  marks: TopperMarks;
  bio?: string;
  strategy?: string;
  slug: string;
  ProfileImage?: string;
  insights: string[];
  answerCopies: {
    gs1: string[];
    gs2: string[];
    gs3: string[];
    gs4: string[];
    essay: string[];
  };
  resources: TopperResources;
  image: TopperImage;
  metadata: TopperMetadata;
  isFeatured: boolean;
  isIndexed: boolean;
  freeAnswerCopyUrl?: string;
  freeAnswerCopyUrls?: string[];
  createdAt: Date;
  updatedAt: Date;
}

/** Types and labels for study-material collections. Safe to import from client components (no database code). */

export type Resource = { name: string; downloadUrl: string; section?: string; language?: string };

export type Collection = {
  slug: string;
  title: string;
  description: string;
  category: string;
  brand: string;
  language: string;
  year: number | null;
  fileSize: string;
  pageCount: number;
  tags: string[];
  files: number;
  requests: number;
  hindi: boolean;
  updatedAt: string | null;
};

/** Folder stock colours from the brand, one per category. */
export const CATEGORY: Record<string, { label: string; short: string; tone: string; back: string; ink: string }> = {
  "test-series": { label: "Test series", short: "Test series", tone: "#DBE2FF", back: "#AFBEFF", ink: "#13238A" },
  notes: { label: "Notes", short: "Notes", tone: "#e3e8fb", back: "#b9c6f7", ink: "#172fa3" },
  books: { label: "Books", short: "Book", tone: "#FDE9C4", back: "#F2C878", ink: "#7a4b00" },
  magazines: { label: "Magazines", short: "Magazine", tone: "#EBE2FF", back: "#C5B3FF", ink: "#3b1d8f" },
  "current-affairs": { label: "Current affairs", short: "Current affairs", tone: "#FFD8CF", back: "#FFA894", ink: "#8a1f12" },
  optional: { label: "Optional subjects", short: "Optional", tone: "#FFE45C", back: "#EFC514", ink: "#5C4A00" },
  other: { label: "Resources", short: "Resource", tone: "#F4F5F9", back: "#D4D8E2", ink: "#3F4450" },
};

export const CATEGORY_ORDER = ["test-series", "notes", "books", "magazines", "current-affairs", "optional", "other"];

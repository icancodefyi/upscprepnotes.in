import { Inter } from "next/font/google";

/** One typeface for the whole brand: Inter, regular (400) and bold (700) only. */
const inter = Inter({ subsets: ["latin"], weight: ["400", "700"], variable: "--up-sans", display: "swap" });

export const brandFonts = inter.variable;

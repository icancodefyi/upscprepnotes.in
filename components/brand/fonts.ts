import { Funnel_Sans } from "next/font/google";

/** One typeface for the whole brand: Funnel Sans, regular (400) and bold (700) only. */
const face = Funnel_Sans({ subsets: ["latin"], weight: ["400", "700"], variable: "--up-sans", display: "swap" });

export const brandFonts = face.variable;

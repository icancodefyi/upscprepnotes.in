import { Funnel_Display, Geist, Geist_Mono } from "next/font/google";

const sans = Geist({ subsets: ["latin"], variable: "--up-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--up-mono" });
const display = Funnel_Display({ subsets: ["latin"], variable: "--up-display" });

/** Class names that expose the brand fonts as --up-sans / --up-mono / --up-display. */
export const brandFonts = `${sans.variable} ${mono.variable} ${display.variable}`;

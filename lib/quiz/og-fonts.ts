import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** The brand typeface (Funnel Sans) for preview images, so they match the site. */
export async function ogFonts() {
  const [regular, bold] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/FunnelSans-400.ttf")),
    readFile(join(process.cwd(), "assets/fonts/FunnelSans-700.ttf")),
  ]);
  return [
    { name: "Funnel Sans", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Funnel Sans", data: bold, weight: 700 as const, style: "normal" as const },
  ];
}

/** A Gilu still from public/quiz, as a data URL the image renderer can draw. */
export async function giluPng(pose: "celebrating" | "thinking" | "correct" | "hello" | "sorry") {
  const buf = await readFile(join(process.cwd(), `public/quiz/gilu-${pose}.png`));
  return `data:image/png;base64,${buf.toString("base64")}`;
}

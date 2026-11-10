/**
 * Exports every brand icon as a static asset, from the same React components the site uses,
 * so the files can never drift from the app. Writes /public/icons/<name>.svg and <name>.png.
 * Use them where inline SVG doesn't work: emails (Gmail strips SVG, so use the PNG), social
 * images, docs, Telegram posts.
 *
 *   pnpm icons:export
 */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { BRAND_ICON_NAMES, BrandIcon } from "../components/brand/icons";

const OUT = join(process.cwd(), "public", "icons");
const SIZE = 128; // PNG size in pixels; SVGs scale to anything.

/** Icons that take their colour from the surrounding text in the app need a fixed colour as a file. */
const COLOR: Record<string, string> = { check: "#1a8a4a", cross: "#d92f2f" };

function toSvg(markup: string, name: string): string {
  return markup
    .replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"')
    .replace(/ aria-hidden="true"/, "")
    .replace(/ style="[^"]*"/, "")
    .replace(/currentColor/g, COLOR[name] ?? "#1f3fd6");
}

async function main() {
  await mkdir(OUT, { recursive: true });
  for (const name of BRAND_ICON_NAMES) {
    const svg = toSvg(renderToStaticMarkup(createElement(BrandIcon, { name, size: SIZE })), name);
    await writeFile(join(OUT, `${name}.svg`), svg + "\n");
    await sharp(Buffer.from(svg), { density: 288 }).resize(SIZE, SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(join(OUT, `${name}.png`));
  }
  console.log(`Exported ${BRAND_ICON_NAMES.length} icons to public/icons (svg + png).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

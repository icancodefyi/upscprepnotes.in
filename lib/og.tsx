/**
 * Share images (1200×630) in the brand, drawn on demand with next/og.
 * Same template as the static images in public/og: mark and wordmark top left, a bold headline
 * with one highlighter swipe, one sentence beneath, the domain bottom left, one piece of art on the right.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { ReactNode } from "react";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = "image/png";

const INK = "#0b0c10";
const BLUE = "#1f3fd6";
const RED = "#ff4a3d";
const HL = "#ffe45c";
const MUTED = "#3f4450";
const FAINT = "#858a96";

type Font = { name: string; data: Buffer; weight: 400 | 700; style: "normal" };
let fonts: Promise<Font[]> | null = null;
/** Funnel Sans, with Noto Sans Devanagari for the Hindi guides. */
function loadFonts() {
  const faces: [string, string][] = [["Funnel Sans", "FunnelSans"], ["Noto Sans Devanagari", "NotoSansDevanagari"]];
  fonts ??= Promise.all(
    faces.flatMap(([name, file]) =>
      ([400, 700] as const).map(async (weight) => ({
        name,
        data: await readFile(join(process.cwd(), "assets/fonts", `${file}-${weight}.ttf`)),
        weight,
        style: "normal" as const,
      })),
    ),
  );
  return fonts;
}

/** An image the renderer can read: local files from public/ inlined, ImageKit asked for JPEG (it cannot read WebP). */
export async function ogSrc(src: string) {
  if (/^https?:\/\//.test(src)) return src.replace("f-auto", "f-jpg");
  const buf = await readFile(join(process.cwd(), "public", src.replace(/^\//, "")));
  const type = /\.png$/i.test(src) ? "png" : "jpeg";
  return `data:image/${type};base64,${buf.toString("base64")}`;
}

/** A lined answer sheet with blue pen lines, tape and a red-circled mark. */
export function OgSheet({ mark, out, caption }: { mark?: string; out?: string; caption?: string }) {
  const widths = [226, 238, 190, 232, 206, 150, 222, 120];
  return (
    <div style={{ display: "flex", position: "relative", width: 420, height: 520 }}>
      <div style={{ display: "flex", position: "absolute", left: 0, top: 30, width: 340, height: 450, background: "#fff", borderRadius: 7, transform: "rotate(-8deg)", boxShadow: "0 0 0 1px rgba(11,12,16,.07), 0 30px 50px -24px rgba(40,30,10,.3)" }} />
      <div style={{ display: "flex", position: "absolute", left: 60, top: 10, width: 340, height: 490, background: "#fff", borderRadius: 7, transform: "rotate(4deg)", boxShadow: "0 0 0 1px rgba(11,12,16,.07), 0 14px 28px -8px rgba(40,30,10,.16), 0 44px 70px -26px rgba(40,30,10,.34)" }}>
        <div style={{ display: "flex", position: "absolute", top: 0, bottom: 0, left: 56, width: 2, background: "rgba(255,74,61,.45)" }} />
        <div style={{ display: "flex", position: "absolute", left: 96, top: -18, width: 150, height: 44, background: "rgba(255,228,92,.85)", transform: "rotate(-3deg)" }} />
        {widths.map((w, i) => (
          <div key={i} style={{ display: "flex", position: "absolute", left: 84, top: 160 + i * 36, width: w, height: 6, borderRadius: 3, background: BLUE, opacity: 0.8 }} />
        ))}
        {mark && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "absolute", right: 22, top: 20, width: 112, height: 112, borderRadius: 56, border: `5px solid ${RED}`, color: "#d9342a", fontWeight: 700, fontSize: 26, lineHeight: 1, transform: "rotate(-8deg)" }}>
            {mark}
            {out && <span style={{ fontSize: 17, fontWeight: 400, marginTop: 4 }}>{out}</span>}
          </div>
        )}
        {caption && <div style={{ display: "flex", position: "absolute", left: 84, bottom: 20, fontSize: 19, color: FAINT }}>{caption}</div>}
      </div>
    </div>
  );
}

function Mark() {
  return (
    <svg width="46" height="46" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill={INK} />
      <path d="M10 6.5v19" stroke={RED} strokeWidth="2" strokeLinecap="round" />
      <path d="M14 11.5h9.5M14 16h9.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M14 20.5h6" stroke="#8fa2ff" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Headline words. Wrap the part to highlight in [square brackets] and the part to colour blue in {braces}:
 * "Ishita Kishore, [AIR 1]".
 */
function Headline({ text, size }: { text: string; size: number }) {
  const words: { w: string; hl: boolean; blue: boolean }[] = [];
  let hl = false;
  let blue = false;
  for (const raw of text.split(/ +/)) {
    let w = raw;
    const openHl = w.startsWith("[");
    const openBlue = w.startsWith("{");
    if (openHl || openBlue) w = w.slice(1);
    if (openHl) hl = true;
    if (openBlue) blue = true;
    const closeHl = /\][.,:?!]?$/.test(w);
    const closeBlue = /\}[.,:?!]?$/.test(w);
    w = w.replace(/[\]}]([.,:?!]?)$/, "$1");
    words.push({ w, hl, blue });
    if (closeHl) hl = false;
    if (closeBlue) blue = false;
  }
  return (
    <div style={{ display: "flex", flexWrap: "wrap", fontSize: size, lineHeight: 1.04, fontWeight: 700, letterSpacing: "-0.035em" }}>
      {words.map((x, i) => {
        const nextHl = words[i + 1]?.hl && x.hl;
        return (
          <span
            key={i}
            style={{
              color: x.blue ? BLUE : INK,
              paddingRight: nextHl ? size * 0.26 : 0,
              marginRight: nextHl ? 0 : size * 0.26,
              // The renderer throws on a style key whose value is undefined, so add the swipe only when needed.
              ...(x.hl ? { backgroundImage: `linear-gradient(transparent 58%, ${HL} 58%, ${HL} 92%, transparent 92%)` } : {}),
            }}
          >
            {x.w}
          </span>
        );
      })}
    </div>
  );
}

/** The marks card used on the right of most images: a sheet with a red margin and label/value rows. */
export function OgRows({ rows, note, tilt = 2 }: { rows: [string, string][]; note?: string; tilt?: number }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 400,
        padding: "30px 34px 26px 40px",
        background: "#fff",
        borderRadius: 14,
        borderLeft: `10px solid ${RED}`,
        transform: `rotate(${tilt}deg)`,
        boxShadow: "0 0 0 1px rgba(11,12,16,.07), 0 14px 28px -8px rgba(40,30,10,.16), 0 44px 70px -26px rgba(40,30,10,.34)",
      }}
    >
      {rows.map(([k, v], i) => (
        <div
          key={k}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            padding: "13px 0",
            borderBottom: i < rows.length - 1 ? "1.5px solid #e6e8f0" : "none",
            fontSize: 25,
          }}
        >
          <span style={{ color: INK, maxWidth: 230 }}>{k}</span>
          <span style={{ color: BLUE, fontWeight: 700, fontSize: 27 }}>{v}</span>
        </div>
      ))}
      {note && <div style={{ display: "flex", marginTop: 14, fontSize: 19, color: FAINT }}>{note}</div>}
    </div>
  );
}

/** A real cover image pinned like a printed sheet, with a yellow price sticker. */
export function OgCover({ src, price }: { src: string; price?: string }) {
  return (
    <div style={{ display: "flex", position: "relative", width: 330, height: 430 }}>
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img
        src={src}
        width={300}
        height={400}
        style={{
          position: "absolute",
          left: 10,
          top: 6,
          objectFit: "cover",
          borderRadius: 8,
          transform: "rotate(-3deg)",
          boxShadow: "0 0 0 1px rgba(11,12,16,.08), 0 30px 60px -20px rgba(40,30,10,.45)",
        }}
      />
      <div style={{ display: "flex", position: "absolute", left: 100, top: -14, width: 140, height: 40, background: "rgba(255,228,92,.85)", transform: "rotate(3deg)" }} />
      {price && (
        <div
          style={{
            display: "flex",
            position: "absolute",
            right: -16,
            bottom: 4,
            padding: "12px 26px",
            fontSize: 44,
            fontWeight: 700,
            color: "#5c4a00",
            background: HL,
            borderRadius: 12,
            transform: "rotate(-6deg)",
            boxShadow: "0 14px 24px -12px rgba(92,74,0,.6)",
          }}
        >
          {price}
        </div>
      )}
    </div>
  );
}

export async function ogImage({ title, sub, art, size }: { title: string; sub: string; art?: ReactNode; size?: number }) {
  const len = title.replace(/[[\]{}]/g, "").length;
  const fontSize = size ?? (len > 48 ? 58 : len > 34 ? 66 : 74);
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#fff", fontFamily: "Funnel Sans, Noto Sans Devanagari", color: INK, position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, position: "absolute", left: 72, top: 60, fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em" }}>
          <Mark />
          UPSCPrepNotes
        </div>
        <div style={{ display: "flex", flexDirection: "column", position: "absolute", left: 72, top: 168, width: art ? 610 : 1000 }}>
          <Headline text={title} size={fontSize} />
          <div style={{ display: "flex", marginTop: 28, fontSize: 29, lineHeight: 1.35, color: MUTED, letterSpacing: "-0.011em", width: art ? 560 : 900 }}>{sub}</div>
        </div>
        <div style={{ display: "flex", position: "absolute", left: 72, bottom: 54, fontSize: 24, color: FAINT }}>upscprepnotes.in</div>
        {art && <div style={{ display: "flex", position: "absolute", right: 64, top: 0, bottom: 0, alignItems: "center" }}>{art}</div>}
      </div>
    ),
    { ...OG_SIZE, fonts: await loadFonts() },
  );
}

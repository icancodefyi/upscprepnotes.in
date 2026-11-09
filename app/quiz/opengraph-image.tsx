import { ImageResponse } from "next/og";
import { giluPng, ogFonts } from "@/lib/quiz/og-fonts";

export const alt = "The daily UPSC Prelims quiz with Gilu";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const chip = (bg: string, fg: string) => ({
  background: bg, color: fg, fontSize: 30, fontWeight: 700, padding: "10px 22px", borderRadius: 999, display: "flex",
});

/** The preview shown when someone shares the plain /quiz link. */
export default async function Image() {
  const [fonts, src] = await Promise.all([ogFonts(), giluPng("correct")]);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#fff8d6", fontFamily: "Funnel Sans" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 72px", width: 760 }}>
          <div style={{ fontSize: 30, color: "#1f3fd6", fontWeight: 700 }}>UPSCPrepNotes</div>
          <div style={{ fontSize: 80, fontWeight: 700, color: "#0b0c10", lineHeight: 1.02, marginTop: 14, letterSpacing: -2 }}>The daily UPSC quiz</div>
          <div style={{ fontSize: 34, color: "#3f4450", marginTop: 22, lineHeight: 1.35 }}>Five real Prelims questions a day, marked the exam way. Gilu explains every trap.</div>
          <div style={{ display: "flex", gap: 12, marginTop: 30 }}>
            <div style={chip("#eafaf0", "#1a8a4a")}>+2 right</div>
            <div style={chip("#fff1ef", "#c42b22")}>-0.66 wrong</div>
            <div style={chip("#ffffff", "#3f4450")}>0 skipped</div>
          </div>
        </div>
        <img src={src} alt="" width={420} height={462} style={{ position: "absolute", right: 30, top: 84 }} />
      </div>
    ),
    { ...size, fonts },
  );
}

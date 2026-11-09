import { ImageResponse } from "next/og";
import { parseShareCode, scoreText } from "@/lib/quiz/share";
import { giluPng, ogFonts } from "@/lib/quiz/og-fonts";

export const alt = "A score on the daily UPSC Prelims quiz";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const chip = (bg: string, fg: string) => ({
  background: bg, color: fg, fontSize: 28, fontWeight: 700, padding: "10px 22px", borderRadius: 999, display: "flex",
});

/** The preview WhatsApp and Telegram show when someone shares "beat my score". */
export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const r = parseShareCode(code);
  const [fonts, src] = await Promise.all([ogFonts(), giluPng(r && r.score >= 4 ? "celebrating" : "thinking")]);
  const score = r ? scoreText(r.score, "-") : "?";
  const scoreColor = !r ? "#0b0c10" : r.score > 0 ? "#1a8a4a" : r.score < 0 ? "#c42b22" : "#0b0c10";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#f4f5f9", fontFamily: "Funnel Sans" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 140, background: "#1f3fd6", display: "flex", alignItems: "center", padding: "0 64px" }}>
          <div style={{ color: "#fff", fontSize: 48, fontWeight: 700 }}>Daily UPSC quiz</div>
          <div style={{ color: "#c6d1ff", fontSize: 28, marginLeft: 24 }}>Real Prelims questions, exam marking</div>
        </div>
        <div style={{ position: "absolute", top: 176, left: 64, width: 700, height: 370, background: "#fff", borderRadius: 32, display: "flex", flexDirection: "column", padding: "34px 44px", border: "2px solid #e3e6ee" }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 30, color: "#3f4450" }}>
            <div>{r ? "A friend scored" : "Five real UPSC questions a day"}</div>
            {r && r.streak > 1 ? <div style={{ ...chip("#fff3e6", "#c2410c"), fontSize: 24, padding: "6px 16px", marginLeft: 16 }}>{`Day ${r.streak} streak`}</div> : null}
          </div>
          <div style={{ fontSize: 140, fontWeight: 700, color: scoreColor, lineHeight: 1, marginTop: 8, letterSpacing: -4 }}>{score}</div>
          <div style={{ fontSize: 30, color: "#5f6571", marginTop: 6 }}>out of 10</div>
          {r ? (
            <div style={{ display: "flex", marginTop: 22, gap: 12 }}>
              <div style={chip("#eafaf0", "#1a8a4a")}>{`${r.right} right`}</div>
              <div style={chip("#fff1ef", "#c42b22")}>{`${r.wrong} wrong`}</div>
              <div style={chip("#eef0f4", "#3f4450")}>{`${r.skipped} skipped`}</div>
            </div>
          ) : null}
        </div>
        <img src={src} alt="" width={380} height={418} style={{ position: "absolute", right: 40, top: 160 }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 66, background: "#ffe45c", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 64px" }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#0b0c10" }}>Can you beat it?</div>
          <div style={{ fontSize: 28, color: "#0b0c10" }}>upscprepnotes.in/quiz</div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}

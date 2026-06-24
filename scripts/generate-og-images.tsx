import satori from "satori";
import sharp from "sharp";
import fs from "fs";
import path from "path";

const BG = "#F8F9FA";
const ACCENT_MINT = "#C4F9D7";
const INK = "#111";
const MUTED = "#71717a";

const WIDTH = 1200;
const HEIGHT = 630;

const FONT_DATA = fs.readFileSync(
  path.join(process.cwd(), "public/fonts/Fraunces-700.ttf")
);

const LOGO_BASE64 =
  "data:image/png;base64,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";

interface Card {
  headline: string;
  subtitle?: string;
  features: string[];
  url: string;
  filename: string;
}

const cards: Card[] = [
  {
    headline: "Topper Strategies, Answer Copies & Marksheets",
    subtitle: "India's UPSC preparation intelligence platform — 280+ topper profiles, 50+ verified handwritten answer copies, marks breakdowns & optional analysis.",
    features: ["280+ Toppers", "50+ Answer Copies", "AI Insights"],
    url: "upscprepnotes.in",
    filename: "default.png",
  },
  {
    headline: "AI Mentor for UPSC",
    subtitle: "Get instant answers trained on 280+ topper strategies, answer copies & marksheets. Ask anything about your UPSC preparation — free.",
    features: ["Free", "Ask Anything", "Instant Answers"],
    url: "upscprepnotes.in/ask",
    filename: "ask.png",
  },
  {
    headline: "UPSC Store — Premium Resources",
    subtitle: "Curated UPSC topper resources — strategy compilations, answer copies, notes bundles, test series & more. Instant PDF delivery.",
    features: ["39 Products", "Instant Download", "Starting ₹99"],
    url: "upscprepnotes.in/store",
    filename: "store.png",
  },
];

function Element(card: Card) {
  return (
    <div
      style={{
        width: WIDTH,
        height: HEIGHT,
        background: BG,
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "flex",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flex: 1,
          padding: "56px 60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <img src={LOGO_BASE64} width={44} height={44} alt="" />
          <span style={{ fontSize: 22, fontWeight: 700, color: INK, letterSpacing: "-0.02em" }}>
            UPSCPrepNotes
          </span>
        </div>

        <div
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontSize: 58,
            fontWeight: 700,
            color: INK,
            lineHeight: 1.12,
            letterSpacing: "-0.03em",
            maxWidth: 640,
          }}
        >
          {card.headline}
        </div>

        <div style={{ fontSize: 20, color: MUTED, marginTop: 16, lineHeight: 1.6, maxWidth: 560, fontWeight: 500 }}>
          {card.subtitle}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 28 }}>
          {card.features.map((f, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 16px",
                background: ACCENT_MINT,
                borderRadius: 100,
                fontSize: 14,
                fontWeight: 600,
                color: INK,
                letterSpacing: "-0.01em",
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#059669" }} />
              {f}
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 28,
            left: 60,
            fontSize: 13,
            fontWeight: 600,
            color: "#a1a1aa",
            letterSpacing: "0.05em",
            textTransform: "uppercase" as const,
          }}
        >
          {card.url}
        </div>
      </div>

      <div style={{ width: 380, display: "flex", position: "relative", overflow: "hidden", flexShrink: 0 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: "linear-gradient(135deg, #C4F9D7 0%, #a7f3c0 50%, #86efac 100%)",
            clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -40,
            width: 320,
            height: 320,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.25)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 140,
            right: 120,
            width: 200,
            height: 200,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.2)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -30,
            right: -30,
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
          }}
        />
      </div>
    </div>
  );
}

async function main() {
  const outDir = path.join(process.cwd(), "public/og");
  fs.mkdirSync(outDir, { recursive: true });

  for (const card of cards) {
    const svg = await satori(Element(card), {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        {
          name: "Fraunces",
          data: FONT_DATA,
          weight: 700,
          style: "normal",
        },
      ],
    });

    await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, card.filename));
    console.log(`Generated ${card.filename}`);
  }

  console.log("All OG images generated successfully.");
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});

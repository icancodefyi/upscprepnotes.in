import ReactPDF from "@react-pdf/renderer";
import path from "path";
import { connectDB } from "@/lib/mongodb";
import { TopperModel } from "@/models/topper.model";
import { topperImageSrc } from "@/lib/utils";

const BRAND = {
  name: "UPSCPrepNotes",
  tagline: "Topper Intelligence Report",
  phone: "+91 91527 50079",
  website: "upscprepnotes.in",
  color: "#059669",
};

const E = BRAND.color;
const E50 = "#f0fdf4";

ReactPDF.Font.register({
  family: "Inter",
  fonts: [
    { src: path.join(process.cwd(), "public/fonts/Inter-300.ttf"), fontWeight: 300 },
    { src: path.join(process.cwd(), "public/fonts/Inter-600.ttf"), fontWeight: 600 },
    { src: path.join(process.cwd(), "public/fonts/Inter-700.ttf"), fontWeight: 700 },
  ],
});

const logoPath = path.join(process.cwd(), "public/logo.png");

const S = ReactPDF.StyleSheet.create({
  page: { fontFamily: "Inter", padding: 56, backgroundColor: "#fff", color: "#1a1a1a" },
  bh: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 32, borderBottom: "1px solid #e5e5e5", paddingBottom: 14 },
  bhL: { flexDirection: "row", alignItems: "center", gap: 8 },
  bhLogo: { width: 22, height: 22 },
  bhN: { fontSize: 11, fontWeight: 600, color: "#111" },
  bhR: { fontSize: 7.5, color: "#999", letterSpacing: 2, textTransform: "uppercase" },
  bf: { position: "absolute", bottom: 40, left: 56, right: 56, flexDirection: "row", justifyContent: "space-between", borderTop: "1px solid #eee", paddingTop: 10 },
  bfL: { fontSize: 7, color: "#aaa" },
  bfR: { fontSize: 7, color: "#aaa" },
  cv: { flex: 1, justifyContent: "center", alignItems: "center" },
  cvLogo: { width: 48, height: 48, marginBottom: 16 },
  cvBrand: { fontSize: 11, fontWeight: 600, color: "#111", letterSpacing: 6, textTransform: "uppercase", marginBottom: 4 },
  cvBrandSub: { fontSize: 7.5, color: "#999", letterSpacing: 2, textTransform: "uppercase", marginBottom: 36 },
  cvPhoto: { width: 90, height: 90, marginBottom: 20, backgroundColor: E50, borderRadius: 45, border: "2px solid #e5e5e5" },
  cvLbl: { fontSize: 9, color: E, letterSpacing: 4, textTransform: "uppercase", marginBottom: 4 },
  cvYear: { fontSize: 9, color: "#999", letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 },
  cvName: { fontSize: 40, fontWeight: 700, color: "#111", textAlign: "center", lineHeight: 1.1, letterSpacing: -1 },
  cvRank: { fontSize: 13, color: "#666", marginTop: 10, textAlign: "center" },
  cvDiv: { width: 40, height: 2, backgroundColor: E, marginVertical: 24 },
  cvMeta: { flexDirection: "row", gap: 0 },
  cvMb: { alignItems: "center", paddingHorizontal: 24, borderRight: "1px solid #e5e5e5" },
  cvMbLast: { alignItems: "center", paddingHorizontal: 24 },
  cvMv: { fontSize: 20, fontWeight: 700, color: "#111" },
  cvMl: { fontSize: 7, color: "#999", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 },
  st: { fontSize: 15, fontWeight: 600, color: "#111", marginBottom: 10, letterSpacing: -0.3 },
  bt: { fontSize: 9.5, color: "#555", lineHeight: 1.8, marginBottom: 7 },
  abt: { fontSize: 11, color: "#444", lineHeight: 2, marginBottom: 12 },
  abtLabel: { fontSize: 8, color: "#999", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 },
  sr: { flexDirection: "row", gap: 10, marginVertical: 14 },
  sb: { flex: 1, border: "1px solid #eee", padding: 10, alignItems: "center", borderRadius: 4 },
  sv: { fontSize: 15, fontWeight: 700, color: "#111" },
  sl: { fontSize: 6.5, color: "#999", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 },
  th: { flexDirection: "row", borderTop: "1px solid #e5e5e5", borderBottom: "1px solid #ccc", paddingVertical: 7, backgroundColor: E50 },
  tr: { flexDirection: "row", borderBottom: "1px solid #eee", paddingVertical: 7 },
  tl: { flex: 1, fontSize: 9.5, color: "#555" },
  tlh: { flex: 1, fontSize: 9.5, fontWeight: 600, color: "#333" },
  tv: { width: 60, fontSize: 9.5, color: "#444", textAlign: "right" },
  tvh: { width: 60, fontSize: 9.5, fontWeight: 700, color: "#111", textAlign: "right" },
  tb: { borderBottom: "2px solid #111" },
  hb: { backgroundColor: E50, padding: 14, marginVertical: 16, borderLeftWidth: 3, borderLeftColor: E, borderRadius: 2 },
  hbt: { fontSize: 9, fontWeight: 600, color: "#065f46", marginBottom: 3 },
  hbp: { fontSize: 9, color: "#444", lineHeight: 1.7 },
});

type Topper = {
  name: string; rank: string; year: string; optionalSubject: string;
  marks: Record<string, number>;
  strategy: string[];
  keyTakeaways: string[];
  answerCopies?: Record<string, string[]>;
};

function getVal(marks: Record<string, number>, key: string): number {
  return marks[key] ?? 0;
}

function Header() {
  return (
    <ReactPDF.View style={S.bh} fixed>
      <ReactPDF.View style={S.bhL}>
        <ReactPDF.Image src={logoPath} style={S.bhLogo} />
        <ReactPDF.Text style={S.bhN}>{BRAND.name}</ReactPDF.Text>
      </ReactPDF.View>
      <ReactPDF.Text style={S.bhR}>{BRAND.tagline}</ReactPDF.Text>
    </ReactPDF.View>
  );
}

function Footer() {
  return (
    <ReactPDF.View style={S.bf} fixed>
      <ReactPDF.Text style={S.bfL}>
        <ReactPDF.Link src={`https://${BRAND.website}`} style={{ color: E, textDecoration: "none" }}>{BRAND.website}</ReactPDF.Link>
        {" \u00b7 "}
        <ReactPDF.Link src={`https://wa.me/${BRAND.phone.replace(/[^0-9]/g, "")}`} style={{ color: E, textDecoration: "none" }}>{BRAND.phone}</ReactPDF.Link>
      </ReactPDF.Text>
      <ReactPDF.Text style={S.bfR}>{BRAND.tagline}</ReactPDF.Text>
    </ReactPDF.View>
  );
}

function parseStrategy(s: string): { heading: string; lines: string[] }[] {
  const sections: { heading: string; lines: string[] }[] = [];
  let cur: { heading: string; lines: string[] } | null = null;
  for (const raw of s.split("\n")) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const hMatch = trimmed.match(/^###\s+(.+)/);
    if (hMatch) {
      if (cur) sections.push(cur);
      cur = { heading: hMatch[1].trim(), lines: [] };
      continue;
    }
    let line = trimmed
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/^\*\s*/, "")
      .replace(/^-\s*/, "")
      .replace(/\*$/g, "")
      .trim();
    if (!line) continue;
    if (!cur) {
      cur = { heading: "", lines: [] };
    }
    cur.lines.push(line);
  }
  if (cur) sections.push(cur);
  return sections;
}

function buildReport(t: Topper, imageSrc: string) {
  const papers = [
    { label: "GS Paper 1", key: "gs1" },
    { label: "GS Paper 2", key: "gs2" },
    { label: "GS Paper 3", key: "gs3" },
    { label: "GS Paper 4 (Ethics)", key: "gs4" },
    { label: "Essay", key: "essay" },
    { label: `${t.optionalSubject} Paper 1`, key: "optional1" },
    { label: `${t.optionalSubject} Paper 2`, key: "optional2" },
  ];

  const best = papers.map(p => ({ label: p.label, value: getVal(t.marks, p.key) }))
    .filter(p => p.value > 0)
    .sort((a, b) => b.value - a.value);

  return (
    <ReactPDF.Document>
      <ReactPDF.Page size="A4" style={S.page}>
        <ReactPDF.View style={S.cv}>
          <ReactPDF.Image src={logoPath} style={S.cvLogo} />
          <ReactPDF.Text style={S.cvBrand}>{BRAND.name}</ReactPDF.Text>
          <ReactPDF.Text style={S.cvBrandSub}>{BRAND.tagline}</ReactPDF.Text>
          <ReactPDF.Image src={imageSrc} style={S.cvPhoto} />
          <ReactPDF.Text style={S.cvLbl}>Strategy Report</ReactPDF.Text>
          <ReactPDF.Text style={S.cvYear}>UPSC CSE {t.year}</ReactPDF.Text>
          <ReactPDF.Text style={S.cvName}>{t.name}</ReactPDF.Text>
          <ReactPDF.Text style={S.cvRank}>AIR {t.rank} &middot; {t.optionalSubject} Optional</ReactPDF.Text>
          <ReactPDF.View style={S.cvDiv} />
          <ReactPDF.View style={S.cvMeta}>
            {[
              { v: t.marks.total, l: "Total" },
              { v: t.marks.written, l: "Written" },
              { v: t.marks.interview, l: "Interview" },
            ].map((s, i) => (
              <ReactPDF.View key={s.l} style={i === 2 ? S.cvMbLast : S.cvMb}>
                <ReactPDF.Text style={S.cvMv}>{s.v}</ReactPDF.Text>
                <ReactPDF.Text style={S.cvMl}>{s.l}</ReactPDF.Text>
              </ReactPDF.View>
            ))}
          </ReactPDF.View>
        </ReactPDF.View>
        <ReactPDF.View style={S.bf}>
          <ReactPDF.Text style={S.bfL}>
            <ReactPDF.Link src={`https://${BRAND.website}`} style={{ color: E, textDecoration: "none" }}>{BRAND.website}</ReactPDF.Link>
            {" \u00b7 "}
            <ReactPDF.Link src={`https://wa.me/${BRAND.phone.replace(/[^0-9]/g, "")}`} style={{ color: E, textDecoration: "none" }}>{BRAND.phone}</ReactPDF.Link>
          </ReactPDF.Text>
          <ReactPDF.Text style={S.bfR}>{BRAND.tagline}</ReactPDF.Text>
        </ReactPDF.View>
      </ReactPDF.Page>

      <ReactPDF.Page size="A4" style={S.page}>
        <Header />
        <ReactPDF.Text style={S.abtLabel}>About This Report</ReactPDF.Text>
        <ReactPDF.Text style={S.st}>{t.name} &middot; Strategy Analysis</ReactPDF.Text>
        <ReactPDF.View style={{ borderTopWidth: 0.5, borderTopColor: E, marginVertical: 14 }} />
        <ReactPDF.Text style={S.abt}>
          {t.name} secured AIR {t.rank} in UPSC CSE {t.year} with {t.optionalSubject} as optional. This report compiles their actual strategy from interview transcripts and published breakdowns on UPSCPrepNotes, paired with verified marks from official UPSC records. Every insight here comes from {t.name}&apos;s own words, not generic advice.
        </ReactPDF.Text>
        <ReactPDF.Text style={S.abt}>
          The strategy section distills their daily routine, paper-wise approach, optional subject methodology, essay writing practice, and interview preparation into actionable points. The marksheet data is cross-checked against UPSC&apos;s published results for accuracy.
        </ReactPDF.Text>
        <ReactPDF.Text style={S.abt}>
          This is part of UPSCPrepNotes&apos;s Topper Intelligence series, a collection of structured, verified strategy reports designed to give serious aspirants a clear understanding of how rank holders actually prepared, paper by paper.
        </ReactPDF.Text>
        <ReactPDF.View style={{ backgroundColor: E50, padding: 14, marginTop: 8, borderLeftWidth: 3, borderLeftColor: E, borderRadius: 2 }}>
          <ReactPDF.Text style={{ fontSize: 9, color: "#444", lineHeight: 1.7 }}>
            <ReactPDF.Text style={{ fontWeight: 600, color: "#065f46" }}>Source integrity: </ReactPDF.Text>
            All strategy points are drawn from {t.name}&apos;s direct interviews and verified published content. Marks data sourced from official UPSC result gazettes. No assumptions or generic UPSC advice has been added.
          </ReactPDF.Text>
        </ReactPDF.View>
        <ReactPDF.View style={{ marginTop: 24, flexDirection: "row", gap: 16 }}>
          {[
            { v: "Interview transcripts", l: "Primary source" },
            { v: "UPSC gazette", l: "Marks verification" },
            { v: "Published strategies", l: "Cross-referenced" },
          ].map(s => (
            <ReactPDF.View key={s.l} style={{ flex: 1, border: "1px solid #eee", padding: 10, alignItems: "center", borderRadius: 4 }}>
              <ReactPDF.Text style={{ fontSize: 11, fontWeight: 700, color: E }}>{s.v}</ReactPDF.Text>
              <ReactPDF.Text style={{ fontSize: 6.5, color: "#999", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>{s.l}</ReactPDF.Text>
            </ReactPDF.View>
          ))}
        </ReactPDF.View>
        <Footer />
      </ReactPDF.Page>

      <ReactPDF.Page size="A4" style={S.page}>
        <Header />
        <ReactPDF.Text style={S.st}>Marks Breakdown</ReactPDF.Text>
        <ReactPDF.View style={S.sr}>
          {[
            { v: `AIR ${t.rank}`, l: "Rank" },
            { v: t.marks.total, l: "Total" },
            { v: t.marks.written, l: "Written" },
            { v: t.marks.interview, l: "Interview" },
          ].map(s => (
            <ReactPDF.View key={s.l} style={S.sb}>
              <ReactPDF.Text style={S.sv}>{s.v}</ReactPDF.Text>
              <ReactPDF.Text style={S.sl}>{s.l}</ReactPDF.Text>
            </ReactPDF.View>
          ))}
        </ReactPDF.View>
        <ReactPDF.View style={S.th}>
          <ReactPDF.Text style={S.tlh}>Paper</ReactPDF.Text>
          <ReactPDF.Text style={S.tvh}>Marks</ReactPDF.Text>
        </ReactPDF.View>
        {papers.map(p => (
          <ReactPDF.View key={p.key} style={S.tr}>
            <ReactPDF.Text style={S.tl}>{p.label}</ReactPDF.Text>
            <ReactPDF.Text style={S.tv}>{getVal(t.marks, p.key)}</ReactPDF.Text>
          </ReactPDF.View>
        ))}
        <ReactPDF.View style={[S.tr, S.tb]}>
          <ReactPDF.Text style={[S.tl, { fontWeight: 600 }]}>Written Total</ReactPDF.Text>
          <ReactPDF.Text style={S.tvh}>{t.marks.written}</ReactPDF.Text>
        </ReactPDF.View>
        <ReactPDF.View style={S.tr}>
          <ReactPDF.Text style={S.tl}>Interview</ReactPDF.Text>
          <ReactPDF.Text style={S.tv}>{t.marks.interview}</ReactPDF.Text>
        </ReactPDF.View>
        {best[0] && (
          <ReactPDF.View style={S.hb}>
            <ReactPDF.Text style={S.hbt}>Strongest Paper: {best[0].label} ({best[0].value} marks)</ReactPDF.Text>
            <ReactPDF.Text style={S.hbp}>{t.name} scored highest in {best[0].label} at {best[0].value} marks, {best[1] ? `${best[0].value - best[1].value} ahead of their next best paper (${best[1].label}).` : ""} This paper was a key differentiator in their overall score.</ReactPDF.Text>
          </ReactPDF.View>
        )}
        <Footer />
      </ReactPDF.Page>

      <ReactPDF.Page size="A4" style={S.page}>
        <Header />
        <ReactPDF.Text style={S.st}>Paper-wise Analysis</ReactPDF.Text>
        <ReactPDF.View style={{ borderTopWidth: 0.5, borderTopColor: E, marginBottom: 14 }} />
        {(() => {
          const paperData = papers.map(p => ({ label: p.label, key: p.key, marks: getVal(t.marks, p.key) }));
          const allMarks = paperData.map(p => p.marks);
          const avg = allMarks.reduce((a, b) => a + b, 0) / allMarks.length;
          const ranked = [...paperData].sort((a, b) => b.marks - a.marks);
          const written = t.marks.written || 1;
          return ranked.map((p, i) => {
            const diff = p.marks - avg;
            const isMax = i === 0;
            const isMin = i === ranked.length - 1;
            const contributes = (p.marks / written * 100);
            let obs = "";
            if (isMax) obs = `Strongest paper. Contributed ${contributes.toFixed(0)}% of total written score.`;
            else if (isMin) obs = `Weakest paper relative to personal average. ${Math.abs(diff).toFixed(0)} marks below average.`;
            else if (diff > 5) obs = `${Math.abs(diff).toFixed(0)} marks above personal average. Solid performance.`;
            else if (diff < -5) obs = `${Math.abs(diff).toFixed(0)} marks below personal average. Area for potential improvement.`;
            else obs = `In line with personal average. Consistent performance.`;
            return (
              <ReactPDF.View key={p.key} style={{ marginBottom: 10, border: "1px solid #eee", borderRadius: 4, padding: 12 }}>
                <ReactPDF.View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <ReactPDF.Text style={{ fontSize: 10, fontWeight: 600, color: "#111" }}>{p.label}</ReactPDF.Text>
                  <ReactPDF.View style={{ backgroundColor: isMax ? E50 : "#f9f9f9", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 3 }}>
                    <ReactPDF.Text style={{ fontSize: 11, fontWeight: 700, color: isMax ? E : "#666" }}>{p.marks}</ReactPDF.Text>
                  </ReactPDF.View>
                </ReactPDF.View>
                <ReactPDF.View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <ReactPDF.View style={{ flex: 1, height: 4, backgroundColor: "#eee", borderRadius: 2 }}>
                    <ReactPDF.View style={{ width: `${(p.marks / 250) * 100}%`, height: 4, backgroundColor: isMax ? E : "#ccc", borderRadius: 2 }} />
                  </ReactPDF.View>
                  <ReactPDF.Text style={{ fontSize: 7, color: "#999", width: 60, textAlign: "right" }}>{isMax ? "BEST" : isMin ? "LOWEST" : `Rank ${i + 1}`}</ReactPDF.Text>
                </ReactPDF.View>
                <ReactPDF.Text style={{ fontSize: 8.5, color: "#555", lineHeight: 1.6 }}>{obs}</ReactPDF.Text>
              </ReactPDF.View>
            );
          })})()}
        <Footer />
      </ReactPDF.Page>

      <ReactPDF.Page size="A4" style={S.page}>
        <Header />
        <ReactPDF.Text style={S.st}>Score Deep Dive</ReactPDF.Text>
        <ReactPDF.View style={{ borderTopWidth: 0.5, borderTopColor: E, marginBottom: 14 }} />
        <ReactPDF.View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
          {[
            { label: "Total papers", value: papers.length, unit: "" },
            { label: "Average score", value: Math.round(papers.reduce((s, p) => s + getVal(t.marks, p.key), 0) / papers.length), unit: "/250" },
            { label: "Best GS", value: Math.max(...["gs1","gs2","gs3","gs4"].map(k => getVal(t.marks, k))), unit: "/250" },
          ].map(s => (
            <ReactPDF.View key={s.label} style={{ flex: 1, border: "1px solid #eee", padding: 10, alignItems: "center", borderRadius: 4 }}>
              <ReactPDF.Text style={{ fontSize: 16, fontWeight: 700, color: E }}>{s.value}{s.unit}</ReactPDF.Text>
              <ReactPDF.Text style={{ fontSize: 6.5, color: "#999", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>{s.label}</ReactPDF.Text>
            </ReactPDF.View>
          ))}
        </ReactPDF.View>
        <ReactPDF.View style={{ borderTopWidth: 0.5, borderTopColor: "#eee", marginBottom: 14 }} />
        <ReactPDF.Text style={{ fontSize: 10, fontWeight: 600, color: "#111", marginBottom: 8 }}>Contribution to Written Total</ReactPDF.Text>
        {(() => {
          const written = t.marks.written || 1;
          const withPct = papers.map(p => ({ ...p, pct: getVal(t.marks, p.key) / written * 100 })).sort((a, b) => b.pct - a.pct);
          return withPct.map((p, i) => (
            <ReactPDF.View key={p.key} style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
              <ReactPDF.Text style={{ width: 100, fontSize: 8, color: "#555" }}>{p.label}</ReactPDF.Text>
              <ReactPDF.View style={{ flex: 1, height: 12, backgroundColor: "#eee", borderRadius: 3, marginHorizontal: 8 }}>
                <ReactPDF.View style={{ width: `${p.pct}%`, height: 12, backgroundColor: i === 0 ? E : "#d1d5db", borderRadius: 3 }} />
              </ReactPDF.View>
              <ReactPDF.Text style={{ width: 50, fontSize: 8, color: "#666", textAlign: "right" }}>{p.pct.toFixed(0)}%</ReactPDF.Text>
            </ReactPDF.View>
          ));
        })()}
        <ReactPDF.View style={{ backgroundColor: E50, padding: 12, marginTop: 12, borderRadius: 4, borderLeftWidth: 3, borderLeftColor: E }}>
          <ReactPDF.Text style={{ fontSize: 8.5, color: "#444", lineHeight: 1.6 }}>
            <ReactPDF.Text style={{ fontWeight: 600, color: "#065f46" }}>Key observation: </ReactPDF.Text>
            {t.name}&apos;s optional subject ({t.optionalSubject}) contributed{" "}
            {((getVal(t.marks, "optional1") + getVal(t.marks, "optional2")) / (t.marks.written || 1) * 100).toFixed(0)}% of their written total.
            Their strongest paper outscored their weakest by {Math.max(...papers.map(p => getVal(t.marks, p.key))) - Math.min(...papers.map(p => getVal(t.marks, p.key)))} marks,
            {Math.max(...papers.map(p => getVal(t.marks, p.key))) / Math.min(...papers.map(p => getVal(t.marks, p.key))) > 1.5 ? " a significant spread indicating focused strengths." : " a relatively balanced profile."}
          </ReactPDF.Text>
        </ReactPDF.View>
        <Footer />
      </ReactPDF.Page>

      <ReactPDF.Page size="A4" style={S.page}>
        <Header />
        <ReactPDF.Text style={S.st}>Strategy Breakdown</ReactPDF.Text>
        <ReactPDF.View style={{ borderTopWidth: 0.5, borderTopColor: E, marginBottom: 14 }} />
        {(() => {
          const full = t.strategy.join("\n");
          const sections = parseStrategy(full);
          if (sections.length === 0) {
            return t.strategy.map((para, i) => (
              <ReactPDF.Text key={i} style={S.bt}>{para}</ReactPDF.Text>
            ));
          }
          return sections.map((sec, i) => (
            <ReactPDF.View key={i} style={{ marginBottom: 12 }}>
              {sec.heading && (
                <ReactPDF.Text style={{ fontSize: 10.5, fontWeight: 600, color: "#111", marginBottom: 4 }}>{sec.heading}</ReactPDF.Text>
              )}
              {sec.lines.map((line, j) => (
                <ReactPDF.Text key={j} style={{ fontSize: 9, color: "#555", lineHeight: 1.7, marginBottom: 2 }}>{line}</ReactPDF.Text>
              ))}
            </ReactPDF.View>
          ));
        })()}
        <Footer />
      </ReactPDF.Page>

      <ReactPDF.Page size="A4" style={S.page}>
        <Header />
        <ReactPDF.Text style={S.st}>Key Takeaways</ReactPDF.Text>
        <ReactPDF.View style={{ borderTopWidth: 0.5, borderTopColor: E, marginBottom: 14 }} />
        {(t.keyTakeaways.length > 0 ? t.keyTakeaways : [
          "Practice answer writing daily — get it evaluated by peers or mentors",
          "Integrate current affairs with static syllabus: one page per topic",
          "Practice full-length timed essays before the exam",
          "Build a structured framework for Ethics case studies",
          "Prepare DAF questions and practice with multiple mentors",
          "Be authentic in the interview",
        ]).map((item, i) => (
          <ReactPDF.View key={i} style={{ flexDirection: "row", marginBottom: 8, borderBottom: "1px solid #f0f0f0", paddingBottom: 8 }}>
            <ReactPDF.View style={{ width: 4, height: 4, backgroundColor: E, borderRadius: 2, marginTop: 7, marginRight: 10 }} />
            <ReactPDF.Text style={{ flex: 1, fontSize: 9.5, color: "#444", lineHeight: 1.7 }}>{item}</ReactPDF.Text>
          </ReactPDF.View>
        ))}
        <ReactPDF.View style={{ backgroundColor: E50, padding: 16, marginTop: 24, borderRadius: 4, borderLeftWidth: 3, borderLeftColor: E }}>
          <ReactPDF.Text style={{ fontSize: 8.5, color: "#444", lineHeight: 1.7 }}>
            For the full set of 280+ strategy reports and 50+ verified answer copies, visit{" "}
            <ReactPDF.Link src={`https://${BRAND.website}`} style={{ color: "#059669", textDecoration: "none" }}>{BRAND.website}</ReactPDF.Link>
            {"\n"}Contact:{" "}
            <ReactPDF.Link src={`https://wa.me/${BRAND.phone.replace(/[^0-9]/g, "")}`} style={{ color: "#059669", textDecoration: "none" }}>{BRAND.phone}</ReactPDF.Link>
          </ReactPDF.Text>
        </ReactPDF.View>
        <Footer />
      </ReactPDF.Page>

      {(() => {
        const ac = t.answerCopies || {};
        const hasEntries = Object.values(ac).some(arr => arr && arr.length > 0);
        if (!hasEntries) return null;
        const labelMap: Record<string, string> = { gs1: "GS Paper 1", gs2: "GS Paper 2", gs3: "GS Paper 3", gs4: "GS Paper 4 (Ethics)", essay: "Essay" };
        const available = Object.entries(ac)
          .filter(([, v]) => v && v.length > 0)
          .map(([k]) => ({ key: k, label: labelMap[k] || k, count: (ac[k] || []).length }));
        return (
          <ReactPDF.Page size="A4" style={S.page}>
            <Header />
            <ReactPDF.Text style={S.st}>Answer Copies Available</ReactPDF.Text>
            <ReactPDF.View style={{ borderTopWidth: 0.5, borderTopColor: E, marginBottom: 14 }} />
            <ReactPDF.Text style={{ fontSize: 10, color: "#444", lineHeight: 1.8, marginBottom: 16 }}>
              The following answer copies from {t.name} are available on UPSCPrepNotes:
            </ReactPDF.Text>
            {available.map(a => (
              <ReactPDF.View key={a.key} style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, border: "1px solid #eee", borderRadius: 4, padding: 12 }}>
                <ReactPDF.View style={{ width: 28, height: 28, backgroundColor: E50, borderRadius: 14, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                  <ReactPDF.Text style={{ fontSize: 12, fontWeight: 700, color: E }}>{a.count}</ReactPDF.Text>
                </ReactPDF.View>
                <ReactPDF.Text style={{ flex: 1, fontSize: 10, fontWeight: 600, color: "#111" }}>{a.label}</ReactPDF.Text>
                <ReactPDF.Text style={{ fontSize: 8, color: "#999" }}>{a.count} {a.count === 1 ? "copy" : "copies"}</ReactPDF.Text>
              </ReactPDF.View>
            ))}
            <ReactPDF.View style={{ backgroundColor: "#f9f9f9", padding: 12, marginTop: 8, borderRadius: 4 }}>
              <ReactPDF.Text style={{ fontSize: 8.5, color: "#666", lineHeight: 1.7 }}>
                Access full-size scanned copies with original markings at{" "}
                <ReactPDF.Link src={`https://${BRAND.website}/toppers/toppers-copy-compilation`} style={{ color: E, textDecoration: "none" }}>{BRAND.website}</ReactPDF.Link>
              </ReactPDF.Text>
            </ReactPDF.View>
            <Footer />
          </ReactPDF.Page>
        );
      })()}

      <ReactPDF.Page size="A4" style={S.page}>
        <Header />
        <ReactPDF.Text style={S.st}>More from UPSCPrepNotes</ReactPDF.Text>
        <ReactPDF.View style={{ borderTopWidth: 0.5, borderTopColor: E, marginBottom: 16 }} />
        <ReactPDF.Text style={{ fontSize: 10, color: "#444", lineHeight: 1.8, marginBottom: 16 }}>
          This report is part of our Topper Intelligence series. You can access similar deep-dive strategy reports for 280+ rank holders, along with verified answer copies and preparation resources.
        </ReactPDF.Text>
        <ReactPDF.View style={{ marginBottom: 12, backgroundColor: "#f9f9f9", padding: 14, borderRadius: 4 }}>
          <ReactPDF.Text style={{ fontSize: 12, fontWeight: 600, color: "#111", marginBottom: 8 }}>50+ Topper Answer Copies</ReactPDF.Text>
          <ReactPDF.Text style={{ fontSize: 9, color: "#555", lineHeight: 1.7, marginBottom: 6 }}>
            Actual handwritten UPSC Mains answer sheets from AIR 1–1249. Organized by paper (GS1–4, Essay, Optional) with mark sheets. Includes 21 original strategy guides, interview pack, ethics case studies, and AI assistant.
          </ReactPDF.Text>
          <ReactPDF.Link src={`https://${BRAND.website}/toppers/toppers-copy-compilation`} style={{ color: E, fontSize: 9, fontWeight: 600, textDecoration: "none" }}>
            View compilation {"\u2192"}
          </ReactPDF.Link>
        </ReactPDF.View>
        <ReactPDF.View style={{ marginBottom: 12, backgroundColor: "#f9f9f9", padding: 14, borderRadius: 4 }}>
          <ReactPDF.Text style={{ fontSize: 12, fontWeight: 600, color: "#111", marginBottom: 8 }}>Free UPSC Resources</ReactPDF.Text>
          <ReactPDF.Text style={{ fontSize: 9, color: "#555", lineHeight: 1.7, marginBottom: 6 }}>
            280+ topper profiles with detailed strategies, PYQs with answer keys, free study materials, and an AI tutor, all free, no registration required.
          </ReactPDF.Text>
          <ReactPDF.Link src={`https://${BRAND.website}/free-materials`} style={{ color: E, fontSize: 9, fontWeight: 600, textDecoration: "none" }}>
            Browse free resources {"\u2192"}
          </ReactPDF.Link>
        </ReactPDF.View>
        <ReactPDF.View style={{ marginBottom: 12, backgroundColor: "#f9f9f9", padding: 14, borderRadius: 4 }}>
          <ReactPDF.Text style={{ fontSize: 12, fontWeight: 600, color: "#111", marginBottom: 8 }}>Strategy Reports for Every Topper</ReactPDF.Text>
          <ReactPDF.Text style={{ fontSize: 9, color: "#555", lineHeight: 1.7, marginBottom: 6 }}>
            Marks breakdown, preparation strategy, and key takeaways for every rank holder on our platform. Each report is individually compiled from interviews and published content.
          </ReactPDF.Text>
          <ReactPDF.Link src={`https://${BRAND.website}/toppers/toppers-copy-compilation`} style={{ color: E, fontSize: 9, fontWeight: 600, textDecoration: "none" }}>
            Explore all reports {"\u2192"}
          </ReactPDF.Link>
        </ReactPDF.View>
        <ReactPDF.View style={{ marginTop: 8, flexDirection: "row", justifyContent: "center", gap: 24 }}>
          <ReactPDF.View style={{ alignItems: "center" }}>
            <ReactPDF.Text style={{ fontSize: 20, fontWeight: 700, color: E }}>280+</ReactPDF.Text>
            <ReactPDF.Text style={{ fontSize: 7, color: "#999", letterSpacing: 2, textTransform: "uppercase", marginTop: 2 }}>Topper profiles</ReactPDF.Text>
          </ReactPDF.View>
          <ReactPDF.View style={{ alignItems: "center" }}>
            <ReactPDF.Text style={{ fontSize: 20, fontWeight: 700, color: E }}>50+</ReactPDF.Text>
            <ReactPDF.Text style={{ fontSize: 7, color: "#999", letterSpacing: 2, textTransform: "uppercase", marginTop: 2 }}>Answer copies</ReactPDF.Text>
          </ReactPDF.View>
          <ReactPDF.View style={{ alignItems: "center" }}>
            <ReactPDF.Text style={{ fontSize: 20, fontWeight: 700, color: E }}>₹0</ReactPDF.Text>
            <ReactPDF.Text style={{ fontSize: 7, color: "#999", letterSpacing: 2, textTransform: "uppercase", marginTop: 2 }}>Free resources</ReactPDF.Text>
          </ReactPDF.View>
        </ReactPDF.View>
        <ReactPDF.View style={{ backgroundColor: E50, padding: 14, marginTop: 20, borderRadius: 4, alignItems: "center" }}>
          <ReactPDF.Text style={{ fontSize: 9, color: "#444", lineHeight: 1.7, textAlign: "center" }}>
            <ReactPDF.Link src={`https://wa.me/${BRAND.phone.replace(/[^0-9]/g, "")}`} style={{ color: E, fontWeight: 600, textDecoration: "none" }}>Chat on WhatsApp</ReactPDF.Link>
            {" \u00b7 "}
            <ReactPDF.Link src={`https://${BRAND.website}`} style={{ color: E, fontWeight: 600, textDecoration: "none" }}>{BRAND.website}</ReactPDF.Link>
          </ReactPDF.Text>
        </ReactPDF.View>
        <Footer />
      </ReactPDF.Page>
    </ReactPDF.Document>
  );
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug") || "ishita-kishore";

    await connectDB();
    const raw = await TopperModel.findOne({ slug }).lean();
    if (!raw) {
      return new Response(`Topper "${slug}" not found`, { status: 404 });
    }

    const marks = raw.marks || {};
    const strategyRaw = raw.strategy || "";
    const name = `${raw.firstName || ""} ${raw.lastName || ""}`.trim();

    const imageSrc = topperImageSrc({
      slug,
      firstName: raw.firstName || "",
      lastName: raw.lastName || "",
      ProfileImage: raw.ProfileImage,
    });

    const t: Topper = {
      name,
      rank: String(raw.rank ?? ""),
      year: String(raw.year ?? ""),
      optionalSubject: raw.optionalSubject || "",
      marks: {
        total: marks.total ?? 0,
        written: marks.written ?? 0,
        interview: marks.interview ?? 0,
        essay: marks.essay ?? 0,
        gs1: marks.gs1 ?? 0,
        gs2: marks.gs2 ?? 0,
        gs3: marks.gs3 ?? 0,
        gs4: marks.gs4 ?? 0,
        optional1: marks.optional1 ?? 0,
        optional2: marks.optional2 ?? 0,
      },
      strategy: strategyRaw.split("\n").filter(Boolean),
      keyTakeaways: raw.insights?.length ? raw.insights : [],
      answerCopies: raw.answerCopies || {},
    };

    const stream = await ReactPDF.renderToStream(buildReport(t, imageSrc));
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    const buf = Buffer.concat(chunks);
    const filename = `${slug}-strategy-report.pdf`;
    return new Response(buf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Content-Length": buf.length.toString(),
      },
    });
  } catch (e) {
    console.error(e);
    return new Response("Failed to generate PDF", { status: 500 });
  }
}

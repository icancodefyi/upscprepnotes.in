import ReactPDF from "@react-pdf/renderer";
import path from "path";

const BRAND = {
  name: "UPSCPrepNotes",
  tagline: "Topper Intelligence Report",
  phone: "+91 91527 50079",
  website: "upscprepnotes.in",
  color: "#059669",
};

const E = BRAND.color;
const E50 = "#f0fdf4";
const E100 = "#ecfdf5";

const t = {
  name: "Ishita Kishore", rank: "1", year: "2022", optionalSubject: "PSIR", photo: "/previews/ishita-kishore.png",
  marks: { total: 1094, written: 840, interview: 197, essay: 153, gs1: 90, gs2: 115, gs3: 118, gs4: 138, optional1: 143, optional2: 133 },
  strategy: [
    "Ishita Kishore's preparation strategy centered around a structured approach to answer writing. She emphasized the importance of practicing with pen and paper from day one, rather than just reading. Her daily routine included writing at least two answers per day and getting them evaluated by peers or mentors.",
    "For GS papers, she focused on integrating current affairs with static syllabus. She maintained a single page for every major topic where she noted key facts, data points, and quotes that could be used across multiple papers.",
    "For PSIR optional, she read the core textbooks (Gauba, Johari) twice and supplemented with contemporary examples. She practiced diagram-based answers that combined theoretical concepts with real-world applications.",
    "For Essay, she wrote 15 full-length essays before the exam. Each essay was timed at 3 hours and evaluated by a mentor. She developed a template structure: introduction with quote, 4-5 body paragraphs with examples, and a forward-looking conclusion.",
    "In the interview, she focused on being honest about what she didn't know. She prepared 60 questions on her DAF and practiced mock interviews with multiple mentors. Her advice: the interview is not a test of knowledge, it's a test of personality.",
  ],
};

const papers = [
  { label: "GS Paper 1", key: "gs1" },
  { label: "GS Paper 2", key: "gs2" },
  { label: "GS Paper 3", key: "gs3" },
  { label: "GS Paper 4 (Ethics)", key: "gs4" },
  { label: "Essay", key: "essay" },
  { label: `${t.optionalSubject} Paper 1`, key: "optional1" },
  { label: `${t.optionalSubject} Paper 2`, key: "optional2" },
] as const;

ReactPDF.Font.register({
  family: "Inter",
  fonts: [
    { src: path.join(process.cwd(), "public/fonts/Inter-300.ttf"), fontWeight: 300 },
    { src: path.join(process.cwd(), "public/fonts/Inter-600.ttf"), fontWeight: 600 },
    { src: path.join(process.cwd(), "public/fonts/Inter-700.ttf"), fontWeight: 700 },
  ],
});

const logoPath = path.join(process.cwd(), "public/logo.png");
const photoUrl = `https://api.dicebear.com/9.x/notionists/svg?seed=${t.name.replace(/\s/g, "-")}`;

const S = ReactPDF.StyleSheet.create({
  page: { fontFamily: "Inter", padding: 56, backgroundColor: "#fff", color: "#1a1a1a" },
  // Brand header (inner pages)
  bh: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 32, borderBottom: "1px solid #e5e5e5", paddingBottom: 14 },
  bhL: { flexDirection: "row", alignItems: "center", gap: 8 },
  bhLogo: { width: 22, height: 22 },
  bhN: { fontSize: 11, fontWeight: 600, color: "#111" },
  bhR: { fontSize: 7.5, color: "#999", letterSpacing: 2, textTransform: "uppercase" },
  // Brand footer
  bf: { position: "absolute", bottom: 40, left: 56, right: 56, flexDirection: "row", justifyContent: "space-between", borderTop: "1px solid #eee", paddingTop: 10 },
  bfL: { fontSize: 7, color: "#aaa" },
  bfR: { fontSize: 7, color: "#aaa" },
  // Cover
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
  // Section
  st: { fontSize: 15, fontWeight: 600, color: "#111", marginBottom: 10, letterSpacing: -0.3 },
  bt: { fontSize: 9.5, color: "#555", lineHeight: 1.8, marginBottom: 7 },
  // About page
  abt: { fontSize: 11, color: "#444", lineHeight: 2, marginBottom: 12 },
  abtLabel: { fontSize: 8, color: "#999", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 },
  // Stats
  sr: { flexDirection: "row", gap: 10, marginVertical: 14 },
  sb: { flex: 1, border: "1px solid #eee", padding: 10, alignItems: "center", borderRadius: 4 },
  sv: { fontSize: 15, fontWeight: 700, color: "#111" },
  sl: { fontSize: 6.5, color: "#999", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 },
  // Table
  th: { flexDirection: "row", borderTop: "1px solid #e5e5e5", borderBottom: "1px solid #ccc", paddingVertical: 7, backgroundColor: E50 },
  tr: { flexDirection: "row", borderBottom: "1px solid #eee", paddingVertical: 7 },
  tl: { flex: 1, fontSize: 9.5, color: "#555" },
  tlh: { flex: 1, fontSize: 9.5, fontWeight: 600, color: "#333" },
  tv: { width: 60, fontSize: 9.5, color: "#444", textAlign: "right" },
  tvh: { width: 60, fontSize: 9.5, fontWeight: 700, color: "#111", textAlign: "right" },
  tb: { borderBottom: "2px solid #111" },
  // Highlight
  hb: { backgroundColor: E50, padding: 14, marginVertical: 16, borderLeftWidth: 3, borderLeftColor: E, borderRadius: 2 },
  hbt: { fontSize: 9, fontWeight: 600, color: "#065f46", marginBottom: 3 },
  hbp: { fontSize: 9, color: "#444", lineHeight: 1.7 },
});

function getVal(key: string): number {
  return t.marks[key as keyof typeof t.marks] as number;
}

const best = papers.map(p => ({ label: p.label, value: getVal(p.key) })).filter(p => p.value > 0).sort((a, b) => b.value - a.value);

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

const Report = () => (
  <ReactPDF.Document>
    <ReactPDF.Page size="A4" style={S.page}>
      <ReactPDF.View style={S.cv}>
        <ReactPDF.Image src={logoPath} style={S.cvLogo} />
        <ReactPDF.Text style={S.cvBrand}>{BRAND.name}</ReactPDF.Text>
        <ReactPDF.Text style={S.cvBrandSub}>{BRAND.tagline}</ReactPDF.Text>
        <ReactPDF.Image src={photoUrl} style={S.cvPhoto} />
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
        This report is compiled from {t.name}&apos;s actual interview transcripts, her published strategy breakdowns on UPSCPrepNotes, and verified marks data from official UPSC records. Every insight on the following pages reflects what {t.name} herself has shared about her preparation — not generic advice or guesswork.
      </ReactPDF.Text>
      <ReactPDF.Text style={S.abt}>
        The strategy section distills her daily routine, paper-wise approach, optional subject methodology, essay writing practice, and interview preparation into actionable points. The marksheet data is cross-checked against UPSC&apos;s published results for accuracy.
      </ReactPDF.Text>
      <ReactPDF.Text style={S.abt}>
        This is part of UPSCPrepNotes&apos;s Topper Intelligence series — a collection of structured, verified strategy reports designed to give serious aspirants a clear understanding of how rank holders actually prepared, paper by paper.
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
          <ReactPDF.Text style={S.tv}>{getVal(p.key)}</ReactPDF.Text>
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
      <ReactPDF.Text style={S.st}>Preparation Strategy</ReactPDF.Text>
      {t.strategy.map((para, i) => (
        <ReactPDF.Text key={i} style={S.bt}>{para}</ReactPDF.Text>
      ))}
      <ReactPDF.View style={{ borderTopWidth: 0.5, borderTopColor: E, marginTop: 28, marginBottom: 14 }} />
      <ReactPDF.Text style={S.st}>Key Takeaways</ReactPDF.Text>
      {[
        "Write at least two answers daily — get them evaluated by peers or mentors",
        "Integrate current affairs with static syllabus: one page per topic",
        "Practice 15+ full-length timed essays before the exam",
        "Build a structured framework for Ethics case studies",
        "Prepare 60+ DAF questions and practice with multiple mentors",
        "Be authentic in the interview — honesty beats bluffing",
      ].map((item, i) => (
        <ReactPDF.Text key={i} style={{ ...S.bt, marginBottom: 3, color: "#444", fontSize: 10, lineHeight: 1.7 }}>
          <ReactPDF.Text style={{ color: E, fontWeight: 700 }}>{"\u2192 "}</ReactPDF.Text>
          {item}
        </ReactPDF.Text>
      ))}
      <ReactPDF.View style={{ backgroundColor: E50, padding: 16, marginTop: 28, borderRadius: 4, borderLeftWidth: 3, borderLeftColor: E }}>
        <ReactPDF.Text style={{ fontSize: 8, color: "#666", lineHeight: 1.7 }}>
          Access 280+ verified topper strategies and 50+ answer copies at{" "}
          <ReactPDF.Link src={`https://${BRAND.website}`} style={{ color: "#059669", textDecoration: "none" }}>{BRAND.website}</ReactPDF.Link>.
          {"\n"}Contact:{" "}
          <ReactPDF.Link src={`https://wa.me/${BRAND.phone.replace(/[^0-9]/g, "")}`} style={{ color: "#059669", textDecoration: "none" }}>{BRAND.phone}</ReactPDF.Link>
          {" | "}
          <ReactPDF.Link src={`https://${BRAND.website}`} style={{ color: "#059669", textDecoration: "none" }}>{BRAND.website}</ReactPDF.Link>
        </ReactPDF.Text>
      </ReactPDF.View>
      <Footer />
    </ReactPDF.Page>
  </ReactPDF.Document>
);

export async function GET() {
  try {
    const stream = await ReactPDF.renderToStream(<Report />);
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    const buf = Buffer.concat(chunks);
    return new Response(buf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="ishita-kishore-strategy-report.pdf"',
        "Content-Length": buf.length.toString(),
      },
    });
  } catch (e) {
    console.error(e);
    return new Response("Failed to generate PDF", { status: 500 });
  }
}

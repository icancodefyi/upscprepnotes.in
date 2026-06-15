import ReactPDF from "@react-pdf/renderer";
import path from "path";
import fs from "fs";
import { MAY_2026 } from "../lib/current-affairs-content";

const BRAND = {
  name: "UPSCPrepNotes",
  tagline: "Monthly Current Affairs",
  phone: "+91 91527 50079",
  website: "upscprepnotes.in",
  color: "#059669",
};

const E = BRAND.color;
const E50 = "#f0fdf4";

ReactPDF.Font.register({
  family: "Inter",
  fonts: [
    { src: path.join(__dirname, "../public/fonts/Inter-300.ttf"), fontWeight: 300 },
    { src: path.join(__dirname, "../public/fonts/Inter-600.ttf"), fontWeight: 600 },
    { src: path.join(__dirname, "../public/fonts/Inter-700.ttf"), fontWeight: 700 },
  ],
});

const logoPath = path.join(__dirname, "../public/logo.png");

const S = ReactPDF.StyleSheet.create({
  page: { fontFamily: "Inter", padding: 56, backgroundColor: "#fff", color: "#1a1a1a" },
  hdr: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24, borderBottom: "1px solid #e5e5e5", paddingBottom: 12 },
  hdrL: { flexDirection: "row", alignItems: "center", gap: 8 },
  hdrLogo: { width: 20, height: 20 },
  hdrName: { fontSize: 10, fontWeight: 600, color: "#111" },
  hdrR: { fontSize: 7, color: "#999", letterSpacing: 1.5, textTransform: "uppercase" },
  ftr: { position: "absolute", bottom: 36, left: 56, right: 56, flexDirection: "row", justifyContent: "space-between", borderTop: "1px solid #eee", paddingTop: 8 },
  ftrText: { fontSize: 6.5, color: "#aaa" },
  cv: { flex: 1, justifyContent: "center", alignItems: "center" },
  cvLogo: { width: 44, height: 44, marginBottom: 14 },
  cvBrand: { fontSize: 10, fontWeight: 600, color: "#111", letterSpacing: 5, textTransform: "uppercase", marginBottom: 3 },
  cvBrandSub: { fontSize: 7, color: "#999", letterSpacing: 2, textTransform: "uppercase", marginBottom: 28 },
  cvLbl: { fontSize: 8, color: E, letterSpacing: 3, textTransform: "uppercase", marginBottom: 3 },
  cvPeriod: { fontSize: 8, color: "#999", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 },
  cvTitle: { fontSize: 32, fontWeight: 700, color: "#111", textAlign: "center", lineHeight: 1.15, letterSpacing: -1 },
  cvSub: { fontSize: 12, color: "#666", marginTop: 10, textAlign: "center" },
  cvDiv: { width: 36, height: 2, backgroundColor: E, marginVertical: 20 },
  cvStatRow: { flexDirection: "row", gap: 0 },
  cvStatBox: { alignItems: "center", paddingHorizontal: 20, borderRight: "1px solid #e5e5e5" },
  cvStatBoxLast: { alignItems: "center", paddingHorizontal: 20 },
  cvStatVal: { fontSize: 18, fontWeight: 700, color: "#111" },
  cvStatLbl: { fontSize: 6.5, color: "#999", letterSpacing: 2, textTransform: "uppercase", marginTop: 3 },
  secTitle: { fontSize: 14, fontWeight: 600, color: "#111", marginBottom: 12, letterSpacing: -0.3 },
  secDivider: { borderTopWidth: 0.5, borderTopColor: E, marginBottom: 16 },
  itemTitle: { fontSize: 10.5, fontWeight: 600, color: "#111", marginBottom: 4, lineHeight: 1.5 },
  itemBody: { fontSize: 9, color: "#555", lineHeight: 1.8, marginBottom: 4 },
  itemBox: { marginBottom: 14, border: "1px solid #f0f0f0", borderRadius: 3, padding: 12 },
  keyHighlight: { backgroundColor: E50, padding: 10, marginVertical: 8, borderLeftWidth: 3, borderLeftColor: E, borderRadius: 2 },
  keyHighlightText: { fontSize: 8, color: "#444", lineHeight: 1.6 },
});

function Header() {
  return (
    <ReactPDF.View style={S.hdr} fixed>
      <ReactPDF.View style={S.hdrL}>
        <ReactPDF.Image src={logoPath} style={S.hdrLogo} />
        <ReactPDF.Text style={S.hdrName}>{BRAND.name}</ReactPDF.Text>
      </ReactPDF.View>
      <ReactPDF.Text style={S.hdrR}>{BRAND.tagline}</ReactPDF.Text>
    </ReactPDF.View>
  );
}

function Footer() {
  return (
    <ReactPDF.View style={S.ftr} fixed>
      <ReactPDF.Text style={S.ftrText}>
        <ReactPDF.Link src={`https://${BRAND.website}`} style={{ color: E, textDecoration: "none" }}>{BRAND.website}</ReactPDF.Link>
        {" \u00b7 "}
        <ReactPDF.Link src={`https://wa.me/${BRAND.phone.replace(/[^0-9]/g, "")}`} style={{ color: E, textDecoration: "none" }}>{BRAND.phone}</ReactPDF.Link>
      </ReactPDF.Text>
      <ReactPDF.Text style={S.ftrText}>{BRAND.tagline}</ReactPDF.Text>
    </ReactPDF.View>
  );
}

function chunkItems<T>(items: T[], perPage: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += perPage) chunks.push(items.slice(i, i + perPage));
  return chunks;
}

function buildPDF() {
  const content = MAY_2026;
  const totalItems = content.sections.reduce((s, sec) => s + sec.items.length, 0);
  const sectionCount = content.sections.length;

  const children: React.ReactElement[] = [];

  // Cover
  children.push(
    <ReactPDF.Page size="A4" style={S.page}>
      <ReactPDF.View style={S.cv}>
        <ReactPDF.Image src={logoPath} style={S.cvLogo} />
        <ReactPDF.Text style={S.cvBrand}>{BRAND.name}</ReactPDF.Text>
        <ReactPDF.Text style={S.cvBrandSub}>{BRAND.tagline}</ReactPDF.Text>
        <ReactPDF.Text style={S.cvLbl}>Edition</ReactPDF.Text>
        <ReactPDF.Text style={S.cvPeriod}>{content.month} {content.year}</ReactPDF.Text>
        <ReactPDF.Text style={S.cvTitle}>{content.title}</ReactPDF.Text>
        <ReactPDF.Text style={S.cvSub}>Complete UPSC-relevant news coverage</ReactPDF.Text>
        <ReactPDF.View style={S.cvDiv} />
        <ReactPDF.View style={S.cvStatRow}>
          <ReactPDF.View style={S.cvStatBox}>
            <ReactPDF.Text style={S.cvStatVal}>{sectionCount}</ReactPDF.Text>
            <ReactPDF.Text style={S.cvStatLbl}>Sections</ReactPDF.Text>
          </ReactPDF.View>
          <ReactPDF.View style={S.cvStatBox}>
            <ReactPDF.Text style={S.cvStatVal}>{totalItems}</ReactPDF.Text>
            <ReactPDF.Text style={S.cvStatLbl}>Topics</ReactPDF.Text>
          </ReactPDF.View>
          <ReactPDF.View style={S.cvStatBoxLast}>
            <ReactPDF.Text style={S.cvStatVal}>{content.month}</ReactPDF.Text>
            <ReactPDF.Text style={S.cvStatLbl}>Edition</ReactPDF.Text>
          </ReactPDF.View>
        </ReactPDF.View>
      </ReactPDF.View>
      <Footer />
    </ReactPDF.Page>
  );

  // Content sections
  content.sections.forEach((section, si) => {
    const chunks = chunkItems(section.items, 4);
    chunks.forEach((chunk, ci) => (
      children.push(
        <ReactPDF.Page key={`${si}-${ci}`} size="A4" style={S.page}>
          <Header />
          <ReactPDF.Text style={S.secTitle}>{si + 1}. {section.title}{chunks.length > 1 ? ` (${ci + 1}/${chunks.length})` : ""}</ReactPDF.Text>
          <ReactPDF.View style={S.secDivider} />
          {chunk.map((item, ii) => (
            <ReactPDF.View key={ii} style={S.itemBox}>
              <ReactPDF.Text style={S.itemTitle}>{item.headline}</ReactPDF.Text>
              <ReactPDF.Text style={S.itemBody}>{item.body}</ReactPDF.Text>
            </ReactPDF.View>
          ))}
          <Footer />
        </ReactPDF.Page>
      )
    ));
  });

  // Quick Revision
  children.push(
    <ReactPDF.Page size="A4" style={S.page}>
      <Header />
      <ReactPDF.Text style={S.secTitle}>Quick Revision</ReactPDF.Text>
      <ReactPDF.View style={S.secDivider} />
      {content.sections.map((section, si) => (
        <ReactPDF.View key={si} style={{ marginBottom: 8, flexDirection: "row", gap: 6 }}>
          <ReactPDF.View style={{ width: 16, height: 16, backgroundColor: E50, borderRadius: 8, alignItems: "center", justifyContent: "center" }}>
            <ReactPDF.Text style={{ fontSize: 7, fontWeight: 700, color: E }}>{si + 1}</ReactPDF.Text>
          </ReactPDF.View>
          <ReactPDF.View style={{ flex: 1 }}>
            <ReactPDF.Text style={{ fontSize: 7.5, fontWeight: 600, color: "#111", marginBottom: 2 }}>{section.title}</ReactPDF.Text>
            <ReactPDF.Text style={{ fontSize: 7, color: "#666", lineHeight: 1.5 }}>
              {section.items.map((i) => i.headline.split(":")[0]).slice(0, 2).join("  \u2022  ")}
            </ReactPDF.Text>
          </ReactPDF.View>
        </ReactPDF.View>
      ))}
      <Footer />
    </ReactPDF.Page>
  );

  // About
  children.push(
    <ReactPDF.Page size="A4" style={S.page}>
      <Header />
      <ReactPDF.Text style={S.secTitle}>About {BRAND.name}</ReactPDF.Text>
      <ReactPDF.View style={S.secDivider} />
      <ReactPDF.Text style={{ fontSize: 10, color: "#444", lineHeight: 2, marginBottom: 16 }}>
        UPSCPrepNotes is a comprehensive platform for UPSC CSE aspirants. Our Monthly Current Affairs compilation is curated by experienced mentors and updated with verified information from government sources, PIB releases, major newspapers, and recognized international publications.
      </ReactPDF.Text>
      <ReactPDF.View style={{ marginBottom: 12, backgroundColor: "#f9f9f9", padding: 14, borderRadius: 4 }}>
        <ReactPDF.Text style={{ fontSize: 12, fontWeight: 600, color: "#111", marginBottom: 8 }}>What else we offer</ReactPDF.Text>
        <ReactPDF.Text style={{ fontSize: 9, color: "#555", lineHeight: 1.8 }}>
          {"\u2022 280+ Topper Strategy Reports with marks analysis\n\u2022 50+ Verified Answer Copies from AIR 1-1249\n\u2022 Free PYQs, study materials, and AI tutor\n\u2022 Monthly Current Affairs for every month"}
        </ReactPDF.Text>
      </ReactPDF.View>
      <ReactPDF.View style={S.keyHighlight}>
        <ReactPDF.Text style={S.keyHighlightText}>
          <ReactPDF.Text style={{ fontWeight: 600, color: "#065f46" }}>Download all editions: </ReactPDF.Text>
          <ReactPDF.Link src={`https://${BRAND.website}/store`} style={{ color: E, textDecoration: "none" }}>{BRAND.website}/store</ReactPDF.Link>
          {" \u00b7 "}
          <ReactPDF.Link src={`https://wa.me/${BRAND.phone.replace(/[^0-9]/g, "")}`} style={{ color: E, textDecoration: "none" }}>{BRAND.phone}</ReactPDF.Link>
        </ReactPDF.Text>
      </ReactPDF.View>
      <Footer />
    </ReactPDF.Page>
  );

  return <ReactPDF.Document>{children}</ReactPDF.Document>;
}

async function main() {
  const doc = buildPDF();
  const stream = await ReactPDF.renderToStream(doc);
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  const buf = Buffer.concat(chunks);

  const outDir = path.join(__dirname, "../public/pdfs/current-affairs");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "may-2026.pdf");
  fs.writeFileSync(outPath, buf);
  console.log(`Generated ${outPath} (${(buf.length / 1024 / 1024).toFixed(1)} MB)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

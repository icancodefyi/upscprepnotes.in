"use client";

import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hjp-Ek-_EeA.woff2", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZ9hjp-Ek-_EeA.woff2", fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    padding: 56,
    backgroundColor: "#ffffff",
  },
  // Cover
  coverContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  coverAccent: {
    width: 48,
    height: 3,
    backgroundColor: "#1a1a1a",
    marginBottom: 32,
  },
  coverLabel: {
    fontSize: 10,
    color: "#888",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  coverName: {
    fontSize: 36,
    fontWeight: 700,
    color: "#1a1a1a",
    textAlign: "center",
    lineHeight: 1.15,
  },
  coverSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 12,
    textAlign: "center",
  },
  coverMeta: {
    marginTop: 32,
    flexDirection: "row",
    gap: 32,
  },
  coverMetaItem: {
    alignItems: "center",
  },
  coverMetaValue: {
    fontSize: 18,
    fontWeight: 700,
    color: "#1a1a1a",
  },
  coverMetaLabel: {
    fontSize: 8,
    color: "#999",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 4,
  },
  coverFooter: {
    position: "absolute",
    bottom: 56,
    left: 56,
    right: 56,
    textAlign: "center",
    fontSize: 8,
    color: "#bbb",
  },
  // Content pages
  sectionDivider: {
    width: 24,
    height: 2,
    backgroundColor: "#1a1a1a",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: 16,
  },
  bodyText: {
    fontSize: 10,
    color: "#444",
    lineHeight: 1.7,
    marginBottom: 8,
  },
  // Marks table
  marksTable: {
    marginTop: 12,
    borderTop: "1px solid #eee",
  },
  marksRow: {
    flexDirection: "row",
    borderBottom: "1px solid #eee",
    paddingVertical: 8,
  },
  marksLabel: {
    flex: 1,
    fontSize: 10,
    color: "#666",
  },
  marksValue: {
    width: 60,
    fontSize: 10,
    fontWeight: 700,
    color: "#1a1a1a",
    textAlign: "right",
  },
  marksTotal: {
    borderBottom: "1px solid #1a1a1a",
  },
  // Stats row
  statsRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    border: "1px solid #eee",
    padding: 12,
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1a1a1a",
  },
  statLabel: {
    fontSize: 7,
    color: "#999",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 4,
  },
  // Strongest paper highlight
  highlightBox: {
    backgroundColor: "#f5f5f5",
    padding: 14,
    marginTop: 16,
    marginBottom: 16,
  },
  highlightTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: 4,
  },
  highlightText: {
    fontSize: 9,
    color: "#555",
    lineHeight: 1.6,
  },
  // Paper names
  paperName: {
    fontSize: 11,
    fontWeight: 700,
    color: "#1a1a1a",
    marginTop: 16,
    marginBottom: 4,
  },
});

function getPaperScore(marks: any, paper: string): number {
  const key = `marks${paper === "GS4" ? "4" : paper === "Essay" ? "essay" : paper === "Optional1" ? "optional1" : "gs" + paper.charAt(2)}`;
  return marks?.[paper === "GS4" ? "gs4" : paper === "Essay" ? "essay" : paper === "Optional1" ? "optional1" : paper.toLowerCase()] || 0;
}

const MOCK_TOPPER = {
  name: "Ishita Kishore",
  rank: "1",
  year: "2022",
  optionalSubject: "PSIR",
  marks: {
    total: 1094,
    written: 840,
    interview: 197,
    essay: 153,
    gs1: 90,
    gs2: 115,
    gs3: 118,
    gs4: 138,
    optional1: 143,
    optional2: 133,
  },
  strategy: `Ishita Kishore's preparation strategy centered around a structured approach to answer writing. She emphasized the importance of practicing with pen and paper from day one, rather than just reading. Her daily routine included writing at least two answers per day and getting them evaluated by peers or mentors.

For GS papers, she focused on integrating current affairs with static syllabus. She maintained a single page for every major topic where she noted key facts, data points, and quotes that could be used across multiple papers.

For PSIR optional, she read the core textbooks (Gauba, Johari) twice and supplemented with contemporary examples. She practiced diagram-based answers that combined theoretical concepts with real-world applications.

For Essay, she wrote 15 full-length essays before the exam. Each essay was timed at 3 hours and evaluated by a mentor. She developed a template structure: introduction with quote, 4-5 body paragraphs with examples, and a forward-looking conclusion.

In the interview, she focused on being honest about what she didn't know. She prepared 60 questions on her DAF and practiced mock interviews with multiple mentors. Her advice: "The interview is not a test of knowledge, it's a test of personality — be authentic."`,
};

export default function TopperReport() {
  const t = MOCK_TOPPER;
  const best = [
    { label: "GS1", value: t.marks.gs1 },
    { label: "GS2", value: t.marks.gs2 },
    { label: "GS3", value: t.marks.gs3 },
    { label: "GS4", value: t.marks.gs4 },
    { label: "Essay", value: t.marks.essay },
  ].filter(p => p.value > 0).sort((a, b) => b.value - a.value);

  return (
    <Document>
      {/* COVER PAGE */}
      <Page size="A4" style={styles.page}>
        <View style={styles.coverContainer}>
          <View style={styles.coverAccent} />
          <Text style={styles.coverLabel}>UPSC CSE {t.year} · Strategy Report</Text>
          <Text style={styles.coverName}>{t.name}</Text>
          <Text style={styles.coverSubtitle}>AIR {t.rank} · {t.optionalSubject} Optional</Text>
          <View style={styles.coverMeta}>
            <View style={styles.coverMetaItem}>
              <Text style={styles.coverMetaValue}>{t.marks.total}</Text>
              <Text style={styles.coverMetaLabel}>Total Marks</Text>
            </View>
            <View style={styles.coverMetaItem}>
              <Text style={styles.coverMetaValue}>{t.marks.written}</Text>
              <Text style={styles.coverMetaLabel}>Written</Text>
            </View>
            <View style={styles.coverMetaItem}>
              <Text style={styles.coverMetaValue}>{t.marks.interview}</Text>
              <Text style={styles.coverMetaLabel}>Interview</Text>
            </View>
          </View>
          <Text style={styles.coverFooter}>UPSCPrepNotes — Topper Intelligence Report</Text>
        </View>
      </Page>

      {/* PAGE 2: MARKS OVERVIEW */}
      <Page size="A4" style={styles.page}>
        <View style={styles.sectionDivider} />
        <Text style={styles.sectionTitle}>Marks Breakdown</Text>

        <View style={styles.statsRow}>
          {[
            { value: `AIR ${t.rank}`, label: "Rank" },
            { value: t.marks.total, label: "Total" },
            { value: t.marks.written, label: "Written" },
            { value: t.marks.interview, label: "Interview" },
          ].map((s) => (
            <View key={s.label} style={styles.statBox}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.marksTable}>
          <View style={styles.marksRow}>
            <Text style={styles.marksLabel}>GS Paper 1</Text>
            <Text style={styles.marksValue}>{t.marks.gs1}</Text>
          </View>
          <View style={styles.marksRow}>
            <Text style={styles.marksLabel}>GS Paper 2</Text>
            <Text style={styles.marksValue}>{t.marks.gs2}</Text>
          </View>
          <View style={styles.marksRow}>
            <Text style={styles.marksLabel}>GS Paper 3</Text>
            <Text style={styles.marksValue}>{t.marks.gs3}</Text>
          </View>
          <View style={styles.marksRow}>
            <Text style={styles.marksLabel}>GS Paper 4 (Ethics)</Text>
            <Text style={styles.marksValue}>{t.marks.gs4}</Text>
          </View>
          <View style={styles.marksRow}>
            <Text style={styles.marksLabel}>Essay</Text>
            <Text style={styles.marksValue}>{t.marks.essay}</Text>
          </View>
          <View style={styles.marksRow}>
            <Text style={styles.marksLabel}>{t.optionalSubject} Paper 1</Text>
            <Text style={styles.marksValue}>{t.marks.optional1}</Text>
          </View>
          <View style={styles.marksRow}>
            <Text style={styles.marksLabel}>{t.optionalSubject} Paper 2</Text>
            <Text style={styles.marksValue}>{t.marks.optional2}</Text>
          </View>
          <View style={[styles.marksRow, styles.marksTotal]}>
            <Text style={styles.marksLabel}>Written Total</Text>
            <Text style={[styles.marksValue]}>{t.marks.written}</Text>
          </View>
          <View style={styles.marksRow}>
            <Text style={styles.marksLabel}>Interview</Text>
            <Text style={styles.marksValue}>{t.marks.interview}</Text>
          </View>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>Strongest Paper: {best[0]?.label} ({best[0]?.value} marks)</Text>
          <Text style={styles.highlightText}>
            {t.name} scored highest in {best[0]?.label} at {best[0]?.value} marks, {best[0] && best[1] ? `${best[0].value - best[1].value} marks ahead of their next best paper (${best[1].label}).` : ""}
            {best[0]?.label === "GS4" ? " Ethics was a clear differentiator — toppers who score 130+ in GS4 often have a structured framework for handling case studies and a clear ethical standpoint." : ""}
          </Text>
        </View>

        <View style={styles.sectionDivider} />
        <Text style={styles.sectionTitle}>Subject Analysis</Text>

        <Text style={styles.paperName}>GS Paper 4 (Ethics) — {t.marks.gs4} / 250</Text>
        <Text style={styles.bodyText}>
          {t.name} scored exceptionally in Ethics, indicating strong case study handling and clarity in theoretical concepts. To achieve this score, she likely used a structured approach: identifying stakeholders, ethical dilemmas, and possible courses of action before concluding with a justifiable resolution based on foundational values.
        </Text>

        <Text style={styles.paperName}>{t.optionalSubject} — {t.marks.optional1 + t.marks.optional2} / 500</Text>
        <Text style={styles.bodyText}>
          With {t.marks.optional1 + t.marks.optional2} combined in PSIR, {t.name} demonstrated mastery of both political theory and international relations. PSIR toppers typically integrate current affairs with theoretical frameworks — for example, using realism to analyze Ukraine-Russia while quoting Thucydides and Morgenthau.
        </Text>
      </Page>

      {/* PAGE 3: STRATEGY */}
      <Page size="A4" style={styles.page}>
        <View style={styles.sectionDivider} />
        <Text style={styles.sectionTitle}>Preparation Strategy</Text>

        {t.strategy.split("\n\n").map((para, i) => (
          <Text key={i} style={styles.bodyText}>{para.trim()}</Text>
        ))}

        <View style={{ ...styles.sectionDivider, marginTop: 32 }} />
        <Text style={styles.sectionTitle}>Key Takeaways</Text>

        {[
          "Write daily — at least two answers per day, evaluated by peers or mentors",
          "Integrate current affairs with static syllabus on a single page per topic",
          "Practice full-length timed essays (15+ before the exam)",
          "Build a structured framework for Ethics case studies",
          "Prepare 60+ DAF questions and practice mock interviews",
          "Be authentic in the interview — not knowing is better than bluffing",
        ].map((takeaway, i) => (
          <Text key={i} style={{ ...styles.bodyText, marginBottom: 4, color: "#333" }}>
            • {takeaway}
          </Text>
        ))}

        <View style={{ ...styles.highlightBox, marginTop: 32, backgroundColor: "#fafafa" }}>
          <Text style={{ fontSize: 8, color: "#999", marginBottom: 4 }}>PRO TIP</Text>
          <Text style={{ fontSize: 9, color: "#444", lineHeight: 1.6 }}>
            Compare {t.name}'s marks with other toppers from the same year. Toppers with similar optional subjects often show patterns in which GS papers they score highest in — use this to identify your own strengths.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

/**
 * Builds the Topper Marks Handbook PDF and its share image from the live marksheets.
 *
 *   npx tsx --tsconfig tsconfig.json scripts/build-marks-handbook.mts
 *
 * Reads MONGODB_URI / DB_NAME from .env.local (read-only), renders an HTML template with the brand
 * tokens, and prints it with headless Chrome. Output:
 *   public/handbook/upsc-topper-marks-handbook.pdf
 *   public/og/marks-handbook.png
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";

for (const l of fs.readFileSync(".env.local", "utf8").split("\n")) {
  if (!l.includes("=") || l.trim().startsWith("#")) continue;
  const i = l.indexOf("=");
  const k = l.slice(0, i).trim();
  if (!process.env[k]) process.env[k] = l.slice(i + 1).trim().replace(/^["']|["']$/g, "");
}

const { getHandbook, CUTOFFS } = await import("../lib/marks-handbook");
const h = await getHandbook();

const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const SITE = "https://upscprepnotes.in";
const PAGE_URL = `${SITE}/toppers/highest-marks-in-upsc`;
const fmt = (x: number) => x.toLocaleString("en-IN");
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const rec = (k: string) => h.records.find((r) => r.key === k)!;
const essay = rec("essay"), gs1 = rec("gs1"), gs2 = rec("gs2"), gs3 = rec("gs3"), gs4 = rec("gs4"), opt = rec("optional"), intv = rec("interview"), written = rec("written"), total = rec("total");
const top = h.bands[0];
const rest = h.bands[h.bands.length - 1];
const t100 = h.targets[0];
const tAll = h.targets[1];
const gap = (k: string) => h.gaps.find((g) => g.key === k)?.gap ?? 0;
const month = new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });
const topperUrl = (slug: string) => `${SITE}/upsc-topper/${slug}?utm_source=handbook&utm_medium=pdf`;
const link = (p: string) => `${SITE}${p}${p.includes("?") ? "&" : "?"}utm_source=handbook&utm_medium=pdf`;
const tl = (t: { name: string; slug: string }) => (t.slug ? `<a href="${topperUrl(t.slug)}">${esc(t.name)}</a>` : esc(t.name));

const MARK = (size: number) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24"><rect x="1" y="1" width="22" height="22" rx="6" fill="#0b0c10"/><path d="M7.5 5v14" stroke="#ff4a3d" stroke-width="1.4" stroke-linecap="round"/><path d="M10.5 8.5h7M10.5 12h7" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/><path d="M10.5 15.5h4.5" stroke="#8fa2ff" stroke-width="1.6" stroke-linecap="round"/></svg>`;

let pageNo = 0;
function page(body: string, opts: { cover?: boolean; title?: string } = {}) {
  pageNo++;
  if (opts.cover) return `<section class="page cover">${body}</section>`;
  return `<section class="page">
  <header class="run"><span class="brand">${MARK(18)}<b>UPSCPrepNotes</b></span><span>Topper Marks Handbook${opts.title ? ` · ${esc(opts.title)}` : ""}</span></header>
  <div class="body">${body}</div>
  <footer class="run"><a href="${link("/toppers/highest-marks-in-upsc")}">upscprepnotes.in/toppers/highest-marks-in-upsc</a><span>${pageNo}</span></footer>
</section>`;
}

/** A horizontal scale from 0 to max with the median, top-10% line and record marked. */
function scale(r: typeof essay) {
  const p = (v: number) => `${((v / r.max) * 100).toFixed(1)}%`;
  return `<div class="scale">
    <div class="track"><span class="fill" style="width:${p(r.median)}"></span><span class="tick t10" style="left:${p(r.top10)}"></span><span class="tick best" style="left:${p(r.best)}"></span></div>
    <div class="legend"><span><i class="sw med"></i>Median ${r.median}</span><span><i class="sw t10"></i>Top 10% from ${r.top10}</span><span><i class="sw best"></i>Record ${r.best}</span><span class="max">of ${fmt(r.max)}</span></div>
  </div>`;
}

function paperBlock(r: typeof essay, lines: string[]) {
  return `<div class="paper-block">
    <div class="pb-head"><h3>${esc(r.label)}</h3><p class="rec"><b>${r.best}</b> of ${r.max} · ${r.holders.slice(0, 2).map((t) => `${tl(t)} (AIR ${t.rank}, ${t.year})`).join(", ")}</p></div>
    ${scale(r)}
    ${lines.map((l) => `<p>${l}</p>`).join("")}
    <p class="small">Top three: ${r.top.slice(0, 3).map((t) => `${tl(t)} ${t.score}`).join(" · ")}</p>
  </div>`;
}

const air1Rows = [...h.air1].reverse().map((a) => `<tr><td><b>CSE ${a.year}</b></td><td>${a.slug ? `<a href="${topperUrl(a.slug)}">${esc(a.name)}</a>` : esc(a.name)} <span class="muted">· ${esc(a.optional)}</span></td><td class="n">${fmt(a.written)}</td><td class="n">${a.interview}</td><td class="n blue"><b>${fmt(a.total)}</b></td><td class="n">${a.cutoff ? `${fmt(a.cutoff)} <span class="muted">(+${a.total - a.cutoff})</span>` : '<span class="muted">Not yet published</span>'}</td></tr>`).join("");
const gaps = h.air1.filter((a) => a.cutoff).map((a) => a.total - (a.cutoff ?? 0));
const maxGap = Math.max(...h.gaps.map((g) => g.gap), 1);

const pages: string[] = [];

// 1. Cover
pages.push(page(`
  <div class="cover-top"><span class="brand big">${MARK(40)}<b>UPSCPrepNotes</b></span><span class="muted">Free edition · ${month}</span></div>
  <div class="cover-main">
    <h1>Topper Marks<br><span class="hl">Handbook</span></h1>
    <p class="lead">The highest marks in every UPSC Mains paper and the interview, what a typical topper scores, and what separates AIR 1–10 from the rest. From ${h.n} real marksheets of rank holders, CSE ${h.yearsLabel}.</p>
  </div>
  <div class="sheet">
    <div class="sheet-head"><span>Index of marks</span><span>Median topper · CSE ${h.yearsLabel}</span></div>
    ${(["essay", "gs1", "gs2", "gs3", "gs4", "optional", "interview"] as const).map((k) => `<div class="sheet-row"><span>${esc(rec(k).label)}</span><span class="dots"></span><span class="n">${rec(k).median}</span></div>`).join("")}
    <div class="sheet-row total"><span>The median topper</span><span class="dots"></span><span class="n"><span class="ring">${fmt(total.median)}</span></span></div>
    <p class="sheet-note">Median marks of ${h.n} rank holders. Out of 2,025.</p>
  </div>
  <div class="cover-foot"><span>Learn from the real thing.</span><a href="${link("/toppers/highest-marks-in-upsc")}">upscprepnotes.in</a></div>
`, { cover: true }));

// 2. How to read + how marks add up + findings
pages.push(page(`
  <h2>Before you start</h2>
  <p>This handbook answers one question with real numbers: <b>what do UPSC toppers actually score?</b> Every figure comes from the marks UPSC publishes for recommended candidates after each final result. We use a marksheet only when every paper is present and adds up. That leaves ${h.n}: ${h.perYear.map((y) => `${y.n} from CSE ${y.year}`).join(", ")}.</p>
  <p>Read the medians before the records. A record tells you what is possible. The median tells you what is normal for someone who made the list, and that is the number to plan around.</p>
  <h2>How UPSC marks add up</h2>
  <table>
    <thead><tr><th>Paper</th><th class="n">Marks</th><th>Counts for rank?</th></tr></thead>
    <tbody>
      <tr><td>Paper A (Indian language) and Paper B (English)</td><td class="n">300 each</td><td>No, qualifying only</td></tr>
      <tr><td>Essay</td><td class="n">250</td><td>Yes</td></tr>
      <tr><td>General Studies I, II, III and IV (Ethics)</td><td class="n">250 each</td><td>Yes</td></tr>
      <tr><td>Optional Papers I and II</td><td class="n">250 each</td><td>Yes</td></tr>
      <tr class="sum"><td>Written total</td><td class="n">1,750</td><td></td></tr>
      <tr><td>Interview (Personality Test)</td><td class="n">275</td><td>Yes</td></tr>
      <tr class="sum"><td>Final total</td><td class="n">2,025</td><td></td></tr>
    </tbody>
  </table>
  <p class="small">Prelims only decides who sits Mains. If you fail either language paper, the rest of your Mains is not evaluated. Check the qualifying standard in the notification for your year.</p>
  <h2>Six things the data says</h2>
  <ol class="findings">
    <li><b>Nobody crossed 150 in Essay.</b> The record is ${essay.best}. Only ${essay.strongCount} of ${h.n} toppers reached ${essay.strongLine}.</li>
    <li><b>GS III is everyone's weakest paper.</b> In ${h.top10.gs3Weakest} of ${h.top10.n} AIR 1–10 marksheets, it was the lowest of the five common papers. The median topper scored ${gs3.median}.</li>
    <li><b>Ethics is where GS marks are easiest to bank.</b> Median ${gs4.median}, record ${gs4.best}.</li>
    <li><b>The top 10 win on GS and Essay, not the optional.</b> ${h.gsGap} of their ${top.med.written - rest.med.written}-mark written lead over ranks below 300 comes from the four GS papers.</li>
    <li><b>No topper is perfect.</b> ${h.top100.below100} of ${h.top100.n} top-100 rankers scored below 100 in at least one GS paper.</li>
    <li><b>The interview can move you hundreds of ranks.</b>${h.swing ? ` Two candidates with ${h.swing.a.written} and ${h.swing.b.written} written marks finished at AIR ${h.swing.a.rank} and AIR ${h.swing.b.rank}.` : ""}</li>
  </ol>
`, { title: "Start here" }));

// 3. Records + AIR 1
pages.push(page(`
  <h2>Highest marks in every paper</h2>
  <p>Records across ${h.n} complete marksheets, with the median topper and the score that puts you in the top 10% of rank holders.</p>
  <table>
    <thead><tr><th>Paper</th><th class="n">Record</th><th>Scored by</th><th class="n">Median</th><th class="n">Top 10%</th></tr></thead>
    <tbody>${[essay, gs1, gs2, gs3, gs4, opt, intv, written, total].map((r) => `<tr${r.key === "written" || r.key === "total" ? ' class="sum"' : ""}><td><b>${esc(r.label)}</b></td><td class="n blue"><b>${fmt(r.best)}</b> <span class="muted">of ${fmt(r.max)}</span></td><td>${r.holders.slice(0, 2).map((t) => `${tl(t)} <span class="muted">AIR ${t.rank}, ${t.year}</span>`).join("<br>")}</td><td class="n">${fmt(r.median)}</td><td class="n">${fmt(r.top10)}</td></tr>`).join("")}</tbody>
  </table>
  <h2>AIR 1 vs the cut-off</h2>
  <p>The cut-off is the General-category score of the last person on the final list.</p>
  <table>
    <thead><tr><th>Year</th><th>AIR 1</th><th class="n">Written</th><th class="n">Interview</th><th class="n">Total</th><th class="n">Cut-off</th></tr></thead>
    <tbody>${air1Rows}</tbody>
  </table>
  <div class="callout"><b>${Math.min(...gaps)} to ${Math.max(...gaps)} marks.</b> That is how far AIR 1 finished above the last General-category selection. Over eight papers, it is about ${Math.round(Math.min(...gaps) / 8)} to ${Math.round(Math.max(...gaps) / 8)} marks a paper. The gap between "selected" and "AIR 1" is a steady extra 10 to 15 marks almost everywhere.</div>
  <p class="small">Cut-offs from UPSC final results, CSE ${CUTOFFS.map((c) => c.year).join(", ")}. Mains cut-offs (out of 1,750): ${CUTOFFS.map((c) => c.mains).join(", ")}.</p>
`, { title: "Records" }));

// 4. Papers I
pages.push(page(`
  <h2>Paper by paper</h2>
  ${paperBlock(essay, [
    `Nobody in ${h.n} marksheets crossed 150. The median topper scored ${essay.median}, and only ${essay.strongCount} reached ${essay.strongLine}.`,
    `Essay is where the very top pulls away: the median AIR 1–10 essay was ${top.med.essay}, against ${rest.med.essay} for ranks below 300. That ${gap("essay")}-mark gap comes from one paper. <b>Write one full essay a week under time, and get it marked hard.</b>`,
  ])}
  ${paperBlock(gs1, [
    `Scores sit in a tight band. ${gs1.top10} already puts you among the best rank holders. <b>Make sure you never drop below 95, rather than chasing 130.</b>`,
  ])}
  ${paperBlock(gs2, [
    `The friendliest GS paper after Ethics: ${gs2.strongCount} of ${h.n} crossed ${gs2.strongLine}. <b>The right article or committee, a current example and a short way forward, every time.</b>`,
  ])}
`, { title: "Essay, GS I, GS II" }));

// 5. Papers II
pages.push(page(`
  ${paperBlock(gs3, [
    `The hardest paper on the marksheet. In ${h.top10.gs3Weakest} of the ${h.top10.n} AIR 1–10 marksheets we hold, GS III was their weakest paper, and the top-10 lead here is only ${gap("gs3")} marks.`,
    `<b>Do not try to win GS III. Protect it.</b> Aim for the mid-90s with data-backed answers, and spend the hours you save on Essay and Ethics.`,
  ])}
  ${paperBlock(gs4, [
    `The highest-scoring GS paper: median ${gs4.median}, and ${gs4.strongCount} toppers crossed ${gs4.strongLine}. Case studies are half the paper. <b>Name the stakeholders, weigh the options, choose one.</b>`,
  ])}
  ${paperBlock(opt, [
    `500 marks with the widest spread of any paper. Only ${opt.strongCount} of ${h.n} crossed 300. The top 10 do not win here: their median optional was ${top.med.optional}, against ${rest.med.optional} below AIR 300. <b>A strong optional keeps you in the race; it rarely decides AIR 1.</b>`,
  ])}
`, { title: "GS III, Ethics, Optional" }));

// 6. Interview + top 10
pages.push(page(`
  ${paperBlock(intv, [
    `${h.counts.interviewUnder160} toppers made the final list with less than 160, so a weak interview does not end your chances if your written is strong.`,
  ])}
  ${h.swing ? `<div class="swing">
    <div><p class="muted">CSE ${h.swing.a.year} · ${esc(h.swing.a.optional)}</p><p class="nm">${tl(h.swing.a)}</p><p>Written <b>${h.swing.a.written}</b> · Interview <b>${h.swing.a.interview}</b></p><p class="rank">AIR ${h.swing.a.rank}</p></div>
    <div><p class="muted">CSE ${h.swing.b.year} · ${esc(h.swing.b.optional)}</p><p class="nm">${tl(h.swing.b)}</p><p>Written <b>${h.swing.b.written}</b> · Interview <b>${h.swing.b.interview}</b></p><p class="rank">AIR ${h.swing.b.rank}</p></div>
  </div>
  <p>Almost the same written marks. A ${h.swing.a.interview - h.swing.b.interview}-mark difference in the interview separated them by ${h.swing.ranks} ranks. The interview is 275 marks you can prepare for: your application form, your state, your subject and the last six months of news cover most of it.</p>` : ""}
  <h2>What the top 10 do differently</h2>
  <p>How far the median AIR 1–10 marksheet is ahead of the median rank below 300, paper by paper.</p>
  <div class="bars">${h.gaps.map((g) => `<div class="bar"><span class="lbl">${esc(g.short)}</span><span class="b"><span style="width:${(g.gap / maxGap) * 100}%"></span></span><span class="v">+${g.gap}</span></div>`).join("")}</div>
  <p>The top 10 are not people with one brilliant paper. <b>They are people with no bad paper.</b></p>
`, { title: "Interview and rank" }));

// 7. Bands + optionals
pages.push(page(`
  <h2>A typical marksheet at every rank</h2>
  <table class="tight">
    <thead><tr><th>Rank band</th>${["essay", "gs1", "gs2", "gs3", "gs4", "optional", "interview", "total"].map((k) => `<th class="n">${esc(rec(k).short)}</th>`).join("")}</tr></thead>
    <tbody>${h.bands.map((b) => `<tr><td><b>${esc(b.label)}</b> <span class="muted">${b.n}</span></td>${(["essay", "gs1", "gs2", "gs3", "gs4", "optional", "interview", "total"] as const).map((k) => `<td class="n${k === "total" ? " blue" : ""}">${k === "total" ? `<b>${fmt(b.med[k])}</b>` : fmt(b.med[k])}</td>`).join("")}</tr>`).join("")}</tbody>
  </table>
  <p class="small">Median marks in each band. The number after the band is how many marksheets it holds.</p>
  <h2>Highest marks by optional subject</h2>
  <table class="tight">
    <thead><tr><th>Optional</th><th class="n">Toppers</th><th class="n">Median</th><th class="n">Highest</th><th>Scored by</th></tr></thead>
    <tbody>${h.optionals.map((o) => `<tr><td><b>${o.slug ? `<a href="${link(`/optional/${o.slug}`)}">${esc(o.subject)}</a>` : esc(o.subject)}</b></td><td class="n">${o.n}</td><td class="n">${o.median}</td><td class="n blue"><b>${o.best}</b></td><td>${tl(o.bestBy)} <span class="muted">AIR ${o.bestBy.rank}, ${o.bestBy.year}</span></td></tr>`).join("")}</tbody>
  </table>
  <p class="small">Both optional papers together, out of 500. Subjects with at least five marksheets. A higher median usually reflects a smaller group with a strong background in the subject, not an easier paper.</p>
`, { title: "Rank bands and optionals" }));

// 8. Target + action plan
pages.push(page(`
  <h2>Your target marksheet</h2>
  <p>Aim at a typical topper, not the record. Write your own last mock or Mains marks in the last column and look for the paper with the biggest gap.</p>
  <table>
    <thead><tr><th>Paper</th><th class="n">To make the list</th><th class="n">Top-100 rank</th><th class="n">Record</th><th class="n">Your marks</th></tr></thead>
    <tbody>${(["essay", "gs1", "gs2", "gs3", "gs4", "optional", "written", "interview", "total"] as const).map((k) => `<tr${k === "written" || k === "total" ? ' class="sum"' : ""}><td>${esc(rec(k).label)}</td><td class="n">${fmt(tAll.med[k])}</td><td class="n">${fmt(t100.med[k])}</td><td class="n muted">${fmt(rec(k).best)}</td><td class="n write"></td></tr>`).join("")}</tbody>
  </table>
  <p class="small">Medians of all ${tAll.n} rank holders, and of the ${t100.n} who ranked inside 100. Medians do not add up exactly to the totals.</p>
  <h2>Five moves this data supports</h2>
  <ol class="findings">
    <li><b>Fix your weakest paper first.</b> The top 10 have no paper far below the median. Find yours in the table above.</li>
    <li><b>Treat Essay as two papers.</b> It gives the biggest top-10 lead of any single paper. One timed essay a week, marked by someone strict.</li>
    <li><b>Bank Ethics.</b> It is the most generous GS paper. Practise case studies until the structure is automatic.</li>
    <li><b>Protect GS III, don't chase it.</b> The mid-90s is already a top-10-percent score.</li>
    <li><b>Prepare the interview like a paper.</b> It is 275 marks, and near the middle of the list each mark is worth several ranks.</li>
  </ol>
  <div class="callout"><b>See the answers behind these marks.</b> Every topper named in this handbook has a free profile with marks, strategy and answer copies at <a href="${link("/toppers")}">upscprepnotes.in/toppers</a>. Sort all ${h.n} marksheets by any paper at <a href="${link("/toppers/marks-database")}">upscprepnotes.in/toppers/marks-database</a>.</div>
`, { title: "Plan" }));

// 9. Method + back
pages.push(page(`
  <h2>Where the numbers come from</h2>
  <p>After each final result, UPSC publishes the marks of every recommended candidate. We take the paper-wise marks of rank holders from those lists and keep a marksheet only when every paper is present, within the maximum, and adds up to the published total.</p>
  <p><b>Two honest limits.</b> This is a sample of toppers, not every candidate, so the medians are higher than for the whole list. And "highest" means highest in this data: UPSC does not publish an all-time record, and an unlisted candidate may have scored more in a single paper.</p>
  <p>Spotted an error? Write to <b>hello@upscprepnotes.in</b> with the name, year and paper, and we will check it against the UPSC list.</p>
  <h2>Keep going</h2>
  <ul class="links">
    <li><a href="${link("/toppers/highest-marks-in-upsc")}"><b>Highest marks in UPSC</b></a><span>This handbook online, updated as new marks are published.</span></li>
    <li><a href="${link("/toppers/marks-database")}"><b>Topper marks database</b></a><span>Every marksheet, sortable by any paper.</span></li>
    <li><a href="${link("/content/upsc-topper-answer-copies")}"><b>Topper answer copies</b></a><span>How the marks above were actually written.</span></li>
    <li><a href="${link("/content/upsc-optional-subject-marks-analysis")}"><b>Optional subject marks analysis</b></a><span>Which optional scores, and why.</span></li>
    <li><a href="${link("/content/how-to-write-upsc-mains-answers")}"><b>How to write Mains answers</b></a><span>Structure, time and presentation.</span></li>
    <li><a href="${link("/content/data-methodology-and-editorial-standards")}"><b>Data methodology</b></a><span>How we collect and check marks.</span></li>
  </ul>
  <div class="back">
    <span class="brand big">${MARK(44)}<b>UPSCPrepNotes</b></span>
    <p>The archive of real topper work. Marksheets, answer booklets and paper-by-paper marks of UPSC rank holders, shown as they are.</p>
    <p class="muted">Free to share. Please link back to upscprepnotes.in when you do. ${month} edition.</p>
  </div>
`, { title: "Method" }));

const css = `
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body { font-family: "Funnel Sans", -apple-system, "Segoe UI", Roboto, Arial, sans-serif; color: #0b0c10; font-size: 10.5pt; line-height: 1.5; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
a { color: #1f3fd6; text-decoration: none; }
b { font-weight: 700; }
.page { width: 210mm; height: 297mm; padding: 14mm 16mm 12mm; position: relative; page-break-after: always; overflow: hidden; display: flex; flex-direction: column; }
.page:last-child { page-break-after: auto; }
.run { display: flex; justify-content: space-between; align-items: center; font-size: 8.5pt; color: #858a96; }
header.run { border-bottom: 1px solid rgba(11,12,16,.08); padding-bottom: 3mm; margin-bottom: 6mm; }
footer.run { border-top: 1px solid rgba(11,12,16,.08); padding-top: 3mm; margin-top: auto; }
footer.run a { color: #858a96; }
.brand { display: inline-flex; align-items: center; gap: 6px; color: #0b0c10; font-size: 9.5pt; letter-spacing: -0.02em; }
.brand.big { font-size: 15pt; gap: 10px; }
.body { flex: 1; }
h1 { font-size: 46pt; line-height: 1.0; letter-spacing: -0.035em; margin: 0; font-weight: 700; }
h2 { font-size: 17pt; letter-spacing: -0.022em; line-height: 1.15; margin: 7mm 0 2.5mm; font-weight: 700; }
.body > h2:first-child { margin-top: 0; }
h3 { font-size: 12.5pt; margin: 0; letter-spacing: -0.015em; }
p { margin: 0 0 2.5mm; color: #3f4450; }
p b, li b { color: #0b0c10; }
.muted { color: #858a96; }
.small { font-size: 8.5pt; color: #858a96; }
.blue { color: #1f3fd6; }
.hl { background: linear-gradient(transparent 52%, #ffe45c 52%, #ffe45c 92%, transparent 92%); padding: 0 2mm; }
table { width: 100%; border-collapse: collapse; font-size: 9pt; margin: 2mm 0 2.5mm; font-variant-numeric: tabular-nums; }
th { text-align: left; font-weight: 400; color: #858a96; border-bottom: 1px solid rgba(11,12,16,.14); padding: 1.6mm 2mm; }
td { border-bottom: 1px solid rgba(11,12,16,.08); padding: 1.6mm 2mm; vertical-align: top; }
table.tight td, table.tight th { padding: 1.3mm 1.6mm; }
.n { text-align: right; white-space: nowrap; }
tr.sum td { background: #f4f5f9; font-weight: 700; }
td.write { border-bottom: 1px solid #1f3fd6; min-width: 22mm; }
.callout { background: #e9edff; border-radius: 4mm; padding: 4mm 5mm; color: #13238a; margin: 4mm 0 3mm; font-size: 10pt; }
.callout b { color: #13238a; }
.findings { margin: 0; padding-left: 5mm; color: #3f4450; }
.findings li { margin-bottom: 2.2mm; padding-left: 1mm; }
/* first block on a page sits under the running header */
.body > .paper-block:first-child { border-top: 0; padding-top: 0; }
.paper-block { border-top: 1px solid rgba(11,12,16,.08); padding-top: 4mm; margin-bottom: 5mm; }
.pb-head { display: flex; justify-content: space-between; align-items: baseline; gap: 4mm; margin-bottom: 2.5mm; }
.pb-head .rec { margin: 0; font-size: 9pt; text-align: right; }
.pb-head .rec b { color: #1f3fd6; font-size: 13pt; }
.scale { margin: 1mm 0 3mm; }
.track { position: relative; height: 3mm; background: #f4f5f9; border-radius: 2mm; }
.fill { position: absolute; left: 0; top: 0; bottom: 0; background: #1f3fd6; border-radius: 2mm; }
.tick { position: absolute; top: -1mm; bottom: -1mm; width: 0.8mm; border-radius: 1mm; }
.tick.t10 { background: #ffd21a; }
.tick.best { background: #ff4a3d; }
.legend { display: flex; gap: 5mm; font-size: 8pt; color: #3f4450; margin-top: 1.8mm; }
.legend .max { margin-left: auto; color: #858a96; }
.sw { display: inline-block; width: 2.5mm; height: 2.5mm; border-radius: 1mm; margin-right: 1.2mm; vertical-align: -0.3mm; }
.sw.med { background: #1f3fd6; } .sw.t10 { background: #ffd21a; } .sw.best { background: #ff4a3d; }
.bars { margin: 3mm 0 4mm; }
.bar { display: grid; grid-template-columns: 22mm 1fr 12mm; align-items: center; gap: 3mm; margin-bottom: 2mm; font-size: 9pt; }
.bar .b { height: 3.4mm; background: #f4f5f9; border-radius: 2mm; overflow: hidden; }
.bar .b span { display: block; height: 100%; background: #1f3fd6; border-radius: 2mm; }
.bar .v { text-align: right; font-weight: 700; font-variant-numeric: tabular-nums; }
.swing { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; margin: 2mm 0 3mm; }
.swing > div { border: 1px solid rgba(11,12,16,.14); border-radius: 4mm; padding: 4mm; }
.swing p { margin: 0 0 1mm; }
.swing .nm { font-weight: 700; color: #0b0c10; font-size: 11pt; }
.swing .rank { color: #d9342a; font-weight: 700; font-size: 16pt; margin-top: 2mm; }
.links { list-style: none; padding: 0; margin: 0; }
.links li { display: flex; flex-direction: column; border-bottom: 1px solid rgba(11,12,16,.08); padding: 2.2mm 0; }
.links span { color: #3f4450; font-size: 9pt; }
.back { margin-top: 10mm; background: #ffe45c; border-radius: 6mm; padding: 8mm; }
.back p { color: #5c4a00; margin-top: 3mm; }
/* Cover */
.cover { padding: 18mm; background: #fff; }
.cover-top { display: flex; justify-content: space-between; align-items: center; font-size: 9.5pt; }
.cover-main { margin-top: 30mm; }
.cover .lead { font-size: 13pt; line-height: 1.5; max-width: 140mm; margin-top: 8mm; color: #3f4450; }
.sheet { margin-top: 18mm; border: 1px solid rgba(11,12,16,.14); border-left: 2.5mm solid #ff4a3d; border-radius: 3mm; padding: 6mm 8mm; width: 128mm; background: #fff; }
.sheet-head { display: flex; justify-content: space-between; font-size: 8.5pt; color: #858a96; margin-bottom: 2mm; }
.sheet-row { border-bottom: 1px solid rgba(31,63,214,.12); display: flex; align-items: baseline; gap: 3mm; height: 8.6mm; line-height: 8.6mm; font-size: 10.5pt; }
.sheet-row .dots { flex: 1; border-bottom: 1px dotted rgba(11,12,16,.25); transform: translateY(-2mm); }
.sheet-row .n { font-weight: 700; color: #1f3fd6; font-variant-numeric: tabular-nums; }
.sheet-row.total { font-weight: 700; }
.ring { display: inline-block; border: 2px solid #ff4a3d; border-radius: 50%; padding: 0 3mm; line-height: 7mm; color: #d9342a; transform: rotate(-4deg); }
.sheet-note { font-size: 8pt; margin-top: 2mm; }
.cover-foot { position: absolute; left: 18mm; right: 18mm; bottom: 16mm; display: flex; justify-content: space-between; font-weight: 700; font-size: 11pt; }
`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>UPSC Topper Marks Handbook · UPSCPrepNotes</title>
<meta name="author" content="UPSCPrepNotes">
<meta name="description" content="Highest marks in every UPSC Mains paper and the interview, from ${h.n} real topper marksheets (CSE ${h.yearsLabel}).">
<meta name="keywords" content="highest marks in UPSC, UPSC topper marks, UPSC marksheet, highest marks in ethics, highest marks in essay, UPSC cut-off">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Funnel+Sans:wght@400;700&display=block" rel="stylesheet">
<style>${css}</style></head><body>${pages.join("\n")}</body></html>`;

// Share image (1200 x 630)
const og = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Funnel+Sans:wght@400;700&display=block" rel="stylesheet">
<style>
*{box-sizing:border-box} body{margin:0;width:1200px;height:630px;font-family:"Funnel Sans",Arial,sans-serif;background:#fff;color:#0b0c10;position:relative;overflow:hidden}
.brand{position:absolute;left:72px;top:60px;display:flex;align-items:center;gap:14px;font-weight:700;font-size:28px;letter-spacing:-.02em}
h1{position:absolute;left:72px;top:150px;margin:0;font-size:72px;line-height:1.04;letter-spacing:-.035em;width:660px}
.hl{background:linear-gradient(transparent 55%,#ffe45c 55%,#ffe45c 92%,transparent 92%);padding:0 8px}
p{position:absolute;left:72px;top:400px;width:560px;font-size:27px;line-height:1.4;color:#3f4450;margin:0}
.dom{position:absolute;left:72px;bottom:56px;font-size:22px;color:#858a96}
.sheet{position:absolute;right:72px;top:96px;width:400px;border:1px solid rgba(11,12,16,.14);border-left:10px solid #ff4a3d;border-radius:14px;padding:26px 30px;transform:rotate(2deg);box-shadow:0 2px 2px rgba(11,12,16,.04),0 24px 48px -16px rgba(40,30,10,.28);background:repeating-linear-gradient(#fff 0,#fff 46px,rgba(31,63,214,.10) 46px,rgba(31,63,214,.10) 47px)}
.row{display:flex;justify-content:space-between;height:47px;line-height:47px;font-size:22px}
.row b{color:#1f3fd6}
.ring{border:3px solid #ff4a3d;border-radius:50%;padding:0 14px;color:#d9342a;display:inline-block;line-height:38px;transform:rotate(-5deg)}
</style></head><body>
<div class="brand">${MARK(44)}UPSCPrepNotes</div>
<h1>Highest marks in UPSC, <span class="hl">paper by paper</span></h1>
<p>Records, medians and AIR 1 vs the cut-off, from ${h.n} real topper marksheets.</p>
<div class="dom">upscprepnotes.in</div>
<div class="sheet">
${[essay, gs1, gs2, gs3, gs4, opt, intv].map((r) => `<div class="row"><span>${esc(r.short)}</span><b>${r.best}</b></div>`).join("")}
<div class="row"><span><b style="color:#0b0c10">Total</b></span><span class="ring">${fmt(total.best)}</span></div>
</div>
</body></html>`;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "handbook-"));
const htmlPath = path.join(tmp, "handbook.html");
const ogPath = path.join(tmp, "og.html");
fs.writeFileSync(htmlPath, html);
fs.writeFileSync(ogPath, og);
fs.mkdirSync("public/handbook", { recursive: true });
const pdfOut = path.resolve("public/handbook/upsc-topper-marks-handbook.pdf");
const ogOut = path.resolve("public/og/marks-handbook.png");
const common = ["--headless=new", "--disable-gpu", "--no-sandbox", "--hide-scrollbars", "--virtual-time-budget=8000"];
execFileSync(CHROME, [...common, "--no-pdf-header-footer", `--print-to-pdf=${pdfOut}`, `file://${htmlPath}`], { stdio: "ignore" });
execFileSync(CHROME, [...common, "--window-size=1200,630", `--screenshot=${ogOut}`, `file://${ogPath}`], { stdio: "ignore" });
if (process.argv.includes("--keep-html")) fs.copyFileSync(htmlPath, path.resolve(process.argv[process.argv.indexOf("--keep-html") + 1]));
console.log(`PDF  ${pdfOut} (${Math.round(fs.statSync(pdfOut).size / 1024)} KB, ${pageNo} pages)`);
console.log(`OG   ${ogOut}`);
process.exit(0);

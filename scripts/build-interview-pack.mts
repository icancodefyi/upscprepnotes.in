/**
 * Builds the UPSC Interview Pack (paid PDF) and its store preview images.
 *
 *   npx tsx --tsconfig tsconfig.json scripts/build-interview-pack.mts [--keep-html path]
 *
 * Reads the live marksheets (read-only) for the interview-marks pages and the coded board transcripts
 * from data/content/interview-transcripts.ts. Output:
 *   private/products/upsc-interview-pack.pdf        paid file, upload to the CDN (never to public/)
 *   public/store/interview-pack/page-*.jpg           store previews (a few pages only)
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

const { getInterviewData } = await import("../lib/interview-marks");
const { IV_TRANSCRIPTS, transcriptStats } = await import("../data/content/interview-transcripts");
const d = await getInterviewData();
const ts = transcriptStats();

const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const SITE = "https://upscprepnotes.in";
const fmt = (x: number) => x.toLocaleString("en-IN");
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const link = (p: string) => `${SITE}${p}${p.includes("?") ? "&" : "?"}utm_source=interview-pack&utm_medium=pdf`;
const tl = (t: { name: string; slug: string }) => (t.slug ? `<a href="${link(`/upsc-topper/${t.slug}`)}">${esc(t.name)}</a>` : esc(t.name));
const month = new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });
const row = (k: string) => ts.rows.find((r) => r.key === k)!;

const MARK = (size: number) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24"><rect x="1" y="1" width="22" height="22" rx="6" fill="#0b0c10"/><path d="M7.5 5v14" stroke="#ff4a3d" stroke-width="1.4" stroke-linecap="round"/><path d="M10.5 8.5h7M10.5 12h7" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/><path d="M10.5 15.5h4.5" stroke="#8fa2ff" stroke-width="1.6" stroke-linecap="round"/></svg>`;

let pageNo = 0;
function page(body: string, opts: { cover?: boolean; title?: string } = {}) {
  pageNo++;
  if (opts.cover) return `<section class="page cover">${body}</section>`;
  return `<section class="page">
  <header class="run"><span class="brand">${MARK(18)}<b>UPSCPrepNotes</b></span><span>Interview Pack${opts.title ? ` · ${esc(opts.title)}` : ""}</span></header>
  <div class="body">${body}</div>
  <footer class="run"><span>For your own preparation. Please don't share this file.</span><span>${pageNo}</span></footer>
</section>`;
}

const lines = (k: number) => `<div class="lines">${'<span></span>'.repeat(k)}</div>`;
const maxBucket = Math.max(...d.buckets.map((b) => b.count));
const maxRow = Math.max(...ts.rows.map((r) => r.count));
const pair0 = d.pairs[0];

const pages: string[] = [];

// 1. Cover
pages.push(page(`
  <div class="cover-top"><span class="brand big">${MARK(40)}<b>UPSCPrepNotes</b></span><span class="muted">${month} edition</span></div>
  <div class="cover-main">
    <h1>UPSC Interview<br><span class="hl">Pack</span></h1>
    <p class="lead">What the Personality Test is worth, what boards actually ask, and a 30-day plan to prepare for it. Built from ${d.n} toppers' interview marks and ${ts.n} real board transcripts from the last interview round.</p>
  </div>
  <div class="sheet">
    <div class="sheet-head"><span>Inside</span><span>Page</span></div>
    ${[
      ["What the interview is worth", 3],
      ["What boards actually ask", 6],
      ["Your DAF, field by field", 8],
      ["Your degree, home state and hobbies", 10],
      ["How to answer each kind of question", 12],
      ["Question bank: 150 questions", 14],
      ["The 30-day plan", 19],
      ["Mock scorecard and interview day", 21],
    ].map(([t, p]) => `<div class="sheet-row"><span>${t}</span><span class="dots"></span><span class="n">${p}</span></div>`).join("")}
    <p class="sheet-note">Interview marks: CSE ${d.yearsLabel}. Transcripts: CSE 2025 boards, January–February 2026.</p>
  </div>
  <div class="cover-foot"><span>275 marks you can prepare for.</span><span>upscprepnotes.in</span></div>
`, { cover: true }));

// 2. How to use
pages.push(page(`
  <h2>How to use this pack</h2>
  <p>The interview is the one stage of UPSC where most of the questions come from a document you wrote yourself: your Detailed Application Form (DAF). That makes it the most predictable 275 marks in the exam, and the one most people prepare for last.</p>
  <p>This pack does three things:</p>
  <ol class="findings">
    <li><b>Shows you what the interview is worth</b>, using the real interview marks of ${d.n} rank holders. A strong interview is worth hundreds of ranks.</li>
    <li><b>Shows you what boards actually ask.</b> We read ${ts.n} transcripts from the CSE 2025 interviews (January–February 2026) and sorted all ${ts.total} questions. About ${ts.dafShare}% came straight from the candidate's DAF, and most of the rest were current affairs linked to it.</li>
    <li><b>Gives you a plan</b>: a field-by-field DAF worksheet, 150 practice questions, answer methods for each kind of question, and a 30-day schedule.</li>
  </ol>
  <h2>The timeline</h2>
  <table>
    <thead><tr><th>Stage</th><th>When</th><th>What to do</th></tr></thead>
    <tbody>
      <tr><td><b>Mains result</b></td><td>Not yet announced. Past gaps suggest mid-November 2026.</td><td>Start the DAF worksheet (page 8) now. Do not wait for the result.</td></tr>
      <tr><td><b>DAF-II window</b></td><td>Usually about a week, announced with the result</td><td>Fill it carefully. Everything you write becomes a question.</td></tr>
      <tr><td><b>Interviews</b></td><td>Last round ran January–February 2026; earlier rounds ran December to April</td><td>The 30-day plan (page 19). Start it the day the result is out.</td></tr>
      <tr><td><b>Final result</b></td><td>Usually March–April</td><td>Your rank comes from written + interview, out of 2,025.</td></tr>
    </tbody>
  </table>
  <p class="small">Dates for CSE 2026 are estimates from past cycles. Confirm every date and instruction on upsc.gov.in and in your e-summon letter.</p>
  <div class="callout"><b>Work with a pen.</b> Pages 9, 10, 11 and 21 are worksheets. The pack is most useful printed, filled in, and carried into every mock interview.</div>
`, { title: "Start here" }));

// 3. What it's worth
pages.push(page(`
  <h2>What the interview is worth</h2>
  <p>The Personality Test carries <b>275 of the 2,025 marks</b> that decide your rank. For the median topper in our data it was <b>${d.share}%</b> of the final score. UPSC describes it as an assessment of personal suitability for a career in public service, by a board that has your application form in front of it. It is meant to be a conversation, not a cross-examination, and it is not a test of how much you know.</p>
  <h2>What toppers actually score</h2>
  <div class="stats">
    <div><b>${d.median}</b><span>Median interview mark of ${d.n} rank holders</span></div>
    <div><b>${d.best}</b><span>Highest in our data: ${d.bestHolders.map((t) => `${tl(t)}, AIR ${t.rank} (${t.year})`).join(", ")}</span></div>
    <div><b>${d.lowest}</b><span>Lowest mark that still made the list: AIR ${d.lowestHolders[0].rank}</span></div>
  </div>
  <p>How the ${d.n} marks spread out, in 10-mark steps:</p>
  <div class="hist">${d.buckets.map((b) => `<div class="hcol"><span class="hv">${b.count}</span><span class="hb" style="height:${(b.count / maxBucket) * 100}%"></span><span class="hl2">${b.from}</span></div>`).join("")}</div>
  <p>Most toppers land between <b>${d.p10} and ${d.p90}</b>. Only ${d.count200} of ${d.n} reached 200, and ${d.countUnder160} made the final list with less than 160. Interview marks sit in a narrow band, so a few marks either way move you further than you'd think.</p>
  <h2>By rank</h2>
  <table>
    <thead><tr><th>Rank band</th><th class="n">Toppers</th><th class="n">Median interview</th><th class="n">Bottom 10% below</th><th class="n">Top 10% from</th></tr></thead>
    <tbody>${d.bands.map((b) => `<tr><td><b>${b.label}</b></td><td class="n">${b.n}</td><td class="n blue"><b>${b.median}</b></td><td class="n">${b.p10}</td><td class="n">${b.p90}</td></tr>`).join("")}</tbody>
  </table>
  <p class="small">CSE ${d.yearsLabel}: ${d.perYear.map((y) => `${y.n} from ${y.year}`).join(", ")}. The top-100 rankers here never went below ${d.top100.lowest}.</p>
`, { title: "Marks" }));

// 4. Swing
pages.push(page(`
  <h2>Same written marks, different lives</h2>
  <p>These are pairs from the same exam year whose written marks are within three of each other. The interview alone separated them.</p>
  ${d.pairs.slice(0, 3).map((p) => `<div class="swing">
    <div><p class="muted">CSE ${p.a.year}${p.a.optional ? ` · ${esc(p.a.optional)}` : ""}</p><p class="nm">${tl(p.a)}</p><p>Written <b>${p.a.written}</b> · Interview <b>${p.a.interview}</b></p><p class="rank">AIR ${p.a.rank}</p></div>
    <div><p class="muted">CSE ${p.b.year}${p.b.optional ? ` · ${esc(p.b.optional)}` : ""}</p><p class="nm">${tl(p.b)}</p><p>Written <b>${p.b.written}</b> · Interview <b>${p.b.interview}</b></p><p class="rank dim">AIR ${p.b.rank}</p></div>
  </div><p class="small swing-note">${p.gap} interview marks apart. ${fmt(p.ranks)} ranks apart.</p>`).join("")}
  <h2>A great written score doesn't carry you</h2>
  <p>${d.strongWrittenWeakIv.map((t) => `${tl(t)} wrote <b>${t.written}</b> in Mains in CSE ${t.year}, a top-tier score, and got <b>${t.interview}</b> in the interview: AIR ${t.rank}.`).join(" ")} With a median interview, both would have finished far higher.</p>
  <p>Across all ${d.n} toppers, the link between written and interview marks is close to zero (correlation ${d.correlation.toFixed(2)}). <b>Your Mains score tells you nothing about how your interview will go.</b> It is a separate paper, and it needs its own preparation.</p>
  <div class="callout"><b>What this means for you:</b> moving from ${d.p10} to ${d.median} is about ${d.median - d.p10} marks. Near the middle of the list, a few marks are worth several ranks, and ranks decide your service and cadre. No other 30 days of preparation in UPSC is worth as much.</div>
`, { title: "Rank swing" }));

// 5. Best scorers
pages.push(page(`
  <h2>The highest interview scores</h2>
  <p>The twelve best interview marks in our data. Each name links to the full marksheet and profile.</p>
  <table>
    <thead><tr><th>Topper</th><th class="n">Interview</th><th class="n">Written</th><th class="n">AIR</th><th>Optional</th></tr></thead>
    <tbody>${d.top.map((t) => `<tr><td><b>${tl(t)}</b> <span class="muted">${t.year}</span></td><td class="n blue"><b>${t.interview}</b></td><td class="n">${t.written ?? "–"}</td><td class="n">${t.rank}</td><td>${esc(t.optional || "–")}</td></tr>`).join("")}</tbody>
  </table>
  <p>Look at the written column. Several of these toppers had ordinary written scores (under 790), and the interview pulled them into a good rank. ${d.top.filter((t) => t.written && t.written < 790).map((t) => `${esc(t.name)} wrote ${t.written} and finished at AIR ${t.rank}.`).slice(0, 2).join(" ")}</p>
  <h2>Does the optional matter?</h2>
  <table class="tight">
    <thead><tr><th>Optional</th><th class="n">Toppers</th><th class="n">Median interview</th><th class="n">Highest</th></tr></thead>
    <tbody>${d.optionals.filter((o) => o.subject).map((o) => `<tr><td>${esc(o.subject)}</td><td class="n">${o.n}</td><td class="n">${o.median}</td><td class="n">${o.best}</td></tr>`).join("")}</tbody>
  </table>
  <p>Hardly. Most optionals have a median within a few marks of ${d.median}. Groups this small move around easily, so don't read a higher median as an advantage. Boards also ask few questions about the optional itself (see the next page).</p>
`, { title: "Best scores" }));

// 6. What boards ask
pages.push(page(`
  <h2>What boards actually ask</h2>
  <p>We read ${ts.n} transcripts from the CSE 2025 interviews (January–February 2026), written up by the candidates themselves. We sorted every one of the ${ts.total} questions into a category. The average interview had <b>${ts.avg} questions</b>; candidates who mentioned the time put it at 20–30 minutes.</p>
  <div class="bars wide">${ts.rows.map((r) => `<div class="bar"><span class="lbl">${esc(r.label)}</span><span class="b"><span style="width:${(r.count / maxRow) * 100}%"></span></span><span class="v">${r.share}%</span><span class="v2">${r.interviews} of ${ts.n}</span></div>`).join("")}</div>
  <p class="small">Left: share of all ${ts.total} questions. Right: in how many of the ${ts.n} interviews the category came up at least once.</p>
  <h2>Five things the transcripts show</h2>
  <ol class="findings">
    <li><b>Current affairs is the biggest single block (${row("current").share}%),</b> but it is rarely random. A civil engineer got drainage and coastal regulation; an electrical engineer got grid stability and transformers; a doctor got medical tourism and violence against doctors. <b>Your DAF picks your current affairs.</b></li>
    <li><b>Home state came up in ${ts.homeAsked} of the ${ts.homeKnown} interviews</b> where the candidate's state was known. Expect "why is your state behind on X" and "how would you fix it".</li>
    <li><b>Hobbies came up in ${ts.hobbyAsked} of the ${ts.hobbyKnown} interviews</b> where hobbies were listed, and one board asked nine hobby questions. They go deep: names, history, recent news, and the policy angle (pay parity in cricket, whether Formula One does anything for society).</li>
    <li><b>"Why civil services" was asked only ${row("why").count} times in ${ts.total} questions.</b> Prepare it, but don't spend a week on it. "Why did you leave your job" and "what have you done since graduating" came up more often.</li>
    <li><b>The optional was only ${row("optional").share}% of questions.</b> Revise its basics, and give more time to your graduation subject and home district.</li>
  </ol>
`, { title: "What boards ask" }));

// 7. Fourteen interviews
pages.push(page(`
  <h2>Fourteen interviews at a glance</h2>
  <p>One line per transcript, with three questions from each in our own words. Read the full transcripts at the links on page 22.</p>
  <table class="tight iv">
    <thead><tr><th>Board</th><th>Candidate</th><th class="n">Qs</th><th>Asked, among others</th></tr></thead>
    <tbody>${IV_TRANSCRIPTS.map((t) => {
      const q = Object.values(t.counts).reduce((a, b) => a + (b ?? 0), 0);
      return `<tr><td><b>${esc(t.board)}</b><br><span class="muted">${t.month}</span></td><td>${esc(t.background)}<br><span class="muted">${esc([t.optional, t.home].filter(Boolean).join(" · "))}</span></td><td class="n">${q}</td><td>${t.examples.slice(0, 3).map((e) => esc(e)).join("<br>")}</td></tr>`;
    }).join("")}</tbody>
  </table>
`, { title: "Transcripts" }));

// 8. DAF field by field
const DAF: [string, string, string, string][] = [
  ["Name", "Meaning of your name, famous people with your name. Ice-breakers.", "“What does your name mean?” “Full name or short name?”", "Know the meaning and one story behind it."],
  ["Home state, district, place of birth", "History, economy, problems, tourism, food, festivals, famous people. “Why is it behind?” “As DM, what would you fix?”", "Economic challenges of Jhansi. Why bridges collapse in Bihar. Why Kerala lags in industry. How to grow tourism in Jaipur.", "Build the district and state dossiers on page 11."],
  ["Mother tongue and languages", "Language policy, the three-language formula, teaching in the mother tongue.", "Should Hindi be pushed in southern states? Should early schooling be in the mother tongue?", "Have a calm, balanced view. These are sensitive."],
  ["School and college", "Why that college or subject, what you did there, why you left a good seat.", "Why leave an IIT seat for this? Were your professors approachable?", "One honest sentence on every choice you made."],
  ["Graduation subject", "Two to five technical questions, often linked to policy.", "Can you repair a transformer? What is grid instability? Explain relativity simply. What is game theory?", "Revise first-year fundamentals and the five biggest recent developments in your field."],
  ["Work experience and gaps", "What exactly you did, why you left, what your company or sector does. Gaps get asked directly.", "Why did you leave your R&D job? What have you done for the last four years?", "Write a 60-second account of every job and every gap."],
  ["Hobbies and interests", "The most-mined field. Depth, recent news, the policy angle.", "Do you travel or only watch travel vlogs? Pay parity in cricket. Which Madhubani painting do you like?", "Only list what you can talk about for ten minutes. See page 11."],
  ["Achievements, positions, volunteering", "What you did, and whether it worked.", "What did you do as NSS secretary? Did your repair camp have any real impact?", "Have one number or one result for every line."],
  ["Service and cadre preferences", "Why this service first, why this order.", "Why the Indian Forest Service? How will your MBA help you there?", "Know the work of your top three services."],
];
pages.push(page(`
  <h2>Your DAF, field by field</h2>
  <p>Every field of the DAF is a question waiting to be asked. Here is what each one tends to trigger, with real examples from the transcripts (paraphrased), and what to prepare.</p>
  <table class="tight daf">
    <thead><tr><th>Field</th><th>What it triggers</th><th>Seen in 2026</th><th>Prepare</th></tr></thead>
    <tbody>${DAF.map(([f, a, b, c]) => `<tr><td><b>${f}</b></td><td>${a}</td><td class="muted">${b}</td><td>${c}</td></tr>`).join("")}</tbody>
  </table>
  <div class="callout"><b>Two rules for filling DAF-II.</b> Write only what you can defend for ten minutes. And write it specifically: “played district-level cricket, opening batsman” invites better questions than “sports”. Check the current DAF-II instructions on upsc.gov.in; the fields can change between years.</div>
`, { title: "DAF" }));

// 9. DAF worksheet
pages.push(page(`
  <h2>DAF worksheet</h2>
  <p>Copy every line of your DAF into the left column, one entry per row. Then write the five questions a board is most likely to ask about it, and one line of your answer for each. A complete DAF usually comes to 25–40 entries; use more paper.</p>
  <table class="work">
    <thead><tr><th style="width:30%">DAF entry</th><th>Five likely questions, and your one-line answer</th></tr></thead>
    <tbody>${Array.from({ length: 6 }).map(() => `<tr><td></td><td>${lines(5)}</td></tr>`).join("")}</tbody>
  </table>
  <p class="small">Example: “Hobby: Madhubani painting” → Which painting do you like? What colours are used, and where do they come from? Does it have a GI tag? How can artists earn more from it? Have you painted recently?</p>
`, { title: "DAF worksheet" }));

// 10. Background questions
pages.push(page(`
  <h2>Your degree and your job</h2>
  <p>Boards lean on your graduation subject far more than your optional. In the transcripts, engineers and doctors got the most technical questions, almost always pulled towards a policy problem.</p>
  <table class="tight">
    <thead><tr><th style="width:24%">If you studied</th><th>Expect questions like</th></tr></thead>
    <tbody>
      <tr><td><b>Civil engineering</b></td><td>Why do bridges collapse? Drainage and flooding in cities. Coastal regulation. Building for climate. Why leave a top college for civil services?</td></tr>
      <tr><td><b>Electrical or electronics</b></td><td>Grid stability with solar and wind. Transformers and the power sector's finances. Electric vehicles and batteries. Who regulates electricity?</td></tr>
      <tr><td><b>Mechanical</b></td><td>Robotics and jobs. Manufacturing and imports. Drones. What happens to workers when factories automate?</td></tr>
      <tr><td><b>Computer science</b></td><td>AI and jobs, data protection, cyber security for ordinary people, digital public infrastructure.</td></tr>
      <tr><td><b>MBBS or health</b></td><td>Violence against doctors, out-of-pocket spending, medical tourism, lifestyle diseases, why leave medicine, AYUSH vs allopathy.</td></tr>
      <tr><td><b>Commerce, economics, banking</b></td><td>The rupee and the dollar, trade deals, Ponzi schemes, write-off vs waiver, SEZs, startups and valuations.</td></tr>
      <tr><td><b>Law</b></td><td>Landmark judgments, pendency, the new criminal laws, free legal aid, how judges are appointed.</td></tr>
      <tr><td><b>Sciences</b></td><td>Explain a concept from your subject simply, then its use: quantum technology, biotechnology and ageing, rare earths.</td></tr>
      <tr><td><b>Humanities</b></td><td>Your subject's thinkers and debates, applied to India today: rewriting textbooks, social change, inequality.</td></tr>
    </tbody>
  </table>
  <h2>Work, gaps and “why”</h2>
  <p>If you worked, expect: what exactly did you do, what does your company or department do, and why did you leave. If you have a gap, expect: what have you done since. In two of the fourteen transcripts the board asked directly what the candidate had done for the last several years.</p>
  <p><b>Write it down once, honestly, in under a minute each:</b></p>
  ${["What I did at each job or role, with one result", "Why I left", "What I did in my gap years", "Why civil services, in my own words, with one real moment behind it"].map((x) => `<p class="lbl2">${x}</p>${lines(2)}`).join("")}
`, { title: "Background" }));

// 11. Home + hobbies
pages.push(page(`
  <h2>Home district and state dossier</h2>
  <p>Home state came up in ${ts.homeAsked} of ${ts.homeKnown} interviews. Prepare one page each for your district and your state. Most questions fall into these boxes:</p>
  <div class="grid2">
    ${[
      ["History and identity", "Why it is famous, then and now; one historical figure; one monument or site most people don't know."],
      ["Economy", "The main industries and crops, the biggest employer, one big project and who benefits."],
      ["Problems", "The three biggest, with a number for each. Why it is behind on one of them."],
      ["Fixes", "As DM, what would you do first? One scheme that works there and one that doesn't."],
      ["People and culture", "Food, festivals, art, language, famous people. Two dishes and what goes in them."],
      ["Comparisons", "How it compares with a neighbouring state or district. Why one did better."],
    ].map(([h, p]) => `<div class="box"><b>${h}</b><p>${p}</p>${lines(3)}</div>`).join("")}
  </div>
  <h2>Hobbies: how deep they go</h2>
  <p>From the transcripts: a cricket fan was asked about a specific match date, pay parity and team balance; a travel-vlog watcher was asked whether they actually travel and how they got there; a painter was asked to describe a style and its colours. For every hobby, know:</p>
  <ul class="ticks"><li>When you last did it, and what exactly</li><li>Three names (people, works, teams) and why they matter</li><li>One piece of news from the last six months</li><li>The policy angle: how government, money or society touches it</li><li>What it has taught you, in one honest sentence</li></ul>
`, { title: "Home and hobbies" }));

// 12. How to answer
const METHODS: [string, string, string][] = [
  ["Opinion", "“Should India leave the WHO?”", "Give your view in the first sentence. Two reasons. One fair point for the other side. Close in one line. If you genuinely have no strong view, a reasoned middle path is fine; dodging is not."],
  ["“As DM, what would you do?”", "“A prisoner dies after a meal and cellmates are vomiting.”", "Immediate: safety and facts first (medical help, secure the scene). Law: what the rules require you to report and to whom. People: who must be informed and reassured. Fix: what stops it happening again."],
  ["Short talk", "“Give us a short talk on natural capital.”", "60–90 seconds: what it is, why it matters to India, two problems, one way forward. Stop. Let them ask."],
  ["You don't know", "“What is Pax Silica?”", "“I'm sorry, I don't know that.” Don't guess facts or numbers. If you know something close and relevant, offer it briefly. One honest “I don't know” costs far less than a confident wrong answer."],
  ["Pushback", "“Your points are mostly negative.”", "Don't defend yourself. Acknowledge it, add the other side, and keep your view if you still hold it. They are testing balance and temper, not the answer."],
  ["Personal", "“Why did you leave medicine?”", "One true story, specific and short. No clichés about serving the nation unless there is a real moment behind it."],
];
pages.push(page(`
  <h2>How to answer each kind of question</h2>
  <p>Six question types make up almost every interview. Each has a shape that works.</p>
  ${METHODS.map(([t, e, m]) => `<div class="method"><div class="mh"><b>${t}</b><span class="muted">${e}</span></div><p>${m}</p></div>`).join("")}
  <p class="small">The example questions are from the 2026 transcripts, paraphrased.</p>
`, { title: "Answering" }));

// 13. More on answering + current affairs map
const CA: [string, string][] = [
  ["The US and India", "Tariffs and trade talks, US foreign policy moves (Greenland, Iran, Venezuela came up), what India should do."],
  ["Neighbourhood", "Unrest in neighbouring countries and why India is stable; China and CPEC; the neighbourhood policy and its critics."],
  ["Global South and the UN", "Can India lead the Global South? UNSC reform, the WHO, multilateralism stalling."],
  ["Economy", "The rupee and the dollar, trade deals (India–EU), logistics, SEZs, startups and valuations, R&D spending."],
  ["Energy and environment", "Solar targets, grid stability, EVs and batteries, rare earths, coastal regulation, natural capital."],
  ["Internal security", "Narco-terrorism, coastal security since 2008, Left Wing Extremism and tribal development."],
  ["Federalism and society", "Delimitation and the north–south debate, language policy, ageing, gig work and 10-minute delivery."],
  ["Education and health", "NEP 2020, coaching dependence, student suicides, medical tourism, violence against doctors, public health spending."],
  ["Law and governance", "Electoral bonds, the new criminal laws, free legal aid, digital media and OTT regulation."],
];
pages.push(page(`
  <h2>Current affairs: the themes boards used</h2>
  <p>These are the themes that came up across the fourteen 2026 interviews. Expect the same kind of mix in your round, updated with whatever has happened since. For each theme, keep one page: the facts, two numbers, the main arguments on each side, and your view.</p>
  <table class="tight">
    <thead><tr><th style="width:26%">Theme</th><th>What came up</th></tr></thead>
    <tbody>${CA.map(([t, p]) => `<tr><td><b>${t}</b></td><td>${p}</td></tr>`).join("")}</tbody>
  </table>
  <h2>Habits that cost marks</h2>
  <ul class="ticks">
    <li><b>Guessing.</b> A confident wrong fact invites three follow-ups. Say you don't know.</li>
    <li><b>Long answers.</b> If an answer passes a minute, stop and let them steer. A 25-question interview leaves about a minute each.</li>
    <li><b>Arguing.</b> Hold your view politely. You can disagree with a board member without winning the point.</li>
    <li><b>Only negatives.</b> Boards notice when every answer is a list of problems. Give the progress too.</li>
    <li><b>DAF surprises.</b> Not knowing something about your own hobby, district or job is the most expensive mistake there is.</li>
    <li><b>Missing today's news.</b> One board asked what day it was and what was on the front page. Read the paper on interview morning.</li>
  </ul>
`, { title: "Current affairs" }));

// 14–17. Question bank
const QB: [string, string[]][] = [
  ["Introduction and you", [
    "Tell us about yourself, in a minute.", "What does your name mean?", "What have you done since you graduated?", "What is one thing you have changed your mind about recently?",
    "What is your biggest weakness, and what have you done about it?", "Who has influenced you most, and how?", "What would your friends say is your worst habit?", "Tell us about a failure and what it taught you.",
    "What did you do while waiting outside today?", "If this doesn't work out, what will you do?", "What would you do on your first day in a district?", "Describe India to a foreigner in a minute.",
  ]],
  ["Why civil services and services", [
    "Why civil services, and why now?", "Why leave a well-paid job for this?", "Why is this service your first preference?", "What does a District Collector actually do in a day?",
    "Is the civil service still relevant with so much technology?", "What should change in how civil servants are recruited?", "Why should civil servants be held to a higher ethical standard than others?", "What happens when an honest officer becomes corrupt? Why does it happen?",
    "Would you accept a posting in a conflict area?", "How will your background help you in your preferred service?",
  ]],
  ["Home state and district", [
    "What is your district famous for, then and now?", "What are the three biggest problems in your district?", "Why is your state behind on [industry / health / education]?", "As DM of your district, what would you do in your first year?",
    "Which central scheme works best in your state, and which doesn't?", "Name two dishes from your district and what goes into them.", "Which little-known place in your state would you promote, and how?", "How does your state compare with its neighbour on [one indicator]?",
    "What is one good thing about your state that the rest of India doesn't know?", "Have you lived outside your home state? What did you learn?", "Who is the most famous person from your district, and why?", "Should states be allowed to set their own language policy?",
  ]],
  ["Graduation subject and college", [
    "Why did you choose this subject?", "Explain the most important idea in your subject to a school student.", "What is the most important development in your field in the last two years?", "How can your subject help solve one problem in your district?",
    "Why do so few graduates in your field work in it?", "Were your professors approachable? What should a teacher–student relationship be?", "Why do Indian students go abroad, and how do we keep them?", "What did your final-year project do, and did it work?",
    "Why did you leave a seat at a top college for civil services?", "What is wrong with how your subject is taught in India?", "Which Indian institution in your field do you admire, and why?",
    "If you had a year and a budget, what would you research?",
  ]],
  ["Work and roles", [
    "What exactly did you do in your job?", "What does your company or department do, and how big is it?", "Why did you leave?", "What did you learn at work that applies to government?",
    "You list [NSS / club / volunteering] in your DAF. What did you actually do?", "Did your work have any real impact? How do you know?", "Why does the private sector spend so little on research in India?", "What would you change about your old organisation?", "What was the hardest decision you took at work?",
    "Tell us about a time you disagreed with your boss.", "What does your sector need from government?", "Why should we believe you will stay in government?",
  ]],
  ["Hobbies and interests", [
    "When did you last do this hobby, and what exactly did you do?", "Name three people who matter in this field, and why.", "What is the latest news in your hobby?", "How does government policy affect your hobby?",
    "Does your hobby do anything for society?", "Why is India weak or strong in this field?", "Should men and women in this sport be paid the same?", "What has your hobby taught you about yourself?",
    "Recommend us a book, a film and a song.", "If you only watch it, why don't you do it?", "How would you make this hobby accessible to poorer children?", "Which work in this field would you show a foreigner?",
  ]],
  ["Optional subject", [
    "Why did you choose this optional?", "Which thinker or idea from your optional do you disagree with?", "How does your optional help you as an administrator?", "Apply one concept from your optional to a current issue.",
    "What does your optional get wrong about India?", "If you could add one topic to its syllabus, what would it be?", "Name a recent book or paper in your optional.", "Is your optional subject still relevant today?", "Explain one idea from your optional to a farmer.",
    "Which part of your optional do you find weakest, and why?", "Who is the most important Indian scholar in your optional?", "What would you add to your optional from Indian experience?",
  ]],
  ["International relations", [
    "What should India do about US tariffs?", "Is the US–India relationship stronger or weaker than five years ago?", "Why are India's neighbours unstable while India is not?", "Can India lead the Global South? What stops it?",
    "Should India push for a permanent UNSC seat, or for reform first?", "Is globalisation in retreat? What does that mean for India?", "What does CPEC mean for India?", "Is India's neighbourhood policy working?",
    "Should India sanction countries when the US asks it to?", "“There are no permanent friends in foreign policy.” Agree?", "What should India's position be in the Russia–Ukraine war now?", "Why does the Global North need the Global South?",
  ]],
  ["Economy and development", [
    "Is a weaker rupee good or bad for India?", "Why hasn't manufacturing grown as planned?", "Are startup valuations in India a bubble?", "What is the difference between a loan waiver and a write-off?",
    "Why do SEZs underperform?", "Should India have a free trade deal with the EU? What are the obstacles?", "How do we create jobs for the young?", "What does logistics cost the Indian economy?",
    "Is gig work good work? Should 10-minute delivery be banned?", "What should the government do about Ponzi schemes?",
  ]],
  ["Energy, environment, science", [
    "Will India meet its renewable energy targets?", "What is grid instability, and how do we fix it?", "Are electric vehicles really green?", "Why do rare earths matter, and where does India stand?",
    "Should natural capital count in GDP?", "How should coastal development be regulated?", "What is green steel?", "Is quantum technology a threat or an opportunity?",
    "Why do people throw gadgets away instead of repairing them?", "What should India do about air pollution that it isn't doing?", "Is nuclear power the answer to India's energy needs?",
    "Should India allow genetically modified food crops?",
  ]],
  ["Security and law", [
    "What is narco-terrorism, and why call it terror?", "What changed in coastal security after 2008?", "How should India deal with Left Wing Extremism?", "Have the new criminal laws reduced pendency?",
    "Why was the electoral bond scheme struck down?", "Why hasn't free legal aid reached people?", "Should judges be appointed differently?", "Should digital news and OTT platforms be regulated like films?", "Should police reforms be a central or a state subject?",
    "Is AI a risk to internal security?",
  ]],
  ["Society, education, health", [
    "What is causing student suicides, and what would you do?", "Why do students depend on coaching?", "Is NEP 2020 working? Three good things and three problems.", "Should early schooling be in the mother tongue?",
    "Why is violence against doctors rising?", "Should India invest in AYUSH or focus on modern medicine?", "How should India prepare for an ageing population?", "Should traditions that harm people be banned outright?",
    "Is respect earned or owed?", "Should military service be compulsory for young people?", "Does a large population make India strong?", "What is creativity?",
  ]],
  ["“As DM / SP / officer, what would you do?”", [
    "Floods hit your district at night. What are your first three orders?", "A bridge collapses in your district. What do you do in the first hour and the first week?", "Local festival tradition is causing injuries. Would you ban it?", "A girl is crying alone at a railway station. What do you do?",
    "A prisoner dies in custody and others are ill. What do you do?", "Your senior asks you to drop a case against an influential person.", "Tourism is damaging your district's coast. How do you balance it?", "Coaching-hub suicides are rising in your city. What do you do?",
    "Farmers block a highway over prices. How do you handle it?", "Two communities clash over a procession route.", "A scheme's money isn't reaching people. How do you find out why?", "You are posted to an embassy and an Indian worker is stranded. What do you do?",
  ]],
];
const totalQ = QB.reduce((a, [, q]) => a + q.length, 0);
const CHUNK_SIZES = [3, 3, 3, 3, 1];
const chunks: [string, string[]][][] = [];
{ let k = 0; for (const c of CHUNK_SIZES) { chunks.push(QB.slice(k, k + c)); k += c; } }
let qn = 0;
chunks.forEach((ch, i) => {
  pages.push(page(`
    ${i === 0 ? `<h2>Question bank</h2><p>${totalQ} practice questions in the style of real boards, written by us from the patterns in the transcripts. Answer each one out loud in under a minute. Tick it when your answer is good enough to give in the room.</p>` : ""}
    ${ch.map(([h, qs]) => `<h3 class="qh">${h}</h3><ol class="qb" start="${qn + 1}">${qs.map((q) => { qn++; return `<li>${esc(q)}</li>`; }).join("")}</ol>`).join("")}
    ${i === chunks.length - 1 ? `<h3 class="qh">Your own questions</h3><p>Write the ten questions you most fear from your own DAF. Answer them first.</p>${lines(10)}` : ""}
  `, { title: `Question bank ${i + 1}/${chunks.length}` }));
});

// 18–19. 30-day plan
const PLAN: [string, string][] = [
  ["1", "Read your DAF line by line. Underline every noun: each is a question."],
  ["2", "DAF worksheet (page 9): five questions and a one-line answer for every entry."],
  ["3", "Home district dossier (page 11)."],
  ["4", "Home state dossier. Compare it with one neighbouring state."],
  ["5", "Graduation subject: revise the fundamentals and five recent developments."],
  ["6", "Hobbies: the five checks on page 11, for every hobby you listed."],
  ["7", "First mock: record yourself answering 20 bank questions. Watch it back."],
  ["8", "Current affairs: the US, the neighbourhood, the Global South."],
  ["9", "Current affairs: economy and trade."],
  ["10", "Current affairs: energy, environment and science."],
  ["11", "Current affairs: internal security and law."],
  ["12", "Current affairs: education, health and society."],
  ["13", "Work, gaps and “why civil services”: write and say each in under a minute."],
  ["14", "Second mock, with a friend or mentor asking from your DAF."],
  ["15", "Opinion questions: 15 from the bank, out loud, with the method on page 12."],
  ["16", "“As DM” questions: all 12 from the bank, with the four-step method."],
  ["17", "Optional subject: basics, two thinkers, one current application."],
  ["18", "Service preferences: the work of your top three services."],
  ["19", "Short talks: give five 90-second talks on the current affairs themes."],
  ["20", "Weak spots: redo every question you ticked as not good enough."],
  ["21", "Third mock, ideally with a panel of three. Use the scorecard (page 21)."],
  ["22", "Review all three scorecards. Pick three habits to fix."],
  ["23", "News of the last six months: one page of facts and numbers."],
  ["24", "Mock or bank practice, 30 minutes. Fix habit one."],
  ["25", "DAF again: read it as a board member would. What would you ask?"],
  ["26", "Mock or bank practice. Fix habit two."],
  ["27", "Documents from your e-summon letter, ready in a folder. Try on your clothes."],
  ["28", "Light revision: DAF answers and dossiers only."],
  ["29", "Rest. Short walk, early night. Read the paper."],
  ["30", "Interview day: read the front page, eat, arrive early, stay calm. You know your DAF."],
];
pages.push(page(`
  <h2>The 30-day plan</h2>
  <p>Start on the day the Mains result is out. If your interview date is further away, keep the order and stretch the weeks. If it is closer, do days 1–7 and 21–30 first.</p>
  <table class="tight plan">
    <thead><tr><th class="n">Day</th><th>Do this</th><th class="n">Done</th></tr></thead>
    <tbody>${PLAN.slice(0, 15).map(([dd, t]) => `<tr><td class="n"><b>${dd}</b></td><td>${t}</td><td class="n"><span class="tick-box"></span></td></tr>`).join("")}</tbody>
  </table>
  <p class="small">Week 1 is your DAF. Week 2 is current affairs linked to it. Week 3 is practice. Week 4 is polish.</p>
`, { title: "30-day plan" }));
pages.push(page(`
  <table class="tight plan">
    <thead><tr><th class="n">Day</th><th>Do this</th><th class="n">Done</th></tr></thead>
    <tbody>${PLAN.slice(15).map(([dd, t]) => `<tr><td class="n"><b>${dd}</b></td><td>${t}</td><td class="n"><span class="tick-box"></span></td></tr>`).join("")}</tbody>
  </table>
  <h2>Every day, from day 8</h2>
  <ul class="ticks"><li>Read one newspaper, and note anything linked to your DAF.</li><li>Answer ten bank questions out loud.</li><li>Ten minutes on your district or hobby: one new fact.</li></ul>
`, { title: "30-day plan" }));

// 20. Scorecard + day-of
const QUAL = ["Mental alertness", "Critical powers of assimilation", "Clear and logical exposition", "Balance of judgement", "Variety and depth of interest", "Ability for social cohesion and leadership", "Intellectual and moral integrity"];
pages.push(page(`
  <h2>Mock interview scorecard</h2>
  <p>These are the qualities UPSC lists for the Personality Test. Ask whoever runs your mock to score each from 1 to 5, and to write one example from the mock beside it.</p>
  <table class="score">
    <thead><tr><th>Quality</th><th class="n">Mock 1</th><th class="n">Mock 2</th><th class="n">Mock 3</th><th>Example</th></tr></thead>
    <tbody>${QUAL.map((q) => `<tr><td>${q}</td><td class="n write"></td><td class="n write"></td><td class="n write"></td><td class="write"></td></tr>`).join("")}</tbody>
  </table>
  <p class="lbl2">Three habits to fix before the next mock</p>${lines(3)}
  <h2>Interview day</h2>
  <ul class="ticks">
    <li>Your e-summon letter, photo ID, and every document it lists, originals and copies, in one folder.</li>
    <li>Formal, comfortable clothes you have worn once already.</li>
    <li>Arrive early. There may be a long wait; boards sometimes ask what you did while waiting.</li>
    <li>Read the front page that morning. Know the date and what is in the news.</li>
    <li>Carry water and something light to eat.</li>
    <li>In the room: greet the board, sit when asked, look at whoever is asking, and pause before you answer.</li>
  </ul>
  <p class="small">Follow the instructions in your own e-summon letter; they override anything here.</p>
`, { title: "Scorecard" }));

// 21. Sources
pages.push(page(`
  <h2>Where this comes from</h2>
  <p><b>Interview marks.</b> After each final result UPSC publishes the marks of every recommended candidate. We use the interview mark of ${d.n} rank holders from CSE ${d.yearsLabel} whose marksheets we hold. This is a sample of toppers, not every candidate. Pairs and written comparisons use only marksheets with a complete written total.</p>
  <p><b>Transcripts.</b> Fourteen accounts of CSE 2025 interviews (January–February 2026), written by the candidates and published on ForumIAS. They are recollections, often incomplete. We sorted every question into a category by hand. All questions in this pack are paraphrased in our own words.</p>
  <table class="tight src">
    <tbody>${IV_TRANSCRIPTS.map((t, i) => `<tr><td class="n">${i + 1}</td><td>${esc(t.board)} board, ${t.month} · ${esc(t.background)}</td><td><a href="${t.url}">forumias.com</a></td></tr>`).join("")}</tbody>
  </table>
  <p><b>The qualities on page 21</b> are as listed for the Personality Test in the UPSC Civil Services notification. Read the current notification on upsc.gov.in for the exact wording.</p>
  <p>Spotted an error? Write to <b>hello@upscprepnotes.in</b>.</p>
  <div class="back">
    <span class="brand big">${MARK(44)}<b>UPSCPrepNotes</b></span>
    <p>Real marks of real toppers, and what they mean for you. More free data at <a href="${link("/toppers/upsc-interview-marks")}">upscprepnotes.in/toppers/upsc-interview-marks</a> and <a href="${link("/toppers/highest-marks-in-upsc")}">the Topper Marks Handbook</a>.</p>
    <p class="muted">${month} edition. Bought it and not happy? Write to us within 7 days for a full refund.</p>
  </div>
`, { title: "Sources" }));

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
.brand { display: inline-flex; align-items: center; gap: 6px; color: #0b0c10; font-size: 9.5pt; letter-spacing: -0.02em; }
.brand.big { font-size: 15pt; gap: 10px; }
.body { flex: 1; }
h1 { font-size: 46pt; line-height: 1.0; letter-spacing: -0.035em; margin: 0; font-weight: 700; }
h2 { font-size: 17pt; letter-spacing: -0.022em; line-height: 1.15; margin: 6mm 0 2.5mm; font-weight: 700; }
.body > h2:first-child { margin-top: 0; }
h3 { font-size: 12pt; margin: 0; letter-spacing: -0.015em; }
h3.qh { margin: 4mm 0 1.5mm; font-size: 11.5pt; }
.body > h3.qh:first-child { margin-top: 0; }
p { margin: 0 0 2.5mm; color: #3f4450; }
p b, li b, td b { color: #0b0c10; }
.muted { color: #858a96; }
.small { font-size: 8.5pt; color: #858a96; }
.blue, .blue b { color: #1f3fd6; }
.hl { background: linear-gradient(transparent 52%, #ffe45c 52%, #ffe45c 92%, transparent 92%); padding: 0 2mm; }
table { width: 100%; border-collapse: collapse; font-size: 9pt; margin: 2mm 0 2.5mm; font-variant-numeric: tabular-nums; }
th { text-align: left; font-weight: 400; color: #858a96; border-bottom: 1px solid rgba(11,12,16,.14); padding: 1.6mm 2mm; }
td { border-bottom: 1px solid rgba(11,12,16,.08); padding: 1.6mm 2mm; vertical-align: top; color: #3f4450; }
table.tight td, table.tight th { padding: 1.3mm 1.6mm; }
table.iv td { font-size: 8.2pt; line-height: 1.38; padding: 1.2mm 1.6mm; }
table.daf td { font-size: 8.4pt; line-height: 1.4; }
table.src td { font-size: 8pt; padding: 0.9mm 1.6mm; }
.n { text-align: right; white-space: nowrap; }
td.write { border-bottom: 1px solid #1f3fd6; min-width: 16mm; height: 9mm; }
.callout { background: #e9edff; border-radius: 4mm; padding: 4mm 5mm; color: #13238a; margin: 4mm 0 3mm; font-size: 10pt; }
.callout b { color: #13238a; }
.findings { margin: 0; padding-left: 5mm; color: #3f4450; }
.findings li { margin-bottom: 2.2mm; padding-left: 1mm; }
.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; margin: 2mm 0 4mm; }
.stats > div { border: 1px solid rgba(11,12,16,.14); border-radius: 4mm; padding: 4mm; }
.stats b { display: block; font-size: 24pt; letter-spacing: -0.03em; color: #1f3fd6; line-height: 1.05; }
.stats span { font-size: 8.5pt; color: #3f4450; display: block; margin-top: 1.5mm; }
.hist { display: flex; align-items: flex-end; gap: 2mm; height: 38mm; margin: 2mm 0 4mm; padding-bottom: 5mm; position: relative; }
.hcol { flex: 1; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; position: relative; }
.hb { width: 100%; background: #1f3fd6; border-radius: 1.5mm 1.5mm 0 0; display: block; }
.hv { font-size: 8pt; color: #3f4450; margin-bottom: 1mm; font-variant-numeric: tabular-nums; }
.hl2 { position: absolute; bottom: -5mm; font-size: 8pt; color: #858a96; }
.bars { margin: 3mm 0 2mm; }
.bar { display: grid; grid-template-columns: 50mm 1fr 10mm 14mm; align-items: center; gap: 3mm; margin-bottom: 1.8mm; font-size: 9pt; }
.bar .b { height: 3.4mm; background: #f4f5f9; border-radius: 2mm; overflow: hidden; }
.bar .b span { display: block; height: 100%; background: #1f3fd6; border-radius: 2mm; }
.bar .v { text-align: right; font-weight: 700; font-variant-numeric: tabular-nums; }
.bar .v2 { text-align: right; color: #858a96; font-size: 8pt; }
.swing { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; margin: 2mm 0 1mm; }
.swing > div { border: 1px solid rgba(11,12,16,.14); border-radius: 4mm; padding: 3mm 4mm; }
.swing p { margin: 0 0 0.6mm; }
.swing .nm { font-weight: 700; color: #0b0c10; font-size: 10.5pt; }
.swing .rank { color: #1f3fd6; font-weight: 700; font-size: 15pt; margin-top: 1mm; }
.swing .rank.dim { color: #d9342a; }
.swing-note { margin-bottom: 3mm; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; margin: 2mm 0 2mm; }
.box { border: 1px solid rgba(11,12,16,.14); border-radius: 3mm; padding: 3mm 4mm; }
.box p { font-size: 8.5pt; margin: 0.5mm 0 1mm; }
.lines span { display: block; height: 6.5mm; border-bottom: 1px solid rgba(31,63,214,.22); }
.box .lines span { height: 5.5mm; }
table.work td { height: auto; }
table.work td:first-child { border-right: 1px solid rgba(11,12,16,.08); }
.lbl2 { margin: 3mm 0 0; font-weight: 700; color: #0b0c10; font-size: 9.5pt; }
.ticks { margin: 1mm 0 2mm; padding-left: 5mm; color: #3f4450; }
.ticks li { margin-bottom: 1.4mm; }
.method { border-top: 1px solid rgba(11,12,16,.08); padding: 3mm 0 1mm; }
.method:first-of-type { border-top: 0; }
.mh { display: flex; justify-content: space-between; gap: 4mm; align-items: baseline; margin-bottom: 1mm; }
.mh b { font-size: 11pt; }
.mh span { font-size: 8.5pt; text-align: right; }
.qb { margin: 0; padding-left: 8mm; color: #3f4450; columns: 1; }
.qb li { margin-bottom: 0.9mm; padding-left: 1mm; font-size: 9.4pt; }
.qb li::marker { color: #858a96; font-size: 8.5pt; font-variant-numeric: tabular-nums; }
.tick-box { display: inline-block; width: 4mm; height: 4mm; border: 1px solid rgba(11,12,16,.35); border-radius: 1mm; }
table.plan td { padding: 1.7mm 1.6mm; }
.back { margin-top: 6mm; background: #ffe45c; border-radius: 6mm; padding: 7mm 8mm; }
.back p { color: #5c4a00; margin-top: 3mm; }
.cover { padding: 18mm; background: #fff; }
.cover-top { display: flex; justify-content: space-between; align-items: center; font-size: 9.5pt; }
.cover-main { margin-top: 26mm; }
.cover .lead { font-size: 13pt; line-height: 1.5; max-width: 145mm; margin-top: 8mm; color: #3f4450; }
.sheet { margin-top: 14mm; border: 1px solid rgba(11,12,16,.14); border-left: 2.5mm solid #ff4a3d; border-radius: 3mm; padding: 6mm 8mm; width: 135mm; background: #fff; }
.sheet-head { display: flex; justify-content: space-between; font-size: 8.5pt; color: #858a96; margin-bottom: 2mm; }
.sheet-row { border-bottom: 1px solid rgba(31,63,214,.12); display: flex; align-items: baseline; gap: 3mm; height: 8.4mm; line-height: 8.4mm; font-size: 10.5pt; }
.sheet-row .dots { flex: 1; border-bottom: 1px dotted rgba(11,12,16,.25); transform: translateY(-2mm); }
.sheet-row .n { font-weight: 700; color: #1f3fd6; }
.sheet-note { font-size: 8pt; margin-top: 2mm; }
.cover-foot { position: absolute; left: 18mm; right: 18mm; bottom: 16mm; display: flex; justify-content: space-between; font-weight: 700; font-size: 11pt; }
`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>UPSC Interview Pack · UPSCPrepNotes</title>
<meta name="author" content="UPSCPrepNotes">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Funnel+Sans:wght@400;700&display=block" rel="stylesheet">
<style>${css}</style></head><body>${pages.join("\n")}</body></html>`;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ivpack-"));
const htmlPath = path.join(tmp, "pack.html");
fs.writeFileSync(htmlPath, html);
fs.mkdirSync("private/products", { recursive: true });
const pdfOut = path.resolve("private/products/upsc-interview-pack.pdf");
const common = ["--headless=new", "--disable-gpu", "--no-sandbox", "--hide-scrollbars", "--virtual-time-budget=8000"];
execFileSync(CHROME, [...common, "--no-pdf-header-footer", `--print-to-pdf=${pdfOut}`, `file://${htmlPath}`], { stdio: "ignore" });

// Store previews: cover, marks, what boards ask, DAF table, one question-bank page.
const previewDir = path.resolve("public/store/interview-pack");
fs.mkdirSync(previewDir, { recursive: true });
const PREVIEW = [1, 3, 6, 8, 15];
for (const [i, p] of PREVIEW.entries()) {
  const base = path.join(tmp, `p${i}`);
  execFileSync("pdftoppm", ["-f", String(p), "-l", String(p), "-r", "110", "-jpeg", "-jpegopt", "quality=82", "-singlefile", pdfOut, base]);
  fs.copyFileSync(`${base}.jpg`, path.join(previewDir, `page-${i + 1}.jpg`));
}
// Share image for the free /toppers/upsc-interview-marks page (1200 x 630).
const ogHtml = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Funnel+Sans:wght@400;700&display=block" rel="stylesheet">
<style>
*{box-sizing:border-box} body{margin:0;width:1200px;height:630px;font-family:"Funnel Sans",Arial,sans-serif;background:#fff;color:#0b0c10;position:relative;overflow:hidden}
.brand{position:absolute;left:72px;top:60px;display:flex;align-items:center;gap:14px;font-weight:700;font-size:28px;letter-spacing:-.02em}
h1{position:absolute;left:72px;top:150px;margin:0;font-size:70px;line-height:1.04;letter-spacing:-.035em;width:640px}
.hl{background:linear-gradient(transparent 55%,#ffe45c 55%,#ffe45c 92%,transparent 92%);padding:0 8px}
p{position:absolute;left:72px;top:400px;width:560px;font-size:27px;line-height:1.4;color:#3f4450;margin:0}
.dom{position:absolute;left:72px;bottom:56px;font-size:22px;color:#858a96}
.sheet{position:absolute;right:72px;top:110px;width:400px;border:1px solid rgba(11,12,16,.14);border-left:10px solid #ff4a3d;border-radius:14px;padding:26px 30px;transform:rotate(2deg);box-shadow:0 2px 2px rgba(11,12,16,.04),0 24px 48px -16px rgba(40,30,10,.28);background:#fff}
.row{display:flex;justify-content:space-between;height:52px;line-height:52px;font-size:23px;border-bottom:1px solid rgba(31,63,214,.12)}
.row b{color:#1f3fd6}
</style></head><body>
<div class="brand">${MARK(44)}UPSCPrepNotes</div>
<h1>UPSC interview marks, <span class="hl">what boards ask</span></h1>
<p>${d.n} toppers' interview marks and ${ts.n} real 2026 board transcripts.</p>
<div class="dom">upscprepnotes.in</div>
<div class="sheet">
<div class="row"><span>Median topper</span><b>${d.median}</b></div>
<div class="row"><span>Highest</span><b>${d.best}</b></div>
<div class="row"><span>Lowest with a rank</span><b>${d.lowest}</b></div>
<div class="row"><span>AIR 1–10 median</span><b>${d.bands[0].median}</b></div>
<div class="row" style="border:0"><span>Out of</span><b>275</b></div>
</div></body></html>`;
const ogPath = path.join(tmp, "og.html");
fs.writeFileSync(ogPath, ogHtml);
execFileSync(CHROME, [...common, "--window-size=1200,630", `--screenshot=${path.resolve("public/og/interview-marks.png")}`, `file://${ogPath}`], { stdio: "ignore" });
if (process.argv.includes("--keep-html")) fs.copyFileSync(htmlPath, path.resolve(process.argv[process.argv.indexOf("--keep-html") + 1]));
console.log(`PDF  ${pdfOut} (${Math.round(fs.statSync(pdfOut).size / 1024)} KB, ${pageNo} pages, ${totalQ} bank questions)`);
console.log(`Previews ${previewDir} (${PREVIEW.length})`);
process.exit(0);

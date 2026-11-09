# Adding questions to the daily quiz

The daily quiz (`/quiz`) shows real UPSC Prelims questions, five at a time, with Gilu reacting to each answer. This guide explains how to add more questions, step by step. Anyone on the team can follow it, and so can an AI assistant (the `quiz-question-sourcing` skill points here).

**The one rule:** every question must be a real UPSC question, and every answer must match UPSC's official answer key. One wrong answer does more damage than ten missing questions. If you are unsure about anything, leave that question out.

---

## What you need

- A computer with this project set up (see `docs/contributing.md`).
- The UPSC question paper you want to add (PDF).
- UPSC's official answer key for that year (PDF).
- About 2–3 minutes per question.

## Where things are

| Thing | File |
| --- | --- |
| The questions | `lib/quiz/prelims-2024.ts` (one file per exam year) |
| How sets, scores and streaks work | `lib/quiz/engine.ts` |
| The quiz screens | `components/quiz/Quiz.tsx` |
| The checker | `scripts/check-quiz-bank.ts` |
| A helper that turns PDF pages into images | `.claude/skills/quiz-question-sourcing/render_pages.py` |

---

## Step 1: Get the question paper

1. Open UPSC's website: <https://upsc.gov.in> → **Examination** → **Previous Question Papers** → **Civil Services (Preliminary) Examination**.
   We also keep the links in our database (collection `pyqs`, any record whose category starts with "Prelims").
2. Download **General Studies Paper I** for the year you want.
3. Note the **set letter** printed on the cover and at the bottom of each page (for example `… (11 – A)` means set **A**). You'll need it in Step 2.

**Only use UPSC's own papers.** Never copy questions, answers or explanations from coaching institutes or test-series websites (Vision IAS, Insights, Drishti, ClearIAS, PW and others). Their pages are fine for *finding* UPSC's link, nothing more.

## Step 2: Get the official answer key

1. On <https://upsc.gov.in> go to **Examination** → **Answer Keys** and find **Civil Services (Preliminary) Examination, \<year\>**. UPSC publishes it after that year's final result. For 2024 it came out on 21 May 2025.
2. Download it **in your browser**. UPSC's site blocks automated downloads, so a script or AI assistant can't fetch it. Save the PDF somewhere on your computer.
3. The key has one column per set (A, B, C, D). **Use the column for your paper's set.** Question numbers differ between sets.
4. The key marks **dropped questions**. Never add a dropped question.

## Step 3: Read the questions

UPSC papers are scanned images, so you can't copy the text out of the PDF. Read each page and type the question.

- English pages are the even pages: page 3, 5, 7… in a PDF viewer, or index 2, 4, 6… in code. Hindi is on the odd pages.
- Each page has about 5 questions, in two columns.
- To get clear page images, run the helper from any folder:
  ```bash
  python3 -P .claude/skills/quiz-question-sourcing/render_pages.py paper.pdf page-images 2 46 120
  ```
  This saves `page-images/page-02.png`, `page-04.png` and so on.

**Pick good questions:**
- ✅ Clear questions with one right answer according to the key.
- ✅ A mix of subjects: aim for every subject in each batch.
- ❌ Questions that need a map or picture.
- ❌ Dropped questions.
- ❌ Questions whose facts have changed so much that the old answer would now mislead people.

## Step 4: Type the question into the file

Open `lib/quiz/prelims-<year>.ts` (create it by copying `prelims-2024.ts` if the year is new). Each question is one block like this:

```ts
{
  id: "p24-61",            // "p" + 2-digit year + "-" + question number
  year: 2024,
  qno: 61,                 // the question number in your set
  subject: "Polity",       // see the list below
  question: "Who was the Provisional President of the Constituent Assembly before Dr. Rajendra Prasad took over?",
  options: ["C. Rajagopalachari", "Dr. B.R. Ambedkar", "T.T. Krishnamachari", "Dr. Sachchidananda Sinha"],
  answer: 3,               // from the official key: a = 0, b = 1, c = 2, d = 3
  explain: "Dr. Sachchidananda Sinha, the oldest member, chaired the first meeting on 9 December 1946. Dr. Rajendra Prasad was elected President on 11 December.",
  verified: true,          // true ONLY if you checked the answer against the official key
},
```

For questions with numbered statements or pairs, split the question into three parts:

```ts
question: "With reference to the Government of India Act, 1935, consider the following statements:",
items: [
  "1. It provided for the establishment of an All India Federation based on the union of the British Indian Provinces and Princely States.",
  "2. Defence and Foreign Affairs were kept under the control of the federal legislature.",
],
ask: "Which of the statements given above is/are correct?",
```

- **Statement-I / Statement-II questions:** put each statement in `items`, starting `"Statement-I: …"`, and use `options: STATEMENT_OPTIONS` (the four standard options are already defined at the top of the file).
- **Tables (pairs):** write each row as one item, e.g. `"1. Brazil — Indri"`.
- **Copy UPSC's wording exactly,** including phrases like "is/are correct". Fix only obvious typing errors, never meaning.
- **Options:** always four, in the paper's order, without the "(a)".

**Subjects** (use exactly one of these):
- Geography
- Environment
- Economy
- Polity
- History & Culture: history, art and culture
- International: world affairs and international organisations
- Schemes: government schemes

### The 50:50 hint (two crossed-out options, each with a reason)

When a student taps **50:50**, Gilu strikes through two wrong options one after the other and shows a one-line reason under each. These live in `lib/quiz/hints-2024.ts` (one file per year), keyed by question id:

```ts
"p24-60": { cross: [0, 3], why: ["Chhau was listed long ago, in 2010.", "Kumbh Mela was listed in 2017."] },
```

- `cross`: the two **wrong** options to strike, in the order they're crossed (a = 0 … d = 3). **Never the right answer.** The checker blocks this.
- `why`: one short line per crossed option (about 15–110 characters) saying *why it's wrong*. Teach the elimination ("Includes statement 1, which is false"), don't give away the answer.
- Leave one wrong option standing, so the student still has to choose between two.

## Step 5: Write the explanation

The explanation shows after the student answers. It's what they learn from, so make it count.

- **2–3 short sentences,** roughly 60–400 characters, so it fits a phone screen.
- **First say why the right answer is right, then name the trap:** which statement or option is wrong, and the fact that makes it wrong.
- **Use real facts:** dates, places, numbers.
- **Check facts against a primary source,** such as NCERT, PIB, the Constitution, a ministry page or UNESCO/UN pages. If you can't confirm a fact, leave the question out.
- **Plain sentences only:** no bullet points or formatting.

| ❌ Weak | ✅ Good |
| --- | --- |
| "This is an important topic. Option C is correct." | "Mitra Shakti is an India–Sri Lanka exercise, not India–Bangladesh. The 2023 edition began at Aundh, Pune, focused on counter-terrorism operations, and the Indian Air Force took part." |

## Step 6: Run the checker

From the project folder:

```bash
npx tsx scripts/check-quiz-bank.ts
```

It must end with **0 error(s)**. It also warns about:
- answers not yet marked `verified`
- explanations that are too short or too long
- text that looks like a scanning mistake
- duplicate questions

Fix the warnings too, except "not yet verified" while you're still waiting for the key.

It also shows how many questions each subject has, and how often the answer is a, b, c or d, so you can spot an imbalance.

## Step 7: Play it yourself

1. Start the site locally: `pnpm dev`.
2. Open `http://localhost:3000/quiz`. To check on your phone, open `http://<your computer's Wi-Fi address>:3000/quiz` on the same Wi-Fi.
3. Tap **Reset my progress** at the bottom of the quiz home screen to replay sets as a new player.
4. Play the sets containing your new questions on a phone **and** a laptop. Check that long statements are readable, options don't overflow, and the explanation makes sense.

## Step 8: Hand it over

Tell the owner:
- how many questions you added, and from which year
- which subjects they cover
- how many are `verified: true`, and which still need checking against the key

Don't publish anything yourself. Changes go live only after the owner approves them.

---

## Things to know

- **Sets of 5.** The quiz shuffles the whole bank in a fixed order and cuts it into sets of 5. The daily set changes at midnight IST.
- **Adding questions to a bank reshuffles its sets.** That's fine while the quiz is in review. Once it's live, add a new year as a **new file** and add it after the existing sets, so nobody's daily set changes under them. A developer connects new files in `lib/quiz/engine.ts` and in the `BANKS` list in `scripts/check-quiz-bank.ts`.
- **Marking matches UPSC GS Paper I:** +2 for right, −0.66 for wrong, 0 for skipped.

## Never

- Present a made-up question as a UPSC question.
- Set `verified: true` without checking the official key.
- Copy anything from a coaching institute or test series.
- Publish quiz changes without the owner's approval.

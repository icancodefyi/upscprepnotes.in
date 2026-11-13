# Mains 2026 result: December news plan

Status: planned. Written 13 Nov 2026. Goal: be the page people and AI assistants cite on result day, then turn that attention into interview-prep sales and leads.

## What UPSC publishes, and when
Confirm every date on upsc.gov.in before we publish it. Do not guess dates.

| Moment | What UPSC releases | What it means for us |
|---|---|---|
| Mains result (usually December) | A list of roll numbers who qualified for the interview. No marks, no cut-off. | Result-day pages, a roll number checker, "what next" guidance. |
| Right after | DAF-II (the second application form) and the interview schedule. | Guides and the mock interview tool. |
| Interview season (about January to April) | Daily interview lists. | Interview prep content. |
| Final result (about April or May) | Final merit list with ranks. | New toppers appear. |
| About two weeks after the final result | Marks of all candidates and the cut-offs. | Topper marks and cut-off pages. This is where our dataset grows. |

Important: topper marks and cut-offs for CSE 2026 are not available on result day. Promising them then would be wrong. On result day we publish what exists and prepare the rest.

## Pages to build ahead (hidden until the day)
1. **Result-day page** (`/upsc-mains-result-2026`, same URL reused in later years via redirect). Contents:
   - Answer-first block: "UPSC Mains 2026 result is out. N candidates qualified for the interview." with the date and a link to the official PDF.
   - Roll number checker: the student types a roll number and the page checks it against the list we load from the official PDF. Runs in the browser, so it costs the server nothing.
   - What happens next: DAF-II, interview dates, documents.
   - What the number means: qualified against vacancies, compared with earlier years from our own data.
   - FAQ with schema, an "Updated" date, and the official source linked.
2. **Interview stage guide:** DAF-II, how the schedule works, how to prepare in 4 to 6 weeks. Links to the Interview Pack and the mock interview tool when it exists.
3. **Previous years comparison:** qualified numbers by year if we can source them from UPSC releases, and AIR 1 marks against the cut-off using our existing data.
4. **Later, after the final result:** the final result page, topper marks, optional-wise toppers, cut-off page. These use the same templates as the existing topper and marks pages.

## Data
- Source: the official result notice and PDF on upsc.gov.in. Never a third-party site.
- Load the roll numbers once, check the count against the number UPSC states, and spot-check a few entries by hand before publishing.
- Store as a static JSON file next to the page. Do not put 14,000 rows in the database.
- Keep the PDF's date and our load date on the page.

## Search and AI visibility
- Answer-first opening, an FAQPage block that matches visible text, `dateModified`, and a link to the official source.
- On publish: ping IndexNow, submit the URL in Bing Webmaster Tools and Google Search Console, and add the page to `llms.txt` (`lib/llms.ts`).
- Update the Ask AI prompt so it knows the result is out and where the page is (`lib/ai/build-prompt.ts`). Web search already covers general news.
- Prepare the wording for the AI so it never says "you qualified" or "you did not qualify". It sends people to the checker.

## Distribution on the day
1. Telegram channel post with the link, within minutes of the official release.
2. Email to our leads, segmented by their form answer. People who said they are at the Mains or Interview stage get it first, with the interview prep offer.
3. A banner or the quiz toast slot for the result page, for 48 hours.
4. A short YouTube video and an Instagram post: what happens next.
5. Genuine posts on r/UPSC and in aspirant groups from your own account, with the checker link.

## Revenue tie-ins
- Interview Pack (₹299): a banner inside the result page and the interview guide.
- Mock interview tool: waitlist signup on the result page. See `docs/interview-tool/PLAN.md`.
- Email capture: "Get the interview schedule and updates", with the form we already have.

## Readiness checklist
- [ ] T-14 days: templates built and hidden. Official calendar checked for the expected date.
- [ ] T-7: load and test the roll number list format using last year's PDF. Fix the parser.
- [ ] T-3: load test the page. Consider putting Cloudflare in front for the spike (the VPS has 2 CPUs).
- [ ] T-1: Telegram post, email and banner drafted. IndexNow key live.
- [ ] Day 0: load the official roll numbers, check the count, publish, ping, post.
- [ ] Day 0 to 7: watch visits, checker uses, email signups, Interview Pack clicks. Correct anything the same day.

## Risks
- **Accuracy:** one wrong roll number can hurt someone and our reputation. Verify against the official PDF and link it. Add a correction note if UPSC revises the list.
- **Traffic spike:** result day brings a burst. Keep the page static and the checker client-side.
- **Fake PDFs and rumours:** only publish from upsc.gov.in. Say so on the page.
- **Premature claims:** never publish cut-offs or toppers' marks that UPSC has not released.

## Metrics
Visits to the result page and the share from AI assistants, checker searches, email signups, Interview Pack clicks and sales, waitlist signups, and the Google and Bing impressions for "UPSC mains result 2026".

## Open questions
- What is the official date? Check the UPSC calendar and subscribe to the official notice feed.
- Do we want a Cloudflare layer before this day?
- Who writes the YouTube script?

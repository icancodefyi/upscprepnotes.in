# Daily quiz: launch checklist

Status as of 9 November 2026. The quiz (`/quiz`) is built and playable locally, and it is **not live**: the page is hidden from search (`robots: noindex`) and missing from the sitemap. Nothing here is deployed until the owner approves.

## 1. Content: answers verified (blocking)

- [ ] Download UPSC's official answer key for CSE Prelims 2024, General Studies Paper I, Set A, in a browser. Give the file path to the developer. (UPSC's site blocks automated downloads.)
- [ ] Check all 84 answers in `lib/quiz/prelims-2024.ts` against the key. Set `verified: true` only for matches.
- [ ] Re-check these answers first, because they were the least certain: **Q7, Q9, Q10, Q11, Q29, Q34, Q42, Q56, Q67, Q70, Q87, Q91, Q96**.
- [ ] Check the explanation of every question against a primary source. Fix anything that is wrong, and keep the explanation under 420 characters.
- [ ] Run `npx tsx scripts/check-quiz-bank.ts`. It must show **0 errors** and **0 "not yet verified" warnings**.

Note: UPSC drops some questions from each paper's key. Any dropped question must come out of the bank. None are known to be dropped yet, but the key will say.

## 2. Quiz features

- [x] 84 questions, 16 sets of 5.
- [x] Marking: +2 right, −0.66 wrong, 0 skipped.
- [x] 50:50 hint with a reason for each crossed-out option, on all 84 questions.
- [x] Streaks, XP, levels, badges, subject accuracy, cut-off projection.
- [x] 30-day challenge track, with rewards at real store prices.
- [x] Phone and laptop layouts; keyboard shortcuts on laptop.
- [ ] Streak rewards claimable for real: needs the sign-in decision and server-side streak tracking. Without these, streaks live on the device and can be faked, so no reward can be claimed yet.
- [ ] Decide the sign-in method (email recommended).

## 3. Review-only parts (done)

- [x] Removed the "Add a day to my streak" button and its helper.
- [x] Removed the "Version 1 for review" wording from the footer and the challenge card.
- [x] "Reset my progress" stays for players.

## 4. Going live (built, waiting behind one switch)

Everything below is built. It stays hidden until `QUIZ_LIVE` in `lib/quiz/config.ts` is set to `true`. Setting it does all of this at once:

- [x] `/quiz` opens to search engines and joins the sitemap.
- [x] "Daily UPSC quiz" appears in the site navigation (Study menu, desktop and phone).
- [x] Quiz promos appear (`components/quiz/QuizTeaser.tsx`):
  - homepage: a large spotlight section after the marks story
  - topper profiles, marksheet pages, guides and free-material pages: a "Test yourself" box under the related links
  - free-download success screens: "Try this" / "While you wait" rows
  - the AI question page: an "Or practise" row under the suggested questions
- [x] Installable: manifest at `/quiz/manifest.webmanifest`, Gilu app icons, and an "add to home screen" card on the results screen (Android prompt, iPhone instructions).
- [x] Sharing:
  - a new score card image (1080×1350)
  - a one-tap WhatsApp challenge button
  - personal "beat my score" links (`/quiz/s/410-3`) whose WhatsApp/Telegram preview shows the score
  - the landing page invites the friend to play
  - the plain `/quiz` link has its own preview card
- [x] Analytics: every quiz event goes to PostHog and to our own tracking under the same name: `quiz_view`, `quiz_start`, `quiz_answer`, `quiz_hint`, `quiz_complete`, `quiz_share` (with method), `quiz_join`, `quiz_install_prompt`, `quiz_installed`, `quiz_challenge_view`. Every promo link carries its own tracking tag.
- [x] PostHog dashboard "Daily quiz launch" (https://us.posthog.com/project/480014/dashboard/2326028): players this week, daily players, the open → start → finish → share funnel, where players come from, return rate, shares, answers, and hints/joins/installs. Local test traffic is excluded.
- [x] Launch posts drafted in `docs/product/quiz-launch-posts.md`: Telegram launch post, email, WhatsApp text, and `scripts/post-quiz-poll.ts` for a daily Telegram quiz poll. The script refuses to post until the quiz is live and the answer is verified.

## 5. Quality checks before launch

- [ ] Play a full set on an iPhone-sized screen and on a 1440px laptop. Check nothing overflows and the bottom buttons never cover content.
- [ ] Play with animations turned off in the phone settings. Gilu should show still poses, and the strikes should appear without animation.
- [ ] Check every option stays readable with long statements.
- [x] `npx tsc --noEmit -p .` and `pnpm build` pass (checked 9 Nov 2026, with `QUIZ_LIVE` false).
- [ ] Test the live site after deploy: the quiz loads, a set can be finished, and the share button works.

## 6. Launch decisions (owner)

- [ ] Approve the quiz content after the answer check.
- [ ] Approve the sign-in method and the reward rules (days 3, 7, 10, 21, 30).
- [ ] Choose the launch day. Don't launch during the Diwali price rush, so the audience isn't split.
- [ ] Decide whether the launch email goes out (Resend Pro is needed for 2,700 recipients).

## 7. Rollback

If a wrong answer is found after launch:
1. Fix the answer in `prelims-2024.ts`. If the question itself is unusable, don't delete it: the sets are shuffled over the whole bank, so deleting a question reshuffles every set and changes the daily quiz for everyone who is part way through. Fix it in place, or swap in a verified replacement with the same id order.
2. Redeploy.
3. Tell the owner the same day, with the question id and the correct answer.

Before launch, deleting questions is fine. After launch, any change to the bank's size or order needs a plan, because it changes which questions appear on which day.

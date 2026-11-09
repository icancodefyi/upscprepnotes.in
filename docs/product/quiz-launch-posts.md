# Daily quiz: launch posts (drafts)

Ready to use on launch day. **Nothing here has been sent.** Post only after the quiz is live (`QUIZ_LIVE = true`) and every answer is verified.

All links carry tracking tags, so the "Where quiz players come from" chart on the PostHog dashboard "Daily quiz launch" shows which post worked.

---

## 1. Telegram launch post (channel)

Post this first, on launch morning, with the quiz preview link so Telegram shows the card.

> **New: the daily UPSC quiz, with Gilu 🐿️**
>
> Five real questions from UPSC's own Prelims paper, every day. Marked exactly like the exam: **+2** right, **−0.66** wrong, **0** skipped.
>
> • Gilu explains the trap after every answer
> • 50:50 hint once a set
> • See what you'd score out of 200 against the cut-off
> • Keep a streak: free rewards at day 7 and day 10
>
> Free, no sign-up, about 5 minutes.
>
> 👉 https://upscprepnotes.in/quiz?utm_source=telegram&utm_medium=post&utm_campaign=launch
>
> Post your score in the comments. Let's see who tops today.

## 2. Telegram daily poll (each morning, manual)

A native Telegram quiz poll: members tap an answer and Telegram shows right or wrong, then a follow-up message links to the other four questions.

```bash
npx tsx scripts/post-quiz-poll.ts          # preview today's question
npx tsx scripts/post-quiz-poll.ts --send   # post it
```

The script refuses to post until the quiz is live and the question's answer is verified. Long questions go out as a message first, then the poll, so nothing is cut off.

Suggested time: 8am IST, when aspirants start their day.

## 3. Email to the list (launch day)

Send only to people who agreed to hear from us, and include the unsubscribe link. The full list (about 2,700) needs the Resend Pro upgrade.

**Subject options**
- Can you score +10 on today's UPSC quiz?
- 5 real UPSC questions. 5 minutes. Your score?
- We built a daily UPSC quiz (and a squirrel who explains every trap)

**Preview text:** Real Prelims questions, exam marking, free.

**Body**

> Hi,
>
> We've launched something new: a daily quiz with five real questions from UPSC's own Prelims paper.
>
> It's marked the exam way: +2 for a right answer, −0.66 for a wrong one, and 0 if you skip. So you practise the hardest part of Prelims: knowing when to leave a question.
>
> After every answer, Gilu, our squirrel, explains the right answer and the trap in the others. At the end you see roughly what you'd score out of 200 if the whole paper went like that, against last year's cut-off.
>
> Play every day to keep your streak. At day 7 and day 10 you unlock free study material from our store.
>
> **[Play today's 5 →](https://upscprepnotes.in/quiz?utm_source=email&utm_medium=launch&utm_campaign=quiz_launch)**
>
> It's free, takes about 5 minutes and needs no sign-up.
>
> Team UPSCPrepNotes
>
> *You're getting this because you downloaded free material from upscprepnotes.in. [Unsubscribe](https://upscprepnotes.in/unsubscribe)*

## 4. WhatsApp message (for you to forward to study groups you're in)

Only in groups where you're a member and links are allowed.

> 5 real UPSC Prelims questions, marked like the exam (+2 / −0.66). Free, 5 minutes. I scored ___ today, beat that 😄
> https://upscprepnotes.in/quiz?utm_source=whatsapp&utm_medium=forward&utm_campaign=launch

## 5. What players share themselves

Built into the quiz, no work needed:
- **Share my score:** an image card with their score, right/wrong/skipped, streak, cut-off projection and Gilu, plus a link.
- **WhatsApp button:** opens WhatsApp with "I scored +X/10… Can you beat me?" and a personal link.
- **The personal link** (`/quiz/s/410-3`) shows their score as the WhatsApp preview, and the page invites the friend to play.

## Launch-day order

1. Turn `QUIZ_LIVE` on, build, deploy, and check `/quiz` on a phone.
2. Telegram launch post (1).
3. Telegram daily poll (2).
4. Launch email (3), if Resend Pro is set up.
5. WhatsApp forwards (4).
6. Check the PostHog dashboard "Daily quiz launch" that evening, and again the next day for the return rate.

# Live mock interview tool: plan

Status: planned, not started. Written 13 Nov 2026.

## Goal
A practice interview for UPSC personality test candidates. The student uploads their DAF, answers a board-style round by voice, and gets a scored report. It is practice, not prediction, and the site says so everywhere.

## Why now
- Mains results usually land in December and interviews run about January to April, so the audience appears right after launch.
- Human mock interviews cost thousands of rupees and need a booked slot. We can offer a round any time for ₹99 to ₹199.
- We already hold the material: 347 board questions, interview marks of 282 toppers, a DAF worksheet and transcripts (`data/content/interview-transcripts.ts`, the Interview Pack in `lib/store-products.ts`).
- Groq is already in the stack (`whisper-large-v3-turbo` for speech to text). The report can reuse the PDF pipeline from the Telegram bot (`upsc-telegram-bot/src/report-pdf.ts`).

## What makes it better than a chatbot
1. **DAF-based questions.** The board asks from your form: hometown, hobbies, optional, service preference, work history. Questions built from the student's own DAF are the main selling point.
2. **Follow-ups.** The agent probes and pushes back ("why?", "what would you do as DM?") instead of walking a list.
3. **A report at the end.** Content, clarity, balance, composure, answer length. Quote the weak answers and show a better version.
4. **Transcript beside model answers** drawn from topper interviews.

## Scope: version 1 (about a week of work)
- Page `/interview` with: DAF upload (PDF or typed form), consent line, start button.
- 8 to 10 questions, press-to-speak. Browser speech synthesis reads the question. Groq Whisper transcribes the answer.
- A 1.5 to 2 second pause before the next question, so it feels like a person.
- End: scored PDF report in site branding, sent by email and downloadable.
- Free taster: 5 minutes, 3 questions, no report. Full mock is paid.
- Pricing to test: ₹149 per mock, 3 for ₹399. Natural upgrade from the ₹299 Interview Pack.

## Not in version 1
- Live video, face or body-language scoring (high cost, shaky feedback).
- True real-time voice conversation (turn-taking is hard).
- Hindi speech. English first, Hinglish and Hindi later, because transcription is less accurate.

## Flow
1. Student lands on `/interview` (from the Interview Pack page, the Ask AI, the Telegram channel).
2. Signs in, uploads or types the DAF, accepts the privacy line.
3. Agent builds a question plan from the DAF plus the board-question bank, in the order a board goes: introduction, hometown and background, optional, hobbies, service preference, current affairs and opinion.
4. Loop: ask, listen, transcribe, decide whether to probe or move on, ask. Cap at about 25 minutes.
5. Score and write the report. Store the report, delete the audio and the DAF.
6. Offer a second mock and the Interview Pack.

## Report contents
- One-line overall verdict and a score out of 100 per area: content, clarity, balance, composure, length.
- Three strongest answers and three weakest, each with a quote and a stronger version.
- Habits: filler words, answer length, repetition.
- Questions to prepare next, linked to our material.

## Tech
- STT: Groq `whisper-large-v3-turbo`.
- LLM: Groq `openai/gpt-oss-120b`, fallback `gpt-oss-20b`, same tool-calling setup as `lib/ai/*`.
- TTS: browser `speechSynthesis` first. Consider a hosted voice later.
- Storage: a `mockinterviews` collection with transcript, scores, report and a created date. Audio is never stored. DAF text is deleted after the report.
- Report: HTML to PDF via Playwright, same as the bot reports, or generated on the VPS.
- Hosting: the VPS (`/opt/upscprepnotes`). Keep requests under the Caddy timeout.
- Limits: per-user daily cap and per-IP rate limit, so the free taster cannot be farmed.

## Risks and answers
- **Honesty:** it is not the UPSC board. State "practice, not prediction" on the page and in the report.
- **Privacy:** a DAF holds personal data. Say what is stored, delete audio and DAF after the report, and add a delete button.
- **Cost:** voice plus a long chat costs more than text. Do not make the full mock free.
- **Quality:** score wording must be reviewed by real aspirants and a mentor before launch.
- **Languages:** Hinglish accuracy will be lower. Say so, and let the student type an answer instead.

## Validation before charging
Get 5 to 10 aspirants who have reached the interview stage to try it free. Ask one question: did the questions feel real? Fix what they say, then price it.

## Metrics
Taster starts, taster to full mock conversion, completion rate, report opens, second-mock rate, refunds, and the aspirants' rating of how real it felt.

## Open questions
- Who can review the questions and the scoring for realism?
- Do we want to bundle it with the Interview Pack or sell separately?
- Where does the voice hosting run, and what is the monthly cost cap?

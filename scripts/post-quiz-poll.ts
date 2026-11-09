/**
 * Posts one question from today's daily quiz to the Telegram channel as a native quiz poll
 * (people tap an answer and Telegram shows right or wrong), followed by a link to the other four.
 *
 * Manual only. Nothing schedules this. It prints what it would send unless you pass --send.
 *
 *   npx tsx scripts/post-quiz-poll.ts            # preview today's poll
 *   npx tsx scripts/post-quiz-poll.ts --send     # post it
 *   npx tsx scripts/post-quiz-poll.ts --q=p24-61 # a specific question
 *
 * Refuses to post unless the quiz is live and the question's answer is verified, so an
 * unchecked answer never reaches the channel.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import TelegramBot from "node-telegram-bot-api";
import { PRELIMS_2024 } from "../lib/quiz/prelims-2024";
import { SETS, dailySetIndex } from "../lib/quiz/engine";
import { QUIZ_LIVE } from "../lib/quiz/config";

const send = process.argv.includes("--send");
const qArg = process.argv.find((a) => a.startsWith("--q="))?.split("=")[1];
const q = qArg ? PRELIMS_2024.find((x) => x.id === qArg) : SETS[dailySetIndex()][0];
if (!q) {
  console.error(`No question ${qArg}`);
  process.exit(1);
}

// Telegram limits: question 300 characters, each option 100, explanation 200.
const stem = [q.question, ...(q.items ?? []), q.ask ?? ""].filter(Boolean).join("\n");
const clip = (s: string, n: number) => (s.length <= n ? s : `${s.slice(0, n - 1)}…`);
const header = `UPSC Prelims ${q.year}, Q${q.qno}`;
// A long question (statements, tables) goes out as a message first, so nothing is cut off;
// the poll then just asks for the answer.
const fits = header.length + 1 + stem.length <= 300;
const lead = fits ? null : `${header}\n\n${stem}`;
const pollQuestion = fits ? `${header}\n${stem}` : `${header}: your answer?`;
const options = q.options.map((o, i) => clip(`(${"abcd"[i]}) ${o}`, 100));
const explanation = clip(q.explain, 200);
const link = "https://upscprepnotes.in/quiz?utm_source=telegram&utm_medium=poll&utm_campaign=daily";
const followUp = `Got it right? Today's other 4 questions are waiting, with Gilu and real UPSC marking (+2 / −0.66).\n\n👉 ${link}`;

if (lead) console.log("Message before the poll:\n" + lead + "\n");
console.log("Poll question:\n" + pollQuestion + "\n");
options.forEach((o, i) => console.log(`${i === q.answer ? "✓" : " "} ${o}`));
console.log("\nExplanation shown after answering:\n" + explanation);
console.log("\nFollow-up message:\n" + followUp + "\n");

if (!send) {
  console.log("Preview only. Pass --send to post.");
  process.exit(0);
}
if (!QUIZ_LIVE) {
  console.error("Not posting: the quiz is not live yet (lib/quiz/config.ts).");
  process.exit(1);
}
if (!q.verified) {
  console.error(`Not posting: ${q.id}'s answer is not verified against UPSC's key yet.`);
  process.exit(1);
}

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;
if (!TOKEN || !CHANNEL_ID) {
  console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHANNEL_ID in .env.local");
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: false });
(async () => {
  if (lead) await bot.sendMessage(CHANNEL_ID, lead);
  // Older Bot API versions read correct_option_id; newer ones read correct_option_ids. Send both.
  const pollOptions = {
    type: "quiz",
    correct_option_id: q.answer,
    correct_option_ids: [q.answer],
    explanation,
    is_anonymous: true,
  } as unknown as Parameters<typeof bot.sendPoll>[3];
  await bot.sendPoll(CHANNEL_ID, pollQuestion, options.map((text) => ({ text })), pollOptions);
  await bot.sendMessage(CHANNEL_ID, followUp);
  console.log("Posted the poll and the follow-up link.");
})().catch((err) => {
  console.error("Failed to post:", err?.message ?? err);
  process.exit(1);
});

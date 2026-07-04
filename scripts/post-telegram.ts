import { config } from "dotenv";
config({ path: ".env.local" });

import TelegramBot from "node-telegram-bot-api";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID!;

if (!TOKEN || !CHANNEL_ID) {
  console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHANNEL_ID in env");
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: false });

const message = process.argv.find(a => a.startsWith("--message="))?.split("=")[1];
const fileArg = process.argv.find(a => a.startsWith("--file="))?.split("=")[1];

if (!message && !fileArg) {
  console.error("Usage: npx tsx scripts/post-telegram.ts --message=\"...\" [--file=/path/to/file.pdf]");
  process.exit(1);
}

async function run() {
  try {
    if (fileArg && message) {
      await bot.sendDocument(CHANNEL_ID, fileArg, { caption: message, parse_mode: "HTML" });
      console.log("Posted: message + file");
    } else if (fileArg) {
      await bot.sendDocument(CHANNEL_ID, fileArg);
      console.log("Posted: file only");
    } else {
      await bot.sendMessage(CHANNEL_ID, message!, { parse_mode: "HTML" });
      console.log("Posted: message only");
    }
  } catch (err) {
    console.error("Failed to post:", err);
    process.exit(1);
  }
}

run();

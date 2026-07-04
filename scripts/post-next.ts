import { readFileSync, writeFileSync, existsSync } from "fs";
import { config } from "dotenv";
if (existsSync(".env.local")) config({ path: ".env.local" });

import TelegramBot from "node-telegram-bot-api";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID!;

if (!TOKEN || !CHANNEL_ID) {
  console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHANNEL_ID in env");
  process.exit(1);
}

const QUEUE_PATH = "telegram-queue.json";

interface QueueItem {
  id: number;
  message: string;
  fileUrl: string | null;
}

function readQueue(): QueueItem[] {
  try {
    return JSON.parse(readFileSync(QUEUE_PATH, "utf-8"));
  } catch {
    return [];
  }
}

function writeQueue(queue: QueueItem[]) {
  writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2));
}

async function run() {
  const queue = readQueue();

  if (queue.length === 0) {
    console.log("Queue is empty. Add more posts to telegram-queue.json");
    process.exit(0);
  }

  const post = queue[0];
  const bot = new TelegramBot(TOKEN, { polling: false });

  try {
    if (post.fileUrl) {
      await bot.sendDocument(CHANNEL_ID, post.fileUrl, {
        caption: post.message,
      });
    } else {
      await bot.sendMessage(CHANNEL_ID, post.message);
    }

    console.log(`Posted item #${post.id}. ${queue.length - 1} items remaining.`);

    writeQueue(queue.slice(1));
  } catch (err) {
    console.error("Failed to post:", err);
    process.exit(1);
  }
}

run();

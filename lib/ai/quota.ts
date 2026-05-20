import { connectDB } from "@/lib/mongodb";
import { AskSessionModel, AskConversationModel } from "@/models/ask.model";

const FREE_QUOTA = 5;

export async function getQuota(sessionId: string): Promise<{
  remaining: number;
  canQuery: boolean;
}> {
  await connectDB();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const session = await AskSessionModel.findOne({ sessionId });

  if (!session) {
    return { remaining: FREE_QUOTA, canQuery: true };
  }

  const isNewDay = !session.lastQueryAt || session.lastQueryAt < today;
  const usedToday = isNewDay ? 0 : session.queriesToday;
  const remaining = Math.max(0, FREE_QUOTA - usedToday);

  return { remaining, canQuery: remaining > 0 };
}

export async function incrementQuota(sessionId: string): Promise<void> {
  await connectDB();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const session = await AskSessionModel.findOne({ sessionId });

  if (!session) {
    await AskSessionModel.create({
      sessionId,
      queriesToday: 1,
      lastQueryAt: new Date(),
    });
    return;
  }

  const isNewDay = !session.lastQueryAt || session.lastQueryAt < today;

  if (isNewDay) {
    await AskSessionModel.updateOne(
      { sessionId },
      { $set: { queriesToday: 1, lastQueryAt: new Date() } },
    );
  } else {
    await AskSessionModel.updateOne(
      { sessionId },
      { $inc: { queriesToday: 1 }, $set: { lastQueryAt: new Date() } },
    );
  }
}

export async function saveMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string,
  sources?: { slug: string; name: string }[],
): Promise<void> {
  await connectDB();

  await AskConversationModel.updateOne(
    { _id: conversationId },
    {
      $push: { messages: { role, content, sources: sources || [] } },
    },
  );
}

export async function updateConversationTitle(
  conversationId: string,
  title: string,
): Promise<void> {
  await connectDB();
  await AskConversationModel.updateOne(
    { _id: conversationId },
    { $set: { title } },
  );
}

export async function listConversations(
  sessionId: string,
): Promise<{ id: string; title: string; updatedAt: Date }[]> {
  await connectDB();

  const conversations = await AskConversationModel.find({ sessionId })
    .select("title updatedAt")
    .sort({ updatedAt: -1 })
    .lean();

  return conversations.map((c) => ({
    id: c._id.toString(),
    title: c.title || "Chat",
    updatedAt: c.updatedAt || c._id.getTimestamp(),
  }));
}

export async function getConversation(
  conversationId: string,
): Promise<{
  id: string;
  title: string;
  messages: { role: string; content: string; sources?: { slug: string; name: string }[] }[];
} | null> {
  await connectDB();

  const conversation = await AskConversationModel.findById(conversationId).lean();

  if (!conversation) return null;

  return {
    id: conversation._id.toString(),
    title: conversation.title,
    messages: conversation.messages.map((m: any) => ({
      role: m.role,
      content: m.content,
      sources: m.sources,
    })),
  };
}

export async function createConversation(
  sessionId: string,
  firstMessage?: string,
): Promise<string> {
  await connectDB();

  const title = firstMessage
    ? firstMessage.slice(0, 60) + (firstMessage.length > 60 ? "…" : "")
    : "New Chat";

  const conversation = await AskConversationModel.create({
    sessionId,
    title,
    messages: [],
  });

  return conversation._id.toString();
}

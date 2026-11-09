import { connectDB } from "@/lib/mongodb";
import { AskSessionModel, AskConversationModel } from "@/models/ask.model";

const FREE_QUOTA = 5;
const AUTH_QUOTA = 20;

/** Midnight in India (IST, UTC+5:30), so the daily limit resets at 12am for our users, not 5:30am. */
export function startOfTodayIST(now = new Date()): Date {
  const IST = 330 * 60 * 1000;
  const d = new Date(now.getTime() + IST);
  d.setUTCHours(0, 0, 0, 0);
  return new Date(d.getTime() - IST);
}

export async function getQuota(
  sessionId: string,
  userId?: string | null,
): Promise<{
  remaining: number;
  canQuery: boolean;
  isAuthenticated: boolean;
}> {
  await connectDB();

  const today = startOfTodayIST();
  const maxQuota = userId ? AUTH_QUOTA : FREE_QUOTA;

  if (userId) {
    const { UserModel } = await import("@/models/user.model");
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      return { remaining: AUTH_QUOTA, canQuery: true, isAuthenticated: true };
    }
    const isNewDay = !user.lastQueryAt || user.lastQueryAt < today;
    const usedToday = isNewDay ? 0 : user.queriesToday;
    const remaining = Math.max(0, AUTH_QUOTA - usedToday);
    return { remaining, canQuery: remaining > 0, isAuthenticated: true };
  }

  const session = await AskSessionModel.findOne({ sessionId });

  if (!session) {
    return { remaining: FREE_QUOTA, canQuery: true, isAuthenticated: false };
  }

  const isNewDay = !session.lastQueryAt || session.lastQueryAt < today;
  const usedToday = isNewDay ? 0 : session.queriesToday;
  const remaining = Math.max(0, FREE_QUOTA - usedToday);

  return { remaining, canQuery: remaining > 0, isAuthenticated: false };
}

export async function incrementQuota(
  sessionId: string,
  userId?: string | null,
): Promise<void> {
  await connectDB();

  const today = startOfTodayIST();

  if (userId) {
    const { UserModel } = await import("@/models/user.model");
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      await UserModel.create({
        _id: userId,
        email: "unknown",
        name: "User",
        queriesToday: 1,
        lastQueryAt: new Date(),
      });
      return;
    }
    const isNewDay = !user.lastQueryAt || user.lastQueryAt < today;
    if (isNewDay) {
      await UserModel.updateOne(
        { _id: userId },
        { $set: { queriesToday: 1, lastQueryAt: new Date() } },
      );
    } else {
      await UserModel.updateOne(
        { _id: userId },
        { $inc: { queriesToday: 1 }, $set: { lastQueryAt: new Date() } },
      );
    }
    return;
  }

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
  userId?: string | null,
): Promise<{ id: string; title: string; updatedAt: Date }[]> {
  await connectDB();

  const filter = userId ? { userId } : { sessionId };

  const conversations = await AskConversationModel.find(filter)
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
  userId?: string | null,
  firstMessage?: string,
): Promise<string> {
  await connectDB();

  const title = firstMessage
    ? firstMessage.slice(0, 60) + (firstMessage.length > 60 ? "…" : "")
    : "New Chat";

  const conversation = await AskConversationModel.create({
    sessionId,
    userId: userId || null,
    title,
    messages: [],
  });

  return conversation._id.toString();
}

/**
 * Gives a question back when no answer was delivered (the model failed), so a failed
 * answer never costs a free question.
 */
export async function refundQuota(
  sessionId: string,
  userId?: string | null,
): Promise<void> {
  await connectDB();
  if (userId) {
    const { UserModel } = await import("@/models/user.model");
    await UserModel.updateOne({ _id: userId, queriesToday: { $gt: 0 } }, { $inc: { queriesToday: -1 } });
    return;
  }
  await AskSessionModel.updateOne({ sessionId, queriesToday: { $gt: 0 } }, { $inc: { queriesToday: -1 } });
}

/** Removes the question we saved when its answer failed, so a retry doesn't leave it in the history twice. */
export async function removeLastMessage(conversationId: string): Promise<void> {
  await connectDB();
  await AskConversationModel.updateOne({ _id: conversationId }, { $pop: { messages: 1 } });
}

/**
 * A chat belongs to the signed-in account that owns it, or, for a guest chat, to the browser
 * (session id) that started it. Nobody else can read it or add to it.
 */
export async function canAccessConversation(
  conversationId: string,
  sessionId: string,
  userId?: string | null,
): Promise<boolean> {
  if (!/^[a-f0-9]{24}$/i.test(conversationId)) return false;
  await connectDB();
  const c = await AskConversationModel.findById(conversationId).select("sessionId userId").lean();
  if (!c) return false;
  if (c.userId) return !!userId && String(c.userId) === String(userId);
  return !!sessionId && c.sessionId === sessionId;
}

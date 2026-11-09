import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { checkRateLimit } from "@/lib/rate-limit";
import { startOfTodayIST } from "@/lib/ai/quota";
import { AskConversationModel, AskSessionModel } from "@/models/ask.model";

/**
 * Runs once when someone signs in: moves the chats they asked as a guest into their account,
 * and carries over today's guest questions so the limit stays honest.
 */
export async function POST(request: NextRequest) {
  const rl = await checkRateLimit(request, "ai-read");
  if (rl) return rl;
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { sessionId } = await request.json();
    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    const userId = session.user.id;
    await connectDB();

    const moved = await AskConversationModel.updateMany(
      { sessionId, userId: null },
      { $set: { userId } },
    );

    // Today's usage = the larger of today's account and today's guest counts.
    // A count from an earlier day is 0 today, so yesterday's questions never block today.
    const today = startOfTodayIST();
    const anon = await AskSessionModel.findOne({ sessionId });
    const anonToday = anon && anon.lastQueryAt && anon.lastQueryAt >= today ? anon.queriesToday : 0;
    if (anonToday > 0) {
      const { UserModel } = await import("@/models/user.model");
      const user = await UserModel.findOne({ _id: userId });
      const userToday = user && user.lastQueryAt && user.lastQueryAt >= today ? user.queriesToday : 0;
      await UserModel.updateOne(
        { _id: userId },
        { $set: { queriesToday: Math.max(userToday, anonToday), lastQueryAt: new Date() } },
      );
    }

    return NextResponse.json({ ok: true, moved: moved.modifiedCount });
  } catch (err) {
    console.error("Migration error:", err);
    return NextResponse.json({ error: "Migration failed" }, { status: 500 });
  }
}

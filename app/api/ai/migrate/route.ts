import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { AskConversationModel, AskSessionModel } from "@/models/ask.model";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { sessionId } = await request.json();
    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    const userId = session.user.id;

    await connectDB();

    // Migrate anonymous conversations to this user
    await AskConversationModel.updateMany(
      { sessionId, userId: null },
      { $set: { userId } },
    );

    // Migrate anonymous session quota to this user
    const anonSession = await AskSessionModel.findOne({ sessionId });
    if (anonSession && anonSession.queriesToday > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isNewDay = !anonSession.lastQueryAt || anonSession.lastQueryAt < today;
      if (!isNewDay) {
        const { UserModel } = await import("@/models/user.model");
        await UserModel.updateOne(
          { _id: userId },
          { $max: { queriesToday: anonSession.queriesToday }, $set: { lastQueryAt: anonSession.lastQueryAt } },
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Migration error:", err);
    return NextResponse.json({ error: "Migration failed" }, { status: 500 });
  }
}

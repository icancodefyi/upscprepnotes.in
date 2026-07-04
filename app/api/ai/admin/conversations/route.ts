import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { AskConversationModel, type IAskConversation } from "@/models/ask.model";
import { AnalyticsEventModel } from "@/models/analytics-event.model";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const rl = await checkRateLimit(req, "ai");
  if (rl) return rl;

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    await connectDB();

    const match: Record<string, unknown> = {};
    if (search) {
      match.$or = [
        { title: { $regex: search, $options: "i" } },
        { "messages.content": { $regex: search, $options: "i" } },
      ];
    }

    const [conversations, total] = await Promise.all([
      AskConversationModel.find(match)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AskConversationModel.countDocuments(match),
    ]);

    const enriched = await Promise.all(
      conversations.map(async (conv: IAskConversation) => {
        const analyticsEvents = await AnalyticsEventModel.find({
          sessionId: conv.sessionId,
          event: { $in: ["checkout_completed", "file_download", "page_view"] },
        })
          .sort({ timestamp: -1 })
          .limit(10)
          .lean();

        return {
          id: conv._id,
          sessionId: conv.sessionId,
          title: conv.title,
          messageCount: conv.messages.length,
          userMessages: conv.messages.filter((m: { role: string }) => m.role === "user").length,
          assistantMessages: conv.messages.filter((m: { role: string }) => m.role === "assistant").length,
          createdAt: conv.createdAt,
          updatedAt: conv.updatedAt,
          messages: conv.messages.slice(-50),
          analyticsEvents,
        };
      }),
    );

    return NextResponse.json({
      success: true,
      conversations: enriched,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Admin conversations error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

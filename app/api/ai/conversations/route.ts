import { NextRequest, NextResponse } from "next/server";
import { listConversations, createConversation, getQuota } from "@/lib/ai/quota";
import { auth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const rl = await checkRateLimit(request, "ai");
  if (rl) return rl;
  const sessionId = request.nextUrl.searchParams.get("sessionId");

  try {
    const session = await auth();
    const userId = session?.user?.id || null;

    const [conversations, quota] = await Promise.all([
      listConversations(sessionId || "", userId),
      getQuota(sessionId || "", userId),
    ]);

    return NextResponse.json({ conversations, quota });
  } catch (err) {
    console.error("Conversations error:", err);
    return NextResponse.json({
      conversations: [],
      quota: { remaining: 5, canQuery: true, isAuthenticated: false },
    });
  }
}

export async function POST(request: NextRequest) {
  const rl = await checkRateLimit(request, "ai");
  if (rl) return rl;
  try {
    const { sessionId } = await request.json();
    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    const session = await auth();
    const userId = session?.user?.id || null;

    const id = await createConversation(sessionId, userId);
    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    console.error("Create conversation error:", err);
    return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });
  }
}

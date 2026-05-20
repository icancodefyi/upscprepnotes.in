import { NextRequest, NextResponse } from "next/server";
import { listConversations, createConversation, getQuota } from "@/lib/ai/quota";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ conversations: [], quota: { remaining: 5, canQuery: true } });
  }

  try {
    const [conversations, quota] = await Promise.all([
      listConversations(sessionId),
      getQuota(sessionId),
    ]);

    return NextResponse.json({ conversations, quota });
  } catch (err) {
    console.error("Conversations error:", err);
    return NextResponse.json({ conversations: [], quota: { remaining: 5, canQuery: true } });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();
    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    const id = await createConversation(sessionId);
    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    console.error("Create conversation error:", err);
    return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });
  }
}

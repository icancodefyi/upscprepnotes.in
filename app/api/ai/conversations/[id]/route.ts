import { NextRequest, NextResponse } from "next/server";
import { getConversation, canAccessConversation } from "@/lib/ai/quota";
import { auth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const rl = await checkRateLimit(request, "ai-read");
  if (rl) return rl;

  const { id } = await params;
  const sessionId = request.nextUrl.searchParams.get("sessionId") || "";

  try {
    const session = await auth();
    const userId = session?.user?.id || null;

    // A chat is private to the account or guest browser that started it.
    // Answer "not found" either way, so chat ids can't be probed.
    if (!(await canAccessConversation(id, sessionId, userId))) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const conversation = await getConversation(id);
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    return NextResponse.json(conversation);
  } catch (err) {
    console.error("Get conversation error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

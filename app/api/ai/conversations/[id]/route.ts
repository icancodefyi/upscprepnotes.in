import { NextRequest, NextResponse } from "next/server";
import { getConversation } from "@/lib/ai/quota";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const rl = await checkRateLimit(request, "ai");
  if (rl) return rl;

  const { id } = await params;

  try {
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

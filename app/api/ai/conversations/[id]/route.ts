import { NextRequest, NextResponse } from "next/server";
import { getConversation } from "@/lib/ai/quota";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

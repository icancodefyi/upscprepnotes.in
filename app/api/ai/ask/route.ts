import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { searchToppers } from "@/lib/ai/search-toppers";
import { buildSystemPrompt } from "@/lib/ai/build-prompt";
import {
  getQuota,
  incrementQuota,
  saveMessage,
  createConversation,
  updateConversationTitle,
  getConversation,
} from "@/lib/ai/quota";
import { connectDB } from "@/lib/mongodb";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, conversationId } = await request.json();

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }
    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    // Check quota
    const quota = await getQuota(sessionId);
    if (!quota.canQuery) {
      return NextResponse.json(
        { error: "Free queries exhausted. Purchase any compilation for unlimited access." },
        { status: 429 },
      );
    }

    // Resolve conversation
    let cid = conversationId;
    if (!cid) {
      cid = await createConversation(sessionId, message);
    }

    // Save user message + update title from first message
    await saveMessage(cid, "user", message);
    await incrementQuota(sessionId);

    const conv = await getConversation(cid);
    if (conv && conv.messages.length === 1) {
      await updateConversationTitle(cid, message.slice(0, 60));
    }

    // Search relevant toppers
    const relevantToppers = await searchToppers(message);
    const systemPrompt = buildSystemPrompt(relevantToppers);

    // Build message history for Groq
    const history = conv?.messages.slice(-10) || [];
    const groqMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "system", content: systemPrompt },
      ...history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    // Stream from Groq
    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: groqMessages,
      temperature: 0.7,
      max_tokens: 1024,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        let fullContent = "";

        try {
          for await (const chunk of stream) {
            const text = chunk.choices?.[0]?.delta?.content || "";
            if (text) {
              fullContent += text;
              controller.enqueue(encoder.encode(text));
            }
          }

          const sources = relevantToppers.map((t) => ({ slug: t.slug, name: t.name }));
          await saveMessage(cid, "assistant", fullContent, sources);
        } catch (err) {
          console.error("Stream error:", err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("Ask error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

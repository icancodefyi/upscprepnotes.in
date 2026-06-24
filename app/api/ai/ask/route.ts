import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { searchToppers, type TopperResult } from "@/lib/ai/search-toppers";
import { buildSystemPrompt } from "@/lib/ai/build-prompt";
import {
  getQuota,
  incrementQuota,
  saveMessage,
  createConversation,
  updateConversationTitle,
  getConversation,
} from "@/lib/ai/quota";
import { auth } from "@/lib/auth";
import { searchWeb, formatSearchResults } from "@/lib/ai/websearch";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const webSearchTool = {
  type: "function" as const,
  function: {
    name: "web_search",
    description: "Search the web for current information on UPSC, government exams, current affairs, notifications, results, cutoffs, and policy changes.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query to look up on the web",
        },
      },
      required: ["query"],
    },
  },
};

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, conversationId, searchWeb: wantsSearch } = await request.json();

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }
    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    const session = await auth();
    const userId = session?.user?.id || null;

    const quota = await getQuota(sessionId, userId);
    if (!quota.canQuery) {
      return NextResponse.json(
        { error: quota.isAuthenticated ? "Daily limit reached. Upgrade for unlimited access." : "Free limit reached. Sign in for 20 queries/day or purchase for unlimited." },
        { status: 429 },
      );
    }

    let cid = conversationId;
    if (!cid) {
      cid = await createConversation(sessionId, userId, message);
    }

    await saveMessage(cid, "user", message);
    await incrementQuota(sessionId, userId);

    const conv = await getConversation(cid);
    if (conv && conv.messages.length === 1) {
      await updateConversationTitle(cid, message.slice(0, 60));
    }

    const relevantToppers = await searchToppers(message);
    const systemPrompt = buildSystemPrompt(relevantToppers);

    const history = conv?.messages.slice(-10) || [];
    const groqMessages: any[] = [
      { role: "system", content: systemPrompt },
      ...history.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let fullContent = "";

        // Phase 1: if user toggled search, detect need with fast 8B model
        let didSearch = false;
        if (wantsSearch) {
          try {
            const detection = await groq.chat.completions.create({
              model: "llama-3.1-8b-instant",
              messages: groqMessages,
              tools: [webSearchTool],
              tool_choice: "auto",
              stream: false,
              temperature: 0.7,
              max_tokens: 512,
            });

            const toolCalls = detection.choices?.[0]?.message?.tool_calls;
            const tc = toolCalls?.[0];
            if (tc) {
              let args: any;
              try { args = JSON.parse(tc.function.arguments); } catch {}
              const query = args?.query;
              if (query) {
                didSearch = true;
                const indicator = `🔍 Searching the web for "${query.replace(/"/g, '\\"')}"...\n\n`;
                controller.enqueue(encoder.encode(indicator));
                fullContent += indicator;

                let formattedResults = "";
                try {
                  const searchData = await searchWeb(query);
                  formattedResults = formatSearchResults(query, searchData.results);
                } catch (err) {
                  console.error("Web search failed:", err);
                }

                groqMessages.push({
                  role: "assistant",
                  content: null,
                  tool_calls: [{
                    id: tc.id,
                    type: "function",
                    function: { name: "web_search", arguments: JSON.stringify(args) },
                  }],
                });

                groqMessages.push({
                  role: "tool",
                  tool_call_id: tc.id,
                  content: formattedResults
                    ? `Web search results for "${query}". Use these to answer the user's question. When citing sources, use markdown links like [Source](actual_url) with the actual URLs. Always include citations for factual claims.\n\n${formattedResults}`
                    : "No web search results were found. Answer using your existing knowledge.",
                });
              }
            }
          } catch (err) {
            console.error("Web search detection failed:", err);
          }
        }

        // Phase 2: stream the response (70B with or without search context)
        try {
          const stream = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: groqMessages,
            stream: true,
            temperature: 0.7,
            max_tokens: 1024,
          });

          for await (const chunk of stream) {
            const text = chunk.choices?.[0]?.delta?.content || "";
            if (text) {
              fullContent += text;
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (err) {
          console.error("Stream error:", err);
          const fallback = "I have information on that. Let me share what I know based on the topper data available.";
          if (!didSearch) {
            controller.enqueue(encoder.encode(fallback));
            fullContent = fallback;
          }
        }

        const sources = relevantToppers.map((t: any) => ({ slug: t.slug, name: t.name }));
        await saveMessage(cid, "assistant", fullContent, sources);
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Conversation-Id": cid,
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

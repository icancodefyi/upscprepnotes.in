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
import { searchWeb, formatSearchResults } from "@/lib/ai/websearch";
import { auth } from "@/lib/auth";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const webSearchTool = {
  type: "function" as const,
  function: {
    name: "web_search",
    description:
      "Search the web for current information about UPSC: latest news, exam dates, notifications, results, current affairs, government schemes, policy changes, budgets, or any factual topic where your training data might be outdated. Use this for queries about recent events (past 12 months), specific data points, or any UPSC topic that needs up-to-date information.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query, typically the user's question rephrased for search",
        },
      },
      required: ["query"],
    },
  },
};

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, conversationId } = await request.json();

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

    const encoder = new TextEncoder();

    let wantsSearch = false;
    let toolCallArgs: any = null;
    let toolCallId = "";
    let assistantContent = "";

    // Phase 1: Non-streaming call to decide if web search is needed
    try {
      const firstResponse = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: groqMessages,
        tools: [webSearchTool],
        tool_choice: "auto",
        stream: false,
        temperature: 0.7,
        max_tokens: 1024,
      });

      const choice = firstResponse.choices?.[0];
      const assistantMessage = choice?.message;
      assistantContent = assistantMessage?.content || "";

      const toolCalls = assistantMessage?.tool_calls;
      if (toolCalls && toolCalls.length > 0) {
        const tc = toolCalls[0];
        toolCallId = tc.id;
        try {
          toolCallArgs = JSON.parse(tc.function.arguments);
        } catch {}
        if (toolCallArgs?.query) {
          wantsSearch = true;
        }
      }
    } catch (err: any) {
      console.error("Tool call failed, falling back to no-search:", err);
      let failedGen: string | null = null;
      try {
        const raw = err?.error?.failed_generation || err?.failed_generation;
        if (typeof raw === "string") {
          failedGen = raw;
        } else if (typeof err.message === "string") {
          const jsonPart = err.message.match(/\{.*\}/);
          if (jsonPart) failedGen = JSON.parse(jsonPart[0])?.error?.failed_generation;
        }
      } catch {}
      if (failedGen) {
        assistantContent = failedGen.replace(/<function=[\s\S]*?<\/function>/g, "").replace(/<function=[\s\S]*$/, "").trim();
        const nativeMatch = failedGen.match(/<function=web_search=\{"query":\s*"([^"]+)"\}><\/function>/);
        if (nativeMatch) {
          wantsSearch = true;
          toolCallArgs = { query: nativeMatch[1] };
          toolCallId = "native-fallback";
        }
      }
    }

    if (wantsSearch) {
      const query = toolCallArgs?.query || message;

      const readable = new ReadableStream({
        async start(controller) {
          let fullContent = "";

          try {
            const indicator = `🔍 *Searching the web for "${query.replace(/"/g, '\\"')}"...*\n\n`;
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
                id: toolCallId,
                type: "function",
                function: { name: "web_search", arguments: JSON.stringify(toolCallArgs || { query }) },
              }],
            });

            const toolContent = formattedResults
              ? `Web search results for "${query}". Use these to answer the user's question. When citing sources, use markdown links like [Source](actual_url) with the actual URLs from the search results above. Always include citations for any factual claims from search results. Acknowledge you searched the web.\n\n${formattedResults}`
              : "No web search results were found. Answer the question using your existing knowledge.";

            groqMessages.push({
              role: "tool",
              tool_call_id: toolCallId,
              content: toolContent,
            });

            const secondStream = await groq.chat.completions.create({
              model: "llama-3.3-70b-versatile",
              messages: groqMessages,
              stream: true,
              temperature: 0.7,
              max_tokens: 1024,
            });

            for await (const chunk of secondStream) {
              const text = chunk.choices?.[0]?.delta?.content || "";
              if (text) {
                fullContent += text;
                controller.enqueue(encoder.encode(text));
              }
            }

            const sources = relevantToppers.map((t: any) => ({ slug: t.slug, name: t.name }));
            await saveMessage(cid, "assistant", fullContent, sources);
          } catch (err) {
            console.error("Stream error:", err);
            const errMsg = "\n\nSorry, something went wrong while searching. Please try again.";
            controller.enqueue(encoder.encode(errMsg));
          } finally {
            controller.close();
          }
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
          "X-Conversation-Id": cid,
        },
      });
    }

    // No tool calls — generate a streamed response using the 70B model
    const readable = new ReadableStream({
      async start(controller) {
        let fullContent = "";
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
          controller.enqueue(encoder.encode(fallback));
          fullContent = fallback;
        }

        const sources = relevantToppers.map((t: any) => ({ slug: t.slug, name: t.name }));
        await saveMessage(cid, "assistant", fullContent || "I have information on that. Let me share what I know based on the topper data available.", sources);
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

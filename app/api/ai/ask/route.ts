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
import { searchWeb, formatSearchResults } from "@/lib/ai/websearch";

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

    const quota = await getQuota(sessionId);
    if (!quota.canQuery) {
      return NextResponse.json(
        { error: "Free queries exhausted. Purchase any compilation for unlimited access." },
        { status: 429 },
      );
    }

    let cid = conversationId;
    if (!cid) {
      cid = await createConversation(sessionId, message);
    }

    await saveMessage(cid, "user", message);
    await incrementQuota(sessionId);

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

    // Phase 1: Non-streaming call to decide if web search is needed
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

    // If AI decided to search the web
    const toolCalls = assistantMessage?.tool_calls;
    if (toolCalls && toolCalls.length > 0) {
      const toolCall = toolCalls[0];
      let query = message;

      try {
        const args = JSON.parse(toolCall.function.arguments);
        if (args.query) query = args.query;
      } catch {}

      // Start streaming immediately with search indicator
      const readable = new ReadableStream({
        async start(controller) {
          let fullContent = "";

          try {
            // Step 1: Send "searching" indicator
            const indicator = `🔍 *Searching the web for "${query.replace(/"/g, '\\"')}"...*\n\n`;
            controller.enqueue(encoder.encode(indicator));
            fullContent += indicator;

            // Step 2: Execute web search
            let formattedResults = "";
            try {
              const searchData = await searchWeb(query);
              formattedResults = formatSearchResults(query, searchData.results);
            } catch (err) {
              console.error("Web search failed:", err);
            }

            // Step 3: Add tool messages and get AI response
            groqMessages.push({
              role: "assistant",
              content: null,
              tool_calls: toolCalls.map((tc: any) => ({
                id: tc.id,
                type: "function",
                function: { name: tc.function.name, arguments: tc.function.arguments },
              })),
            });

            const toolContent = formattedResults
              ? `Web search results for "${query}". Use these to answer the user's question. When citing sources, use markdown links like [Source](actual_url) with the actual URLs from the search results above. Always include citations for any factual claims from search results. Acknowledge you searched the web.\n\n${formattedResults}`
              : "No web search results were found. Answer the question using your existing knowledge.";

            groqMessages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              content: toolContent,
            });

            // Phase 2: Streaming call with search results
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

    // No tool calls — return content as stream
    const content = assistantMessage?.content || "";
    const sources = relevantToppers.map((t: any) => ({ slug: t.slug, name: t.name }));
    await saveMessage(cid, "assistant", content, sources);

    const readable = new ReadableStream({
      start(controller) {
        if (content) controller.enqueue(encoder.encode(content));
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

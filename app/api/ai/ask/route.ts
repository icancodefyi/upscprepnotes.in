import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { searchToppers, findTopperByName, type TopperResult } from "@/lib/ai/search-toppers";
import { checkRateLimit } from "@/lib/rate-limit";
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
import { trackServer } from "@/lib/tracking/server";

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

// ── Fast path ───────────────────────────────────────────────────────────────
// The seeded topper-page link asks `Tell me about X's UPSC strategy`, which is
// ~49% of all questions and is already fully stored in the DB. Answering it
// without the LLM costs 0 tokens and can never hit a rate limit.
const TOPPER_STRATEGY_RE = /^tell me about\s+(.+?)['’]s\s+upsc\s+strategy\s*[.?!]*$/i;

function sentenceTrim(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
  return stop > max * 0.5 ? cut.slice(0, stop + 1) : `${cut.trimEnd()}…`;
}

async function buildFastTopperAnswer(
  message: string,
): Promise<{ text: string; sources: { slug: string; name: string }[] } | null> {
  const m = message.trim().match(TOPPER_STRATEGY_RE);
  if (!m) return null;
  const asked = m[1].trim();
  if (!asked || asked.length > 60) return null;

  // Exact name lookup — ranked search is too noisy here (rank bonuses can
  // outrank the person actually asked about), so never answer off a guess.
  const top = await findTopperByName(asked);
  if (!top) return null;

  const parts: string[] = [];
  const intro = top.bio?.trim();
  parts.push(
    intro ||
      `${top.name} secured AIR ${top.rank} in ${top.year}${top.optionalSubject ? ` with ${top.optionalSubject} as the optional subject` : ""}.`,
  );
  if (top.strategy?.trim()) parts.push(sentenceTrim(top.strategy.trim(), 1400));
  const insights = (top.insights || []).filter(Boolean).slice(0, 3);
  if (insights.length) parts.push(insights.map((i) => `- ${i}`).join("\n"));
  parts.push(`Full profile with the marks breakdown: [${top.name}](/upsc-topper/${top.slug}).`);
  parts.push(
    `Want me to break down any part of this approach — ${top.optionalSubject || "the optional subject"}, answer writing, or the interview stage?`,
  );

  return {
    text: parts.filter(Boolean).join("\n\n"),
    sources: [{ slug: top.slug, name: top.name }],
  };
}

// ── Errors ──────────────────────────────────────────────────────────────────
// Provider errors are never shown verbatim — always plain language.
function describeStreamError(err: any): {
  code: string;
  message: string;
  retryAfter?: number;
} {
  const raw = String(err?.error?.message || err?.message || "");
  const status: number | undefined = err?.status || err?.error?.status;

  if (status === 429 || /rate.?limit|tokens per day|\btpd\b/i.test(raw)) {
    const t =
      raw.match(/try again in\s+(\d+)m(?:in(?:ute)?s?)?([\d.]+)?s/i) ||
      raw.match(/try again in\s+(\d+)s/i);
    let retryAfter = 1200;
    if (t) retryAfter = t[2] ? Math.ceil(Number(t[1]) * 60 + Number(t[2])) : Number(t[1]);
    const mins = Math.max(1, Math.ceil(retryAfter / 60));
    return {
      code: "rate_limit",
      retryAfter,
      message: `We've hit a short temporary limit on answers — it resets daily. Please try again in about ${mins} minute${mins === 1 ? "" : "s"}.`,
    };
  }
  if (status === 401 || status === 403 || /api.?key|unauthorized/i.test(raw)) {
    return {
      code: "service_unavailable",
      message: "Our answer service is temporarily offline. Please try again in a few minutes.",
    };
  }
  if (status === 503 || status === 529 || /overloaded|capacity/i.test(raw)) {
    return {
      code: "busy",
      message: "The AI service is at full capacity right now. Please try again in a moment.",
    };
  }
  return {
    code: "generation_failed",
    message: "We couldn't write an answer this time. Please try again.",
  };
}

export async function POST(request: NextRequest) {
  const rl = await checkRateLimit(request, "ai");
  if (rl) return rl;

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
    const startedAt = Date.now();
    const base = { signed_in: !!userId, web_search: !!wantsSearch, conversation: conversationId || undefined };
    if (!quota.canQuery) {
      await trackServer("ask_limit", { sessionId, path: "/api/ai/ask", props: { ...base, authenticated: quota.isAuthenticated } });
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

    const relevantToppers = (await searchToppers(message)).slice(0, 2);
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
        let streamFailed = false;

        // Control frames: server → client status updates (stripped before display)
        const emit = (obj: Record<string, unknown>) => {
          controller.enqueue(encoder.encode(`#@${JSON.stringify(obj)}\n`));
        };

        // Free path — answer the seeded topper question straight from the DB (0 tokens)
        if (!wantsSearch) {
          let fast: Awaited<ReturnType<typeof buildFastTopperAnswer>> = null;
          try {
            fast = await buildFastTopperAnswer(message);
          } catch (err) {
            console.error("Fast-path answer failed:", err);
          }
          if (fast) {
            emit({ t: "status", label: "Reading topper data" });
            emit({ t: "end" });
            controller.enqueue(encoder.encode(fast.text));
            fullContent = fast.text;
            emit({ t: "end" });
            await saveMessage(cid, "assistant", fullContent, fast.sources);
            await trackServer("ask_answer", { sessionId, path: "/api/ai/ask", props: { ...base, path: "fast", ms: Date.now() - startedAt, chars: fullContent.length, sources: fast.sources.length } });
            controller.close();
            return;
          }
        }

        // Phase 1: if user toggled search, detect need with fast 8B model
        if (wantsSearch) {
          emit({ t: "begin", label: "Analyzing your question" });
          try {
            const detection = await groq.chat.completions.create({
              model: "openai/gpt-oss-20b",
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
                emit({ t: "status", label: "Searching the web" });
                const indicator = `🔍 Searching the web for "${query.replace(/"/g, '\\"')}"...\n\n`;
                controller.enqueue(encoder.encode(indicator));
                fullContent += indicator;

                let formattedResults = "";
                let sources: { domain: string; label: string }[] = [];
                try {
                  const searchData = await searchWeb(query);
                  formattedResults = formatSearchResults(query, searchData.results);
                  sources = searchData.results
                    .map((r) => {
                      let domain = r.url;
                      try {
                        domain = new URL(r.url).hostname.replace(/^www\./, "");
                      } catch {}
                      return { domain, label: r.title.slice(0, 70) || domain };
                    })
                    .slice(0, 5);
                } catch (err) {
                  console.error("Web search failed:", err);
                }

                if (sources.length) emit({ t: "sources", items: sources });
                emit({ t: "status", label: "Compiling the best info" });

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
        emit({ t: "status", label: "Writing your answer" });
        emit({ t: "end" });
        try {
          const stream = await groq.chat.completions.create({
            model: "openai/gpt-oss-20b",
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
        } catch (err: any) {
          const info = describeStreamError(err);
          console.error("Stream error:", err);
          console.error(
            `[ask-error] code=${info.code} status=${err?.status ?? "n/a"} message=${String(err?.error?.message || err?.message || "").slice(0, 300)}`,
          );
          streamFailed = true;
          await trackServer("ask_error", { sessionId, path: "/api/ai/ask", props: { ...base, code: info.code, status: err?.status, ms: Date.now() - startedAt } });
          emit({
            t: "error",
            code: info.code,
            message: info.message,
            retryAfter: info.retryAfter,
          });
        }

        emit({ t: "end" });

        if (streamFailed) {
          // Never persist a fake/empty answer as a real assistant message
          controller.close();
          return;
        }

        const sources = relevantToppers.map((t: any) => ({ slug: t.slug, name: t.name }));
        await saveMessage(cid, "assistant", fullContent, sources);
        await trackServer("ask_answer", { sessionId, path: "/api/ai/ask", props: { ...base, path: "model", ms: Date.now() - startedAt, chars: fullContent.length, sources: sources.length } });
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

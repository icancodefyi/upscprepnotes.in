import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { findTopperByName } from "@/lib/ai/search-toppers";
import { checkRateLimit } from "@/lib/rate-limit";
import { buildSystemPrompt } from "@/lib/ai/build-prompt";
import {
  getQuota,
  incrementQuota,
  saveMessage,
  createConversation,
  updateConversationTitle,
  getConversation,
  refundQuota,
  removeLastMessage,
  canAccessConversation,
} from "@/lib/ai/quota";
import { auth } from "@/lib/auth";
import { TOOLS, runTool } from "@/lib/ai/tools";
import { trackServer } from "@/lib/tracking/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODELS = ["openai/gpt-oss-120b", "openai/gpt-oss-20b"];
const MAX_ROUNDS = 5;
const CURRENT_RE = /\b(latest|today|this (week|month|year)|news|current affairs|notification|result|cut.?off|date|2026|2027|vacanc|recent|announced)\b/i;
const MISUSE_RE = /\b(nude|naked|porn|xxx|sex video|boobs|nsfw)\b/i;
const TOOL_LABEL: Record<string, string> = {
  find_topper: "Reading topper data",
  list_toppers: "Comparing toppers",
  optional_stats: "Checking optional subjects",
  answer_copy_info: "Checking answer copies",
  get_products: "Finding the right pack",
  search_free_materials: "Searching free material",
  get_pyq: "Finding question papers",
  web_search: "Searching the web",
};

async function callModel(messages: any[], tools: boolean): Promise<any> {
  let lastErr: any;
  for (const model of MODELS) {
    for (const withTools of tools ? [true, false] : [false]) {
      try {
        const body: any = { model, messages, temperature: 0.5, max_completion_tokens: 3000, stream: false, reasoning_effort: "medium", include_reasoning: false };
        if (withTools) {
          body.tools = TOOLS;
          body.tool_choice = "auto";
        } else if (messages.some((m) => m.role === "tool")) {
          body.tools = TOOLS;
          body.tool_choice = "none";
        }
        return await groq.chat.completions.create(body);
      } catch (err: any) {
        lastErr = err;
        const status = err?.status;
        // Rate limits and outages: try the next model. Bad tool output (400): retry once without tools.
        if (status === 429 || (status && status >= 500)) break;
      }
    }
  }
  throw lastErr;
}

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

  // Set once the question has been counted, so any later failure can give it back.
  let counted: { sessionId: string; userId: string | null; cid: string } | null = null;
  try {
    const { message, sessionId, conversationId, searchWeb: wantsSearch } = await request.json();

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }
    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }
    if (message.length > 2000) {
      return NextResponse.json({ error: "Please keep your question under 2,000 characters." }, { status: 400 });
    }

    const session = await auth();
    const userId = session?.user?.id || null;

    const quota = await getQuota(sessionId, userId);
    const startedAt = Date.now();
    const base = { signed_in: !!userId, web_search: !!wantsSearch, conversation: conversationId || undefined };
    if (!quota.canQuery) {
      await trackServer("ask_limit", { sessionId, path: "/api/ai/ask", props: { ...base, authenticated: quota.isAuthenticated } });
      return NextResponse.json(
        {
          code: "quota",
          error: quota.isAuthenticated ? "Daily limit reached." : "Free limit reached. Sign in for 20 questions a day.",
        },
        { status: 429 },
      );
    }

    // Only continue a chat this browser or account owns; anything else starts a new chat.
    let cid: string | null =
      typeof conversationId === "string" && (await canAccessConversation(conversationId, sessionId, userId))
        ? conversationId
        : null;
    if (!cid) {
      cid = await createConversation(sessionId, userId, message);
    }

    await saveMessage(cid, "user", message);
    await incrementQuota(sessionId, userId);
    counted = { sessionId, userId, cid };
    const refund = async () => {
      counted = null;
      await refundQuota(sessionId, userId).catch(() => {});
      await removeLastMessage(cid as string).catch(() => {});
    };

    const conv = await getConversation(cid);
    if (conv && conv.messages.length === 1) {
      await updateConversationTitle(cid, message.slice(0, 60));
    }

    const webAllowed = !!wantsSearch || CURRENT_RE.test(message);
    const history = conv?.messages.slice(-10) || [];
    const groqMessages: any[] = [
      { role: "system", content: buildSystemPrompt(webAllowed) },
      ...history.map((m: any) => ({ role: m.role, content: m.content })),
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
        const say = (text: string) => {
          fullContent += text;
          for (let i = 0; i < text.length; i += 48) controller.enqueue(encoder.encode(text.slice(i, i + 48)));
        };

        // Free path: the seeded topper-page question is answered straight from the DB (0 tokens)
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

        // Obvious misuse never reaches the model
        if (MISUSE_RE.test(message)) {
          emit({ t: "end" });
          say("I can only help with UPSC preparation and this site. If you tell me your stage, attempt and optional subject, I can suggest what to study next.");
          emit({ t: "end" });
          await saveMessage(cid, "assistant", fullContent, []);
          controller.close();
          return;
        }

        const topperRefs = new Map<string, string>();
        const webSources: { domain: string; label: string }[] = [];
        const toolsUsed: string[] = [];

        emit({ t: "begin", label: "Reading your question" });
        try {
          let answer = "";
          for (let round = 0; round < MAX_ROUNDS; round++) {
            const last = round === MAX_ROUNDS - 1;
            const res = await callModel(groqMessages, !last);
            const msg = res.choices?.[0]?.message;
            const calls = msg?.tool_calls || [];
            if (!calls.length || last) {
              answer = (msg?.content || "").trim();
              break;
            }
            groqMessages.push({ role: "assistant", content: msg.content || null, tool_calls: calls });
            for (const tc of calls) {
              let args: any = {};
              try {
                args = JSON.parse(tc.function.arguments || "{}");
              } catch {}
              const name = tc.function.name;
              toolsUsed.push(name);
              emit({ t: "status", label: TOOL_LABEL[name] || "Looking things up" });
              const out = await runTool(name, args, { webAllowed });
              for (const r of out.topperSlugs || []) topperRefs.set(r.slug, r.name);
              if (out.webSources?.length) {
                webSources.push(...out.webSources);
                emit({ t: "sources", items: webSources.slice(0, 5) });
              }
              groqMessages.push({ role: "tool", tool_call_id: tc.id, content: out.text.slice(0, 12000) });
            }
          }
          emit({ t: "status", label: "Writing your answer" });
          emit({ t: "end" });
          if (answer) say(answer);
        } catch (err: any) {
          const info = describeStreamError(err);
          console.error("Ask AI failed:", err);
          console.error(
            `[ask-error] code=${info.code} status=${err?.status ?? "n/a"} message=${String(err?.error?.message || err?.message || "").slice(0, 300)}`,
          );
          streamFailed = true;
          await trackServer("ask_error", { sessionId, path: "/api/ai/ask", props: { ...base, code: info.code, status: err?.status, ms: Date.now() - startedAt } });
          emit({ t: "error", code: info.code, message: info.message, retryAfter: info.retryAfter });
        }

        emit({ t: "end" });

        if (streamFailed || !fullContent.trim()) {
          // Never persist a fake/empty answer, and give the question back: a failed answer is free.
          if (!streamFailed) emit({ t: "error", code: "empty", message: "We couldn't write an answer this time. Please try again." });
          await refund();
          controller.close();
          return;
        }

        const sources = [...topperRefs.entries()].slice(0, 3).map(([slug, name]) => ({ slug, name }));
        await saveMessage(cid, "assistant", fullContent, sources);
        await trackServer("ask_answer", { sessionId, path: "/api/ai/ask", props: { ...base, path: "agent", ms: Date.now() - startedAt, chars: fullContent.length, sources: sources.length, tools: toolsUsed.join(",").slice(0, 120) } });
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
    if (counted) {
      const c = counted as { sessionId: string; userId: string | null; cid: string };
      await refundQuota(c.sessionId, c.userId).catch(() => {});
      await removeLastMessage(c.cid).catch(() => {});
    }
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

"use client";

import { useState, useEffect, useRef, FormEvent, useCallback } from "react";
import Link from "next/link";
import { getSuggestedQuestions } from "@/lib/ai/build-prompt";

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: { slug: string; name: string }[];
};

type Conversation = {
  id: string;
  title: string;
  updatedAt: string;
};

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("ask_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("ask_session_id", id);
  }
  return id;
}

function formatTitle(title: string | undefined): string {
  if (!title) return "Chat";
  return title.length > 40 ? title.slice(0, 40) + "…" : title;
}

export default function AskPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [quota, setQuota] = useState<{ remaining: number; canQuery: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const suggestedQuestions = getSuggestedQuestions();

  const fetchConversations = useCallback(async () => {
    const sessionId = getSessionId();
    const res = await fetch(`/api/ai/conversations?sessionId=${sessionId}`);
    const data = await res.json();
    setConversations(data.conversations || []);
    if (data.quota) setQuota(data.quota);
    return data;
  }, []);

  const loadConversation = useCallback(async (id: string) => {
    setActiveId(id);
    const res = await fetch(`/api/ai/conversations/${id}`);
    if (!res.ok) return;
    const data = await res.json();
    setMessages(data.messages || []);
  }, []);

  // Initial load
  useEffect(() => {
    (async () => {
      const data = await fetchConversations();
      if (data.conversations?.length > 0) {
        await loadConversation(data.conversations[0].id);
      }
      setLoading(false);
    })();
  }, [fetchConversations, loadConversation]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  async function newConversation() {
    const sessionId = getSessionId();
    const res = await fetch("/api/ai/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    if (!res.ok) return;
    const { id } = await res.json();
    setActiveId(id);
    setMessages([]);
    setInput("");
    await fetchConversations();
    inputRef.current?.focus();
  }

  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setStreaming(true);

    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMsg]);

    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId: getSessionId(),
          conversationId: activeId,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const errorMsg = err.error || `Error ${res.status}`;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: errorMsg };
          return updated;
        });
        setStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        fullContent += text;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: fullContent };
          return updated;
        });
      }

      await fetchConversations();
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: "Something went wrong." };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function renderContent(content: string) {
    const html = content
      .replace(
        /\[([^\]]+)\]\((\/[^)]+)\)/g,
        '<a href="$2" class="font-medium text-amber-600 underline underline-offset-2 hover:text-amber-700">$1</a>',
      )
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/^### (.+)$/gm, "<h3 class='mt-3 font-semibold text-sm'>$1</h3>")
      .replace(/^## (.+)$/gm, "<h2 class='mt-4 font-semibold text-base'>$1</h2>")
      .replace(/^- (.+)$/gm, "</p><li class='ml-4 list-disc text-sm'>$1</li>")
      .replace(/\n\n/g, "</p><p class='mt-2 text-sm leading-relaxed'>")
      .replace(/\n/g, "<br/>");

    return (
      <div
        className="text-sm leading-relaxed [&_p]:text-sm [&_p]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: `<p class="text-sm leading-relaxed">${html}</p>` }}
      />
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col border-r border-zinc-200 bg-zinc-50 transition-transform duration-300 md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-4">
          <Link href="/" className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            UPSCPrepNotes
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="text-zinc-400 hover:text-zinc-600 md:hidden"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* New Chat button */}
        <div className="p-3">
          <button
            type="button"
            onClick={newConversation}
            className="flex w-full items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
        </div>

        {/* Conversation list */}
        <nav className="flex-1 overflow-y-auto px-3 pb-3">
          {conversations.length === 0 ? (
            <p className="px-2 text-xs text-zinc-400">No conversations yet</p>
          ) : (
            <div className="space-y-1">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => {
                    loadConversation(conv.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full truncate rounded-lg px-3 py-2 text-left text-sm transition ${
                    activeId === conv.id
                      ? "bg-amber-100 font-medium text-amber-900"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  {formatTitle(conv.title)}
                </button>
              ))}
            </div>
          )}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-zinc-200 px-4 py-3">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>
              {quota ? `${quota.remaining} / 5 free` : "— / 5 free"}
            </span>
            <span className="text-zinc-300">Ask AI</span>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 md:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="text-zinc-500 hover:text-zinc-700 md:hidden"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <div className="hidden md:block" />

          <Link
            href="/"
            className="text-xs uppercase tracking-[0.3em] text-zinc-400 hover:text-zinc-600"
          >
            Home
          </Link>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-300" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-300 [animation-delay:0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-300 [animation-delay:0.3s]" />
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6">
              <div className="max-w-lg text-center">
                <h1 className="mb-2 text-2xl font-semibold tracking-tight text-zinc-800">
                  Ask UPSC AI
                </h1>
                <p className="mb-8 text-sm text-zinc-400">
                  Get answers from your UPSC study assistant — powered by topper strategies.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => {
                        setInput(q);
                        inputRef.current?.focus();
                      }}
                      className="cursor-pointer rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-500 transition hover:border-amber-300 hover:text-amber-700"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl px-4 py-6 md:px-6">
              <div className="space-y-6">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <div className="mr-3 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700 uppercase">
                        AI
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] md:max-w-[75%] ${
                        msg.role === "user"
                          ? "rounded-2xl bg-zinc-900 px-4 py-2.5 text-sm text-white"
                          : "text-zinc-800"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <>
                          {renderContent(msg.content)}
                          {msg.sources && msg.sources.length > 0 && (
                            <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-zinc-100 pt-3">
                              <span className="text-[10px] uppercase tracking-wider text-zinc-400">
                                Sources:
                              </span>
                              {msg.sources.map((s) => (
                                <Link
                                  key={s.slug}
                                  href={`/upsc-topper/${s.slug}`}
                                  className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-medium text-zinc-600 hover:bg-amber-100 hover:text-amber-700"
                                >
                                  {s.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      )}
                    </div>
                  </div>
                ))}
                {streaming && (
                  <div className="flex justify-start">
                    <div className="mr-3 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700 uppercase">
                      AI
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:0.15s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:0.3s]" />
                    </div>
                  </div>
                )}
              </div>
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-zinc-200 bg-white px-4 py-4 md:px-6">
          <div className="mx-auto max-w-3xl">
            <form onSubmit={handleSubmit} className="relative">
              <textarea
                ref={inputRef as any}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about UPSC preparation…"
                rows={1}
                disabled={streaming || loading}
                className="w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-3 pr-14 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:ring-0"
                style={{ minHeight: "44px", maxHeight: "120px" }}
                onInput={(e) => {
                  const el = e.target as HTMLTextAreaElement;
                  el.style.height = "auto";
                  el.style.height = Math.min(el.scrollHeight, 120) + "px";
                }}
              />
              <button
                type="submit"
                disabled={streaming || loading || !input.trim()}
                className="absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-white transition hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-zinc-900"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
                </svg>
              </button>
            </form>
            <p className="mt-2 text-center text-[10px] text-zinc-400">
              Responses are AI-generated. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

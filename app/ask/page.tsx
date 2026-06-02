"use client";

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { getSuggestedQuestions } from "@/lib/ai/build-prompt";

export default function AskPageWrapper() {
  return (
    <Suspense>
      <AskPage />
    </Suspense>
  );
}

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

const suggestedQuestions = getSuggestedQuestions();

function AskPage() {
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [quota, setQuota] = useState<{ remaining: number; canQuery: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const initialQueryDone = useRef(false);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch(`/api/ai/conversations?sessionId=${getSessionId()}`);
      if (!res.ok) return;
      const data = await res.json();
      setConversations(data.conversations || []);
      if (data.quota) setQuota(data.quota);
    } catch {}
  }, []);

  const loadConversation = useCallback(async (id: string) => {
    try {
      setActiveId(id);
      setMessages([]);
      const res = await fetch(`/api/ai/conversations/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data.messages || []);
    } catch {}
  }, []);

  // Handle initial query param
  useEffect(() => {
    if (loading || initialQueryDone.current) return;
    const q = searchParams.get("q");
    if (q) {
      initialQueryDone.current = true;
      setInput(q);
      // Wait a beat for everything to render, then submit
      setTimeout(() => {
        const form = document.querySelector("form");
        if (form) form.requestSubmit();
      }, 500);
    }
  }, [loading, searchParams]);

  useEffect(() => {
    (async () => {
      await fetchConversations();
      setLoading(false);
    })();
  }, [fetchConversations]);

  // Auto-scroll
  useEffect(() => {
    if (!showScrollBtn) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, streaming, showScrollBtn]);

  // Track scroll position
  const handleScroll = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distFromBottom > 200);
  }, []);

  async function newConversation() {
    try {
      const res = await fetch("/api/ai/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: getSessionId() }),
      });
      if (!res.ok) return;
      const { id } = await res.json();
      setActiveId(id);
      setMessages([]);
      setInput("");
      await fetchConversations();
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch {}
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg: Message = { role: "user", content: text };
    const assistantMsg: Message = { role: "assistant", content: "" };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    setStreaming(true);
    setShowScrollBtn(false);

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
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: err.error || `Error ${res.status}` };
          return updated;
        });
        setStreaming(false);
        return;
      }

      const newId = res.headers.get("X-Conversation-Id");
      if (newId && newId !== activeId) setActiveId(newId);

      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullContent += decoder.decode(value, { stream: true });
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

  async function copyContent(index: number, content: string) {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(index);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollBtn(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="flex h-screen bg-white">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-zinc-200 bg-white transition-transform duration-200 md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-3">
          <button
            type="button"
            onClick={newConversation}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            New chat
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 pb-2 scrollbar-thin" aria-label="Conversation history">
          {conversations.length === 0 ? (
            <p className="px-3 pt-6 text-center text-xs text-zinc-400">No conversations yet</p>
          ) : (
            <div className="space-y-0.5">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => {
                    loadConversation(conv.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full truncate rounded-lg px-3 py-2.5 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                    activeId === conv.id
                      ? "bg-zinc-100 font-medium text-zinc-900"
                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
                  }`}
                >
                  <svg className="-ml-0.5 mr-2 inline h-3.5 w-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  {formatTitle(conv.title)}
                </button>
              ))}
            </div>
          )}
        </nav>

        <div className="border-t border-zinc-100 px-3 py-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400" aria-label={`Quota: ${quota?.remaining ?? "—"} of 5 queries remaining`}>
              <svg className="-mt-0.5 mr-1 inline h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {quota ? `${quota.remaining} / 5` : "—"}
            </span>
            <Link href="/toppers/toppers-copy-compilation" data-track="ask-sidebar-cta" className="font-medium text-primary transition hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
              Get the Compilation →
            </Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile header */}
        <header className="flex items-center justify-between border-b border-zinc-100 bg-white px-4 py-3 md:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-1 text-zinc-500 transition hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            aria-label="Open sidebar"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <span className="text-sm font-medium text-zinc-700">Ask AI</span>
          <Link href="/" className="text-xs text-zinc-400 transition hover:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
            Home
          </Link>
        </header>

        {/* Messages area */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="relative flex-1 overflow-y-auto bg-white scrollbar-thin"
        >
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-200 border-t-primary" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6">
              <div className="mx-auto w-full max-w-xl text-center">
                <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <h1 className="mb-1.5 text-xl font-semibold tracking-tight text-zinc-800">Ask UPSC AI</h1>
                <p className="mb-8 text-sm text-zinc-400">
                  Get answers from actual UPSC topper strategies
                </p>
                <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Suggested questions">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => {
                        setInput(q);
                        setTimeout(() => inputRef.current?.focus(), 50);
                      }}
                      className="rounded-lg border border-zinc-200 px-3.5 py-2 text-sm text-zinc-500 transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mx-auto max-w-3xl">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`animate-in fade-in-0 slide-in-from-bottom-2 ${
                      msg.role === "assistant" ? "bg-zinc-50" : "bg-white"
                    } border-b border-zinc-100 last:border-b-0`}
                    style={{ animationDuration: "200ms" }}
                  >
                    <div className="mx-auto max-w-3xl px-4 py-6 md:px-6 lg:px-10">
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            msg.role === "assistant"
                              ? "bg-zinc-700 text-white"
                              : "bg-zinc-800 text-white"
                          }`}
                          aria-hidden
                        >
                          {msg.role === "assistant" ? "AI" : "U"}
                        </div>

                        <div className="min-w-0 flex-1 group">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-zinc-500">
                              {msg.role === "assistant" ? "Assistant" : "You"}
                            </span>
                            {msg.role === "assistant" && msg.content && (
                              <button
                                type="button"
                                onClick={() => copyContent(i, msg.content)}
                                className="opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100 rounded p-1 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                                aria-label={copiedId === i ? "Copied" : "Copy response"}
                              >
                                {copiedId === i ? (
                                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                                  </svg>
                                )}
                              </button>
                            )}
                          </div>
                          {msg.role === "assistant" ? (
                            <div className="prose prose-zinc prose-sm max-w-none mt-2 prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:rounded prose-code:bg-zinc-200/70 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-normal prose-pre:rounded-xl prose-pre:bg-zinc-800 prose-pre:text-zinc-100 prose-li:marker:text-zinc-400">
                              <ReactMarkdown components={mdComponents}>{msg.content}</ReactMarkdown>
                              {msg.sources && msg.sources.length > 0 && (
                                  <div className="mt-6 flex flex-wrap items-center gap-2">
                                  <span className="text-xs font-medium text-zinc-400">Sources:</span>
                                  {msg.sources.map((s) => (
                                    <Link
                                      key={s.slug}
                                      href={`/upsc-topper/${s.slug}`}
                                      className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 ring-1 ring-zinc-200 transition hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                                    >
                                      {s.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                              <div className="mt-6 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 px-4 py-3">
                                <Link
                                  href="/toppers/toppers-copy-compilation"
                                  data-track="ask-after-answer-cta"
                                  className="flex items-center justify-between gap-2 text-xs text-zinc-500 transition hover:text-zinc-800"
                                >
                                  <span>See actual answer copies with marks from these toppers →</span>
                                  <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </Link>
                              </div>
                            </div>
                          ) : (
                            <p className="mt-2 text-sm leading-relaxed text-zinc-800">{msg.content}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {streaming && (
                  <div className="bg-zinc-50 border-b border-zinc-100">
                    <div className="mx-auto max-w-3xl px-4 py-6 md:px-6 lg:px-10">
                      <div className="flex items-start gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-xs font-bold text-white" aria-hidden>
                          AI
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-semibold text-zinc-500">Assistant</span>
                          <div className="mt-2 pt-0.5">
                            <span className="inline-flex gap-1">
                              <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
                              <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:0.15s]" />
                              <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:0.3s]" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Scroll to bottom button */}
              {showScrollBtn && (
                <button
                  type="button"
                  onClick={scrollToBottom}
                  className="sticky bottom-4 left-1/2 z-10 mx-auto flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs text-zinc-500 shadow-lg transition hover:bg-zinc-50 hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  style={{ width: "fit-content" }}
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  Scroll to bottom
                </button>
              )}
            </>
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-zinc-100 bg-white px-4 py-4 md:px-6 lg:px-10">
          <div className="mx-auto max-w-3xl">
            <form onSubmit={handleSubmit} className="relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question…"
                rows={1}
                disabled={streaming || loading}
                className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 pr-12 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-300 focus:shadow-sm"
                style={{ minHeight: "48px", maxHeight: "160px" }}
                onInput={(e) => {
                  const el = e.target as HTMLTextAreaElement;
                  el.style.height = "auto";
                  el.style.height = Math.min(el.scrollHeight, 160) + "px";
                }}
              />
              <button
                type="submit"
                disabled={streaming || loading || !input.trim()}
                className="absolute right-1.5 bottom-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white transition hover:bg-zinc-800 active:scale-95 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                aria-label="Send message"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
                </svg>
              </button>
            </form>
            <p className="mt-2 text-center text-[11px] text-zinc-300">
              {quota ? `${quota.remaining} free queries remaining today` : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const mdComponents: Components = {
  a: ({ href, children }) => (
    <Link
      href={href || "#"}
      className="text-zinc-800 underline underline-offset-2 decoration-zinc-300 hover:decoration-zinc-500"
    >
      {children}
    </Link>
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className?.includes("language-");
    if (isInline) {
      return (
        <code className="rounded bg-zinc-200/70 px-1.5 py-0.5 text-sm font-normal text-zinc-800" {...props}>
          {children}
        </code>
      );
    }
    return (
      <pre className="my-4 overflow-x-auto rounded-xl bg-zinc-800 p-4 text-sm leading-relaxed text-zinc-100">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    );
  },
  ul: ({ children }) => <ul className="my-3 space-y-1.5 pl-5 list-disc">{children}</ul>,
  ol: ({ children }) => <ol className="my-3 space-y-1.5 pl-5 list-decimal">{children}</ol>,
  li: ({ children }) => <li className="text-sm leading-relaxed text-zinc-700 pl-1">{children}</li>,
  p: ({ children }) => <p className="my-3 text-sm leading-relaxed text-zinc-700 first:mt-0 last:mb-0">{children}</p>,
  h1: ({ children }) => <h1 className="mt-6 mb-3 text-base font-semibold tracking-tight text-zinc-900">{children}</h1>,
  h2: ({ children }) => <h2 className="mt-5 mb-2 text-sm font-semibold tracking-tight text-zinc-900">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-4 mb-2 text-sm font-semibold tracking-tight text-zinc-900">{children}</h3>,
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-2 border-zinc-300 pl-4 text-sm italic text-zinc-500">{children}</blockquote>
  ),
  hr: () => <hr className="my-6 border-zinc-200" />,
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto rounded-xl border border-zinc-200">
      <table className="min-w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-r border-b border-zinc-200 bg-zinc-100/80 px-3 py-2 text-left font-medium text-zinc-700 last:border-r-0">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-r border-b border-zinc-200 px-3 py-2 text-zinc-600 last:border-r-0">{children}</td>
  ),
};

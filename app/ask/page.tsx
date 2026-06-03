"use client";

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { getSuggestedQuestions } from "@/lib/ai/build-prompt";
import { trackViewItem } from "@/lib/analytics";

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

const suggestedQuestions = getSuggestedQuestions();

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    ta.style.pointerEvents = "none";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return true;
  } catch {}
  return false;
}

function isSearchIndicator(content: string): boolean {
  return content.startsWith("\uD83D\uDD0D");
}

function stripSearchIndicator(content: string): string {
  const idx = content.indexOf("\n\n", content.indexOf("\uD83D\uDD0D"));
  if (idx === -1) return content;
  return content.slice(idx + 2);
}

function preprocessContent(content: string): string {
  return content.replace(/\[source:\s*([^\]]+)\]/gi, (_, domain) => {
    const d = domain.trim();
    const url = d.startsWith("http") ? d : `https://${d}`;
    return `[\uD83D\uDCCE ${d}](${url})`;
  });
}

function formatTitle(title: string | undefined): string {
  if (!title) return "Chat";
  return title.length > 40 ? title.slice(0, 40) + "\u2026" : title;
}

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
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
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

  useEffect(() => {
    if (loading || initialQueryDone.current) return;
    const q = searchParams.get("q");
    if (q) {
      initialQueryDone.current = true;
      setInput(q);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  useEffect(() => {
    if (!streaming && !loading) {
      inputRef.current?.focus();
    }
  }, [streaming, loading]);

  useEffect(() => {
    trackViewItem("Ask AI Page", 0);
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
    setIsSearching(false);

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
      let hasShownSearch = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullContent += chunk;

        if (!hasShownSearch && isSearchIndicator(fullContent)) {
          setIsSearching(true);
          hasShownSearch = true;
        }
        if (hasShownSearch && !isSearchIndicator(fullContent)) {
          setIsSearching(false);
        }

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: fullContent };
          return updated;
        });
      }

      setIsSearching(false);
      await fetchConversations();
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: "Something went wrong." };
        return updated;
      });
    } finally {
      setStreaming(false);
      setIsSearching(false);
    }
  }

  async function handleCopy(index: number, content: string) {
    let text = isSearchIndicator(content) ? stripSearchIndicator(content) : content;
    text = text.replace(/\[source:\s*[^\]]+\]/gi, "")
      .replace(/\[([^\]]*)\]\(https?:\/\/[^)]+\)/g, "$1")
      .trim();
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-zinc-200 bg-white transition-transform duration-300 md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 h-14 shrink-0">
          <Link href="/" data-track="ask-sidebar-home" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-zinc-900 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">PN</span>
            </div>
            <span className="text-sm font-bold tracking-tight text-zinc-800">Ask AI</span>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            data-track="ask-sidebar-close"
            className="md:hidden rounded-md p-1 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-3">
          <button
            type="button"
            onClick={newConversation}
            data-track="ask-new-chat"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-300"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            New chat
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 pb-2 scrollbar-thin">
          {conversations.length === 0 ? (
            <p className="px-3 pt-8 text-center text-xs text-zinc-400">No conversations yet</p>
          ) : (
            <div className="space-y-0.5">
              {conversations.map((conv, idx) => (
                <button
                  key={conv.id}
                  type="button"
                  data-track={`ask-conversation-${idx}`}
                  onClick={() => {
                    loadConversation(conv.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full truncate rounded-lg px-3 py-2.5 text-left text-sm transition ${
                    activeId === conv.id
                      ? "bg-zinc-100 font-medium text-zinc-900"
                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
                  }`}
                >
                  <svg className="-ml-0.5 mr-2 inline h-3.5 w-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  {formatTitle(conv.title)}
                </button>
              ))}
            </div>
          )}
        </nav>

        <div className="border-t border-zinc-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">
              <svg className="-mt-0.5 mr-1 inline h-3 w-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {quota ? `${quota.remaining} / 5` : "\u2014"}
            </span>
            <Link
              href="/toppers/toppers-copy-compilation"
              data-track="ask-sidebar-cta"
              className="text-xs font-medium text-zinc-800 underline underline-offset-2 decoration-zinc-300 hover:decoration-zinc-600 transition"
            >
              Get bundle \u2192
            </Link>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col min-w-0 h-screen">
        <header className="flex items-center justify-between border-b border-zinc-100 bg-white px-4 h-14 shrink-0 md:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            data-track="ask-mobile-menu"
            className="rounded-lg p-1.5 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 transition"
            aria-label="Open sidebar"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-zinc-700">Ask AI</span>
          <Link href="/" data-track="ask-mobile-home" className="text-xs text-zinc-400 hover:text-zinc-600 transition">
            Home
          </Link>
        </header>

        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto scrollbar-thin bg-white"
        >
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-800" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6">
              <div className="mx-auto w-full max-w-xl text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100">
                  <svg className="h-7 w-7 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <h1 className="mb-1.5 text-xl font-bold tracking-tight text-zinc-800">Ask UPSC AI</h1>
                <p className="mb-8 text-sm text-zinc-400 max-w-md mx-auto">
                  Get answers drawn from actual UPSC topper strategies and live web search
                </p>
                <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Suggested questions">
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={q}
                      type="button"
                      data-track={`ask-suggestion-${idx}`}
                      onClick={() => {
                        setInput(q);
                        setTimeout(() => inputRef.current?.focus(), 50);
                      }}
                      className="rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-500 transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-700"
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
                    className={`${
                      msg.role === "assistant" ? "bg-zinc-50/50" : "bg-white"
                    } border-b border-zinc-100 last:border-b-0`}
                  >
                    <div className="mx-auto max-w-3xl px-4 py-5 md:px-6 lg:px-8">
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                            msg.role === "assistant"
                              ? "bg-zinc-700 text-white"
                              : "bg-zinc-800 text-white"
                          }`}
                        >
                          {msg.role === "assistant" ? "AI" : "U"}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                              {msg.role === "assistant" ? "Assistant" : "You"}
                            </span>
                          </div>
                          {msg.role === "assistant" ? (
                            <div className="mt-1.5">
                              <div className="prose prose-zinc prose-sm max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-zinc-800 prose-a:underline prose-a:underline-offset-2 prose-a:decoration-zinc-300 hover:prose-a:decoration-zinc-500 prose-code:rounded prose-code:bg-zinc-200/70 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-normal prose-pre:rounded-xl prose-pre:bg-zinc-800 prose-pre:text-zinc-100 prose-li:marker:text-zinc-400">
                                <ReactMarkdown components={mdComponents}>{preprocessContent(msg.content)}</ReactMarkdown>
                                {msg.sources && msg.sources.length > 0 && (
                                  <div className="mt-5 flex flex-wrap items-center gap-2">
                                    <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">Sources:</span>
                                    {msg.sources.map((s, srcIdx) => (
                                      <Link
                                        key={s.slug}
                                        href={`/upsc-topper/${s.slug}`}
                                        data-track={`ask-source-${srcIdx}`}
                                        className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 ring-1 ring-zinc-200 transition hover:bg-zinc-200"
                                      >
                                        {s.name}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Copy button — always visible at bottom */}
                              {msg.content && (
                                <div className="flex justify-end mt-3">
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(i, msg.content)}
                                    data-track={`ask-copy-${i}`}
                                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition"
                                  >
                                    {copiedIndex === i ? (
                                      <>
                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Copied
                                      </>
                                    ) : (
                                      <>
                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        Copy
                                      </>
                                    )}
                                  </button>
                                </div>
                              )}

                              {/* CTA after answer copies */}
                              <div className="mt-2 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-3">
                                <Link
                                  href="/toppers/toppers-copy-compilation"
                                  data-track="ask-after-answer-cta"
                                  className="flex items-center justify-between gap-2 text-xs text-zinc-500 transition hover:text-zinc-800"
                                >
                                  <span>See actual answer copies with marks from these toppers \u2192</span>
                                  <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </Link>
                              </div>
                            </div>
                          ) : (
                            <p className="mt-1.5 text-sm leading-relaxed text-zinc-800">{msg.content}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Streaming indicator */}
                {streaming && (
                  <div className="bg-zinc-50/50 border-b border-zinc-100">
                    <div className="mx-auto max-w-3xl px-4 py-5 md:px-6 lg:px-8">
                      <div className="flex items-start gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-[11px] font-bold text-white">AI</div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Assistant</span>
                          <div className="mt-3">
                            {isSearching ? (
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
                                  <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:0.15s]" />
                                  <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:0.3s]" />
                                </div>
                                <span className="text-xs text-zinc-400">Searching the web\u2026</span>
                              </div>
                            ) : (
                              <div className="flex gap-1">
                                <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
                                <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:0.15s]" />
                                <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:0.3s]" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </>
          )}
        </div>

        <div className="border-t border-zinc-100 bg-white px-4 py-3 md:px-6 lg:px-8 shrink-0">
          <div className="mx-auto max-w-3xl">
            <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
              <div className="relative flex-1">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  data-track="ask-message-input"
                  placeholder="Ask a question about UPSC preparation\u2026"
                  rows={1}
                  disabled={streaming || loading}
                  className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 pr-10 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:shadow-sm"
                  style={{ minHeight: "48px", maxHeight: "160px" }}
                  onInput={(e) => {
                    const el = e.target as HTMLTextAreaElement;
                    el.style.height = "auto";
                    el.style.height = Math.min(el.scrollHeight, 160) + "px";
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={streaming || loading || !input.trim()}
                data-track="ask-send"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white transition hover:bg-zinc-800 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
                </svg>
              </button>
            </form>
            <p className="mt-1.5 text-center text-[11px] text-zinc-300">
              {quota ? `${quota.remaining} free queries remaining today` : ""}
              {quota && quota.remaining <= 1 ? ` \u2014 Get unlimited access in the bundle` : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const mdComponents: Components = {
  a: ({ href, children }) => {
    const isExternal = href?.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-200 hover:text-zinc-800 transition no-underline"
        >
          <span className="text-[13px] leading-none">\uD83D\uDCCE</span>
          <span className="max-w-[220px] truncate">{children}</span>
          <svg className="h-3 w-3 shrink-0 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      );
    }
    return (
      <Link
        href={href || "#"}
        className="text-zinc-800 underline underline-offset-2 decoration-zinc-300 hover:decoration-zinc-500"
      >
        {children}
      </Link>
    );
  },
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

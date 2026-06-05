"use client";

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { getSuggestedQuestions } from "@/lib/ai/build-prompt";
import { trackViewItem } from "@/lib/analytics";
import { trackClientEvent, getVisitorId } from "@/lib/client-analytics";

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

function getAskSessionId(): string {
  if (typeof window === "undefined") return "";
  return getVisitorId();
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
    return `[${d}](${url})`;
  });
}

function formatTitle(title: string | undefined): string {
  if (!title) return "Chat";
  return title.length > 40 ? title.slice(0, 40) + "\u2026" : title;
}

function dicebearUrl(seed: string): string {
  return `https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=${encodeURIComponent(seed)}`;
}

type SourceType = "government" | "official" | "academic" | "coaching" | "reference" | "community";

type SourceChip = {
  domain: string;
  label: string;
  type: SourceType;
  url: string;
  title?: string;
  reason?: string;
};

const SOURCE_TYPE_ORDER: Record<SourceType, number> = {
  government: 0,
  official: 1,
  academic: 2,
  coaching: 3,
  reference: 4,
  community: 5,
};

const SOURCE_TYPE_LABEL: Record<SourceType, string> = {
  government: "Government",
  official: "Official",
  academic: "Academic",
  coaching: "Coaching",
  reference: "Reference",
  community: "Community",
};

const GOVERNMENT_DOMAINS = [
  "upsc.gov.in", "pib.gov.in", "prsindia.org", "gov.in", "nic.in",
  "india.gov.in", "niti.gov.in", "education.gov.in", "mea.gov.in",
];

const OFFICIAL_DOMAINS = [
  "ncert.nic.in", "nios.ac.in", "ugc.ac.in", "aicte-india.org",
];

const ACADEMIC_DOMAINS = [
  "ac.in", ".edu", "researchgate.net", "scholar.google.com",
];

const COACHING_DOMAINS = [
  "vajiramandravi.com", "visionias.in", "nextias.com", "drishtiias.com",
  "forumias.com", "insightsonindia.com", "iasbaba.com", "byjus.com",
  "unacademy.com", "pendulumedu.com", "clearias.com", "sleepyclasses.com",
];

const KNOWN_DOMAIN_LABELS: Record<string, string> = {
  "vajiramandravi.com": "Vajiram & Ravi",
  "visionias.in": "Vision IAS",
  "nextias.com": "Next IAS",
  "drishtiias.com": "Drishti IAS",
  "forumias.com": "Forum IAS",
  "insightsonindia.com": "Insights on India",
  "iasbaba.com": "IAS Baba",
  "byjus.com": "BYJU'S",
  "unacademy.com": "Unacademy",
  "ncert.nic.in": "NCERT",
  "nios.ac.in": "NIOS",
  "upsc.gov.in": "UPSC",
  "pib.gov.in": "PIB",
  "prsindia.org": "PRS India",
};

function classifyDomain(domain: string): SourceType {
  const d = domain.toLowerCase().replace(/^www\./, "");
  for (const g of GOVERNMENT_DOMAINS) {
    if (d === g || d.endsWith("." + g)) return "government";
  }
  for (const o of OFFICIAL_DOMAINS) {
    if (d === o || d.endsWith("." + o)) return "official";
  }
  for (const c of COACHING_DOMAINS) {
    if (d === c || d.endsWith("." + c)) return "coaching";
  }
  for (const a of ACADEMIC_DOMAINS) {
    if (d.endsWith(a)) return "academic";
  }
  return "reference";
}

function classifySources(content: string): SourceChip[] {
  const linkRegex = /\[([^\]]*)\]\(https?:\/\/([^)\/]+)/gi;
  const seen = new Set<string>();
  const chips: SourceChip[] = [];
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const domain = match[2].toLowerCase().replace(/^www\./, "");
    if (seen.has(domain)) continue;
    seen.add(domain);
    const type = classifyDomain(domain);
    const label = KNOWN_DOMAIN_LABELS[domain] || match[1].trim() || domain.split(".")[0];
    const cleanDomain = domain.replace(/^https?:\/\//, "");
    chips.push({
      domain,
      label,
      type,
      url: match[0].match(/\(([^)]+)\)/)?.[1] || `https://${domain}`,
      title: label,
    });
  }
  chips.sort((a, b) => SOURCE_TYPE_ORDER[a.type] - SOURCE_TYPE_ORDER[b.type]);
  return chips;
}

const SOURCE_TYPE_COLORS: Record<SourceType, { bg: string; text: string; dot: string }> = {
  government: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  official: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  academic: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
  coaching: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  reference: { bg: "bg-zinc-50", text: "text-zinc-600", dot: "bg-zinc-400" },
  community: { bg: "bg-zinc-50", text: "text-zinc-600", dot: "bg-zinc-400" },
};

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
  const [searchResults, setSearchResults] = useState<{ domain: string; label: string; status: "fetching" | "done" }[]>([]);
  const [selectedSources, setSelectedSources] = useState<SourceChip[] | null>(null);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const initialQueryDone = useRef(false);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch(`/api/ai/conversations?sessionId=${getAskSessionId()}`);
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
        body: JSON.stringify({ sessionId: getAskSessionId() }),
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

    trackClientEvent("ask_question", {
      messageLength: text.length,
      conversationId: activeId || "new",
      hasHistory: messages.length > 0,
    });

    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId: getAskSessionId(),
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
        trackClientEvent("ask_error", { status: res.status, error: err.error || "unknown" });
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

      // Fake progressive source discovery for UX
      const searchTimer = setTimeout(() => {
        setIsSearching(true);
        const chips = classifySources(fullContent);
        if (chips.length > 0) {
          setSearchResults(chips.map((c) => ({ domain: c.domain, label: c.label, status: "done" as const })));
        } else {
          setSearchResults([
            { domain: "", label: "Searching sources", status: "fetching" },
          ]);
        }
      }, 800);
      let searchDone = false;

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
          if (!searchDone) {
            searchDone = true;
            clearTimeout(searchTimer);
            const chips = classifySources(fullContent);
            setSearchResults(chips.length > 1
              ? chips.slice(1).map((c) => ({ domain: c.domain, label: c.label, status: "done" as const }))
              : [{ domain: "", label: "Consulted sources", status: "done" as const }],
            );
            setTimeout(() => {
              setIsSearching(false);
              setSearchResults([]);
            }, 1200);
          }
        }

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: fullContent };
          return updated;
        });
      }

      clearTimeout(searchTimer);
      setIsSearching(false);
      setSearchResults([]);
      await fetchConversations();

      // Set follow-up questions from suggested list
      const shuffled = [...suggestedQuestions].sort(() => Math.random() - 0.5);
      setFollowUpQuestions(shuffled.slice(0, 4));

      trackClientEvent("ask_response", {
        responseLength: fullContent.length,
        conversationId: newId || activeId || "unknown",
        wasSearching: hasShownSearch,
      });
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: "Something went wrong." };
        return updated;
      });
      trackClientEvent("ask_error", { error: "fetch_crash" });
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
      <SourceDrawerModal sources={selectedSources} onClose={() => setSelectedSources(null)} />
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-zinc-100 bg-white transition-transform duration-300 md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 h-14 shrink-0">
          <Link href="/" data-track="ask-sidebar-home" className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-zinc-900 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">PN</span>
            </div>
            <span className="text-sm font-semibold tracking-tight text-zinc-800">Ask AI</span>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            data-track="ask-sidebar-close"
            className="md:hidden rounded-md p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition"
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
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 hover:border-zinc-300 hover:text-zinc-900"
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
                  className={`group w-full rounded-lg px-3 py-2.5 text-left text-sm transition ${
                    activeId === conv.id
                      ? "bg-zinc-100 font-medium text-zinc-900"
                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <svg className={`shrink-0 h-3.5 w-3.5 ${activeId === conv.id ? "text-zinc-600" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span className="truncate">{formatTitle(conv.title)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </nav>

        <div className="border-t border-zinc-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {quota ? `${quota.remaining} / 5 today` : "\u2014"}
            </span>
            <Link
              href="/toppers/toppers-copy-compilation"
              data-track="ask-sidebar-cta"
              className="text-xs font-medium text-zinc-700 underline underline-offset-2 decoration-zinc-300 transition hover:decoration-zinc-600"
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
              <div className="mx-auto max-w-4xl">
                {messages.map((msg, i) => (
                  <div key={i} className={msg.role === "assistant" ? "bg-white" : "bg-white"}>
                    {msg.role === "user" ? (
                      <div className="mx-auto max-w-3xl px-4 py-4 md:px-6 lg:px-8 flex justify-end">
                        <div className="flex items-start gap-3 flex-row-reverse max-w-[85%] md:max-w-[70%]">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-100 ring-1 ring-zinc-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={dicebearUrl(`user-${i}`)} alt="" className="h-full w-full object-cover" />
                          </div>
                          <div className="rounded-2xl bg-zinc-800 px-4 py-2.5 text-sm leading-relaxed text-white shadow-sm">
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="border-b border-zinc-100 last:border-b-0">
                        {/* Source chips bar — compact */}
                        {classifySources(msg.content).length > 0 && (
                          <div className="mx-auto max-w-4xl px-4 pt-5 md:px-6 lg:px-8">
                            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-2">
                              <svg className="h-3.5 w-3.5 shrink-0 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              <span className="mr-1 whitespace-nowrap text-xs font-medium text-zinc-500">
                                {classifySources(msg.content).length} sources
                              </span>
                              {classifySources(msg.content).slice(0, 4).map((src) => (
                                <button
                                  key={src.domain}
                                  onClick={() => setSelectedSources(classifySources(msg.content))}
                                  className="inline-flex shrink-0 items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50"
                                >
                                  <span className={`h-1.5 w-1.5 rounded-full ${SOURCE_TYPE_COLORS[src.type].dot}`} />
                                  <span className="max-w-[80px] truncate">{src.label}</span>
                                </button>
                              ))}
                              {classifySources(msg.content).length > 4 && (
                                <button
                                  onClick={() => setSelectedSources(classifySources(msg.content))}
                                  className="inline-flex shrink-0 items-center gap-1 rounded-md border border-dashed border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-700"
                                >
                                  +{classifySources(msg.content).length - 4}
                                </button>
                              )}
                              {/* Trust indicator */}
                              <span className="ml-auto hidden shrink-0 items-center gap-1.5 text-xs text-emerald-600 sm:inline-flex">
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                Verified
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Answer content */}
                        <div className="mx-auto max-w-4xl px-4 py-5 md:px-6 lg:px-8">
                          <div className="flex items-start gap-4">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm mt-1">
                              <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                              </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="prose prose-zinc max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-zinc-800 prose-a:underline prose-a:underline-offset-2 prose-a:decoration-zinc-300 hover:prose-a:decoration-zinc-500 prose-code:rounded prose-code:bg-zinc-200/70 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-normal prose-pre:rounded-xl prose-pre:bg-zinc-800 prose-pre:text-zinc-100 prose-li:marker:text-zinc-400 [&_p]:leading-[1.75] [&_p]:my-4 [&_li]:leading-[1.75] [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:mt-6 [&_h3]:mb-2 [&_blockquote]:border-l-[3px] [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-zinc-500 [&_blockquote]:my-6 [&_ul]:my-4 [&_ul]:space-y-2 [&_ol]:my-4 [&_ol]:space-y-2">
                                <ReactMarkdown components={mdComponents}>{preprocessContent(msg.content)}</ReactMarkdown>
                              </div>

                              {/* Topper sources */}
                              {msg.sources && msg.sources.length > 0 && (
                                <div className="mt-6 flex flex-wrap items-center gap-2">
                                  <span className="text-xs font-medium text-zinc-400">Topper references</span>
                                  {msg.sources.map((s, srcIdx) => (
                                    <Link
                                      key={s.slug}
                                      href={`/upsc-topper/${s.slug}`}
                                      data-track={`ask-source-${srcIdx}`}
                                      className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-800"
                                    >
                                      {s.name}
                                    </Link>
                                  ))}
                                </div>
                              )}

                              {/* Copy */}
                              {msg.content && (
                                <div className="mt-4 flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(i, msg.content)}
                                    data-track={`ask-copy-${i}`}
                                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs text-zinc-400 transition hover:text-zinc-600 hover:bg-zinc-100"
                                  >
                                    {copiedIndex === i ? (
                                      <><svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Copied</>
                                    ) : (
                                      <><svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>Copy</>
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Follow-up questions */}
                {!streaming && followUpQuestions.length > 0 && messages.length > 0 && (
                  <div className="border-t border-zinc-100">
                    <div className="mx-auto max-w-4xl px-4 py-5 md:px-6 lg:px-8">
                      <p className="mb-3 text-xs font-medium text-zinc-500">Related questions</p>
                      <div className="flex flex-wrap gap-2">
                        {followUpQuestions.map((q, qi) => (
                          <button
                            key={qi}
                            type="button"
                            data-track={`ask-followup-${qi}`}
                            onClick={() => {
                              setInput(q);
                              setTimeout(() => {
                                const form = document.querySelector("form");
                                if (form) form.requestSubmit();
                              }, 100);
                            }}
                            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-800"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* CTA after answer */}
                {!streaming && messages.length > 0 && messages[messages.length - 1]?.role === "assistant" && (
                  <div className="border-t border-zinc-100">
                    <div className="mx-auto max-w-4xl px-4 py-4 md:px-6 lg:px-8">
                      <Link
                        href="/toppers/toppers-copy-compilation"
                        data-track="ask-after-answer-cta"
                        className="inline-flex items-center gap-2 text-xs text-zinc-400 transition hover:text-zinc-700"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-3-3v6m-7 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        See actual answer copies with marks from these toppers
                      </Link>
                    </div>
                  </div>
                )}

                {/* Premium research state */}
                {streaming && isSearching && searchResults.length > 0 && (
                  <div className="bg-white border-t border-zinc-100">
                    <div className="mx-auto max-w-4xl px-4 py-4 md:px-6 lg:px-8">
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <div className="flex gap-1">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:0.15s]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:0.3s]" />
                        </div>
                        <span className="font-medium text-emerald-600">Researching</span>
                        <span className="text-zinc-300 mx-1">·</span>
                        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none max-w-[400px]">
                          {searchResults.map((r, ri) => (
                            <span key={ri} className="inline-flex shrink-0 items-center gap-1">
                              {r.status === "done" ? (
                                <svg className="h-3 w-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <span className="h-2 w-2 animate-pulse rounded-full bg-zinc-300" />
                              )}
                              <span className={r.status === "done" ? "text-zinc-600" : "text-zinc-400"}>{r.label}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Streaming indicator (idle) */}
                {streaming && !isSearching && (
                  <div className="bg-white">
                    <div className="mx-auto max-w-4xl px-4 py-4 md:px-6 lg:px-8">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600">
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                          </svg>
                        </div>
                        <div className="flex gap-1">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:0.15s]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:0.3s]" />
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
          <div className="mx-auto max-w-4xl">
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
            <p className="mt-2 text-center text-[11px] text-zinc-300">
              {quota ? `${quota.remaining} free queries remaining today` : ""}
              {quota && quota.remaining <= 1 ? ` \u2014 ` : ""}
              {quota && quota.remaining <= 1 ? (
                <Link href="/toppers/toppers-copy-compilation" className="text-zinc-500 underline underline-offset-2 decoration-zinc-300 hover:decoration-zinc-500">Get unlimited</Link>
              ) : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SourceDrawerModal({ sources, onClose }: { sources: SourceChip[] | null; onClose: () => void }) {
  if (!sources || sources.length === 0) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:p-4">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex max-h-[70vh] w-full flex-col rounded-t-2xl bg-white shadow-2xl sm:max-h-[60vh] sm:max-w-lg sm:rounded-2xl mx-auto">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-zinc-800">Sources</h3>
          <button onClick={onClose} className="rounded-md p-1 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition" aria-label="Close">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {sources.map((src, i) => {
            const colors = SOURCE_TYPE_COLORS[src.type];
            return (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-white p-3.5 transition hover:border-zinc-200">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${colors.bg}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://www.google.com/s2/favicons?domain=${src.domain}&sz=16`} alt="" className="h-4 w-4 rounded" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-800">{src.label}</span>
                    <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${colors.bg} ${colors.text}`}>
                      {SOURCE_TYPE_LABEL[src.type]}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-400">{src.domain}</p>
                  {src.reason && <p className="mt-1 text-xs text-zinc-500">{src.reason}</p>}
                </div>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition"
                  aria-label="Open source"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            );
          })}
        </div>
        <div className="border-t border-zinc-100 px-5 py-3 flex items-center justify-between text-xs text-zinc-400">
          <span>{sources.length} source{sources.length !== 1 ? "s" : ""}</span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              {sources.filter(s => s.type === "government").length} Gov
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              {sources.filter(s => s.type === "coaching").length} Coaching
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function faviconUrl(domain: string): string {
  const d = domain.replace(/^https?:\/\//, "").split("/")[0];
  return `https://www.google.com/s2/favicons?domain=${d}&sz=16`;
}

const mdComponents: Components = {
  a: ({ href, children }) => {
    if (!href) return <span>{children}</span>;
    const isExternal = href.startsWith("http");
    if (isExternal) {
      const domain = href.replace(/^https?:\/\//, "").split("/")[0];
      const favicon = faviconUrl(href);
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 border-b border-zinc-200 px-1 pb-0.5 text-xs text-zinc-500 no-underline transition hover:border-zinc-400 hover:text-zinc-800"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={favicon} alt="" className="h-3.5 w-3.5 shrink-0 rounded" width={14} height={14} />
          <span className="max-w-[180px] truncate font-medium">{children}</span>
        </a>
      );
    }
    return (
      <Link
        href={href || "#"}
        className="font-medium text-zinc-800 underline underline-offset-2 decoration-zinc-300 transition hover:decoration-zinc-600"
      >
        {children}
      </Link>
    );
  },
  code: ({ className, children, ...props }) => {
    const isInline = !className?.includes("language-");
    if (isInline) {
      return (
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm font-normal text-zinc-700" {...props}>
          {children}
        </code>
      );
    }
    return (
      <pre className="my-5 overflow-x-auto rounded-xl bg-zinc-900 p-4 text-sm leading-relaxed text-zinc-100">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    );
  },
  ul: ({ children }) => <ul className="my-5 space-y-2 pl-6 list-disc marker:text-zinc-300">{children}</ul>,
  ol: ({ children }) => <ol className="my-5 space-y-2 pl-6 list-decimal marker:text-zinc-400">{children}</ol>,
  li: ({ children }) => <li className="text-sm leading-[1.75] text-zinc-700 pl-1.5">{children}</li>,
  p: ({ children }) => <p className="my-4 text-sm leading-[1.75] text-zinc-700 first:mt-0 last:mb-0">{children}</p>,
  h1: ({ children }) => <h1 className="mt-8 mb-4 text-lg font-bold tracking-tight text-zinc-900">{children}</h1>,
  h2: ({ children }) => <h2 className="mt-8 mb-3 text-base font-semibold tracking-tight text-zinc-900">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-6 mb-2 text-sm font-semibold tracking-tight text-zinc-900">{children}</h3>,
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-[3px] border-zinc-300 pl-5 text-sm leading-[1.75] text-zinc-500 italic">{children}</blockquote>
  ),
  hr: () => <hr className="my-8 border-zinc-100" />,
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-zinc-200">
      <table className="min-w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-r border-b border-zinc-200 bg-zinc-50 px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600 last:border-r-0">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-r border-b border-zinc-100 px-4 py-2.5 text-sm text-zinc-600 last:border-r-0">{children}</td>
  ),
};

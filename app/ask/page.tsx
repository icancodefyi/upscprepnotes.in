"use client";

import {
  Suspense,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  Fragment,
} from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSession, signIn, signOut } from "next-auth/react";
import { getSuggestedQuestions } from "@/lib/ai/build-prompt";
import { trackViewItem } from "@/lib/analytics";
import { trackClientEvent, getVisitorId } from "@/lib/client-analytics";
import ProductRecommendations from "@/components/ProductRecommendations";

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
  if (idx === -1) return "";
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
  if (!title) return "New conversation";
  let t = title;
  const prefixes = [
    "Tell me more about ",
    "What is ",
    "What are ",
    "How did ",
    "How should ",
    "How do ",
    "Explain ",
    "What's ",
  ];
  for (const p of prefixes) {
    if (t.startsWith(p)) {
      t = t.slice(p.length);
      break;
    }
  }
  t = t.charAt(0).toUpperCase() + t.slice(1);
  return t.length > 35 ? t.slice(0, 35) + "\u2026" : t;
}

function dicebearUrl(seed: string): string {
  return `https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=${encodeURIComponent(seed)}`;
}

type SourceType =
  | "government"
  | "official"
  | "academic"
  | "coaching"
  | "reference"
  | "community"
  | "topper";

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
  topper: 6,
};

const SOURCE_TYPE_LABEL: Record<SourceType, string> = {
  government: "Government",
  official: "Official",
  academic: "Academic",
  coaching: "Coaching",
  reference: "Reference",
  community: "Community",
  topper: "Topper",
};

const GOVERNMENT_DOMAINS = [
  "upsc.gov.in",
  "pib.gov.in",
  "prsindia.org",
  "gov.in",
  "nic.in",
  "india.gov.in",
  "niti.gov.in",
  "education.gov.in",
  "mea.gov.in",
];

const OFFICIAL_DOMAINS = [
  "ncert.nic.in",
  "nios.ac.in",
  "ugc.ac.in",
  "aicte-india.org",
];

const ACADEMIC_DOMAINS = [
  "ac.in",
  ".edu",
  "researchgate.net",
  "scholar.google.com",
];

const COACHING_DOMAINS = [
  "vajiramandravi.com",
  "visionias.in",
  "nextias.com",
  "drishtiias.com",
  "forumias.com",
  "insightsonindia.com",
  "iasbaba.com",
  "byjus.com",
  "unacademy.com",
  "pendulumedu.com",
  "clearias.com",
  "sleepyclasses.com",
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
    const linkText = match[1].trim();
    const genericLabels = new Set([
      "source",
      "sources",
      "link",
      "website",
      "here",
      "article",
      "page",
    ]);
    const label =
      KNOWN_DOMAIN_LABELS[domain] ||
      (!genericLabels.has(linkText.toLowerCase())
        ? linkText
        : domain.split(".")[0]);
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

function getMergedSources(msg: Message): SourceChip[] {
  const webSources = classifySources(msg.content);
  const topperSources: SourceChip[] = (msg.sources || []).map((s) => ({
    domain: `topper/${s.slug}`,
    label: s.name,
    type: "topper" as SourceType,
    url: `/upsc-topper/${s.slug}`,
    title: s.name,
  }));
  const merged = [...webSources, ...topperSources];
  merged.sort((a, b) => SOURCE_TYPE_ORDER[a.type] - SOURCE_TYPE_ORDER[b.type]);
  return merged;
}

const SOURCE_TYPE_COLORS: Record<
  SourceType,
  { bg: string; text: string; dot: string }
> = {
  government: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  official: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  academic: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    dot: "bg-violet-500",
  },
  coaching: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  reference: { bg: "bg-zinc-50", text: "text-zinc-600", dot: "bg-zinc-400" },
  community: { bg: "bg-zinc-50", text: "text-zinc-600", dot: "bg-zinc-400" },
  topper: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500" },
};

function groupConversations(convs: Conversation[]) {
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const yesterday = today - 86400000;
  const weekAgo = today - 7 * 86400000;

  const groups: { label: string; items: Conversation[] }[] = [
    { label: "Today", items: [] },
    { label: "Yesterday", items: [] },
    { label: "This Week", items: [] },
    { label: "Earlier", items: [] },
  ];

  for (const c of convs) {
    const t = new Date(c.updatedAt).getTime();
    if (t >= today) groups[0].items.push(c);
    else if (t >= yesterday) groups[1].items.push(c);
    else if (t >= weekAgo) groups[2].items.push(c);
    else groups[3].items.push(c);
  }

  return groups.filter((g) => g.items.length > 0);
}

function faviconUrl(domain: string): string {
  const d = domain.replace(/^https?:\/\//, "").split("/")[0];
  return `https://www.google.com/s2/favicons?domain=${d}&sz=16`;
}

function AskPage() {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingMessage, setStreamingMessage] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [searchedOnce, setSearchedOnce] = useState(false);
  const [quota, setQuota] = useState<{
    remaining: number;
    canQuery: boolean;
    isAuthenticated: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [quotaExhausted, setQuotaExhausted] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [searchPhase, setSearchPhase] = useState("");
  const [searchResults, setSearchResults] = useState<
    { domain: string; label: string; status: "fetching" | "done" }[]
  >([]);
  const [selectedSources, setSelectedSources] = useState<SourceChip[] | null>(
    null,
  );
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const initialQueryDone = useRef(false);

  const groupedConversations = useMemo(
    () => groupConversations(conversations),
    [conversations],
  );

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/ai/conversations?sessionId=${getAskSessionId()}`,
      );
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
    if (!streaming && !loading) inputRef.current?.focus();
  }, [streaming, loading]);

  useEffect(() => {
    trackViewItem("Ask AI Page", 0);
  }, []);

  // Migrate anonymous conversations and resend pending message when user signs in
  useEffect(() => {
    if (status === "authenticated" && pendingMessage) {
      (async () => {
        try {
          await fetch("/api/ai/migrate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId: getAskSessionId() }),
          });
          await fetchConversations();
        } catch {}
      })();
    }
  }, [status, fetchConversations, pendingMessage]);

  // Resend pending message after migration completes
  const migrationDone = useRef(false);
  useEffect(() => {
    if (
      status === "authenticated" &&
      pendingMessage &&
      !migrationDone.current
    ) {
      migrationDone.current = true;
      setInput(pendingMessage);
      setPendingMessage(null);
      setShowQuotaModal(false);
      setTimeout(() => {
        const form = document.querySelector("form");
        if (form) form.requestSubmit();
      }, 300);
    }
  }, [status, pendingMessage]);

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
      setFollowUpQuestions([]);
      await fetchConversations();
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch {}
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg: Message = { role: "user", content: text };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    setStreaming(true);
    setStreamingMessage(null);
    setSearchedOnce(false);
    setIsSearching(false);
    setSearchPhase("");
    setFollowUpQuestions([]);

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

      if (res.status === 429) {
        const errBody = await res.json().catch(() => ({}));
        setPendingMessage(text);
        setShowQuotaModal(true);
        setQuotaExhausted(true);
        setStreamingMessage(null);
        setQuota((prev) =>
          prev ? { ...prev, remaining: 0, canQuery: false } : prev,
        );
        trackClientEvent("ask_error", {
          status: 429,
          error: errBody.error || "quota_exhausted",
        });
        setStreaming(false);
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: err.error || `Error ${res.status}` },
        ]);
        setStreamingMessage(null);
        trackClientEvent("ask_error", {
          status: res.status,
          error: err.error || "unknown",
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
      let sourceLabelsShown = false;

      const searchTimer = setTimeout(() => {
        setSearchedOnce(true);
        setIsSearching(true);
        setSearchPhase("Gathering sources...");
        const chips = classifySources(fullContent);
        if (chips.length > 1) {
          setSearchResults(
            chips
              .slice(1)
              .map((c) => ({
                domain: c.domain,
                label: c.label,
                status: "done" as const,
              })),
          );
          setSearchPhase("Analyzing sources...");
          sourceLabelsShown = true;
        } else {
          setSearchResults([
            {
              domain: "",
              label: "Searching UPSC websites",
              status: "fetching",
            },
          ]);
        }
      }, 800);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullContent += chunk;

        // Detect search indicator and strip it from display content
        if (!hasShownSearch && isSearchIndicator(fullContent)) {
          setSearchedOnce(true);
          setIsSearching(true);
          setSearchPhase("Searching the web...");
          hasShownSearch = true;
        }

        const displayContentRaw = stripSearchIndicator(fullContent);

        // When real content starts arriving after the search indicator
        if (hasShownSearch && displayContentRaw.trim() && !sourceLabelsShown) {
          clearTimeout(searchTimer);
          const chips = classifySources(fullContent);
          if (chips.length > 1) {
            setSearchResults(
              chips
                .slice(1)
                .map((c) => ({
                  domain: c.domain,
                  label: c.label,
                  status: "done" as const,
                })),
            );
          } else {
            setSearchResults([
              {
                domain: "",
                label: "Consulted UPSC resources",
                status: "done" as const,
              },
            ]);
          }
          setSearchedOnce(true);
          setIsSearching(false);
          setSearchPhase("");
          setSearchResults([]);
          sourceLabelsShown = true;
        }

        setStreamingMessage(displayContentRaw || fullContent);
      }

      clearTimeout(searchTimer);
      setIsSearching(false);
      setSearchPhase("");
      setSearchResults([]);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: fullContent },
      ]);
      setStreamingMessage(null);

      await fetchConversations();

      const shuffled = [...suggestedQuestions].sort(() => Math.random() - 0.5);
      setFollowUpQuestions(shuffled.slice(0, 4));

      trackClientEvent("ask_response", {
        responseLength: fullContent.length,
        conversationId: newId || activeId || "unknown",
        wasSearching: hasShownSearch,
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong." },
      ]);
      setStreamingMessage(null);
      trackClientEvent("ask_error", { error: "fetch_crash" });
    } finally {
      setStreaming(false);
      setStreamingMessage(null);
      setIsSearching(false);
      setSearchPhase("");
    }
  }

  async function handleCopy(index: number, content: string) {
    let text = isSearchIndicator(content)
      ? stripSearchIndicator(content)
      : content;
    text = text
      .replace(/\[source:\s*[^\]]+\]/gi, "")
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
    <div className="flex h-full overflow-hidden bg-white">
      <SourceDrawerModal
        sources={selectedSources}
        onClose={() => setSelectedSources(null)}
      />

      {/* Quota exhausted modal */}
      {showQuotaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowQuotaModal(false)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-zinc-800">
                Daily limit reached
              </h3>
              <button
                type="button"
                onClick={() => setShowQuotaModal(false)}
                className="rounded-md p-1 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition"
                aria-label="Close"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="mb-5 text-sm text-zinc-500 leading-relaxed">
              You&apos;ve used all your queries for today. Sign in to get{" "}
              <span className="font-semibold text-zinc-700">
                20 queries/day
              </span>{" "}
              instead of 5.
            </p>
            <button
              type="button"
              onClick={() => {
                signIn("google");
                setShowQuotaModal(false);
              }}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 hover:border-zinc-300"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>
            <p className="mt-3 text-center text-xs text-zinc-400">
              Already signed in?{" "}
              <Link
                href="/store"
                className="text-zinc-500 underline underline-offset-2 decoration-zinc-300 hover:decoration-zinc-500"
              >
                Browse premium resources
              </Link>
            </p>
          </div>
        </div>
      )}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — quiet, low contrast */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-zinc-100 bg-white transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-3 h-12 shrink-0 border-b border-zinc-50">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="UPSCPrepNotes" className="h-10 w-auto" />
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            data-track="ask-sidebar-close"
            className="md:hidden p-1 text-zinc-300 hover:text-zinc-500 transition"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-2 pb-2">
          <button
            type="button"
            onClick={newConversation}
            data-track="ask-new-chat"
            className="flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-zinc-400 transition hover:bg-zinc-50 hover:text-zinc-600"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New chat
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-1.5 pb-2 scrollbar-thin">
          {conversations.length === 0 ? (
            <p className="px-3 pt-6 text-center text-xs text-zinc-300">
              No conversations
            </p>
          ) : (
            <div className="space-y-3">
              {groupedConversations.map((group) => (
                <div key={group.label}>
                  <p className="px-2.5 pb-0.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    {group.label}
                  </p>
                  <div className="space-y-0.5">
                    {group.items.slice(0, 8).map((conv, idx) => (
                      <button
                        key={conv.id}
                        type="button"
                        data-track={`ask-conversation-${idx}`}
                        onClick={() => {
                          loadConversation(conv.id);
                          setSidebarOpen(false);
                        }}
                        className={`group w-full rounded-lg px-2.5 py-1.5 text-left text-sm transition ${activeId === conv.id ? "bg-zinc-100 text-zinc-800 font-medium" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"}`}
                      >
                        <span className="truncate block">
                          {formatTitle(conv.title)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </nav>

        {/* Auth */}
        <div className="border-t border-zinc-50 px-2 py-2">
          {session?.user ? (
            <div className="flex items-center gap-2 px-2.5 py-1.5">
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt=""
                  className="h-5 w-5 rounded-full"
                />
              )}
              <span className="flex-1 truncate text-xs text-zinc-500">
                {session.user.email}
              </span>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/ask" })}
                className="text-[11px] text-zinc-400 hover:text-zinc-600 transition"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => signIn("google")}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-700"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
              <span className="ml-auto text-[11px] text-zinc-300">
                20 queries/day
              </span>
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        <header className="flex items-center justify-between border-b border-zinc-100 bg-white px-4 h-14 shrink-0 md:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            data-track="ask-mobile-menu"
            className="rounded-lg p-1.5 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 transition"
            aria-label="Open sidebar"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          <span className="text-sm font-semibold text-zinc-700">AI Mentor</span>
          <Link
            href="/"
            data-track="ask-mobile-home"
            className="text-xs text-zinc-400 hover:text-zinc-600 transition"
          >
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
              <div className="w-full max-w-md text-center">
                <h1 className="text-2xl font-bold text-zinc-900">
                  Ask the AI Mentor
                </h1>
                <p className="mt-2 text-sm text-zinc-500">
                  Get instant answers from 280+ topper strategies and real UPSC
                  data.
                </p>
                <div className="mt-8 space-y-2">
                  {[
                    "How did AIR 1 prepare for GS2?",
                    "Analyze UPSC 2024 GS1 urbanization question",
                    "What is the best answer writing framework?",
                  ].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => {
                        setInput(q);
                        inputRef.current?.focus();
                      }}
                      className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-zinc-700 text-left transition hover:border-emerald-400 hover:bg-emerald-100"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mx-auto max-w-[720px] px-4">
                {messages.map((msg, i) => (
                  <div key={i}>
                    {msg.role === "user" ? (
                      <div className="py-4 pl-8 flex justify-end">
                        <div className="rounded-2xl bg-zinc-800 px-4 py-2.5 text-sm leading-relaxed text-white max-w-[75%]">
                          {msg.content}
                        </div>
                      </div>
                    ) : (
                      <div className="border-b border-zinc-100 last:border-b-0">
                        <div className="py-5 relative">
                          <div className="absolute left-0 top-[14px]">
                            <img
                              src="/logo.png"
                              alt=""
                              className="h-9 w-9 rounded-full bg-white shadow-sm ring-1 ring-zinc-100"
                            />
                          </div>
                          <div className="pl-11">
                            <div className="prose prose-zinc max-w-none prose-a:text-zinc-800 prose-a:underline prose-a:underline-offset-2 prose-a:decoration-zinc-300 hover:prose-a:decoration-zinc-500 prose-code:rounded prose-code:bg-zinc-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:text-zinc-700 prose-pre:rounded-lg prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-li:marker:text-zinc-400">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={mdComponents}
                              >
                                {preprocessContent(msg.content)}
                              </ReactMarkdown>
                            </div>
                            {msg.content && (
                              <div className="mt-4 flex items-center gap-1 text-[11px]">
                                <button
                                  type="button"
                                  onClick={() => handleCopy(i, msg.content)}
                                  data-track={`ask-copy-${i}`}
                                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
                                >
                                  {copiedIndex === i ? (
                                    <>
                                      <svg
                                        className="h-3.5 w-3.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                      Copied
                                    </>
                                  ) : (
                                    <>
                                      <svg
                                        className="h-3.5 w-3.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={1.5}
                                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                      </svg>
                                      Copy
                                    </>
                                  )}
                                </button>
                                {getMergedSources(msg).length > 0 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setSelectedSources(getMergedSources(msg))
                                    }
                                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
                                  >
                                    <svg
                                      className="h-3.5 w-3.5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                      />
                                    </svg>
                                    {getMergedSources(msg).length} source
                                    {getMergedSources(msg).length !== 1
                                      ? "s"
                                      : ""}
                                  </button>
                                )}
                              </div>
                            )}
                            <ProductRecommendations />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Streaming assistant message */}
                {streamingMessage && (
                  <div className="border-b border-zinc-100 last:border-b-0">
                    <div className="py-5 relative">
                      <div className="absolute left-0 top-[14px]">
                        <img
                          src="/logo.png"
                          alt=""
                          className="h-9 w-9 rounded-full bg-white shadow-sm ring-1 ring-zinc-100"
                        />
                      </div>
                      <div className="pl-11">
                        <div className="prose prose-zinc max-w-none prose-a:text-zinc-800 prose-a:underline prose-a:underline-offset-2 prose-a:decoration-zinc-300 hover:prose-a:decoration-zinc-500 prose-code:rounded prose-code:bg-zinc-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:text-zinc-700 prose-pre:rounded-lg prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-li:marker:text-zinc-400">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={mdComponents}
                          >
                            {preprocessContent(streamingMessage)}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Research progress — shown only while searching, hidden the instant content arrives */}
                {streaming && isSearching && (
                  <div className="mx-auto max-w-[720px] px-4 py-4">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <svg
                        className="h-3.5 w-3.5 text-zinc-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <span>{searchPhase || "Researching..."}</span>
                      <span className="text-zinc-200 mx-1">·</span>
                      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none max-w-[400px]">
                        {searchResults.length === 0 ? (
                          <span className="flex gap-1">
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-200" />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-200 [animation-delay:0.15s]" />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-200 [animation-delay:0.3s]" />
                          </span>
                        ) : (
                          searchResults.map((r, ri) => (
                            <span
                              key={ri}
                              className="inline-flex shrink-0 items-center gap-1"
                            >
                              {r.status === "done" ? (
                                <svg
                                  className="h-3 w-3 text-zinc-300"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              ) : (
                                <span className="h-2 w-2 animate-pulse rounded-full bg-zinc-200" />
                              )}
                              <span
                                className={
                                  r.status === "done"
                                    ? "text-zinc-400"
                                    : "text-zinc-300"
                                }
                              >
                                {r.label}
                              </span>
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Web search used — tiny muted row after streaming, replaces search banner */}
                {!streaming && searchedOnce && messages.length > 0 && (
                  <div className="mx-auto max-w-[720px] px-4 pb-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-300">
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      Web search used
                    </div>
                  </div>
                )}

                {/* Streaming indicator — dot animation while streaming but not searching */}
                {streaming && !isSearching && (
                  <div className="mx-auto max-w-[720px] px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800">
                        <svg
                          className="h-3 w-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </div>
                      <div className="flex gap-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-300" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-300 [animation-delay:0.15s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-300 [animation-delay:0.3s]" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />

                {!streaming && followUpQuestions.length > 0 && (
                  <div className="mt-4 mb-2">
                    <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-400 mb-2 font-medium">
                      Follow up
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {followUpQuestions.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => {
                            setInput(q);
                            inputRef.current?.focus();
                          }}
                          className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs text-zinc-700 transition hover:border-emerald-400 hover:bg-emerald-100"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Input area */}
       <div className="shrink-0 border-t border-zinc-100 bg-white px-4 pt-4 pb-4 md:px-6">
  <div className="mx-auto max-w-3xl">

    <form onSubmit={handleSubmit}>
      <div
        className="
          relative
          overflow-hidden
          rounded-[20px]
          border
          border-zinc-200
          bg-white
          shadow-sm
          transition-all
          duration-200
          focus-within:border-zinc-300
          focus-within:shadow-md
        "
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={streaming || loading}
          rows={1}
          placeholder="Ask about UPSC preparation..."
          className="
            block
            w-full
            resize-none
            border-0
            bg-transparent
            px-5
            py-3
            pr-16
            text-[15px]
            leading-6
            text-zinc-900
            outline-none
            placeholder:text-zinc-400
          "
          style={{
            minHeight: "52px",
            maxHeight: "220px",
          }}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "52px";
            el.style.height =
              Math.min(el.scrollHeight, 220) + "px";
          }}
        />

        <button
          type="submit"
          disabled={streaming || loading || !input.trim()}
          aria-label="Send message"
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            bg-zinc-900
            text-white
            transition-all
            duration-200
            hover:scale-105
            hover:bg-zinc-800
            active:scale-95
            disabled:scale-100
            disabled:bg-zinc-200
            disabled:text-zinc-400
            disabled:cursor-not-allowed
          "
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 12h14m-7-7l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </form>

    {quota && (
      <p className="mt-2 text-center text-[11px] text-zinc-400">
        {quota.isAuthenticated
          ? `${quota.remaining} of 20 queries remaining today`
          : `${quota.remaining} of 5 free queries remaining today`}

        {quota.remaining <= 1 && !quota.isAuthenticated && (
          <>
            {" "}
            —{" "}
            <button
              type="button"
              onClick={() => signIn("google")}
              className="text-zinc-500 underline underline-offset-2 hover:text-zinc-700"
            >
              Sign in for 20/day
            </button>
          </>
        )}

        {quota.remaining <= 1 && quota.isAuthenticated && (
          <>
            {" "}
            —{" "}
            <Link
              href="/store"
              className="text-zinc-500 underline underline-offset-2 hover:text-zinc-700"
            >
              Browse premium resources
            </Link>
          </>
        )}
      </p>
    )}
  </div>
</div>
      </div>
    </div>
  );
}

function SourceDrawerModal({
  sources,
  onClose,
}: {
  sources: SourceChip[] | null;
  onClose: () => void;
}) {
  if (!sources || sources.length === 0) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:p-4">
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[70vh] w-full flex-col rounded-t-2xl bg-white shadow-2xl sm:max-h-[60vh] sm:max-w-lg sm:rounded-2xl mx-auto">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-zinc-800">Sources</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition"
            aria-label="Close"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {sources.map((src, i) => {
            const colors = SOURCE_TYPE_COLORS[src.type];
            return (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-white p-3.5 transition hover:border-zinc-200"
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colors.bg}`}
                >
                  {src.type === "topper" ? (
                    <svg
                      className="h-4 w-4 text-rose-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  ) : (
                    <img
                      src={faviconUrl(src.domain)}
                      alt=""
                      className="h-4 w-4 rounded"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-800">
                      {src.label}
                    </span>
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${colors.bg} ${colors.text}`}
                    >
                      {SOURCE_TYPE_LABEL[src.type]}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-400">{src.domain}</p>
                  {src.reason && (
                    <p className="mt-1 text-xs text-zinc-500">{src.reason}</p>
                  )}
                </div>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition"
                  aria-label="Open source"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            );
          })}
        </div>
        <div className="border-t border-zinc-100 px-5 py-3 flex items-center justify-between text-xs text-zinc-400">
          <span>
            {sources.length} source{sources.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  );
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
          className="inline-flex items-center border-b border-zinc-200 px-1 pb-0.5 transition hover:border-zinc-400"
        >
          <img
            src={favicon}
            alt=""
            className="h-3.5 w-3.5 shrink-0 rounded"
            width={14}
            height={14}
          />
        </a>
      );
    }
    return (
      <Link
        href={href || "#"}
        className="text-zinc-600 underline underline-offset-2 decoration-zinc-300 transition hover:decoration-zinc-500"
      >
        {children}
      </Link>
    );
  },
  code: ({ className, children, ...props }) => {
    const isInline = !className?.includes("language-");
    if (isInline) {
      return (
        <code
          className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm text-zinc-600"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <pre className="my-4 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm leading-relaxed text-zinc-100">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    );
  },
  ul: ({ children }) => (
    <ul className="my-3 space-y-1 pl-5 list-disc marker:text-zinc-300">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-3 space-y-1 pl-5 list-decimal marker:text-zinc-400">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-[16px] leading-[1.7] text-zinc-800 pl-1">{children}</li>
  ),
  p: ({ children }) => (
    <p className="my-3 text-[16px] leading-[1.7] text-zinc-800 first:mt-0 last:mb-0">
      {children}
    </p>
  ),
  h1: ({ children }) => (
    <h1 className="mt-6 mb-3 text-base font-bold tracking-tight text-zinc-900">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-6 mb-2 text-sm font-semibold tracking-tight text-zinc-900">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-5 mb-2 text-sm font-medium tracking-tight text-zinc-900">
      {children}
    </h3>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-[3px] border-zinc-200 pl-4 text-[16px] leading-[1.7] text-zinc-600 italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-5 border-zinc-100" />,
  table: ({ children }) => (
    <div className="my-5 overflow-x-auto rounded-lg border border-zinc-200">
      <table className="min-w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-r border-b border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 last:border-r-0">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-r border-b border-zinc-100 px-3 py-2 text-sm text-zinc-600 last:border-r-0">
      {children}
    </td>
  ),
};

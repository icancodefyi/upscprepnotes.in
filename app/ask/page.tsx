"use client";

import {
  Suspense,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
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
import posthog from "posthog-js";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
} from "@/components/ui/message";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

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

type AskStatusEvent =
  | { t: "begin"; label?: string }
  | { t: "status"; label?: string }
  | { t: "sources"; items?: { domain: string; label: string }[] }
  | { t: "end" };

function stripSearchIndicator(content: string): string {
  const idx = content.indexOf("\n\n", content.indexOf("\uD83D\uDD0D"));
  if (idx === -1) return "";
  return content.slice(idx + 2);
}

function preprocessContent(content: string): string {
  let result = content;
  result = result.replace(/\[source:\s*([^\]]+)\]/gi, (_, domain) => {
    const d = domain.trim().replace(/\s+/g, "");
    const url = d.startsWith("http") ? d : `https://${d}`;
    return `[${d}](${url})`;
  });
  result = result.replace(/\[([^\]]+)\]\(\s+([^)\s]+)\s*\)/gi, (_, text, url) => {
    return `[${text}](${url.replace(/\s+/g, "")})`;
  });
  return result;
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
  government: { bg: "bg-brand-muted", text: "text-blue-700", dot: "bg-blue-500" },
  official: {
    bg: "bg-brand-muted",
    text: "text-brand",
    dot: "bg-brand",
  },
  academic: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    dot: "bg-violet-500",
  },
  coaching: { bg: "bg-brand-muted", text: "text-brand", dot: "bg-brand-muted" },
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
  const [researchLabel, setResearchLabel] = useState("");
  const [researchSources, setResearchSources] = useState<
    { domain: string; label: string }[]
  >([]);
  const [selectedSources, setSelectedSources] = useState<SourceChip[] | null>(
    null,
  );
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [searchWeb, setSearchWeb] = useState(false);
  const [shareData, setShareData] = useState<{ question: string; answer: string } | null>(null);
  const [shareImageBlob, setShareImageBlob] = useState<Blob | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const shareCanvasRef = useRef<HTMLCanvasElement>(null);
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

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      posthog.identify(session.user.email, {
        email: session.user.email,
        name: session.user.name || undefined,
      });
    }
  }, [status, session?.user?.email, session?.user?.name]);

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
    setResearchLabel("");
    setResearchSources([]);
    setFollowUpQuestions([]);

    trackClientEvent("ask_question", {
      messageLength: text.length,
      conversationId: activeId || "new",
      hasHistory: messages.length > 0,
    });
    posthog.capture("ai_question_asked", {
      message_length: text.length,
      conversation_id: activeId || "new",
      has_history: messages.length > 0,
    });

    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId: getAskSessionId(),
          conversationId: activeId,
          searchWeb,
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
      let buffer = "";

      // Handle server control frames (status/source updates)
      const applyEvent = (ev: AskStatusEvent) => {
        switch (ev.t) {
          case "begin":
            setIsSearching(true);
            setResearchLabel(ev.label || "Researching");
            setResearchSources([]);
            break;
          case "status":
            setResearchLabel(ev.label || "Researching");
            break;
          case "sources":
            if (Array.isArray(ev.items)) setResearchSources(ev.items);
            break;
          case "end":
            setIsSearching(false);
            break;
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Extract complete `#@<json>\n` control frames; keep everything else as content
        let idx = buffer.indexOf("#@");
        while (idx !== -1) {
          const nl = buffer.indexOf("\n", idx + 2);
          if (nl === -1) break;
          const frame = buffer.slice(idx + 2, nl);
          let ev: AskStatusEvent | null = null;
          try {
            ev = JSON.parse(frame) as AskStatusEvent;
          } catch {}
          if (ev) applyEvent(ev);
          buffer = buffer.slice(0, idx) + buffer.slice(nl + 1);
          idx = buffer.indexOf("#@");
        }

        fullContent += buffer;
        buffer = "";

        // Detect search indicator and strip it from display content
        if (!hasShownSearch && isSearchIndicator(fullContent)) {
          setSearchedOnce(true);
          hasShownSearch = true;
        }

        const displayContentRaw = stripSearchIndicator(fullContent);
        setStreamingMessage(displayContentRaw || fullContent);
      }

      // Flush any trailing content left in the frame buffer (partial non-frame text)
      if (buffer && !buffer.startsWith("#@")) {
        fullContent += buffer;
        setStreamingMessage(stripSearchIndicator(fullContent) || fullContent);
      }

      setIsSearching(false);
      setResearchLabel("");
      setResearchSources([]);

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
      setResearchLabel("");
      setResearchSources([]);
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

  function stripMarkdown(content: string): string {
    let text = isSearchIndicator(content)
      ? stripSearchIndicator(content)
      : content;
    text = text
      .replace(/\[source:\s*[^\]]+\]/gi, "")
      .replace(/\[([^\]]*)\]\(https?:\/\/[^)]+\)/g, "$1")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/^\s*[-•]\s+/gm, "• ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    return text;
  }

  function openShareModal(answerContent: string, question?: string) {
    const q = question || messages.filter(m => m.role === "user").pop()?.content || "";
    const cleanAnswer = stripMarkdown(answerContent);
    setShareData({ question: q, answer: cleanAnswer });
    setShareImageBlob(null);
    setShareCopied(false);
    setTimeout(() => generateShareCard(q, cleanAnswer), 50);
  }

  function generateShareCard(question: string, answer: string) {
    const canvas = shareCanvasRef.current;
    if (!canvas) return;
    const W = 1080;
    const H = 1350;
    const dpr = 2;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#0a0a0a");
    grad.addColorStop(0.5, "#111827");
    grad.addColorStop(1, "#0a0a0a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Accent line at top
    ctx.fillStyle = "#10b981";
    ctx.fillRect(0, 0, W, 6);

    // Header
    ctx.fillStyle = "#10b981";
    ctx.font = "600 24px system-ui, -apple-system, sans-serif";
    ctx.fillText("UPSCPrepNotes", 60, 75);
    ctx.fillStyle = "#52525b";
    ctx.font = "400 18px system-ui, -apple-system, sans-serif";
    ctx.fillText("AI Mentor", 235, 75);

    // Question section
    let y = 130;
    ctx.fillStyle = "#10b981";
    ctx.font = "600 16px system-ui, -apple-system, sans-serif";
    ctx.fillText("Q:", 60, y);
    ctx.fillStyle = "#f4f4f5";
    ctx.font = "600 26px system-ui, -apple-system, sans-serif";
    const qLines = wrapText(ctx, question, W - 160);
    for (const line of qLines) {
      y += 36;
      ctx.fillText(line, 90, y);
    }

    // Divider
    y += 45;
    ctx.strokeStyle = "#27272a";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, y);
    ctx.lineTo(W - 60, y);
    ctx.stroke();
    y += 50;

    // Answer section
    ctx.fillStyle = "#a1a1aa";
    ctx.font = "600 16px system-ui, -apple-system, sans-serif";
    ctx.fillText("A:", 60, y);
    ctx.fillStyle = "#e4e4e7";
    ctx.font = "400 24px system-ui, -apple-system, sans-serif";

    const maxAnswerHeight = H - y - 200;
    const lineHeight = 34;
    const maxLines = Math.floor(maxAnswerHeight / lineHeight);

    const answerLines: string[] = [];
    const allLines = wrapText(ctx, answer, W - 160);
    for (let i = 0; i < Math.min(allLines.length, maxLines - 1); i++) {
      answerLines.push(allLines[i]);
    }
    if (allLines.length > maxLines - 1) {
      answerLines.push("...");
    }

    for (const line of answerLines) {
      y += lineHeight;
      ctx.fillText(line, 90, y);
    }

    // Footer
    y = H - 100;
    ctx.fillStyle = "#27272a";
    ctx.fillRect(60, y - 20, W - 120, 1);
    ctx.fillStyle = "#10b981";
    ctx.font = "700 22px system-ui, -apple-system, sans-serif";
    ctx.fillText("upscprepnotes.in/ask", 60, y + 20);
    ctx.fillStyle = "#52525b";
    ctx.font = "400 16px system-ui, -apple-system, sans-serif";
    ctx.fillText("Get free UPSC strategy guidance", W - 320, y + 20);

    // Convert to blob
    canvas.toBlob((blob) => {
      if (blob) setShareImageBlob(blob);
    }, "image/png");
  }

  function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const paragraphs = text.split("\n");
    const lines: string[] = [];
    for (const para of paragraphs) {
      if (!para.trim()) {
        lines.push("");
        continue;
      }
      const words = para.split(" ");
      let current = "";
      for (const word of words) {
        const test = current ? current + " " + word : word;
        const metrics = ctx.measureText(test);
        if (metrics.width > maxWidth && current) {
          lines.push(current);
          current = word;
        } else {
          current = test;
        }
      }
      if (current) lines.push(current);
    }
    return lines;
  }

  function downloadShareImage() {
    if (!shareImageBlob) return;
    const url = URL.createObjectURL(shareImageBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "upscprepnotes-ai.png";
    a.click();
    URL.revokeObjectURL(url);
  }

  function whatsappShareCard() {
    if (!shareData) return;
    const text = `${shareData.question}\n\n${shareData.answer.substring(0, 1500)}\n\n— via UPSCPrepNotes AI Mentor\nhttps://upscprepnotes.in/ask`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  function twitterShareCard() {
    if (!shareData) return;
    const text = `${shareData.question.substring(0, 100)}\n\n${shareData.answer.substring(0, 200)}\n\n— via UPSCPrepNotes AI Mentor\nhttps://upscprepnotes.in/ask`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

async function copyShareText() {
    if (!shareData) return;
    const text = `${shareData.question}\n\n${shareData.answer}\n\n— via UPSCPrepNotes AI Mentor\nhttps://upscprepnotes.in/ask`;
    const ok = await copyToClipboard(text);
    if (ok) {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <SidebarProvider className="h-full" style={{ minHeight: 0 }}>
      <SourceDrawerModal
        sources={selectedSources}
        onClose={() => setSelectedSources(null)}
      />

      {/* Quota exhausted dialog */}
      <Dialog open={showQuotaModal} onOpenChange={setShowQuotaModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Daily limit reached</DialogTitle>
            <DialogDescription>
              You&apos;ve used all your queries for today. Sign in to get{" "}
              <span className="font-semibold text-foreground">20 queries/day</span>{" "}
              instead of 5.
            </DialogDescription>
          </DialogHeader>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              posthog.capture("user_signed_in", { method: "google", trigger: "quota_modal" });
              signIn("google");
              setShowQuotaModal(false);
            }}
            className="w-full"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
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
          </Button>
          <DialogFooter>
            <p className="w-full text-center text-xs text-muted-foreground">
              Already signed in?{" "}
              <Link
                href="/store"
                className="underline underline-offset-2 hover:text-foreground"
              >
                Browse premium resources
              </Link>
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share dialog */}
      {shareData && (
        <Dialog open onOpenChange={() => setShareData(null)}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Share answer</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Card preview */}
              <div className="overflow-hidden rounded-xl border border-border shadow-sm">
                <canvas ref={shareCanvasRef} className="block w-full" />
                {!shareImageBlob && (
                  <div className="flex h-48 items-center justify-center bg-muted">
                    <Spinner />
                  </div>
                )}
              </div>

              {/* Download button */}
              <Button
                type="button"
                onClick={downloadShareImage}
                disabled={!shareImageBlob}
                className="w-full"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download image
              </Button>

              {/* Share options */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={whatsappShareCard}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <svg className="h-5 w-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span className="text-[10px] text-muted-foreground">WhatsApp</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={twitterShareCard}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <svg className="h-5 w-5 text-foreground" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span className="text-[10px] text-muted-foreground">Twitter</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={copyShareText}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <svg className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.5 2.5 0 0013.5 1.5h-9a2.5 2.5 0 00-2.5 2.5v9a2.5 2.5 0 002.5 2.5h2.5m4.166-1.888A2.5 2.5 0 0111.5 14.5h9a2.5 2.5 0 002.5-2.5v-9a2.5 2.5 0 00-2.5-2.5h-9a2.5 2.5 0 00-2.5 2.5v9a2.5 2.5 0 002.5 2.5h2.5" />
                  </svg>
                  <span className="text-[10px] text-muted-foreground">Copy text</span>
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShareData(null)}
                className="w-full"
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Sidebar */}
      <Sidebar>
        <SidebarHeader>
          <Link href="/" className="flex items-center px-2 py-1">
            <img src="/logo.png" alt="UPSCPrepNotes" className="h-10 w-auto" />
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={newConversation} data-track="ask-new-chat">
                    <svg
                      className="size-4"
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
                    <span>New chat</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {conversations.length === 0 ? (
            <p className="px-6 pt-6 text-center text-xs text-muted-foreground">
              No conversations
            </p>
          ) : (
            groupedConversations.map((group) => (
              <SidebarGroup key={group.label}>
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.slice(0, 8).map((conv, idx) => (
                      <SidebarMenuItem key={conv.id}>
                        <SidebarMenuButton
                          isActive={activeId === conv.id}
                          onClick={() => loadConversation(conv.id)}
                          data-track={`ask-conversation-${idx}`}
                        >
                          <span>{formatTitle(conv.title)}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))
          )}
        </SidebarContent>

        <SidebarFooter>
          {session?.user ? (
            <div className="flex items-center gap-2 px-2 py-1">
              {session.user.image && (
                <Avatar className="size-7">
                  <AvatarImage src={session.user.image} alt="" />
                  <AvatarFallback>
                    {(session.user.email || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              <span className="flex-1 truncate text-xs text-muted-foreground">
                {session.user.email}
              </span>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => signOut({ callbackUrl: "/ask" })}
              >
                Sign out
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                posthog.capture("user_signed_in", { method: "google", trigger: "sidebar" });
                signIn("google");
              }}
              className="w-full justify-start gap-2 text-muted-foreground"
            >
              <svg className="size-3.5" viewBox="0 0 24 24" aria-hidden="true">
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
              <Badge variant="secondary" className="ml-auto">20/day</Badge>
            </Button>
          )}
        </SidebarFooter>
      </Sidebar>

      {/* Main */}
      <SidebarInset className="flex h-full min-h-0 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border/60 bg-background px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger data-track="ask-sidebar-trigger" />
            <span className="text-sm font-semibold text-foreground md:hidden">
              AI Mentor
            </span>
          </div>
          <span className="hidden text-sm font-semibold text-foreground md:block">
            AI Mentor
          </span>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-muted-foreground"
          >
            <Link href="/" data-track="ask-mobile-home">Home</Link>
          </Button>
        </header>

        {/* Top purchase banner — always visible */}
        <div className="mx-auto w-full max-w-[720px] shrink-0 px-4 pt-3 md:pt-4">
          <Link
            href="/store/all-strategy-reports"
            data-track="ask-purchase-banner"
            className="flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-brand to-teal-600 px-4 py-2.5 text-white shadow-sm transition hover:from-brand hover:to-teal-500"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold leading-tight">Get All 280+ Strategy Reports</p>
                <p className="truncate text-[10px] text-emerald-100">
                  One-time payment · Lifetime access · ₹27,720 value at ₹799
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-lg bg-white/20 px-2.5 py-1 text-[11px] font-bold">Shop Now →</span>
          </Link>
        </div>

        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto bg-background scrollbar-thin"
        >
          {loading ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-6">
              <Spinner className="size-5 text-muted-foreground" />
              <div className="w-full max-w-xs space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6">
              <div className="w-full max-w-md text-center">
                <h1 className="text-2xl font-bold text-foreground">
                  Ask the AI Mentor
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Get instant answers from 280+ topper strategies and real UPSC
                  data.
                </p>
                <div className="mt-8 space-y-2">
                  {[
                    "How did AIR 1 prepare for GS2?",
                    "Analyze UPSC 2024 GS1 urbanization question",
                    "What is the best answer writing framework?",
                  ].map((q) => (
                    <Button
                      key={q}
                      variant="outline"
                      className="w-full justify-start text-left text-muted-foreground"
                      onClick={() => {
                        setInput(q);
                        inputRef.current?.focus();
                      }}
                    >
                      {q}
                    </Button>
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
                      <Message align="end" className="py-4">
                        <MessageContent className="items-end">
                          <Bubble variant="default" align="end" className="max-w-[75%]">
                            <BubbleContent className="bg-foreground text-background">
                              {msg.content}
                            </BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    ) : (
                      <div className="border-b border-border/60 last:border-b-0">
                        <Message align="start" className="py-5">
                          <MessageAvatar>
                            <Avatar className="size-8 ring-1 ring-border">
                              <AvatarImage src="/logo.png" alt="AI Mentor" />
                              <AvatarFallback>AI</AvatarFallback>
                            </Avatar>
                          </MessageAvatar>
                          <MessageContent>
                            <div className="prose prose-zinc max-w-none prose-a:text-foreground prose-a:underline prose-a:underline-offset-2 prose-a:decoration-muted-foreground/40 hover:prose-a:decoration-foreground prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:text-foreground prose-pre:rounded-lg prose-pre:bg-foreground prose-pre:text-background prose-li:marker:text-muted-foreground">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={mdComponents}
                              >
                                {preprocessContent(msg.content)}
                              </ReactMarkdown>
                            </div>
                            {msg.content && (
                              <MessageFooter className="gap-1 px-1">
                                <Button
                                  variant="ghost"
                                  size="xs"
                                  onClick={() => handleCopy(i, msg.content)}
                                  data-track={`ask-copy-${i}`}
                                  className="text-muted-foreground"
                                >
                                  {copiedIndex === i ? (
                                    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : (
                                    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                  )}
                                  {copiedIndex === i ? "Copied" : "Copy"}
                                </Button>
                                {getMergedSources(msg).length > 0 && (
                                  <Button
                                    variant="ghost"
                                    size="xs"
                                    onClick={() =>
                                      setSelectedSources(getMergedSources(msg))
                                    }
                                    className="text-muted-foreground"
                                  >
                                    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    {getMergedSources(msg).length} source
                                    {getMergedSources(msg).length !== 1 ? "s" : ""}
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="xs"
                                  onClick={() => {
                                    const q = messages.slice(0, i).reverse().find(m => m.role === "user")?.content || "";
                                    openShareModal(msg.content, q);
                                  }}
                                  data-track={`ask-share-${i}`}
                                  className="text-muted-foreground"
                                >
                                  <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.769-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.188 2.25 2.25 0 00-3.935-2.188zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                                  </svg>
                                  Share
                                </Button>
                              </MessageFooter>
                            )}
                          </MessageContent>
                        </Message>
                      </div>
                    )}
                  </div>
                ))}

                {/* Streaming assistant message */}
                {streamingMessage && (
                  <div className="border-b border-border/60 last:border-b-0">
                    <Message align="start" className="py-5">
                      <MessageAvatar>
                        <Avatar className="size-8 ring-1 ring-border">
                          <AvatarImage src="/logo.png" alt="AI Mentor" />
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                      </MessageAvatar>
                      <MessageContent>
                        <Marker role="status" className="mb-1">
                          <MarkerIcon>
                            <Spinner className="size-3" />
                          </MarkerIcon>
                          <MarkerContent>Thinking...</MarkerContent>
                        </Marker>
                        <div className="prose prose-zinc max-w-none prose-a:text-foreground prose-a:underline prose-a:underline-offset-2 prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:text-foreground prose-pre:rounded-lg prose-pre:bg-foreground prose-pre:text-background">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={mdComponents}
                          >
                            {preprocessContent(streamingMessage)}
                          </ReactMarkdown>
                        </div>
                      </MessageContent>
                    </Message>
                  </div>
                )}

                {/* Research progress — shown only while Web search is active, hidden the instant content arrives */}
                {streaming && isSearching && !streamingMessage && (
                  <div className="mx-auto max-w-[720px] px-4 py-4">
                    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/40 px-3.5 py-3">
                      <Spinner className="size-4 shrink-0 text-brand mt-0.5" />
                      <div className="min-w-0 space-y-1.5">
                        <p className="text-xs font-medium text-foreground">
                          {researchLabel || "Researching..."}
                          <span className="text-muted-foreground/50">…</span>
                        </p>
                        {researchSources.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5">
                            {researchSources.slice(0, 5).map((r, ri) => (
                              <span
                                key={ri}
                                className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background px-2 py-0.5 text-[10px] text-muted-foreground"
                              >
                                <span className="size-1 rounded-full bg-brand" />
                                <span className="max-w-[140px] truncate">{r.label}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Web search used — tiny muted row after streaming, replaces search banner */}
                {!streaming && searchedOnce && messages.length > 0 && (
                  <div className="mx-auto max-w-[720px] px-4 pb-2">
                    <Marker>
                      <MarkerIcon>
                        <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </MarkerIcon>
                      <MarkerContent>Web search used</MarkerContent>
                    </Marker>
                  </div>
                )}

                {/* Streaming indicator — shown while streaming but not in the research phase */}
                {streaming && !isSearching && (
                  <div className="mx-auto max-w-[720px] px-4 py-4">
                    <Marker role="status">
                      <MarkerIcon>
                        <Spinner className="size-3.5" />
                      </MarkerIcon>
                      <MarkerContent>
                        {streamingMessage ? "Generating response..." : "Thinking..."}
                      </MarkerContent>
                    </Marker>
                  </div>
                )}

                <div ref={messagesEndRef} />

                {!streaming && followUpQuestions.length > 0 && (
                  <div className="mt-4 mb-2 space-y-2">
                    <Separator />
                    <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-2 font-medium">
                      Follow up
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {followUpQuestions.map((q) => (
                        <Button
                          key={q}
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-auto rounded-full py-1.5 text-xs text-muted-foreground"
                          onClick={() => {
                            setInput(q);
                            inputRef.current?.focus();
                          }}
                        >
                          {q}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Input area */}
        <div className="shrink-0 border-t border-border/60 bg-background px-4 pt-4 pb-4 md:px-6">
          <div className="mx-auto max-w-3xl">
            <form onSubmit={handleSubmit}>
              <div className="relative flex items-end gap-2 rounded-2xl border border-input bg-background p-2 shadow-sm transition-colors focus-within:border-ring">
                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={streaming || loading}
                  rows={1}
                  placeholder="Ask about UPSC preparation..."
                  className="min-h-[52px] max-h-[220px] flex-1 resize-none border-0 bg-transparent px-3 py-2 text-[15px] leading-6 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:border-0 shadow-none"
                  onInput={(e) => {
                    const el = e.currentTarget;
                    el.style.height = "52px";
                    el.style.height = Math.min(el.scrollHeight, 220) + "px";
                  }}
                />
                <div className="flex shrink-0 items-center gap-2 pb-1.5">
                  <label
                    className="flex cursor-pointer items-center gap-1.5 text-[11px] font-medium text-muted-foreground"
                    data-track="ask-web-search-toggle"
                  >
                    <Switch
                      checked={searchWeb}
                      onCheckedChange={setSearchWeb}
                      disabled={streaming || loading}
                      size="sm"
                    />
                    Web search
                  </label>
                  <Button
                    type="submit"
                    size="icon"
                    disabled={streaming || loading || !input.trim()}
                    aria-label="Send message"
                    className="shrink-0"
                  >
                    {streaming ? (
                      <Spinner className="size-4" />
                    ) : (
                      <svg
                        className="size-4"
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
                    )}
                  </Button>
                </div>
              </div>
            </form>

            {quota && (
              <p className="mt-2 text-center text-[11px] text-muted-foreground">
                {quota.isAuthenticated
                  ? `${quota.remaining} of 20 queries remaining today`
                  : `${quota.remaining} of 5 free queries remaining today`}

                {quota.remaining <= 1 && !quota.isAuthenticated && (
                  <>
                    {" "}
                    —{" "}
                    <Button
                      variant="link"
                      size="xs"
                      className="h-auto p-0 text-xs"
                      onClick={() => signIn("google")}
                    >
                      Sign in for 20/day
                    </Button>
                  </>
                )}

                {quota.remaining <= 1 && quota.isAuthenticated && (
                  <>
                    {" "}
                    —{" "}
                    <Link
                      href="/store"
                      className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                    >
                      Browse premium resources
                    </Link>
                  </>
                )}
              </p>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
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
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="max-h-[70vh] sm:max-w-lg sm:mx-auto sm:rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>Sources</SheetTitle>
          <SheetDescription className="sr-only">
            Sources used to answer this question
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-full min-h-0 flex-1 pr-2">
          <div className="flex-1 space-y-3 pt-2">
            {sources.map((src, i) => {
              const colors = SOURCE_TYPE_COLORS[src.type];
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-border bg-background p-3.5 transition hover:bg-muted"
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
                      <span className="text-sm font-medium text-foreground">
                        {src.label}
                      </span>
                      <Badge
                        variant="secondary"
                        className={`${colors.bg} ${colors.text}`}
                      >
                        {SOURCE_TYPE_LABEL[src.type]}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{src.domain}</p>
                    {src.reason && (
                      <p className="mt-1 text-xs text-muted-foreground">{src.reason}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    asChild
                    className="shrink-0 text-muted-foreground"
                    aria-label="Open source"
                  >
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        className="size-4"
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
                  </Button>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <div className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
          {sources.length} source{sources.length !== 1 ? "s" : ""}
        </div>
      </SheetContent>
    </Sheet>
  );
}

const mdComponents: Components = {
  a: ({ href, children }) => {
    if (!href) return <span>{children}</span>;
    const cleanHref = href.replace(/\s+/g, "").trim();
    if (!cleanHref) return <span>{children}</span>;
    const isExternal = cleanHref.startsWith("http");
    if (isExternal) {
      const label = children || cleanHref.replace(/^https?:\/\//, "").split("/")[0];
      return (
        <a
          href={cleanHref}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-zinc-300 underline-offset-2 transition hover:decoration-zinc-500"
        >
          {label}
        </a>
      );
    }
    return (
      <Link
        href={cleanHref || "#"}
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
    <h2 className="mt-6 mb-3 text-base font-bold tracking-tight text-zinc-900">
      {children}
    </h2>
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

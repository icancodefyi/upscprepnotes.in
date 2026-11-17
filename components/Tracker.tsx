"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { captureAttribution, flush, identify, pathWithoutEmail, track } from "@/lib/track";

/**
 * Site-wide interaction capture into the `tracking` collection. Mounted once in AppShell.
 * Records: page views and leaves (time on page, deepest scroll), scroll milestones, every click
 * (data-track label, text, link, section), form submits (field names only, plus identity when an email is
 * entered), search typing and submits, dropdown changes, and JavaScript errors.
 * Also: session_start (visit number, days since the last visit, device and connection), web_vitals (speed),
 * form_start / form_abandon, rage_click, copy (length only), download_click and section_view for any element
 * marked data-track-view="name".
 * Never records the value of password, email, phone or card fields as text.
 */

type NavExt = Navigator & { connection?: { effectiveType?: string; downlink?: number; saveData?: boolean }; deviceMemory?: number };

/** Once per browser session: how many times this browser has visited, and how long since last time. */
function startSession() {
  try {
    if (sessionStorage.getItem("_tss")) return;
    sessionStorage.setItem("_tss", "1");
    const now = Date.now();
    let prev: { n: number; last: number; first: number } | null = null;
    try { prev = JSON.parse(localStorage.getItem("_tv") || "null"); } catch {}
    const n = (prev?.n ?? 0) + 1;
    localStorage.setItem("_tv", JSON.stringify({ n, last: now, first: prev?.first ?? now }));
    const nav = navigator as NavExt;
    const c = nav.connection;
    track("session_start", {
      visit_number: n,
      returning: n > 1,
      days_since_last: prev ? Math.floor((now - prev.last) / 864e5) : null,
      days_since_first: prev ? Math.floor((now - prev.first) / 864e5) : 0,
      screen: { w: screen.width, h: screen.height, dpr: Math.round((window.devicePixelRatio || 1) * 10) / 10 },
      langs: (nav.languages || []).slice(0, 3),
      tz_offset: new Date().getTimezoneOffset(),
      connection: c ? { type: c.effectiveType, downlink: c.downlink, save_data: !!c.saveData } : undefined,
      dark: window.matchMedia?.("(prefers-color-scheme: dark)").matches,
      reduced_motion: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
      standalone: window.matchMedia?.("(display-mode: standalone)").matches,
      cores: nav.hardwareConcurrency,
      memory: nav.deviceMemory,
    });
  } catch {}
}

/** Core Web Vitals of the first page load of a visit, sent when the tab is hidden. */
function observeVitals(): () => void {
  if (typeof PerformanceObserver === "undefined") return () => {};
  const v: Record<string, number> = {};
  const list: PerformanceObserver[] = [];
  const watch = (type: string, fn: (e: PerformanceEntry & Record<string, number | boolean>) => void, extra: Record<string, unknown> = {}) => {
    try {
      const o = new PerformanceObserver((l) => l.getEntries().forEach((e) => fn(e as never)));
      o.observe({ type, buffered: true, ...extra } as PerformanceObserverInit);
      list.push(o);
    } catch {}
  };
  watch("largest-contentful-paint", (e) => { v.lcp = Math.round(e.startTime); });
  watch("layout-shift", (e) => { if (!e.hadRecentInput) v.cls = Math.round(((v.cls || 0) + Number(e.value)) * 1000) / 1000; });
  watch("paint", (e) => { if (e.name === "first-contentful-paint") v.fcp = Math.round(e.startTime); });
  watch("event", (e) => { if (e.interactionId && e.duration > (v.inp || 0)) v.inp = Math.round(e.duration); }, { durationThreshold: 40 });
  const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (nav) v.ttfb = Math.round(nav.responseStart);
  let sent = false;
  const send = () => {
    if (sent || document.visibilityState !== "hidden" || v.lcp == null) return;
    sent = true;
    track("web_vitals", { ...v, nav_type: nav?.type });
  };
  document.addEventListener("visibilitychange", send);
  return () => {
    document.removeEventListener("visibilitychange", send);
    list.forEach((o) => o.disconnect());
  };
}

const SKIP_INPUT = /^(password|email|tel|hidden|file)$/;
/** A search box: type=search, marked data-track-input, or "search" in its placeholder, name, label or id. */
const isSearchInput = (el: Element | null): el is HTMLInputElement =>
  el instanceof HTMLInputElement &&
  !SKIP_INPUT.test(el.type) &&
  (el.type === "search" || el.hasAttribute("data-track-input") || /search/i.test([el.placeholder, el.name, el.id, el.getAttribute("aria-label")].filter(Boolean).join(" ")));
const text = (el: Element | null, max = 100) =>
  (el?.getAttribute("aria-label") || (el as HTMLElement | null)?.innerText || el?.textContent || "").trim().replace(/\s+/g, " ").slice(0, max);

function sectionOf(el: Element): string | undefined {
  const s = el.closest("section, nav, footer, header, aside, [role=dialog]");
  if (!s) return undefined;
  const label = s.getAttribute("aria-label") || text(s.querySelector("h1, h2, h3"), 80);
  return label || s.tagName.toLowerCase();
}

export default function Tracker() {
  const pathname = usePathname();
  const page = useRef({ start: 0, maxScroll: 0, marks: new Set<number>(), path: "" });
  const started = useRef(new Map<HTMLFormElement, string>());
  const seenViews = useRef(new Set<string>());
  const viewIO = useRef<IntersectionObserver | null>(null);

  // Attribution, global listeners, flush on hide. Once.
  useEffect(() => {
    captureAttribution();
    startSession();
    const stopVitals = observeVitals();

    // Frustration signal: three clicks within a second in the same place.
    let recent: { t: number; x: number; y: number }[] = [];
    let lastRage = 0;

    const onClick = (e: MouseEvent) => {
      const now = Date.now();
      recent = recent.filter((c) => now - c.t < 1000 && Math.hypot(c.x - e.clientX, c.y - e.clientY) < 40);
      recent.push({ t: now, x: e.clientX, y: e.clientY });
      if (recent.length >= 3 && now - lastRage > 2000) {
        lastRage = now;
        const tgt = e.target as Element | null;
        track("rage_click", { tag: tgt?.tagName?.toLowerCase(), text: text(tgt), section: tgt ? sectionOf(tgt) : undefined });
      }
      click(e);
    };
    const click = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const el = target?.closest?.("[data-track], a, button, [role=button], [role=tab], [role=menuitem], summary, label");
      if (!el || el.closest("[data-track-ignore]")) return;
      const href = el.getAttribute("href") || undefined;
      const outbound = !!href && /^https?:\/\//.test(href) && !href.includes(window.location.host);
      track("click", {
        track: el.getAttribute("data-track") || undefined,
        tag: el.tagName.toLowerCase(),
        text: text(el),
        href,
        outbound: outbound || undefined,
        download: (!!href && (/\.(pdf|zip|docx?|xlsx?|pptx?)(\?|$)/i.test(href) || /\/api\/(download|free-download)/.test(href))) || el.hasAttribute("download") || undefined,
        state: el.getAttribute("aria-expanded") ?? el.getAttribute("aria-selected") ?? undefined,
        section: sectionOf(el),
      });
      if (outbound) flush(true);
    };

    const onFocusIn = (e: FocusEvent) => {
      const el = e.target as HTMLElement | null;
      const f = el?.closest?.("form");
      if (!f || !(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement)) return;
      if (started.current.has(f)) return;
      const name = f.getAttribute("data-track") || f.getAttribute("aria-label") || f.id || f.getAttribute("name") || sectionOf(f) || "form";
      started.current.set(f, name);
      track("form_start", { form: name, section: sectionOf(f) });
    };

    const onCopy = () => {
      const len = String(window.getSelection?.()?.toString() ?? "").length;
      if (len > 0) track("copy", { length: Math.min(len, 5000) });
    };

    const onSubmit = (e: Event) => {
      const f = e.target as HTMLFormElement;
      if (!(f instanceof HTMLFormElement)) return;
      started.current.delete(f);
      const name = f.getAttribute("data-track") || f.getAttribute("aria-label") || f.id || f.getAttribute("name") || sectionOf(f) || "form";
      const fields = Array.from(f.elements)
        .filter((x): x is HTMLInputElement => x instanceof HTMLInputElement || x instanceof HTMLTextAreaElement || x instanceof HTMLSelectElement)
        .map((x) => x.name || x.type)
        .slice(0, 20);
      track("form_submit", { form: name, fields, section: sectionOf(f) });
      const email = f.querySelector<HTMLInputElement>("input[type=email]")?.value;
      if (email) identify(email, name);
      const q = Array.from(f.querySelectorAll("input")).find(isSearchInput)?.value?.trim();
      if (q) track("search", { query: q.slice(0, 200), source: name, submitted: true });
    };

    // What people type into search boxes and filters (debounced, never email/password/phone fields).
    const typing = new WeakMap<Element, { t: ReturnType<typeof setTimeout> | null; last: string }>();
    const onInput = (e: Event) => {
      const el = e.target as HTMLInputElement;
      if (!isSearchInput(el)) return;
      const st = typing.get(el) || { t: null, last: "" };
      if (st.t) clearTimeout(st.t);
      st.t = setTimeout(() => {
        const v = el.value.trim();
        if (v.length >= 2 && v !== st.last) {
          st.last = v;
          track("search", { query: v.slice(0, 200), source: el.getAttribute("aria-label") || el.placeholder || el.name || "search", live: true });
        }
      }, 1200);
      typing.set(el, st);
    };

    const onChange = (e: Event) => {
      const el = e.target as HTMLSelectElement;
      if (!(el instanceof HTMLSelectElement)) return;
      track("select", { name: el.name || el.getAttribute("aria-label") || el.id || "select", value: el.value.slice(0, 100), section: sectionOf(el) });
    };

    let errors = 0;
    // Errors that are not ours: browser extensions, wallet apps and cross-origin scripts with no detail.
    const NOISE = /^Script error\.?$|ethereum|web3|chrome-extension:|moz-extension:|safari(-web)?-extension:/i;
    // Chrome's page translation rewrites text and is a known cause of React errors; flag those so they can be told apart.
    const translated = () => /translated-(ltr|rtl)/.test(document.documentElement.className);
    const onError = (e: ErrorEvent) => {
      const message = String(e.message || "");
      if (NOISE.test(message) || NOISE.test(e.filename || "")) return;
      if (errors++ >= 5) return;
      track("js_error", { message: message.slice(0, 200), source: `${e.filename?.split("/").pop() || ""}:${e.lineno || ""}`, translated: translated() });
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      const message = String((e.reason as Error)?.message || e.reason || "");
      if (NOISE.test(message)) return;
      if (errors++ >= 5) return;
      track("js_error", { message: message.slice(0, 200), kind: "promise", translated: translated() });
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const doc = document.documentElement;
        const pct = Math.min(100, Math.round(((window.scrollY + window.innerHeight) / Math.max(doc.scrollHeight, 1)) * 100));
        const p = page.current;
        if (pct > p.maxScroll) p.maxScroll = pct;
        for (const m of [25, 50, 75, 90]) {
          if (pct >= m && !p.marks.has(m)) {
            p.marks.add(m);
            track("scroll_depth", { depth: m });
          }
        }
      });
    };

    const leave = () => {
      started.current.forEach((name) => track("form_abandon", { form: name }));
      started.current.clear();
      const p = page.current;
      if (p.start) track("page_leave", { duration_ms: Date.now() - p.start, max_scroll: p.maxScroll }, { path: p.path });
      p.start = 0;
      flush(true);
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") leave();
      else if (!page.current.start) {
        page.current.start = Date.now();
        page.current.path = pathWithoutEmail();
      }
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("focusin", onFocusIn, true);
    document.addEventListener("copy", onCopy, true);
    document.addEventListener("submit", onSubmit, true);
    document.addEventListener("input", onInput, true);
    document.addEventListener("change", onChange, true);
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", leave);
    return () => {
      stopVitals();
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("focusin", onFocusIn, true);
      document.removeEventListener("copy", onCopy, true);
      document.removeEventListener("submit", onSubmit, true);
      document.removeEventListener("input", onInput, true);
      document.removeEventListener("change", onChange, true);
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", leave);
    };
  }, []);

  // One page_view per route; the previous page gets its page_leave.
  useEffect(() => {
    const p = page.current;
    const prevPath = p.path;
    started.current.forEach((name) => track("form_abandon", { form: name }, { path: prevPath }));
    started.current.clear();
    seenViews.current = new Set();
    if (p.start) track("page_leave", { duration_ms: Date.now() - p.start, max_scroll: p.maxScroll }, { path: prevPath });
    const path = pathWithoutEmail();
    page.current = { start: Date.now(), maxScroll: 0, marks: new Set(), path };
    // Wait a beat so the new page's <title> is in place.
    const t = setTimeout(() => track("page_view", { title: document.title.slice(0, 160), from: prevPath || undefined }, { path }), 300);
    // Impressions: any element marked data-track-view="name" counts once per page when half of it is on screen.
    const scan = () => {
      viewIO.current?.disconnect();
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((en) => {
            const name = (en.target as HTMLElement).dataset.trackView;
            if (!en.isIntersecting || !name) return;
            if (!seenViews.current.has(name)) {
              seenViews.current.add(name);
              track("section_view", { name });
            }
            io.unobserve(en.target);
          }),
        { threshold: 0.5 },
      );
      viewIO.current = io;
      document.querySelectorAll("[data-track-view]").forEach((el) => io.observe(el));
    };
    const s1 = setTimeout(scan, 600);
    const s2 = setTimeout(scan, 2500);
    return () => {
      clearTimeout(t);
      clearTimeout(s1);
      clearTimeout(s2);
      viewIO.current?.disconnect();
    };
  }, [pathname]);

  return null;
}

"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { captureAttribution, flush, identify, track } from "@/lib/track";

/**
 * Site-wide interaction capture into the `tracking` collection. Mounted once in AppShell.
 * Records: page views and leaves (time on page, deepest scroll), scroll milestones, every click
 * (data-track label, text, link, section), form submits (field names only, plus identity when an email is
 * entered), search typing and submits, dropdown changes, and JavaScript errors.
 * Never records the value of password, email, phone or card fields as text.
 */

const SKIP_INPUT = /^(password|email|tel|hidden|file)$/;
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

  // Attribution, global listeners, flush on hide. Once.
  useEffect(() => {
    captureAttribution();

    const onClick = (e: MouseEvent) => {
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
        state: el.getAttribute("aria-expanded") ?? el.getAttribute("aria-selected") ?? undefined,
        section: sectionOf(el),
      });
      if (outbound) flush(true);
    };

    const onSubmit = (e: Event) => {
      const f = e.target as HTMLFormElement;
      if (!(f instanceof HTMLFormElement)) return;
      const name = f.getAttribute("data-track") || f.getAttribute("aria-label") || f.id || f.getAttribute("name") || sectionOf(f) || "form";
      const fields = Array.from(f.elements)
        .filter((x): x is HTMLInputElement => x instanceof HTMLInputElement || x instanceof HTMLTextAreaElement || x instanceof HTMLSelectElement)
        .map((x) => x.name || x.type)
        .slice(0, 20);
      track("form_submit", { form: name, fields, section: sectionOf(f) });
      const email = f.querySelector<HTMLInputElement>("input[type=email]")?.value;
      if (email) identify(email, name);
      const q = f.querySelector<HTMLInputElement>("input[type=search], input[name=q], input[data-track-input]")?.value?.trim();
      if (q) track("search", { query: q.slice(0, 200), source: name, submitted: true });
    };

    // What people type into search boxes and filters (debounced, never email/password/phone fields).
    const typing = new WeakMap<Element, { t: ReturnType<typeof setTimeout> | null; last: string }>();
    const onInput = (e: Event) => {
      const el = e.target as HTMLInputElement;
      if (!(el instanceof HTMLInputElement) || SKIP_INPUT.test(el.type)) return;
      if (el.type !== "search" && !el.hasAttribute("data-track-input")) return;
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
    const onError = (e: ErrorEvent) => {
      if (errors++ >= 5) return;
      track("js_error", { message: String(e.message).slice(0, 200), source: `${e.filename?.split("/").pop() || ""}:${e.lineno || ""}` });
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      if (errors++ >= 5) return;
      track("js_error", { message: String((e.reason as Error)?.message || e.reason).slice(0, 200), kind: "promise" });
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
      const p = page.current;
      if (p.start) track("page_leave", { duration_ms: Date.now() - p.start, max_scroll: p.maxScroll }, { path: p.path });
      p.start = 0;
      flush(true);
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") leave();
      else if (!page.current.start) {
        page.current.start = Date.now();
        page.current.path = window.location.pathname + window.location.search;
      }
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    document.addEventListener("input", onInput, true);
    document.addEventListener("change", onChange, true);
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", leave);
    return () => {
      document.removeEventListener("click", onClick, true);
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
    if (p.start) track("page_leave", { duration_ms: Date.now() - p.start, max_scroll: p.maxScroll }, { path: prevPath });
    const path = window.location.pathname + window.location.search;
    page.current = { start: Date.now(), maxScroll: 0, marks: new Set(), path };
    // Wait a beat so the new page's <title> is in place.
    const t = setTimeout(() => track("page_view", { title: document.title.slice(0, 160), from: prevPath || undefined }, { path }), 300);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}

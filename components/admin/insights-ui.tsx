import Link from "next/link";

/** Shared pieces for the admin dashboard and Insights pages (server components). */

export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
export const num = (n: number) => Math.round(n).toLocaleString("en-IN");
export const dur = (ms: number) => {
  if (!ms) return "—";
  const s = Math.round(ms / 1000);
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
};
export const ago = (d?: Date | string) => {
  if (!d) return "";
  const s = Math.round((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
};
export const when = (d?: Date | string) =>
  d ? new Date(d).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }) : "";

export function PageHeader({ title, desc, range, basePath, extra }: { title: string; desc?: string; range?: number; basePath?: string; extra?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">{title}</h1>
        {desc && <p className="mt-1 max-w-2xl text-sm text-zinc-500">{desc}</p>}
      </div>
      <div className="flex items-center gap-2">
        {extra}
        {range && basePath && (
          <div className="flex rounded-full border border-black/[0.08] bg-white p-1 text-sm">
            {[7, 30, 90].map((r) => (
              <Link
                key={r}
                href={`${basePath}?range=${r}`}
                className={`rounded-full px-3 py-1 font-medium transition-colors ${r === range ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-900"}`}
              >
                {r} days
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const INSIGHT_TABS = [
  { href: "/admin/tracking", label: "Traffic" },
  { href: "/admin/tracking/demand", label: "Demand" },
  { href: "/admin/tracking/funnel", label: "Store funnel" },
  { href: "/admin/tracking/journeys", label: "Journeys" },
  { href: "/admin/tracking/live", label: "Live" },
];
export function InsightTabs({ active, range }: { active: string; range?: number }) {
  return (
    <nav className="mb-6 flex gap-1 overflow-x-auto border-b border-black/[0.06] text-sm">
      {INSIGHT_TABS.map((t) => (
        <Link
          key={t.href}
          href={range && !t.href.endsWith("journeys") && !t.href.endsWith("live") ? `${t.href}?range=${range}` : t.href}
          className={`-mb-px whitespace-nowrap border-b-2 px-3 py-2.5 font-medium transition-colors ${t.href === active ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-500 hover:text-zinc-900"}`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

export function Card({ title, desc, action, children, className = "" }: { title?: string; desc?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-black/[0.06] bg-white p-5 ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>}
            {desc && <p className="mt-0.5 text-xs text-zinc-500">{desc}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

/** A headline number with its change against the previous period. */
export function Stat({ label, value, sub, change, good = "up" }: { label: string; value: string; sub?: string; change?: number | null; good?: "up" | "down" }) {
  const show = change !== undefined;
  const isGood = change == null ? true : good === "up" ? change >= 0 : change <= 0;
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-1.5 text-3xl font-semibold tracking-tight text-zinc-900 tabular-nums">{value}</p>
      <div className="mt-1 flex items-center gap-2 text-xs">
        {show && (
          <span className={`rounded-full px-1.5 py-0.5 font-medium tabular-nums ${change == null ? "bg-zinc-100 text-zinc-500" : isGood ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
            {change == null ? "new" : `${change > 0 ? "+" : ""}${change}%`}
          </span>
        )}
        {sub && <span className="text-zinc-400">{sub}</span>}
      </div>
    </div>
  );
}

/** Ranked rows with a proportional bar behind each. */
export function BarList({ rows, format = num, empty = "Nothing yet.", max = 12, hrefFor }: { rows: { label: string; value: number; hint?: string }[]; format?: (n: number) => string; empty?: string; max?: number; hrefFor?: (label: string) => string | undefined }) {
  if (!rows.length) return <Empty>{empty}</Empty>;
  const top = Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul className="space-y-1.5">
      {rows.slice(0, max).map((r, i) => {
        const href = hrefFor?.(r.label);
        const inner = (
          <>
            <span className="absolute inset-y-0 left-0 rounded-md bg-zinc-100" style={{ width: `${Math.max(3, (r.value / top) * 100)}%` }} />
            <span className="relative min-w-0 flex-1 truncate" title={r.label}>
              {r.label || "(empty)"}
              {r.hint && <span className="ml-2 text-xs text-zinc-400">{r.hint}</span>}
            </span>
            <span className="relative shrink-0 font-medium tabular-nums text-zinc-900">{format(r.value)}</span>
          </>
        );
        return (
          <li key={r.label + i}>
            {href ? (
              <Link href={href} className="relative flex items-center gap-3 rounded-md px-2.5 py-1.5 text-sm text-zinc-700 hover:text-zinc-900">
                {inner}
              </Link>
            ) : (
              <div className="relative flex items-center gap-3 rounded-md px-2.5 py-1.5 text-sm text-zinc-700">{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** One bar per day; the label under the first, middle and last bar. */
export function DailyBars({ series, format = num, color = "#18181b", height = 120 }: { series: { day: string; value: number }[]; format?: (n: number) => string; color?: string; height?: number }) {
  const max = Math.max(...series.map((s) => s.value), 1);
  const total = series.reduce((a, s) => a + s.value, 0);
  if (!total) return <Empty>No data in this period yet.</Empty>;
  const label = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const marks = new Set([0, Math.floor((series.length - 1) / 2), series.length - 1]);
  return (
    <div>
      <div className="flex items-end gap-[2px]" style={{ height }}>
        {series.map((s) => (
          <div key={s.day} className="group relative flex h-full flex-1 items-end">
            <div className="w-full rounded-t-[3px] transition-opacity group-hover:opacity-70" style={{ height: `${(s.value / max) * 100}%`, minHeight: s.value ? 2 : 0, background: color }} />
            <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-xs text-white group-hover:block">
              {label(s.day)}: {format(s.value)}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex text-[11px] text-zinc-400">
        {series.map((s, i) => (
          <div key={s.day} className="flex-1 text-center">{marks.has(i) ? label(s.day) : ""}</div>
        ))}
      </div>
    </div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-xl bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500">{children}</p>;
}

export function NoTracking() {
  return (
    <div className="rounded-2xl border border-dashed border-black/[0.12] bg-white p-6 text-sm text-zinc-600">
      <p className="font-semibold text-zinc-900">No tracking data in this period yet.</p>
      <p className="mt-1">
        Tracking records visits on the live site only (localhost is skipped). Once the redesign is deployed, data appears here within minutes. To test locally, set{" "}
        <code className="rounded bg-zinc-100 px-1">TRACK_LOCAL=1</code> in <code className="rounded bg-zinc-100 px-1">.env.local</code> and restart the dev server (local events then go into the same database).
      </p>
    </div>
  );
}

type Ev = { event: string; path?: string; props?: Record<string, unknown>; email?: string };
const s = (v: unknown) => (v == null ? "" : String(v));
const EVENT_TONE: Record<string, string> = {
  purchase: "bg-emerald-100 text-emerald-800",
  checkout_started: "bg-emerald-50 text-emerald-700",
  checkout_redirect: "bg-emerald-50 text-emerald-700",
  buy_click: "bg-blue-50 text-blue-700",
  product_view: "bg-blue-50 text-blue-700",
  ask_question: "bg-violet-50 text-violet-700",
  search: "bg-amber-50 text-amber-800",
  identify: "bg-zinc-900 text-white",
  form_submit: "bg-zinc-100 text-zinc-700",
  js_error: "bg-red-50 text-red-700",
};
export function EventChip({ event }: { event: string }) {
  return <span className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ${EVENT_TONE[event] ?? "bg-zinc-100 text-zinc-600"}`}>{event.replace(/_/g, " ")}</span>;
}

/** One readable line for an event. */
export function describeEvent(e: Ev): string {
  const p = e.props ?? {};
  switch (e.event) {
    case "page_view": return s(e.path);
    case "page_leave": return `${s(e.path)} · ${dur(Number(p.duration_ms) || 0)} · scrolled ${s(p.max_scroll)}%`;
    case "scroll_depth": return `${s(e.path)} · ${s(p.depth)}%`;
    case "click": return [s(p.track), s(p.text)].filter(Boolean).join(" · ") + (p.href ? ` → ${s(p.href)}` : "");
    case "search": return `“${s(p.query)}”${p.source ? ` in ${s(p.source)}` : ""}${p.submitted ? " (submitted)" : ""}`;
    case "ask_question": return `“${s(p.question).slice(0, 180)}”`;
    case "product_view": return `${s(p.slug)} · ₹${s(p.price)}`;
    case "buy_click":
    case "checkout_redirect": return `${Array.isArray(p.items) ? p.items.join(" + ") : ""} · ₹${s(p.amount)}${p.tracking ? ` · ${s(p.tracking)}` : ""}`;
    case "checkout_started":
    case "purchase": return `${Array.isArray(p.items) ? p.items.join(" + ") : ""} · ₹${s(p.total)} · ref ${s(p.ref)}`;
    case "identify": return `${s(e.email)} via ${s(p.source)}`;
    case "form_submit": return s(p.form);
    case "select": return `${s(p.name)} = ${s(p.value)}`;
    case "js_error": return s(p.message);
    default: return Object.entries(p).slice(0, 3).map(([k, v]) => `${k}: ${s(v)}`).join(" · ");
  }
}

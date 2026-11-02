"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TrafficChart from "./TrafficChart";

type Stats = {
  uniqueVisitors: number;
  pageViews: number;
  totalSessions: number;
  fileDownloads: number;
  returningVisitors: number;
  topPages: { _id: string; count: number }[];
  deviceBreakdown: { _id: string; count: number }[];
  referrers: { _id: string; count: number }[];
  bounceSessions: number;
  dailyTimeline: { _id: string; count: number }[];
};

function formatCompact(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(n >= 10_000 ? 0 : 1) + "K";
  return n.toString();
}

const card = "rounded-[24px] bg-white shadow-[0_0_0_1px_var(--line-2),0_1px_2px_rgba(11,12,16,0.04)]";
const input =
  "mt-2 w-full rounded-[14px] bg-white px-4 text-m text-[var(--ink)] shadow-[0_0_0_1px_var(--line-2)] outline-none placeholder:text-[var(--muted)] focus:shadow-[0_0_0_2px_var(--accent)]";

/** A section heading: title, then the old label as a caption under it, then the description. */
function Head({ label, title, desc, center = false }: { label: string; title: string; desc?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-[40rem] text-center" : "max-w-[40rem]"}>
      <h2 className="t-head text-l">{title}</h2>
      <p className="mt-2 text-s font-bold text-[var(--muted)]">{label}</p>
      {desc && <p className="mt-3 text-m leading-[1.6] text-[var(--ink-2)]">{desc}</p>}
    </div>
  );
}

function Tick() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

const AUDIENCE = [
  {
    title: "Age & Stage",
    desc: "80% are college students and graduates (ages 20–28) actively preparing for UPSC CSE Prelims and Mains. They visit daily for notes, current affairs, and test prep.",
    tone: "#DBE2FF",
    ink: "#13238A",
    icon: <><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></>,
  },
  {
    title: "Study Stage",
    desc: "45% are in their first attempt, 35% in second, and 20% in third+. They spend 8–12 minutes per session consuming serious study content, not just browsing.",
    tone: "#e3e8fb",
    ink: "#172fa3",
    icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></>,
  },
  {
    title: "Geography",
    desc: "70% from Delhi NCR, Lucknow, Patna, Jaipur, Bengaluru, and Hyderabad. The rest spans all states with strong UPSC coaching ecosystems.",
    tone: "#FDE9C4",
    ink: "#7a4b00",
    icon: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></>,
  },
  {
    title: "Content Preference",
    desc: "Highest engagement on Mains answer writing, optional subject notes, current affairs compilations, and toppers’ strategy copies.",
    tone: "#EBE2FF",
    ink: "#3b1d8f",
    icon: <><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>,
  },
];

const SLOTS = [
  {
    name: "Banner",
    title: "Sidebar Banner",
    desc: "300x250 display ad on all notes and download pages. High visibility as users scroll through study content.",
    price: "₹3,000",
    period: " / month",
    specs: ["300×250 or 250×250 format", "Static image or animated GIF", "Monthly impression report"],
  },
  {
    name: "Premium",
    title: "Premium Banner",
    desc: "728×90 leaderboard at the top of all pages. First thing aspirants see. Includes newsletter mention.",
    price: "₹5,000",
    period: " / month",
    original: "₹7,000",
    badge: "Best value",
    specs: ["728×90 leaderboard — top placement", "1× newsletter mention included", "Monthly impression + CTR report"],
  },
  {
    name: "Sponsored",
    title: "Sponsored Content",
    desc: "A dedicated article or guide featuring your product. Published once and stays live permanently.",
    price: "₹8,000",
    period: " / one-time",
    specs: ["Native article — stays live forever", "Social media promotion (1 post)", "Featured in newsletter (1×)"],
  },
];

const WHY = [
  { title: "Intent-driven traffic", desc: "Visitors arrive searching for specific study topics — they are in learning mode and open to relevant course or book recommendations." },
  { title: "No ad fatigue", desc: "We show max 1–2 ads per page. Your brand gets undivided attention, not lost in a sea of banners." },
  { title: "Organic + growing", desc: "Traffic grows steadily through Google Search. You benefit from compounding visibility without paying for acquisition." },
  { title: "Zero bots, all real", desc: "Verified analytics. Every session is a real aspirant. We run on first-party data with no algorithm noise." },
  { title: "India-optimised pricing", desc: "Designed for Indian edtech budgets. No minimum commitment. Month-to-month with no lock-in." },
  { title: "Transparent reporting", desc: "Monthly reports with impressions, clicks, and engagement data. You always know exactly what you’re getting." },
];

const FAQS = [
  { q: "What ad formats do you accept?", a: "We accept static images (PNG, JPG), animated GIFs, and HTML5 banners. We do not accept autoplay video, audio ads, or pop-ups. All ads are reviewed before going live." },
  { q: "Can I target specific pages or topics?", a: "Yes. You can choose to appear on specific subject pages (e.g., Geography, Polity, History) or across the entire site. Topic-targeted placement is available at the same rates." },
  { q: "What’s the minimum commitment?", a: "One month. No long-term contracts. Discounts available for 3-month and 6-month commitments (10% and 20% off respectively)." },
  { q: "How do you measure impressions?", a: "We count an impression when the ad enters the viewport (minimum 50% visible for 1 second). This ensures you only pay for ads that are actually seen, not just loaded." },
  { q: "Do you offer sponsored content placement?", a: "Yes. We can publish a sponsored article, guide, or resource featuring your product. It stays live permanently and is promoted in our newsletter and social media." },
  { q: "Can I pause or cancel mid-month?", a: "Yes. You can pause anytime with 7 days notice. No refunds for partial months, but unused days can be rolled forward." },
];

export default function AdvertiseClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    slot: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  useEffect(() => {
    fetch("/api/public-stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          type: "advertise",
          message: `Organization: ${form.organization}\nSlot: ${form.slot}\nMessage: ${form.message}`,
        }),
      });
      if (res.ok) {
        setFormStatus("success");
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const returningRate = stats ? Math.round((stats.returningVisitors / Math.max(stats.uniqueVisitors, 1)) * 100) : 0;
  const bounceRate = stats ? Math.round((stats.bounceSessions / Math.max(stats.totalSessions, 1)) * 100) : 0;

  return (
    <div className="pb-24 pt-28 sm:pt-32">
      <div className="mx-auto max-w-[1120px] px-6">
        {/* Hero */}
        <header className="mx-auto max-w-[48rem] text-center">
          <h1 className="t-display text-h1">
            Reach serious UPSC aspirants <span className="swipe">who are ready to study</span>
          </h1>
          <p className="mt-3 inline-flex items-center gap-2 text-s font-bold text-[var(--muted)]">
            <span aria-hidden className="h-2 w-2 rounded-full bg-[#1f3fd6]" />
            Now accepting sponsors
          </p>
          <p className="mx-auto mt-5 max-w-[38rem] text-m leading-[1.6] text-[var(--ink-2)]">
            UPSCPrepNotes connects you with thousands of focused UPSC CSE candidates actively searching for study material, test series, courses, and books. No bots. No tire-kickers. Just future civil servants.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#slots" className="btn btn-blue">
              View available slots <span className="knob">→</span>
            </a>
            <a href="#contact" className="btn btn-paper">
              Get in touch
            </a>
          </div>
        </header>

        {/* Stats */}
        <section id="stats" className="mt-24 scroll-mt-28">
          <Head label="Real-time audience data" title="Your ad reaches real people — verified" desc="These numbers update live from our analytics. No vanity metrics." />

          {loading ? (
            <div className={`${card} mt-8 grid grid-cols-2 lg:grid-cols-4`}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-6">
                  <div className="h-8 w-20 animate-pulse rounded-[8px] bg-[var(--canvas)]" />
                  <div className="mt-3 h-4 w-28 animate-pulse rounded-[6px] bg-[var(--canvas)]" />
                </div>
              ))}
            </div>
          ) : stats ? (
            <>
              <dl className={`${card} mt-8 grid grid-cols-2 divide-[var(--line)] lg:grid-cols-4 lg:divide-x`}>
                {[
                  { v: stats.uniqueVisitors, l: "Monthly Visitors", t: `↑ ${returningRate}% returning`, up: true },
                  { v: stats.pageViews, l: "Monthly Page Views", t: "↑ Deep engagement", up: true },
                  { v: stats.totalSessions, l: "Monthly Sessions", t: `${bounceRate}% bounce rate`, up: false },
                  { v: stats.fileDownloads, l: "Free Downloads / Leads", t: "↑ Action-oriented users", up: true },
                ].map((s) => (
                  <div key={s.l} className="p-6">
                    <dd className="t-display tab text-l leading-none">{formatCompact(s.v)}</dd>
                    <dt className="mt-2 text-s font-bold">{s.l}</dt>
                    <p className={`mt-1 text-s ${s.up ? "text-[#1f3fd6]" : "text-[var(--muted)]"}`}>{s.t}</p>
                  </div>
                ))}
              </dl>

              {stats.dailyTimeline && stats.dailyTimeline.length > 1 && (
                <div className="mt-4">
                  <TrafficChart data={stats.dailyTimeline} />
                </div>
              )}

              {stats.topPages && stats.topPages.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-s font-bold text-[var(--muted)]">Top pages this month</h3>
                  <div className={`${card} mt-3 divide-y divide-[var(--line)]`}>
                    {stats.topPages.slice(0, 7).map((page) => (
                      <div key={page._id} className="flex items-center justify-between gap-4 px-5 py-3">
                        <span className="truncate text-s text-[var(--ink-2)]">{page._id || "/"}</span>
                        <span className="tab shrink-0 text-s font-bold">{page.count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="mt-8 rounded-[20px] bg-[var(--canvas)] p-5 text-s text-[var(--ink-2)]">Stats temporarily unavailable. Contact us for current numbers.</p>
          )}
        </section>

        {/* Audience */}
        <section id="audience" className="mt-24 scroll-mt-28">
          <Head
            label="Who you’ll reach"
            title="100% UPSC CSE aspirants"
            desc="Every visitor arrives with intent — researching a topic, downloading study material, or looking for test series and courses."
          />
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {AUDIENCE.map((a) => (
              <div key={a.title} className={`${card} p-6`}>
                <span className="grid h-10 w-10 place-items-center rounded-[12px]" style={{ background: a.tone, color: a.ink }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    {a.icon}
                  </svg>
                </span>
                <h3 className="mt-4 text-m font-bold">{a.title}</h3>
                <p className="mt-1 text-s leading-[1.6] text-[var(--ink-2)]">{a.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Ad slots */}
        <section id="slots" className="mt-24 scroll-mt-28">
          <Head
            center
            label="Ad slots & pricing"
            title="Choose how you want to reach aspirants"
            desc="Every slot includes placement on our highest-traffic pages. Prices are introductory — lock them in."
          />
          <div className="mt-10 grid gap-4 lg:grid-cols-3 lg:items-stretch">
            {SLOTS.map((s) => {
              const featured = !!s.badge;
              return (
                <div
                  key={s.title}
                  className={`relative flex flex-col rounded-[28px] p-7 ${
                    featured ? "bg-[var(--ink)] text-white shadow-[0_24px_56px_-24px_rgba(11,12,16,0.6)]" : `${card}`
                  }`}
                >
                  {s.badge && <span className="absolute right-6 top-6 rounded-full bg-[var(--hl)] px-3 py-1 text-s font-bold text-[var(--hl-ink)]">{s.badge}</span>}
                  <p className={`text-s font-bold ${featured ? "text-white/60" : "text-[var(--muted)]"}`}>{s.name}</p>
                  <h3 className="mt-1 t-head text-l">{s.title}</h3>
                  <p className={`mt-3 text-s leading-[1.6] ${featured ? "text-white/75" : "text-[var(--ink-2)]"}`}>{s.desc}</p>
                  <p className="mt-6 flex items-baseline gap-1.5">
                    <span className="t-display tab text-l">{s.price}</span>
                    <span className={`text-s ${featured ? "text-white/60" : "text-[var(--muted)]"}`}>{s.period}</span>
                    {s.original && <span className="tab ml-1 text-s text-white/50 line-through">{s.original}</span>}
                  </p>
                  <ul className={`mb-8 mt-6 space-y-2.5 border-t pt-6 ${featured ? "border-white/15" : "border-[var(--line)]"}`}>
                    {s.specs.map((sp) => (
                      <li key={sp} className={`flex items-start gap-2.5 text-s ${featured ? "text-white/85 [&_svg]:text-[var(--hl)]" : "text-[var(--ink-2)]"}`}>
                        <Tick />
                        {sp}
                      </li>
                    ))}
                  </ul>
                  <a href="#contact" className={`btn mt-auto w-full justify-center [--btn-fs:15px] ${featured ? "btn-blue" : "btn-ink"}`}>
                    Book this slot
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        {/* Why advertise */}
        <section className="mt-24">
          <Head center label="Why advertise here" title="High-intent audience at India-friendly rates" />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {WHY.map((w, i) => (
              <div key={w.title} className={`${card} p-6`}>
                <p className="t-display tab text-l text-[var(--accent)]">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-m font-bold">{w.title}</h3>
                <p className="mt-1 text-s leading-[1.6] text-[var(--ink-2)]">{w.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto mt-24 max-w-[46rem]">
          <Head center label="FAQ" title="Common questions" />
          <div className={`${card} mt-8 divide-y divide-[var(--line)]`}>
            {FAQS.map((f) => (
              <details key={f.q} className="group px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                  <span className="text-m font-bold leading-snug">{f.q}</span>
                  <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--canvas)] transition-transform duration-200 group-open:rotate-45 group-open:bg-[var(--accent)] group-open:text-white">+</span>
                </summary>
                <p className="mt-3 text-m leading-[1.65] text-[var(--ink-2)]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Contact form */}
        <section id="contact" className="mx-auto mt-24 max-w-[46rem] scroll-mt-28">
          <div className="relative overflow-hidden rounded-[28px] bg-[var(--accent)] p-7 text-white sm:p-10">
            <svg aria-hidden viewBox="0 0 200 140" className="pointer-events-none absolute -right-6 -top-8 h-40 w-56 rotate-[12deg] text-white/10" fill="none" stroke="currentColor" strokeWidth="6" strokeLinejoin="round">
              <rect x="8" y="8" width="184" height="124" rx="10" />
              <path d="M10 14l90 66 90-66" />
            </svg>
            <div className="relative">
              <h2 className="t-head text-l">Ready to reach UPSC aspirants?</h2>
              <p className="mt-2 text-s font-bold text-white/60">Get started</p>
              <p className="mt-3 max-w-[32rem] text-m leading-[1.6] text-white/85">Fill in the form and we&rsquo;ll get back within 24 hours with a custom proposal.</p>
            </div>
          </div>

          {formStatus === "success" ? (
            <div className={`${card} -mt-6 mx-3 relative p-8 text-center sm:mx-6`}>
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#e3e8fb] text-[#172fa3]">
                <Tick />
              </div>
              <p className="mt-4 text-m font-bold">Thanks, we&rsquo;ll be in touch!</p>
              <p className="mt-1 text-s text-[var(--ink-2)]">
                We typically respond within 24 hours. In the meantime, feel free to browse our{" "}
                <Link href="/store" className="font-bold text-[var(--accent)] underline underline-offset-2">store</Link>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={`${card} relative -mt-6 mx-3 space-y-5 p-6 sm:mx-6 sm:p-8`}>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-s font-bold" htmlFor="name">
                  Name
                  <input id="name" name="name" type="text" className={`${input} h-12`} value={form.name} onChange={handleChange} required placeholder="Ravi Sharma" />
                </label>
                <label className="block text-s font-bold" htmlFor="email">
                  Email
                  <input id="email" name="email" type="email" className={`${input} h-12`} value={form.email} onChange={handleChange} required placeholder="ravi@example.com" />
                </label>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-s font-bold" htmlFor="organization">
                  Organization
                  <input id="organization" name="organization" type="text" className={`${input} h-12`} value={form.organization} onChange={handleChange} required placeholder="Vision IAS / Drishti IAS / …" />
                </label>
                <label className="block text-s font-bold" htmlFor="slot">
                  Slot interest
                  <select id="slot" name="slot" className={`${input} h-12 appearance-none`} value={form.slot} onChange={handleChange} required>
                    <option value="">Select a slot</option>
                    <option value="sidebar-banner">Sidebar Banner — ₹3,000/mo</option>
                    <option value="premium-banner">Premium Banner — ₹5,000/mo (best value)</option>
                    <option value="sponsored-content">Sponsored Content — ₹8,000 (one-time)</option>
                    <option value="newsletter">Newsletter Mention — ₹3,000/mo</option>
                    <option value="custom">Custom Bundle — Let&rsquo;s discuss</option>
                  </select>
                </label>
              </div>
              <label className="block text-s font-bold" htmlFor="message">
                Message
                <textarea
                  id="message"
                  name="message"
                  className={`${input} min-h-[120px] py-3 leading-[1.5]`}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your campaign goals, target audience, and any specific requirements…"
                  required
                />
              </label>
              <p className="text-s text-[var(--muted)]">We respect your privacy. Your details will only be used to respond to this inquiry.</p>
              <button type="submit" className="btn btn-blue w-full justify-center" disabled={formStatus === "sending"}>
                {formStatus === "sending" ? "Sending…" : <>Submit inquiry <span className="knob">→</span></>}
              </button>
              {formStatus === "error" && (
                <p className="text-center text-s text-[var(--mark-deep)]">
                  Something went wrong. Please email us directly at{" "}
                  <a href="mailto:hello@upscprepnotes.in" className="underline">hello@upscprepnotes.in</a>.
                </p>
              )}
            </form>
          )}
        </section>

        {/* Footer line */}
        <div className="mt-20 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-6 text-s text-[var(--muted)]">
          <span>© {new Date().getFullYear()} UPSCPrepNotes</span>
          <div className="flex gap-5">
            <Link className="hover:text-[var(--ink)]" href="/privacy">Privacy</Link>
            <Link className="hover:text-[var(--ink)]" href="/contact">Contact</Link>
            <Link className="hover:text-[var(--ink)]" href="/">Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

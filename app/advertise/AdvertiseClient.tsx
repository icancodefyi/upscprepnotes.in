"use client";

import { useEffect, useState } from "react";
import TrafficChart from "./TrafficChart";
import "./advertise.css";

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

function formatUrl(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname + (u.pathname !== "/" ? u.pathname.substring(0, 30) : "");
  } catch {
    return url.length > 35 ? url.substring(0, 35) + "…" : url;
  }
}

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
    fetch("/api/analytics/stats?days=30")
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

  const returningRate = stats
    ? Math.round((stats.returningVisitors / Math.max(stats.uniqueVisitors, 1)) * 100)
    : 0;

  const bounceRate = stats
    ? Math.round((stats.bounceSessions / Math.max(stats.totalSessions, 1)) * 100)
    : 0;

  return (
    <>
      {/* Hero */}
      <section className="adv-hero">
        <div className="adv-hero__label">
          <span className="adv-hero__label-dot" />
          Now accepting sponsors
        </div>
        <h1 className="adv-hero__headline">
          Reach serious UPSC aspirants who are ready to study
        </h1>
        <p className="adv-hero__sub">
          UPSCPrepNotes connects you with thousands of focused UPSC CSE candidates
          actively searching for study material, test series, courses, and books.
          No bots. No tire-kickers. Just future civil servants.
        </p>
        <div className="adv-hero__actions">
          <a href="#slots" className="slot-card__cta" style={{ width: "auto", padding: "0.75rem 1.75rem", fontSize: "0.9375rem" }}>
            View available slots
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
          <a href="#contact" className="slot-card__cta" style={{ width: "auto", padding: "0.75rem 1.75rem", fontSize: "0.9375rem", background: "oklch(1 0 0)", color: "oklch(0.15 0 0)", border: "1.5px solid oklch(0.91 0 0)" }}>
            Get in touch
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="adv-section adv-anchor" id="stats">
        <div className="adv-section__header">
          <div className="adv-section__label">Real-time audience data</div>
          <h2 className="adv-section__title">Your ad reaches real people — verified</h2>
          <p className="adv-section__desc">
            These numbers update live from our analytics. No vanity metrics.
          </p>
        </div>

        {loading ? (
          <div className="stats-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="stat-card stat-card--skeleton">
                <div className="stat-card__value" />
                <div className="stat-card__label" />
              </div>
            ))}
          </div>
        ) : stats ? (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-card__value">{formatCompact(stats.uniqueVisitors)}</div>
                <div className="stat-card__label">Monthly Visitors</div>
                <div className="stat-card__trend stat-card__trend--up">↑ {returningRate}% returning</div>
              </div>
              <div className="stat-card">
                <div className="stat-card__value">{formatCompact(stats.pageViews)}</div>
                <div className="stat-card__label">Monthly Page Views</div>
                <div className="stat-card__trend stat-card__trend--up">↑ Deep engagement</div>
              </div>
              <div className="stat-card">
                <div className="stat-card__value">{formatCompact(stats.totalSessions)}</div>
                <div className="stat-card__label">Monthly Sessions</div>
                <div className="stat-card__trend stat-card__trend--neutral">{bounceRate}% bounce rate</div>
              </div>
              <div className="stat-card">
                <div className="stat-card__value">{formatCompact(stats.fileDownloads)}</div>
                <div className="stat-card__label">Free Downloads / Leads</div>
                <div className="stat-card__trend stat-card__trend--up">↑ Action-oriented users</div>
              </div>
            </div>

            {stats.dailyTimeline && stats.dailyTimeline.length > 1 && (
              <div style={{ marginTop: "1.5rem" }}>
                <TrafficChart data={stats.dailyTimeline} />
              </div>
            )}

            {stats.topPages && stats.topPages.length > 0 && (
              <div style={{ marginTop: "1.5rem" }}>
                <h3 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "oklch(0.556 0 0)", marginBottom: "0.625rem" }}>
                  Top pages this month
                </h3>
                <div className="top-pages">
                  {stats.topPages.slice(0, 7).map((page) => (
                    <div key={page._id} className="top-page-row">
                      <span className="top-page-row__path">{page._id || "/"}</span>
                      <span className="top-page-row__count">{page.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <p style={{ color: "oklch(0.556 0 0)", fontSize: "0.875rem" }}>
            Stats temporarily unavailable. Contact us for current numbers.
          </p>
        )}
      </section>

      {/* Audience */}
      <section className="adv-section adv-anchor" id="audience">
        <div className="adv-section__header">
          <div className="adv-section__label">Who you&rsquo;ll reach</div>
          <h2 className="adv-section__title">100% UPSC CSE aspirants</h2>
          <p className="adv-section__desc">
            Every visitor arrives with intent — researching a topic, downloading study
            material, or looking for test series and courses.
          </p>
        </div>

        <div className="audience-grid">
          <div className="audience-card">
            <div className="audience-card__icon" style={{ background: "oklch(0.92 0.04 158 / 0.4)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.58 0.18 158)" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <div className="audience-card__title">Age & Stage</div>
            <div className="audience-card__desc">
              80% are college students and graduates (ages 20&ndash;28) actively preparing for UPSC CSE Prelims and Mains. They visit daily for notes, current affairs, and test prep.
            </div>
          </div>
          <div className="audience-card">
            <div className="audience-card__icon" style={{ background: "oklch(0.88 0.06 256 / 0.3)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.45 0.12 256)" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
            </div>
            <div className="audience-card__title">Study Stage</div>
            <div className="audience-card__desc">
              45% are in their first attempt, 35% in second, and 20% in third+. They spend 8&ndash;12 minutes per session consuming serious study content, not just browsing.
            </div>
          </div>
          <div className="audience-card">
            <div className="audience-card__icon" style={{ background: "oklch(0.9 0.05 85 / 0.4)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.52 0.14 85)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
            </div>
            <div className="audience-card__title">Geography</div>
            <div className="audience-card__desc">
              70% from Delhi NCR, Lucknow, Patna, Jaipur, Bengaluru, and Hyderabad. The rest spans all states with strong UPSC coaching ecosystems.
            </div>
          </div>
          <div className="audience-card">
            <div className="audience-card__icon" style={{ background: "oklch(0.92 0.04 340 / 0.3)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.52 0.14 340)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div className="audience-card__title">Content Preference</div>
            <div className="audience-card__desc">
              Highest engagement on Mains answer writing, optional subject notes, current affairs compilations, and toppers&rsquo; strategy copies.
            </div>
          </div>
        </div>
      </section>

      {/* Ad Slots */}
      <section className="adv-section adv-anchor" id="slots">
        <div className="adv-section__header adv-section--centered">
          <div className="adv-section__label">Ad slots & pricing</div>
          <h2 className="adv-section__title">Choose how you want to reach aspirants</h2>
          <p className="adv-section__desc">
            Every slot includes placement on our highest-traffic pages. Prices are introductory &mdash; lock them in.
          </p>
        </div>

        <div className="slots-grid">
          <div className="slot-card">
            <div className="slot-card__name">Banner</div>
            <div className="slot-card__title">Sidebar Banner</div>
            <div className="slot-card__desc">
              300x250 display ad on all notes and download pages. High visibility as users scroll through study content.
            </div>
            <div className="slot-card__price">
              <span className="slot-card__price-value">₹3,000</span>
              <span className="slot-card__price-period"> / month</span>
            </div>
            <div className="slot-card__specs">
              <div className="slot-card__spec">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                300×250 or 250×250 format
              </div>
              <div className="slot-card__spec">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                Static image or animated GIF
              </div>
              <div className="slot-card__spec">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                Monthly impression report
              </div>
            </div>
            <a href="#contact" className="slot-card__cta">Book this slot</a>
          </div>

          <div className="slot-card slot-card--featured">
            <div className="slot-card__badge">Best value</div>
            <div className="slot-card__name">Premium</div>
            <div className="slot-card__title">Premium Banner</div>
            <div className="slot-card__desc">
              728×90 leaderboard at the top of all pages. First thing aspirants see. Includes newsletter mention.
            </div>
            <div className="slot-card__price">
              <span className="slot-card__price-value">₹5,000</span>
              <span className="slot-card__price-period"> / month</span>
              <span className="slot-card__price-original">₹7,000</span>
            </div>
            <div className="slot-card__specs">
              <div className="slot-card__spec">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                728×90 leaderboard — top placement
              </div>
              <div className="slot-card__spec">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                1× newsletter mention included
              </div>
              <div className="slot-card__spec">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                Monthly impression + CTR report
              </div>
            </div>
            <a href="#contact" className="slot-card__cta">Book this slot</a>
          </div>

          <div className="slot-card">
            <div className="slot-card__name">Sponsored</div>
            <div className="slot-card__title">Sponsored Content</div>
            <div className="slot-card__desc">
              A dedicated article or guide featuring your product. Published once and stays live permanently.
            </div>
            <div className="slot-card__price">
              <span className="slot-card__price-value">₹8,000</span>
              <span className="slot-card__price-period"> / one-time</span>
            </div>
            <div className="slot-card__specs">
              <div className="slot-card__spec">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                Native article — stays live forever
              </div>
              <div className="slot-card__spec">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                Social media promotion (1 post)
              </div>
              <div className="slot-card__spec">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                Featured in newsletter (1×)
              </div>
            </div>
            <a href="#contact" className="slot-card__cta">Book this slot</a>
          </div>
        </div>
      </section>

      {/* Why advertise */}
      <section className="adv-section">
        <div className="adv-section__header adv-section--centered">
          <div className="adv-section__label">Why advertise here</div>
          <h2 className="adv-section__title">High-intent audience at India-friendly rates</h2>
        </div>

        <div className="why-grid">
          <div className="why-card">
            <div className="why-card__number">01</div>
            <div className="why-card__title">Intent-driven traffic</div>
            <div className="why-card__desc">
              Visitors arrive searching for specific study topics — they are in learning mode and open to relevant course or book recommendations.
            </div>
          </div>
          <div className="why-card">
            <div className="why-card__number">02</div>
            <div className="why-card__title">No ad fatigue</div>
            <div className="why-card__desc">
              We show max 1&ndash;2 ads per page. Your brand gets undivided attention, not lost in a sea of banners.
            </div>
          </div>
          <div className="why-card">
            <div className="why-card__number">03</div>
            <div className="why-card__title">Organic + growing</div>
            <div className="why-card__desc">
              Traffic grows steadily through Google Search. You benefit from compounding visibility without paying for acquisition.
            </div>
          </div>
          <div className="why-card">
            <div className="why-card__number">04</div>
            <div className="why-card__title">Zero bots, all real</div>
            <div className="why-card__desc">
              Verified analytics. Every session is a real aspirant. We run on first-party data with no algorithm noise.
            </div>
          </div>
          <div className="why-card">
            <div className="why-card__number">05</div>
            <div className="why-card__title">India-optimised pricing</div>
            <div className="why-card__desc">
              Designed for Indian edtech budgets. No minimum commitment. Month-to-month with no lock-in.
            </div>
          </div>
          <div className="why-card">
            <div className="why-card__number">06</div>
            <div className="why-card__title">Transparent reporting</div>
            <div className="why-card__desc">
              Monthly reports with impressions, clicks, and engagement data. You always know exactly what you&rsquo;re getting.
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="adv-section">
        <div className="adv-section__header adv-section--centered">
          <div className="adv-section__label">FAQ</div>
          <h2 className="adv-section__title">Common questions</h2>
        </div>

        <div className="adv-faqs">
          <details className="adv-faq">
            <summary className="adv-faq__summary">
              What ad formats do you accept?
              <svg className="adv-faq__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div className="adv-faq__content">
              We accept static images (PNG, JPG), animated GIFs, and HTML5 banners. We do not accept autoplay video, audio ads, or pop-ups. All ads are reviewed before going live.
            </div>
          </details>
          <details className="adv-faq">
            <summary className="adv-faq__summary">
              Can I target specific pages or topics?
              <svg className="adv-faq__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div className="adv-faq__content">
              Yes. You can choose to appear on specific subject pages (e.g., Geography, Polity, History) or across the entire site. Topic-targeted placement is available at the same rates.
            </div>
          </details>
          <details className="adv-faq">
            <summary className="adv-faq__summary">
              What&rsquo;s the minimum commitment?
              <svg className="adv-faq__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div className="adv-faq__content">
              One month. No long-term contracts. Discounts available for 3-month and 6-month commitments (10% and 20% off respectively).
            </div>
          </details>
          <details className="adv-faq">
            <summary className="adv-faq__summary">
              How do you measure impressions?
              <svg className="adv-faq__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div className="adv-faq__content">
              We count an impression when the ad enters the viewport (minimum 50% visible for 1 second). This ensures you only pay for ads that are actually seen, not just loaded.
            </div>
          </details>
          <details className="adv-faq">
            <summary className="adv-faq__summary">
              Do you offer sponsored content placement?
              <svg className="adv-faq__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div className="adv-faq__content">
              Yes. We can publish a sponsored article, guide, or resource featuring your product. It stays live permanently and is promoted in our newsletter and social media.
            </div>
          </details>
          <details className="adv-faq">
            <summary className="adv-faq__summary">
              Can I pause or cancel mid-month?
              <svg className="adv-faq__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div className="adv-faq__content">
              Yes. You can pause anytime with 7 days notice. No refunds for partial months, but unused days can be rolled forward.
            </div>
          </details>
        </div>
      </section>

      {/* Contact form */}
      <section className="adv-section adv-anchor" id="contact">
        <div className="adv-section__header adv-section--centered">
          <div className="adv-section__label">Get started</div>
          <h2 className="adv-section__title">Ready to reach UPSC aspirants?</h2>
          <p className="adv-section__desc">
            Fill in the form and we&rsquo;ll get back within 24 hours with a custom proposal.
          </p>
        </div>

        {formStatus === "success" ? (
          <div className="contact-form">
            <div className="contact-form__card">
              <div className="contact-form__success">
                <div className="contact-form__success-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.58 0.18 158)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div className="contact-form__success-title">Thanks, we&rsquo;ll be in touch!</div>
                <div className="contact-form__success-desc">
                  We typically respond within 24 hours. In the meantime, feel free to browse our{" "}
                  <a href="/store" style={{ color: "oklch(0.58 0.18 158)", textDecoration: "underline" }}>store</a>.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form__card">
              <div className="contact-form__group">
                <label className="contact-form__label" htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="contact-form__input"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Ravi Sharma"
                />
              </div>
              <div className="contact-form__group">
                <label className="contact-form__label" htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="contact-form__input"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="ravi@example.com"
                />
              </div>
              <div className="contact-form__group">
                <label className="contact-form__label" htmlFor="organization">Organization</label>
                <input
                  id="organization"
                  name="organization"
                  type="text"
                  className="contact-form__input"
                  value={form.organization}
                  onChange={handleChange}
                  required
                  placeholder="Vision IAS / Drishti IAS / …"
                />
              </div>
              <div className="contact-form__group">
                <label className="contact-form__label" htmlFor="slot">Slot interest</label>
                <select
                  id="slot"
                  name="slot"
                  className="contact-form__select"
                  value={form.slot}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a slot</option>
                  <option value="sidebar-banner">Sidebar Banner — ₹3,000/mo</option>
                  <option value="premium-banner">Premium Banner — ₹5,000/mo (best value)</option>
                  <option value="sponsored-content">Sponsored Content — ₹8,000 (one-time)</option>
                  <option value="newsletter">Newsletter Mention — ₹3,000/mo</option>
                  <option value="custom">Custom Bundle — Let&rsquo;s discuss</option>
                </select>
              </div>
              <div className="contact-form__group">
                <label className="contact-form__label" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  className="contact-form__textarea"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your campaign goals, target audience, and any specific requirements…"
                  required
                />
              </div>
              <div className="contact-form__group">
                <div className="contact-form__hint">
                  We respect your privacy. Your details will only be used to respond to this inquiry.
                </div>
              </div>
              <button
                type="submit"
                className="contact-form__submit"
                disabled={formStatus === "sending"}
              >
                {formStatus === "sending" ? (
                  <>
                    <div className="adv-loading__spinner" style={{ width: "1rem", height: "1rem" }} />
                    Sending…
                  </>
                ) : (
                  <>
                    Submit inquiry
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </>
                )}
              </button>
              {formStatus === "error" && (
                <p style={{ marginTop: "0.75rem", fontSize: "0.8125rem", color: "oklch(0.55 0.2 30)", textAlign: "center" }}>
                  Something went wrong. Please email us directly at{" "}
                  <a href="mailto:hello@upscprepnotes.in" style={{ textDecoration: "underline" }}>hello@upscprepnotes.in</a>.
                </p>
              )}
            </div>
          </form>
        )}
      </section>

      {/* Footer */}
      <footer className="adv-footer">
        <div className="adv-footer__inner">
          <span className="adv-footer__text">© {new Date().getFullYear()} UPSCPrepNotes</span>
          <div className="adv-footer__links">
            <a className="adv-footer__link" href="/privacy">Privacy</a>
            <a className="adv-footer__link" href="/contact">Contact</a>
            <a className="adv-footer__link" href="/">Home</a>
          </div>
        </div>
      </footer>
    </>
  );
}

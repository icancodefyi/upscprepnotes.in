"use client";

import { useState, FormEvent } from "react";
import { IconMail, IconCheck } from "@tabler/icons-react";

export default function EmailCapture({ variant = "grid" }: { variant?: "grid" | "list" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/store/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    const cls = variant === "list" ? "list-email-capture" : "email-capture";
    return (
      <div className={`${cls} ${cls}--success`}>
        <IconCheck size={20} />
        <span>You&rsquo;re subscribed! We&rsquo;ll notify you when new resources drop.</span>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <section className="list-email-capture">
        <div className="list-email-capture__inner">
          <IconMail size={20} className="list-email-capture__icon" />
          <h3 className="list-email-capture__title">New topper reports drop every week</h3>
          <p className="list-email-capture__desc">
            Get notified when we add new answer copies, notes, and strategy compilations.
          </p>
          <form onSubmit={handleSubmit} className="list-email-capture__form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="list-email-capture__input"
              aria-label="Email address"
            />
            <button type="submit" className="list-email-capture__btn" disabled={status === "loading"}>
              {status === "loading" ? "Subscribing…" : "Subscribe"}
            </button>
          </form>
          {status === "error" && (
            <p className="list-email-capture__error">Something went wrong. Try again.</p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="email-capture">
      <div className="email-capture__inner">
        <IconMail size={24} className="email-capture__icon" />
        <h3 className="email-capture__title">New resources every week</h3>
        <p className="email-capture__desc">
          Get notified when we add new answer copies, notes bundles, and strategy reports.
        </p>
        <form onSubmit={handleSubmit} className="email-capture__form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="email-capture__input"
            aria-label="Email address"
          />
          <button type="submit" className="email-capture__btn" disabled={status === "loading"}>
            {status === "loading" ? "Subscribing…" : "Subscribe"}
          </button>
        </form>
        {status === "error" && (
          <p className="email-capture__error">Something went wrong. Try again.</p>
        )}
      </div>
    </section>
  );
}

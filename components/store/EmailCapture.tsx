"use client";

import { useState, FormEvent } from "react";
import { IconMail, IconCheck } from "@tabler/icons-react";

export default function EmailCapture() {
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
    return (
      <div className="email-capture email-capture--success">
        <IconCheck size={20} />
        <span>You&rsquo;re subscribed! We&rsquo;ll notify you when new resources drop.</span>
      </div>
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

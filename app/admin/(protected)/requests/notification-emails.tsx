"use client";

import { useState, useEffect, FormEvent } from "react";

interface EmailDoc {
  _id: string;
  email: string;
  createdAt: string;
}

export default function NotificationEmails() {
  const [emails, setEmails] = useState<EmailDoc[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function fetchEmails() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notification-emails");
      const data = await res.json();
      if (Array.isArray(data)) setEmails(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEmails();
  }, []);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    try {
      const res = await fetch("/api/admin/notification-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add email");
      }

      setSuccess("Email added successfully.");
      setNewEmail("");
      fetchEmails();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add email");
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/notification-emails/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete email");
      }

      setEmails((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete email");
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-semibold tracking-tight">
          Notification Emails
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          These emails receive a notification when a new purchase is made.
        </p>
      </div>

      <div className="rounded-[32px] border border-black/[0.06] bg-white p-8">
        <form onSubmit={handleAdd} className="flex gap-3">
          <input
            type="email"
            placeholder="sales@impiclabs.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="flex-1 rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-primary/50"
          />
          <button
            type="submit"
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
          >
            Add Email
          </button>
        </form>

        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}
        {success && (
          <p className="mt-3 text-sm text-green-600">{success}</p>
        )}

        <div className="mt-6">
          {loading ? (
            <p className="text-sm text-zinc-400">Loading...</p>
          ) : emails.length === 0 ? (
            <p className="text-sm text-zinc-500">
              No notification emails configured.
            </p>
          ) : (
            <div className="space-y-2">
              {emails.map((doc) => (
                <div
                  key={doc._id}
                  className="flex items-center justify-between rounded-2xl border border-black/[0.06] px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{doc.email}</p>
                    <p className="text-xs text-zinc-400">
                      Added{" "}
                      {new Date(doc.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="rounded-full px-4 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

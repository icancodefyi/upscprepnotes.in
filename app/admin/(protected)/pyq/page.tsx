"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Paper {
  _id: string;
  year: number;
  category: string;
  title: string;
  url: string;
}

export default function AdminPYQPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchPapers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/pyq");
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = await res.json();
      if (data.papers) {
        setPapers(data.papers);
      } else if (data.error === "No PYQ data in DB. Run seed.") {
        setPapers([]);
      }
    } catch {
      setMessage("Failed to load papers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  function updateUrl(_id: string, url: string) {
    setPapers((prev) =>
      prev.map((p) => (p._id === _id ? { ...p, url } : p))
    );
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");

    try {
      const updates = papers.map((p) => ({
        _id: p._id,
        url: p.url,
      }));

      const res = await fetch("/api/admin/pyq", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error || "Failed to save.");
        return;
      }

      setMessage("Saved successfully.");
    } catch {
      setMessage("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  const grouped = papers.reduce<Record<number, Paper[]>>((acc, p) => {
    if (!acc[p.year]) acc[p.year] = [];
    acc[p.year].push(p);
    return acc;
  }, {});

  const sortedYears = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);

  if (loading) {
    return <div className="text-zinc-500">Loading papers...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            PYQ Paper Links
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {papers.length} papers. Add PDF URLs for each paper.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      {message && (
        <div
          className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
            message === "Saved successfully."
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {papers.length === 0 ? (
        <div className="rounded-[32px] border border-black/[0.06] bg-white p-16 text-center">
          <p className="text-lg text-zinc-500">
            No papers found. Run the seed script to import from JSON.
          </p>
        </div>
      ) : (
        sortedYears.map((year) => (
          <div key={year} className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Year: {year}</h2>
            <div className="overflow-hidden rounded-[32px] border border-black/[0.06] bg-white">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-black/10">
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold">Paper</th>
                    <th className="p-4 font-semibold">PDF URL</th>
                  </tr>
                </thead>
                <tbody>
                  {grouped[year].map((paper) => (
                    <tr
                      key={paper._id}
                      className="border-b border-black/[0.04] last:border-b-0 hover:bg-zinc-50"
                    >
                      <td className="p-4 text-zinc-600">{paper.category}</td>
                      <td className="p-4 font-medium">{paper.title}</td>
                      <td className="p-4">
                        <Input
                          value={paper.url}
                          onChange={(e) =>
                            updateUrl(paper._id, e.target.value)
                          }
                          placeholder="https://..."
                          className="w-full"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

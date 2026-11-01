"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, card } from "./ui";

export type RelatedTopper = {
  name: string;
  slug: string;
  rank: number;
  year: number;
  optional: string;
  total: number;
  avatar: string;
  freeCopy: boolean;
};
export type RelatedGroup = { id: string; label: string; toppers: RelatedTopper[] };

const fmt = (n: number) => n.toLocaleString("en-IN");

export default function Related({ groups }: { groups: RelatedGroup[] }) {
  const usable = groups.filter((g) => g.toppers.length);
  const [active, setActive] = useState(usable[0]?.id);
  const group = usable.find((g) => g.id === active) ?? usable[0];
  if (!group) return null;

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Related toppers">
        {usable.map((g) => (
          <button
            key={g.id}
            type="button"
            role="tab"
            aria-selected={g.id === group.id}
            onClick={() => setActive(g.id)}
            className={`rounded-full px-3.5 py-1.5 text-[14px] font-medium transition-colors duration-150 ${
              g.id === group.id ? "bg-[var(--ink)] text-white" : "bg-white text-[var(--ink-2)] shadow-[0_0_0_1px_var(--line-2)] hover:text-[var(--ink)]"
            }`}
          >
            {g.label}
            <span className={`ml-1.5 tab ${g.id === group.id ? "text-white/60" : "text-[var(--muted)]"}`}>{g.toppers.length}</span>
          </button>
        ))}
      </div>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {group.toppers.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/upsc-topper/${t.slug}`}
              data-track={`topper-related-${t.slug}`}
              className={`${card} group flex items-center gap-4 p-4 transition-transform duration-200 ease-[var(--ease)] hover:-translate-y-0.5`}
            >
              <Avatar src={t.avatar} alt={t.name} size={52} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15.5px] font-semibold group-hover:text-[var(--accent)]">{t.name}</span>
                <span className="block truncate text-[13px] text-[var(--muted)]">{`AIR ${t.rank} · CSE ${t.year} · ${t.optional}`}</span>
                {t.freeCopy && <span className="mt-1 inline-block rounded-full bg-[#d4f1df] px-2 py-0.5 text-[11px] font-semibold text-[#14532d]">Free copy</span>}
              </span>
              {t.total > 0 && (
                <span className="tab shrink-0 text-right">
                  <span className="block text-[16px] font-semibold">{fmt(t.total)}</span>
                  <span className="block text-[11.5px] text-[var(--muted)]">/ 2,025</span>
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { Empty } from "@/components/admin/insights-ui";

/** Extra chart pieces for the Insights pages (server components, plain HTML/CSS). */

const dayLabel = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" });

/** Two stacked series per day (for example new vs returning visitors). */
export function StackedBars({ series, a, b, height = 130 }: { series: { day: string; a: number; b: number }[]; a: { label: string; color: string }; b: { label: string; color: string }; height?: number }) {
  const max = Math.max(...series.map((s) => s.a + s.b), 1);
  if (!series.some((s) => s.a + s.b)) return <Empty>No data in this period yet.</Empty>;
  const marks = new Set([0, Math.floor((series.length - 1) / 2), series.length - 1]);
  return (
    <div>
      <div className="mb-3 flex gap-4 text-xs text-zinc-600">
        {[a, b].map((x) => (
          <span key={x.label} className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: x.color }} />
            {x.label}
          </span>
        ))}
      </div>
      <div className="flex items-end gap-[2px]" style={{ height }}>
        {series.map((s) => (
          <div key={s.day} className="group relative flex h-full flex-1 flex-col justify-end">
            <div style={{ height: `${(s.b / max) * 100}%`, background: b.color, minHeight: s.b ? 2 : 0 }} className="rounded-t-[3px]" />
            <div style={{ height: `${(s.a / max) * 100}%`, background: a.color, minHeight: s.a ? 2 : 0 }} />
            <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-xs text-white group-hover:block">
              {dayLabel(s.day)}: {s.a} {a.label.toLowerCase()}, {s.b} {b.label.toLowerCase()}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex text-[11px] text-zinc-400">
        {series.map((s, i) => (
          <div key={s.day} className="flex-1 text-center">{marks.has(i) ? dayLabel(s.day) : ""}</div>
        ))}
      </div>
    </div>
  );
}

/** Day of week by hour of day (IST), shaded by how busy it is. */
export function Heatmap({ names, grid, max }: { names: string[]; grid: number[][]; max: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-separate border-spacing-[3px] text-[11px]">
        <thead>
          <tr>
            <th className="w-9" />
            {Array.from({ length: 24 }, (_, h) => (
              <th key={h} className="font-normal text-zinc-400">{h % 3 === 0 ? h : ""}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.map((row, di) => (
            <tr key={names[di]}>
              <td className="pr-1 text-right text-zinc-500">{names[di]}</td>
              {row.map((n, h) => (
                <td
                  key={h}
                  title={`${names[di]} ${h}:00 – ${n.toLocaleString("en-IN")} page views`}
                  className="h-6 rounded-[4px]"
                  style={{ background: n ? `rgba(31,63,214,${0.08 + (n / max) * 0.92})` : "rgba(11,12,16,0.04)" }}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-zinc-400">Hours are IST. Darker means more page views.</p>
    </div>
  );
}

/** Weekly cohorts: of the visitors first seen that week, the share who came back in week 1, 2, 3… */
export function CohortTable({ rows }: { rows: { week: string; size: number; retention: (number | null)[] }[] }) {
  if (!rows.some((r) => r.size)) return <Empty>Not enough history yet.</Empty>;
  return (
    <div className="-mx-2 overflow-x-auto">
      <table className="w-full min-w-[640px] border-separate border-spacing-[3px] text-xs">
        <thead>
          <tr className="text-left text-zinc-500">
            <th className="px-2 pb-1 font-medium">First seen week of</th>
            <th className="px-2 pb-1 text-right font-medium">Visitors</th>
            {Array.from({ length: 8 }, (_, k) => (
              <th key={k} className="px-1 pb-1 text-center font-medium">Week {k + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.week}>
              <td className="whitespace-nowrap px-2 text-zinc-700">{dayLabel(r.week)}</td>
              <td className="px-2 text-right tabular-nums text-zinc-700">{r.size.toLocaleString("en-IN")}</td>
              {r.retention.slice(1).map((v, k) => (
                <td
                  key={k}
                  className="h-7 rounded-[5px] text-center tabular-nums"
                  style={v == null ? { background: "transparent" } : { background: `rgba(31,63,214,${0.06 + Math.min(1, v / 40) * 0.8})`, color: v >= 22 ? "#fff" : "#0b0c10" }}
                >
                  {v == null ? "" : `${v}%`}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

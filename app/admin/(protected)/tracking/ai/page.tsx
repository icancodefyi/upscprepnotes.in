import { getAI, parseRange } from "@/lib/admin/insights";
import { BarList, Card, DailyBars, InsightTabs, PageHeader, Stat, num } from "@/components/admin/insights-ui";

export const dynamic = "force-dynamic";

export default async function AIPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const range = parseRange((await searchParams).range);
  const a = await getAI(range);
  const lim = a.limits;

  return (
    <div>
      <PageHeader title="Insights" desc="How people use the AI mentor: volume, repeat use, free-limit pressure and answer quality." range={range} basePath="/admin/tracking/ai" />
      <InsightTabs active="/admin/tracking/ai" range={range} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat label="Conversations" value={num(a.totalConvs)} />
        <Stat label="Questions" value={num(a.totalQs)} sub={`${a.avgQsPerConv} per conversation`} />
        <Stat label="People asking" value={num(a.askers)} sub={`${a.signedShare}% signed in`} />
        <Stat label="Came back to ask again" value={`${a.repeatRate}%`} sub={`${num(a.repeatAskers)} on another day`} />
        <Stat label="Hit the free limit" value={`${lim.anonMaxRate}%`} sub={`${num(lim.anonMax)} of ${num(lim.anon)} anonymous (5/day)`} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title="Questions per day">
          <DailyBars series={a.questionsDaily} color="#1f3fd6" />
        </Card>
        <Card title="Conversation depth" desc="How many questions people ask in one conversation">
          <BarList rows={a.perConv} />
          <p className="mt-3 text-xs text-zinc-400">Most one-question chats means people try it once. A high share of 3+ means it is genuinely useful.</p>
        </Card>
        <Card title="Free limits" desc="Where a paywall would have people">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-zinc-500">Anonymous visitors who asked</dt><dd className="font-semibold tabular-nums">{num(lim.anon)}</dd></div>
            <div className="flex justify-between"><dt className="text-zinc-500">…who used all 5 free questions</dt><dd className="font-semibold tabular-nums">{num(lim.anonMax)} ({lim.anonMaxRate}%)</dd></div>
            <div className="flex justify-between border-t border-black/[0.06] pt-3"><dt className="text-zinc-500">Signed-in users who asked</dt><dd className="font-semibold tabular-nums">{num(lim.signed)}</dd></div>
            <div className="flex justify-between"><dt className="text-zinc-500">…who used all 20 questions</dt><dd className="font-semibold tabular-nums">{num(lim.signedMax)} ({lim.signedMaxRate}%)</dd></div>
          </dl>
          <p className="mt-3 text-xs text-zinc-400">People who exhaust 20 a day are the likeliest to pay for an unlimited plan.</p>
        </Card>
        <Card title="Answer quality" desc="Server-side, since the tracking deploy">
          {a.tracked.answers + a.tracked.errors === 0 ? (
            <p className="rounded-xl bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500">Needs tracking data. After deploy this shows answer speed, failures and limit hits.</p>
          ) : (
            <>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-zinc-500">Answers delivered</dt><dd className="font-semibold tabular-nums">{num(a.tracked.answers)}</dd></div>
                <div className="flex justify-between"><dt className="text-zinc-500">Failed answers</dt><dd className="font-semibold tabular-nums">{num(a.tracked.errors)}</dd></div>
                <div className="flex justify-between"><dt className="text-zinc-500">Blocked by the limit</dt><dd className="font-semibold tabular-nums">{num(a.tracked.limitHits)}</dd></div>
                <div className="flex justify-between"><dt className="text-zinc-500">Retries by users</dt><dd className="font-semibold tabular-nums">{num(a.tracked.retries)}</dd></div>
              </dl>
              {a.latency.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm">
                  {a.latency.map((l) => (
                    <li key={l.path} className="flex justify-between"><span className="text-zinc-500">{l.path === "fast" ? "Topper answers (no model)" : "Model answers"}, avg / 75th</span><span className="tabular-nums">{(l.avg / 1000).toFixed(1)}s / {(l.p75 / 1000).toFixed(1)}s</span></li>
                  ))}
                </ul>
              )}
              {a.errors.length > 0 && <div className="mt-3"><BarList rows={a.errors} /></div>}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

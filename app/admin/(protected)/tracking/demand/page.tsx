import { getDemand, parseRange } from "@/lib/admin/insights";
import { BarList, Card, InsightTabs, PageHeader, Stat, num } from "@/components/admin/insights-ui";

export const dynamic = "force-dynamic";

export default async function DemandPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const range = parseRange((await searchParams).range);
  const d = await getDemand(range);

  return (
    <div>
      <PageHeader
        title="Insights"
        desc="What people want, in their own words: AI mentor questions, searches, clicks and free requests. Build products where these cluster."
        range={range}
        basePath="/admin/tracking/demand"
      />
      <InsightTabs active="/admin/tracking/demand" range={range} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="AI questions" value={num(d.totalQuestions)} sub={`${num(d.typedQuestions)} typed, ${num(d.templated)} from site links`} />
        <Stat label="Topics detected" value={num(d.topics.length)} sub={`${num(d.unmatched)} typed questions unmatched`} />
        <Stat label="Searches" value={num(d.searches.reduce((a, s) => a + s.value, 0))} sub="from tracking" />
        <Stat label="Free copy requests" value={num(d.copyLeads.reduce((a, s) => a + s.value, 0) + d.copyRequests.reduce((a, s) => a + s.value, 0))} sub="downloads + requests" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title="What people ask the AI about" desc="Questions they typed themselves, matched to topics (one can match several)">
          <BarList rows={d.topics} empty="No typed AI questions in this period." max={20} />
        </Card>
        <Card title="Most asked questions" desc="Typed questions, lower-cased, most repeated first">
          <BarList rows={d.topQuestions} empty="No AI questions in this period." max={20} />
        </Card>
        <Card title="Toppers people ask the AI about" desc={`From the “Ask AI about this topper” links. ${num(d.caLinks)} more questions came from current-affairs links.`}>
          <BarList rows={d.topperAsks} empty="None in this period." max={20} hrefFor={(name) => `/admin/toppers?search=${encodeURIComponent(name.split(" ")[0])}`} />
        </Card>
        <Card title="What people search for" desc="Search boxes across the site (tracking)">
          <BarList rows={d.searches} empty="No searches tracked yet. They appear after deploy." max={20} />
        </Card>
        <Card title="Most clicked" desc="Elements with a data-track label (tracking)">
          <BarList rows={d.clicks} empty="No clicks tracked yet. They appear after deploy." max={20} />
        </Card>
        <Card title="Free answer copies people download" desc="By topper">
          <BarList rows={d.copyLeads} empty="None in this period." />
        </Card>
        <Card title="Answer copies people ask us for" desc="By topper (we don't hold these yet)">
          <BarList rows={d.copyRequests} empty="None in this period." />
        </Card>
        <Card title="Free materials people download" desc="By document">
          <BarList rows={d.materialLeads} empty="None in this period." />
        </Card>
      </div>
    </div>
  );
}

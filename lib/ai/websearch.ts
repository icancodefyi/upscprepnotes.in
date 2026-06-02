export type WebSearchResult = {
  title: string;
  url: string;
  content: string;
};

export async function searchWeb(query: string): Promise<{
  results: WebSearchResult[];
  answer?: string;
}> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    console.warn("TAVILY_API_KEY not set, skipping web search");
    return { results: [] };
  }

  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: "basic",
      max_results: 5,
      include_answer: false,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("Tavily search error:", res.status, text);
    return { results: [] };
  }

  const data = await res.json();
  return {
    results: (data.results || []).map((r: any) => ({
      title: r.title || "",
      url: r.url || "",
      content: r.content || "",
    })),
    answer: data.answer,
  };
}

export function formatSearchResults(query: string, results: WebSearchResult[]): string {
  if (results.length === 0) return "";

  const lines = [`Web search results for "${query}":`, ""];

  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    lines.push(`Source ${i + 1}: ${r.title}`);
    lines.push(`URL: ${r.url}`);
    lines.push(`Content: ${r.content.slice(0, 1000)}`);
    lines.push("");
  }

  return lines.join("\n");
}

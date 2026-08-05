// Shared search matcher used by every search surface: the header dropdown API
// (`app/api/search/route.ts`), the `/toppers` section search
// (`app/toppers/ToppersSearch.tsx`), and the `/search` page
// (`app/search/SearchClient.tsx`).
//
// The old behaviour was a single whole-query `.includes(q)` against each field,
// so a two-word query like "komal meena" or "NCERT notes" could never match,
// and a typo/partial like "vishwas" or "aishva" never reached
// "vishwajeet-souryan..." or "vaishali-chopra...". This helper instead splits
// the query into words and requires every word to match some field token,
// either as a substring or as a near-miss (a prefix within a small edit
// distance), which recovers those queries.

export function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter(Boolean);
}

// Minimum Levenshtein distance between `query` and any prefix of `target`.
// Trailing characters of `target` beyond the query length are free, so this
// behaves like a typo-tolerant "startsWith": "vishwas" is distance 1 from a
// prefix of "vishwajeet", "aishva" is distance 2 from a prefix of "vaishali".
function prefixEditDistance(query: string, target: string): number {
  const m = query.length;
  if (m === 0) return 0;

  // prev holds dp column j-1 indexed by query position; curr holds column j.
  let prev = new Array<number>(m + 1);
  for (let i = 0; i <= m; i++) prev[i] = i;

  let best = prev[m]; // distance against the empty prefix of `target`
  for (let j = 1; j <= target.length; j++) {
    const curr = new Array<number>(m + 1);
    curr[0] = j;
    for (let i = 1; i <= m; i++) {
      const cost = query[i - 1] === target[j - 1] ? 0 : 1;
      curr[i] = Math.min(
        prev[i] + 1, // drop a char from target
        curr[i - 1] + 1, // drop a char from query
        prev[i - 1] + cost, // substitute / match
      );
    }
    best = Math.min(best, curr[m]);
    prev = curr;
  }
  return best;
}

// How much fuzz a query word earns, scaled by its length. Words of 1-3 chars
// must match exactly (as a substring) to avoid drowning results in noise.
function fuzzyThreshold(len: number): number {
  if (len <= 3) return 0;
  if (len <= 5) return 1;
  return 2;
}

function tokenMatches(queryToken: string, fieldToken: string): boolean {
  if (fieldToken.includes(queryToken)) return true;
  const threshold = fuzzyThreshold(queryToken.length);
  if (threshold === 0) return false;
  return prefixEditDistance(queryToken, fieldToken) <= threshold;
}

// True when every word of `query` matches at least one token drawn from
// `fields`. An empty query matches everything (callers decide whether to run).
export function matchesQuery(
  query: string,
  fields: Array<string | number | null | undefined>,
): boolean {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return true;

  const fieldTokens = fields.flatMap((f) => tokenize(String(f ?? "")));
  if (fieldTokens.length === 0) return false;

  return queryTokens.every((qt) => fieldTokens.some((ft) => tokenMatches(qt, ft)));
}

export type SearchableTopper = {
  firstName: string;
  lastName: string;
  rank: number;
  year: number;
  optionalSubject: string;
  slug: string;
};

// Matches a topper against name, slug, optional subject, rank, and year.
// The slug is included so word matching works even when a record's
// firstName/lastName are missing but the slug (e.g. "vaishali-chopra-...") is
// not.
export function matchesTopper(topper: SearchableTopper, query: string): boolean {
  return matchesQuery(query, [
    topper.firstName,
    topper.lastName,
    topper.slug,
    topper.optionalSubject,
    topper.rank,
    topper.year,
  ]);
}

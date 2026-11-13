/**
 * Some stored marks are impossible (for example 1006 in a 250-mark paper). A bad paper mark also makes the
 * written and final totals unreliable, so those are dropped along with it. Used wherever marks are shown or ranked.
 */
export const MARK_CAP: Record<string, number> = { gs1: 250, gs2: 250, gs3: 250, gs4: 250, essay: 250, optional1: 250, optional2: 250, interview: 275, written: 1750, total: 2025 };

export function cleanMarks(raw: Record<string, number | undefined> | undefined | null): { marks: Record<string, number>; suspect: boolean } {
  const marks: Record<string, number> = {};
  let suspect = false;
  for (const [k, v] of Object.entries(raw || {})) {
    if (typeof v !== "number" || !(k in MARK_CAP) || !v) continue;
    if (v > MARK_CAP[k]) suspect = true;
    else marks[k] = v;
  }
  if (marks.written && marks.interview && marks.total && Math.abs(marks.written + marks.interview - marks.total) > 3) suspect = true;
  if (suspect) {
    delete marks.total;
    delete marks.written;
  }
  return { marks, suspect };
}

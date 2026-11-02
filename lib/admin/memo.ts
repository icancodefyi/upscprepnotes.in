/**
 * Tiny in-process cache for admin queries.
 * - Fresh for `ttlMs`: returned instantly.
 * - Stale (up to `staleMs`): returned instantly while a refresh runs in the background.
 * - Concurrent callers share one running query.
 * Admin numbers are therefore at most about a minute old, and a repeat click is instant.
 */
type Entry<T> = { value?: T; at: number; running?: Promise<T> };

const store = new Map<string, Entry<unknown>>();

export function memo<A extends unknown[], T>(name: string, fn: (...args: A) => Promise<T>, ttlMs = 45_000, staleMs = 15 * 60_000) {
  return async (...args: A): Promise<T> => {
    const key = `${name}:${JSON.stringify(args)}`;
    const e = (store.get(key) as Entry<T> | undefined) ?? { at: 0 };
    store.set(key, e);
    const age = Date.now() - e.at;

    const refresh = () => {
      if (!e.running) {
        e.running = fn(...args)
          .then((v) => {
            e.value = v;
            e.at = Date.now();
            return v;
          })
          .finally(() => {
            e.running = undefined;
          });
      }
      return e.running;
    };

    if (e.value !== undefined && age < ttlMs) return e.value;
    if (e.value !== undefined && age < staleMs) {
      refresh().catch(() => {}); // serve the stale copy now, update for the next click
      return e.value;
    }
    return refresh();
  };
}

/** Drop everything, e.g. after the admin changes data that the numbers depend on. */
export function clearMemo() {
  store.clear();
}

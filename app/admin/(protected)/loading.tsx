/** Shown instantly while an admin page loads its data; the sidebar stays put. */
export default function AdminLoading() {
  const bar = "animate-pulse rounded-xl bg-zinc-100";
  return (
    <div aria-busy="true" aria-label="Loading">
      <div className={`${bar} h-9 w-56`} />
      <div className={`${bar} mt-3 h-4 w-80 max-w-full`} />
      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-[20px] border border-black/[0.06] bg-white p-5">
            <div className={`${bar} h-3 w-20`} />
            <div className={`${bar} mt-4 h-8 w-28`} />
            <div className={`${bar} mt-3 h-3 w-24`} />
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-[24px] border border-black/[0.06] bg-white p-6">
            <div className={`${bar} h-4 w-40`} />
            <div className={`${bar} mt-6 h-40 w-full`} />
          </div>
        ))}
      </div>
    </div>
  );
}

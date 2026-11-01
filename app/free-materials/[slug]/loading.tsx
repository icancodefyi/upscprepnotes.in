/** Quiet placeholder while the library renders. */
export default function Loading() {
  const block = "animate-pulse rounded-[14px] bg-[#eceef4]";
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1120px] px-6 pb-24 pt-36">
        <div className={`${block} h-3 w-48`} />
        <div className={`${block} mt-8 h-14 w-[70%]`} />
        <div className={`${block} mt-5 h-5 w-[55%]`} />
        <div className={`${block} mt-10 h-14 w-full rounded-full`} />
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`${block} h-[260px] rounded-[20px]`} />
          ))}
        </div>
      </div>
    </div>
  );
}

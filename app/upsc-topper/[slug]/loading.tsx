/** Shown while a topper page renders: the hero and marks statement as quiet blocks. */
export default function TopperDetailLoading() {
  const block = "animate-pulse rounded-[14px] bg-[#eceef4]";
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1120px] px-6 pb-24 pt-36">
        <div className={`${block} h-3 w-64`} />
        <div className="mt-10 grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <div className={`${block} h-16 w-[80%]`} />
            <div className={`${block} mt-4 h-8 w-[60%]`} />
            <div className={`${block} mt-8 h-5 w-[90%]`} />
            <div className={`${block} mt-3 h-5 w-[70%]`} />
            <div className="mt-9 flex gap-3">
              <div className={`${block} h-12 w-44 rounded-full`} />
              <div className={`${block} h-12 w-40 rounded-full`} />
            </div>
          </div>
          <div className={`${block} mx-auto h-[420px] w-full max-w-[420px] rounded-[20px]`} />
        </div>
      </div>
    </div>
  );
}

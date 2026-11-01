/**
 * One heading pattern for every section: title (max two lines), one-sentence lead underneath,
 * optional action aligned to the title's baseline on the right. Content always starts 56px below.
 */
export default function SectionHead({
  title,
  lead,
  action,
  dark = false,
}: {
  title: React.ReactNode;
  lead: React.ReactNode;
  action?: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-[40rem]">
        <h2 className="t-display h-sec">{title}</h2>
        <p className={`mt-5 max-w-[34rem] text-m leading-[1.55] tracking-[-0.011em] ${dark ? "text-white/70" : "text-[var(--ink-2)]"}`}>
          {lead}
        </p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

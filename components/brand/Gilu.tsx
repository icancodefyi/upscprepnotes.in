export type GiluPose =
  | "hello"
  | "reading"
  | "thinking"
  | "correct"
  | "wrong"
  | "sorry"
  | "celebrating"
  | "dozing";

/**
 * Gilu, the site's squirrel mascot. Each pose is an SVG in /public/mascot with its own
 * animation built in, and it holds still for visitors who turn motion off.
 * Decorative by default; pass `label` when Gilu carries meaning that no nearby text gives.
 */
export default function Gilu({
  pose,
  size = 96,
  label,
  className = "",
}: {
  pose: GiluPose;
  size?: number;
  label?: string;
  className?: string;
}) {
  return (
    // A plain img keeps the SVG's built-in animation; next/image would need SVGs allowed site-wide.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/mascot/gilu-${pose}.svg`}
      width={size}
      height={Math.round(size * 1.1)}
      alt={label ?? ""}
      aria-hidden={label ? undefined : true}
      draggable={false}
      decoding="async"
      className={`select-none ${className}`}
    />
  );
}

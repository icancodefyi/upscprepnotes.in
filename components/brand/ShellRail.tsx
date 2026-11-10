"use client";

import { usePathname } from "next/navigation";
import { hasShellRail, railProductFor } from "@/lib/rail";

/**
 * Puts the right rail beside every page the shell frames, except money pages, tools and pages
 * that carry their own rail. The rails themselves are rendered on the server and passed in,
 * so the product catalogue never ships to the browser.
 */
export default function ShellRail({ rails, inlineRails, children }: { rails: Record<string, React.ReactNode>; inlineRails: Record<string, React.ReactNode>; children: React.ReactNode }) {
  const path = usePathname() ?? "/";
  if (!hasShellRail(path)) return <main>{children}</main>;
  const key = railProductFor(path);
  return (
    <>
      <div className="mx-auto max-w-[1680px] xl:grid xl:grid-cols-[minmax(0,1fr)_316px]">
        <main className="min-w-0">{children}</main>
        <aside className="hidden xl:block xl:pr-6 xl:pt-32">
          <div className="[@media(min-height:720px)]:sticky [@media(min-height:720px)]:top-24">{rails[key]}</div>
        </aside>
      </div>
      <div className="mx-auto max-w-[1080px] px-4 pb-12 pt-4 xl:hidden">{inlineRails[key]}</div>
    </>
  );
}

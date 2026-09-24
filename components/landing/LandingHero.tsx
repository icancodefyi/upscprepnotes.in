import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LandingHero() {
  const stats = [
    { value: "280+", label: "Verified Marksheets" },
    { value: "37", label: "Optional Subjects" },
    { value: "50+", label: "Handwritten Copies" },
    { value: "2,700+", label: "Free Study PDFs" },
  ];

  return (
    <div className="px-2.5 pt-2.5 sm:px-3 sm:pt-3">
      <main
        id="hero"
        className="relative isolate flex min-h-[660px] max-h-[880px] h-[92vh] w-full flex-col items-center justify-between overflow-hidden rounded-[16px] px-4 pt-20 pb-10 sm:px-12 sm:pt-28 sm:pb-14 text-center"
      >
        {/* Hero Background Image: Historic LBSNAA Academy Campus at Golden Hour */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[16px]">
          <picture>
            <source srcSet="/images/altruist/upsc_hero_academy.webp" type="image/webp" />
            <img
              src="/images/altruist/upsc_hero_academy.jpg"
              alt="LBSNAA Mussoorie Academy campus against Himalayas"
              loading="eager"
              decoding="sync"
              className="h-full w-full object-cover object-center"
            />
          </picture>
          {/* Calibrated gradient overlay for high contrast and sharp legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/75" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.35)_0%,transparent_80%)]" />
        </div>

        {/* Centered Heading & Value Proposition */}
        <div className="relative z-10 mx-auto my-auto flex max-w-4xl flex-col items-center justify-center text-center px-2 sm:px-4">
          <p className="text-xs font-semibold tracking-widest uppercase text-white/80 mb-3 drop-shadow-md">
            UPSC Civil Services Examination · 2021 – 2025 Archive
          </p>

          <h1 className="text-[26px] xs:text-[30px] sm:text-5xl md:text-[62px] font-extrabold tracking-tight text-white drop-shadow-[0_3px_16px_rgba(0,0,0,0.6)] sm:leading-[1.12]">
            <span className="block">Every mark. Every topper.</span>
            <span className="mt-2 block sm:mt-3">
              Decoded with{" "}
              <span className="inline-flex items-center rounded-[12px] sm:rounded-[18px] bg-[#FEF9EE] px-3.5 py-0.5 sm:px-6 sm:py-1 text-[#7A4B13] border border-[#F7E7CD] shadow-2xl align-middle font-extrabold whitespace-nowrap ml-1 sm:ml-2">
                zero fluff.
              </span>
            </span>
          </h1>

          <p className="mx-auto mt-4 sm:mt-5 max-w-2xl text-[14px] sm:text-base md:text-[17px] font-medium leading-relaxed tracking-[-0.01em] text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
            280+ verified marksheet breakdowns, 50+ uncut handwritten answer booklets, and data-backed Mains scoring frameworks. Verified from official UPSC gazette notifications.
          </p>
        </div>

        {/* Bottom CTA Button & Social Proof */}
        <div className="relative z-10 mx-auto flex flex-col items-center gap-4 pb-2 sm:pb-3 w-full max-w-3xl">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#featured-toppers"
              data-track="home-hero-cta"
              className="flex h-[48px] sm:h-[50px] items-center justify-center rounded-[12px] bg-[#16526E] hover:bg-[#114258] px-7 sm:px-8 text-sm sm:text-base font-semibold text-white shadow-xl transition active:scale-[0.98]"
            >
              Explore 280+ Marksheets <ArrowRight size={16} className="ml-1.5" />
            </a>

            <Link
              href="/store"
              data-track="home-hero-store"
              className="flex h-[48px] sm:h-[50px] items-center justify-center rounded-[12px] bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md px-6 sm:px-7 text-sm sm:text-base font-semibold text-white shadow-lg transition active:scale-[0.98]"
            >
              Browse Compilations
            </Link>
          </div>

          {/* Proof Badge with Avatars */}
          <div className="flex max-w-[95vw] sm:max-w-none items-center gap-2.5 sm:gap-3 rounded-full bg-white/95 px-3.5 sm:px-4 py-1.5 shadow-md backdrop-blur-xs">
            <div className="flex -space-x-2 shrink-0">
              <img
                src="/images/altruist/avatar_1.jpg"
                alt="Verified Topper Avatar"
                className="h-6 w-6 sm:h-7 sm:w-7 rounded-full border-2 border-white object-cover"
              />
              <img
                src="/images/altruist/avatar_2.jpg"
                alt="Verified Topper Avatar"
                className="h-6 w-6 sm:h-7 sm:w-7 rounded-full border-2 border-white object-cover"
              />
              <img
                src="/images/altruist/avatar_3.jpg"
                alt="Verified Topper Avatar"
                className="h-6 w-6 sm:h-7 sm:w-7 rounded-full border-2 border-white object-cover"
              />
              <img
                src="/images/altruist/avatar_4.jpg"
                alt="Verified Topper Avatar"
                className="h-6 w-6 sm:h-7 sm:w-7 rounded-full border-2 border-white object-cover"
              />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-black whitespace-nowrap">
              <span className="inline sm:hidden">280+ Marksheets Indexed · Verified</span>
              <span className="hidden sm:inline">280+ Official Marksheets Indexed · Gazette Verified</span>
            </span>
          </div>

          {/* Key Metric Chips Row */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-white/80">
            {stats.map((s) => (
              <div key={s.label} className="text-center flex items-center gap-2">
                <span className="font-bold text-white text-sm sm:text-base">{s.value}</span>
                <span className="text-xs text-white/75">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

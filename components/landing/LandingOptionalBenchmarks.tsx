import Link from "next/link";
import { MapPin, TrendingUp, ArrowRight } from "lucide-react";

export default function LandingOptionalBenchmarks() {
  const benchmarks = [
    {
      badge: "PSIR · ★ 313 Record",
      title: "Political Science & IR Benchmark",
      location: "ForumIAS MGP · 5-Yr Record",
      desc: "Classical Western & Indian political thought in Paper 1, grounded in foreign policy whitepapers.",
      img: "/images/altruist/event_1.webp",
      href: "/optional/psir",
    },
    {
      badge: "Anthropology · 298 Benchmark",
      title: "Anthropology Scoring Benchmark",
      location: "Vajiram & Ravi · Top 0.1%",
      desc: "Physical anthropology fossil sketches in Paper 1, Xaxa Committee tribal policy in Paper 2.",
      img: "/images/altruist/event_2.webp",
      href: "/optional/anthropology",
    },
    {
      badge: "Sociology · 295 Benchmark",
      title: "Sociology Paper Analysis",
      location: "Vision IAS · High GS-2 Link",
      desc: "Empirical field studies (MN Srinivas, Andre Beteille) paired with demographic census trends.",
      img: "/images/altruist/event_3.webp",
      href: "/optional/sociology",
    },
    {
      badge: "Mathematics · 298 Record",
      title: "Mathematics Precision Standard",
      location: "Vision IAS · Engineering Top",
      desc: "Uncompromising calculation speed. Solved entire 10-year question banks under strict 3-hour timer.",
      img: "/images/altruist/event_4.webp",
      href: "/optional/mathematics",
    },
  ];

  const additionalOptionals = [
    { name: "Geography", href: "/optional/geography", score: "Map & Diagrams Focus" },
    { name: "History", href: "/optional/history", score: "High Conversion Rate" },
    { name: "Public Administration", href: "/optional/public-administration", score: "Governance Blueprint" },
    { name: "Philosophy", href: "/optional/philosophy", score: "Strong Ethics Linkage" },
  ];

  return (
    <section className="framer-1okn818" data-framer-name="Schedule - Section" id="schedule">
      <div className="framer-1nohhmw" data-framer-name="Content Stack">
        <div className="framer-p51ont" data-framer-name="Header Stack">
          <div className="framer-1lrjazr-container">
            <div
              className="framer-C5DvW framer-c8VI7 framer-ultdxd framer-v-ultdxd"
              data-framer-name="Variant 1"
              style={{
                backgroundColor: "var(--token-aa1fdafa-3658-4ff4-91fe-60ad3074fde3, rgb(222, 239, 248))",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              <div className="framer-1csgvwc" data-framer-component-type="RichTextContainer" style={{ transform: "none", opacity: 1 }}>
                <p className="framer-text framer-styles-preset-ajns0" dir="auto">Optional Benchmarks</p>
              </div>
            </div>
          </div>

          <div className="framer-1isw8z0" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
            <h2
              className="framer-text framer-styles-preset-dw9di9"
              dir="auto"
              style={{ textAlign: "left" }}
            >
              Highest Recorded Optional Scores & Subject Analysis
            </h2>
          </div>

          <div className="framer-gow4qv" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
            <p
              className="framer-text framer-styles-preset-1t286ig"
              dir="auto"
              style={{ textAlign: "left" }}
            >
              Historical peak benchmarks and structural scoring nuances across 37 recognized optional subjects.
            </p>
          </div>
        </div>

        {/* Benchmarks Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10 w-full">
          {benchmarks.map((b, idx) => (
            <Link
              key={idx}
              href={b.href}
              data-track={`home-optional-card-${b.href.replace("/optional/", "")}`}
              className="group transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              style={{
                backgroundColor: "var(--token-aa1fdafa-3658-4ff4-91fe-60ad3074fde3, rgb(222, 239, 248))",
                borderRadius: "17px",
                opacity: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflow: "hidden",
                minHeight: "360px",
                position: "relative",
                padding: "16px",
              }}
            >
              {/* Header Solid White Card */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
                  padding: "14px",
                  position: "relative",
                  zIndex: 10,
                }}
              >
                <div className="inline-block bg-[#ebf8ff] text-[#116e99] border border-[#d0ecfa] px-2.5 py-0.5 rounded-[6px] text-xs font-bold mb-2">
                  {b.badge}
                </div>
                <p className="text-[15px] font-bold text-black leading-snug">{b.title}</p>
                <p className="text-xs text-black/75 font-medium mt-1.5 leading-relaxed">{b.desc}</p>
              </div>

              {/* Location Pill */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  boxShadow: "0 3px 8px rgba(0, 0, 0, 0.15)",
                  padding: "8px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  position: "relative",
                  zIndex: 10,
                  width: "fit-content",
                }}
              >
                <MapPin size={13} className="text-[#16526e]" />
                <span className="text-xs font-semibold text-black">{b.location}</span>
              </div>

              {/* Background Image with calibrated dark gradient overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 1,
                }}
              >
                <img
                  src={b.img}
                  alt={b.title}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    borderRadius: "inherit",
                    objectPosition: "center",
                    objectFit: "cover",
                  }}
                />
                <div
                  style={{
                    background: "linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.55) 100%)",
                    position: "absolute",
                    inset: 0,
                  }}
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Additional Optional Subjects Directory Bar (Transferred for SEO & Crawlability) */}
        <div className="mt-8 rounded-[16px] border border-black/8 bg-white p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-black/80">
            <TrendingUp size={16} className="text-[#16526E]" />
            <span>More High-Scoring Optionals:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {additionalOptionals.map((opt) => (
              <Link
                key={opt.name}
                href={opt.href}
                data-track={`home-optional-pill-${opt.name.toLowerCase()}`}
                className="inline-flex items-center gap-1.5 rounded-[8px] border border-black/10 bg-[#DEEFF8]/50 hover:bg-[#DEEFF8] px-3 py-1.5 text-xs font-semibold text-[#16526E] transition-colors"
              >
                <span>{opt.name}</span>
                <span className="text-[10px] text-black/50 font-normal">({opt.score})</span>
                <ArrowRight size={11} className="opacity-70" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

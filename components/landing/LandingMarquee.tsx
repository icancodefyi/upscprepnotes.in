const MARQUEE_ITEMS = [
  { name: "Vision IAS", src: "/images/logos/visionias.png", heightClass: "h-9 sm:h-11" },
  { name: "ForumIAS", src: "/images/logos/forumias.png", heightClass: "h-8 sm:h-10" },
  { name: "Vajiram & Ravi", src: "/images/logos/vajiram.svg", heightClass: "h-9 sm:h-11" },
  { name: "Next IAS", src: "/images/logos/nextias.svg", heightClass: "h-7 sm:h-9" },
  { name: "Drishti IAS", src: "/images/logos/drishti.png", heightClass: "h-11 sm:h-13" },
  { name: "InsightsIAS", src: "/images/logos/insights.png", heightClass: "h-8 sm:h-10" },
  { name: "Shankar IAS Academy", src: "/images/logos/shankarias.png", heightClass: "h-9 sm:h-11" },
  { name: "IASbaba", src: "/images/logos/iasbaba.png", heightClass: "h-9 sm:h-11" },
];

export default function LandingMarquee() {
  return (
    <section
      className="framer-1iz3aqe"
      data-framer-name="Recognized Section"
      style={{
        backgroundColor: "var(--token-4a66cce6-00d5-40f7-836a-7512ad740f85, rgb(255, 255, 252))",
        paddingTop: "32px",
        paddingBottom: "32px",
      }}
    >
      <div className="framer-14l6v7v" data-framer-name="Content Stack">
        <div className="framer-1n52tai" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
          <p
            className="framer-text framer-styles-preset-1t286ig"
            style={{
              textAlign: "center",
              color: "rgba(0, 0, 0, 0.55)",
              fontWeight: 600,
              fontSize: "13px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Evaluated copies & test series sourced from premier academies:
          </p>
        </div>

        <div className="relative w-full overflow-hidden mt-6 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="animate-altruist-marquee flex items-center gap-14 sm:gap-20 py-2">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <div
                key={`m-${i}`}
                className="flex shrink-0 items-center justify-center transition-transform duration-200 hover:scale-105"
              >
                <img
                  src={item.src}
                  alt={item.name}
                  className={`${item.heightClass} w-auto max-w-[200px] object-contain opacity-80 transition-opacity duration-200 hover:opacity-100`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

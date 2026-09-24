import Link from "next/link";
import { ArrowRight, Award } from "lucide-react";
import AnimatedCurvedRibbon from "@/components/AnimatedCurvedRibbon";

export default function LandingGazetteRecords() {
  const records = [
    {
      title: "Ishita Kishore · AIR 01",
      sticker: "313 PSIR Record (5-Yr Peak)",
      role: "IAS · Uttar Pradesh Cadre",
      img: "/images/toppers/ishita-kishore.jpg",
      badge: "Roll No. 1910080460",
      slug: "ishita-kishore-rank-1-2022",
      cutoffDelta: "+134 vs Cutoff",
    },
    {
      title: "Garima Lohia · AIR 02",
      sticker: "141 Highest Essay in CSE 2022",
      role: "IAS · Bihar Cadre",
      img: "/images/toppers/garima-lohia.jpg",
      badge: "Roll No. 1910102924",
      slug: "garima-lohia-rank-2-2022",
      cutoffDelta: "+103 vs Cutoff",
    },
    {
      title: "Ayan Jain · AIR 16",
      sticker: "298 Maths Record (Engineering Peak)",
      role: "IAS · Madhya Pradesh Cadre",
      img: "/images/toppers/ayan-jain.jpg",
      badge: "Roll No. 1040520",
      slug: "ayan-jain-rank-16-2023",
      cutoffDelta: "+68 vs Cutoff",
    },
  ];

  return (
    <section className="framer-qco01b" data-framer-name="Impacts - Section" id="impacts">
      <div className="framer-52eljy" data-framer-name="Content Stack">
        <div className="framer-14d0d9n" data-framer-name="Header Stack">
          <div className="framer-1gr44io-container">
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
                <p className="framer-text framer-styles-preset-ajns0" dir="auto">Gazette Records</p>
              </div>
            </div>
          </div>

          <div className="framer-n2z088" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
            <h2
              className="framer-text framer-styles-preset-dw9di9"
              dir="auto"
              style={{ textAlign: "left" }}
            >
              Verified Results We Proudly Archive
            </h2>
          </div>

          <div className="framer-6iv1f1" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
            <p
              className="framer-text framer-styles-preset-1t286ig"
              dir="auto"
              style={{ textAlign: "left" }}
            >
              Every marksheet and answer booklet indexed here has been verified against official Union Public Service Commission gazette notifications.
            </p>
          </div>
        </div>

        {/* 3 Impact Cards linking to real topper profiles */}
        <div className="framer-1rsuefy" style={{ display: "flex", position: "relative" }}>
          <ul
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
              width: "100%",
              padding: 0,
              margin: 0,
              listStyle: "none",
            }}
          >
            {records.map((r, i) => (
              <li key={i} className="ticker-item" style={{ listStyle: "none" }}>
                <Link
                  href={`/upsc-topper/${r.slug}`}
                  data-track={`home-gazette-${r.slug}`}
                  className="framer-1a0968r group block relative overflow-hidden rounded-[18px] transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
                  data-framer-name={`Impact ${i + 1}`}
                  style={{ opacity: 1, transform: "none" }}
                >
                  <div className="ssr-variant">
                    <div className="framer-opg2ek" data-framer-name="(change)" style={{ opacity: 1, transform: "none" }}>
                      <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }} data-framer-background-image-wrapper="true">
                        <img
                          src={r.img}
                          alt={r.title}
                          style={{
                            display: "block",
                            width: "100%",
                            height: "100%",
                            borderRadius: "inherit",
                            objectPosition: "center top",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Floating Italic Sticker Tag */}
                  <div className="framer-ib04zu" data-border="true" data-framer-name="Tag">
                    <div className="framer-143137m" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
                      <p className="framer-text framer-styles-preset-otdcmf" dir="auto">
                        {r.sticker}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Inset Label with Profile Link Indicator */}
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs rounded-[12px] p-3.5 border border-black/8 shadow-sm transition-all group-hover:bg-[#DEEFF8]">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-black text-sm group-hover:text-[#16526E] transition-colors">
                        {r.title}
                      </p>
                      <ArrowRight size={14} className="text-[#16526E] opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-xs text-black/60 font-medium mt-0.5">
                      {r.role} · {r.badge}
                    </p>
                    <span className="inline-block mt-2 text-[11px] font-bold text-[#16526E]">
                      View Evaluated Marksheet & Booklet →
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Rotating Ribbon Underneath */}
      <div className="ssr-variant">
        <AnimatedCurvedRibbon
          id="ribbon-gazette"
          unitText="VERIFIED MARKSHEETS • GENUINE TOPPER BOOKLETS • OFFICIAL GAZETTE RECORDS • ZERO GUESSWORK • "
          angle={19}
          direction={-1}
          baseSpeed={0.8}
          scrollSpeed={0.5}
          containerClass="framer-m0c4nu-container"
          svgWidth={2032}
          svgHeight={300}
          viewBox="0 0 2032 300"
          pathD="M 101.5 150 L 330.1 198.5 L 787.4 101.5 L 1244.6 198.5 L 1701.9 101.5 L 2100 150"
          strokeColor="var(--token-4a66cce6-00d5-40f7-836a-7512ad740f85, rgb(255, 255, 252))"
          textColor="rgb(37, 91, 115)"
        />
      </div>
    </section>
  );
}

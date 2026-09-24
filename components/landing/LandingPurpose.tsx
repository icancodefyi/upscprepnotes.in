"use client";

import { useState } from "react";
import AnimatedCurvedRibbon from "@/components/AnimatedCurvedRibbon";

export default function LandingPurpose() {
  const [activeTab, setActiveTab] = useState(0);

  const pillars = [
    {
      title: "GS Papers 1–4",
      quote: "Every mark gained in Mains is a deliberate decision. Not luck.",
      subtitle:
        "Official scoring distributions decoded from 280+ verified gazette notifications across GS1 through GS4 Ethics.",
      img: "/images/altruist/upsc_hero_academic.webp",
      alt: "Civil services academy study hall",
    },
    {
      title: "Handwritten Copies",
      quote: "Study topper intros, structured diagrams, and examiner margin remarks line by line.",
      subtitle:
        "50+ genuine exam booklets evaluated by premier academies with actual examiner marks and feedback matrices.",
      img: "/images/toppers/ishita-kishore.jpg",
      alt: "Ishita Kishore AIR 1 evaluated copy",
    },
    {
      title: "Optional Analysis",
      quote: "Compare average marks, scoring shifts, and topper papers across 37 recognized optionals.",
      subtitle:
        "Historical peak benchmarks from 313 in PSIR to 298 in Maths and Anthropology — zero guesswork.",
      img: "/images/altruist/upsc_hero_academy.webp",
      alt: "LBSNAA Academy campus grounds",
    },
    {
      title: "AI Mentor & Strategy",
      quote: "Ask targeted syllabus queries and compare preparation paths against verified rank-1 frameworks.",
      subtitle:
        "Vector intelligence trained strictly on verified topper dossiers, ARC reports, and committee recommendations.",
      img: "/images/altruist/upsc_hero_altruist.webp",
      alt: "Aspirant studying strategy framework",
    },
  ];

  const current = pillars[activeTab];

  return (
    <section
      data-name="Our Purpose - Section"
      className="framer-EIYZL framer-xhscK framer-AB6d5 framer-ZfgoP framer-VNgH7 framer-wa15fs framer-v-wa15fs"
      data-framer-name="Education"
      style={{
        backgroundColor: "var(--token-4a66cce6-00d5-40f7-836a-7512ad740f85, rgb(255, 255, 252))",
        width: "100%",
        opacity: 1,
      }}
    >
      <div className="framer-15w04j6" data-framer-name="Content Stack" style={{ opacity: 1 }}>
        <div className="framer-tnz2lx" data-framer-name="Header Stack" style={{ opacity: 1 }}>
          <div className="framer-fosn5m-container" style={{ opacity: 1 }}>
            <div
              className="framer-C5DvW framer-c8VI7 framer-ultdxd framer-v-ultdxd"
              data-framer-name="Variant 1"
              style={{
                backgroundColor: "var(--token-aa1fdafa-3658-4ff4-91fe-60ad3074fde3, rgb(222, 239, 248))",
                borderRadius: "10px",
                opacity: 1,
              }}
            >
              <div
                className="framer-1csgvwc"
                data-framer-component-type="RichTextContainer"
                style={{ transform: "none", opacity: 1 }}
              >
                <p className="framer-text framer-styles-preset-ajns0" dir="auto">
                  Academic Pillars
                </p>
              </div>
            </div>
          </div>

          <div
            className="framer-13cmbnc"
            data-framer-component-type="RichTextContainer"
            style={{ transform: "none", opacity: 1 }}
          >
            <h2
              className="framer-text framer-styles-preset-dw9di9"
              dir="auto"
              style={{ textAlign: "center" }}
            >
              Structured preparation shouldn’t be a luxury!
            </h2>
          </div>

          <div
            className="framer-1mqy6uf"
            data-framer-component-type="RichTextContainer"
            style={{ opacity: 0.8, transform: "none" }}
          >
            <p
              className="framer-text framer-styles-preset-1t286ig"
              dir="auto"
              style={{ textAlign: "center" }}
            >
              From official marks distributions to actual handwritten answer copies, we bring civil services preparation down to verifiable data.
            </p>
          </div>
        </div>
      </div>

      <div
        className="framer-j2f5pg"
        data-framer-name="Content"
        style={{
          backgroundColor: "var(--token-a7b6c3b9-9bcd-41ca-90cf-3832bfc2095a, rgb(0, 0, 0))",
          opacity: 1,
        }}
      >
        {/* Curved Rotating SVG Ribbon */}
        <AnimatedCurvedRibbon
          id="ribbon-purpose"
          unitText="AUTHENTIC MARKSHEETS • EVALUATED COPIES • VERIFIED RANKERS • ZERO FLUFF • UPSC CSE 2026 • "
          angle={-10}
          direction={1}
          baseSpeed={0.8}
          scrollSpeed={0.5}
          containerClass="framer-xh74jq-container"
          svgWidth={1940}
          svgHeight={300}
          viewBox="0 0 1940 300"
          pathD="M 99.7,150.0 L 299.8,191.2 L 500.0,211.9 L 700.2,201.6 L 970.0,150.0 L 1205.0,103.2 L 1405.2,87.6 L 1605.3,103.2 L 1840.3,150.0"
          strokeColor="rgb(237, 242, 248)"
          textColor="rgb(37, 91, 115)"
        />

        {/* White Info Card Chassis */}
        <div
          className="framer-1ol60wp"
          data-framer-name="Info Card"
          style={{
            backgroundColor: "var(--token-5e116048-a615-49a6-97d7-2d659f41a725, rgb(255, 255, 255))",
            borderRadius: "15px",
            opacity: 1,
            transform: "none",
          }}
        >
          {/* Left: Text & Tabs Stack */}
          <div className="framer-1kn7r6n" data-framer-name="Text Stack" style={{ opacity: 1 }}>
            <div
              className="framer-1nj5tdm"
              data-framer-component-type="RichTextContainer"
              style={{
                transform: "none",
                opacity: 1,
              }}
            >
              <h5
                className="framer-text framer-styles-preset-1a3qyz6"
                dir="auto"
                style={{ color: "var(--token-a7b6c3b9-9bcd-41ca-90cf-3832bfc2095a, rgb(0, 0, 0))" }}
              >
                What We Stand For
              </h5>
            </div>

            {/* 4 Interactive Pill Tabs */}
            <div className="framer-1jdloac" data-framer-name="Toggle Stack" style={{ opacity: 1 }}>
              {pillars.map((p, idx) => {
                const isActive = activeTab === idx;
                return (
                  <div key={idx} className="framer-pufutt-container" style={{ opacity: 1, transform: "none" }}>
                    <button
                      type="button"
                      onClick={() => setActiveTab(idx)}
                      className={`framer-u0vFC framer-j1EhD framer-13eakb6 ${isActive ? "framer-v-13eakb6" : "framer-v-5cwh2h"} text-left transition-all duration-150`}
                      style={{
                        backgroundColor: isActive
                          ? "var(--token-9bd908c5-7840-4cc3-9001-6077d25b88ca, rgba(230, 237, 245, 0.7))"
                          : "transparent",
                        width: "100%",
                        borderRadius: "8px",
                        cursor: "pointer",
                        opacity: 1,
                      }}
                    >
                      <div
                        className="framer-46b72a"
                        data-framer-name="Icon"
                        style={{
                          backgroundColor: isActive
                            ? "var(--token-eff9db75-30f0-4c7d-a7af-eaa94d6dc6ea, rgb(22, 82, 110))"
                            : "var(--token-a7cc2964-d8ca-4e2b-a4dc-bf1002d1db68, rgb(235, 248, 255))",
                          borderRadius: "6px",
                          boxShadow: isActive ? "rgba(0, 0, 0, 0.25) 0px 0px 4px 0px" : "none",
                          opacity: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span className={`text-[12px] font-bold ${isActive ? "text-white" : "text-[#16526e]"}`}>
                          0{idx + 1}
                        </span>
                      </div>
                      <div
                        className="framer-1t1gjqa"
                        data-framer-component-type="RichTextContainer"
                        style={{ transform: "none", opacity: 1 }}
                      >
                        <h6 className="framer-text framer-styles-preset-12gmgnu" dir="auto">
                          {p.title}
                        </h6>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Image Stack with Dark Overlay & High-Contrast Quote */}
          <div
            className="framer-isy5f9"
            data-framer-name="Image Stack"
            style={{
              backgroundColor: "var(--token-a7b6c3b9-9bcd-41ca-90cf-3832bfc2095a, rgb(0, 0, 0))",
              borderRadius: "12px",
              opacity: 1,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              className="framer-1ha9k0h"
              data-framer-name="Image"
              style={{
                mask: "linear-gradient(rgba(0, 0, 0, 0.7) 0%, rgb(0, 0, 0) 100%)",
                opacity: 1,
              }}
            >
              <div
                style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
                data-framer-background-image-wrapper="true"
              >
                <img
                  src={current.img}
                  alt={current.alt}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    borderRadius: "inherit",
                    objectPosition: "center",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>

            <div
              className="framer-1hwg3ax"
              data-framer-name="Black Overlay"
              style={{
                background:
                  "linear-gradient(0deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.35) 60%, rgba(0, 0, 0, 0.2) 100%)",
                opacity: 1,
                position: "absolute",
                inset: 0,
              }}
            />

            <div
              className="framer-d1g695"
              data-framer-component-type="RichTextContainer"
              style={{
                position: "absolute",
                bottom: "24px",
                left: "24px",
                right: "24px",
                width: "calc(100% - 48px)",
                maxWidth: "440px",
                transform: "none",
                opacity: 1,
                zIndex: 10,
              }}
            >
              <h4
                className="framer-text framer-styles-preset-1l1604x"
                dir="auto"
                style={{
                  color: "#ffffff",
                  fontSize: "22px",
                  lineHeight: "1.4",
                  fontWeight: 700,
                  textShadow: "0 2px 10px rgba(0,0,0,0.85)",
                }}
              >
                {current.quote}
              </h4>
              <p className="mt-2 text-white/90 text-[13px] sm:text-[14px] font-medium drop-shadow-md leading-relaxed">
                {current.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

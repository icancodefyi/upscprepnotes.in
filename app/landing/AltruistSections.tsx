"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, ChevronLeft, ChevronRight, Plus, Minus, ArrowRight, ArrowUpRight, BookOpen, FileText, TrendingUp, Bot, Sparkles, MapPin, Download } from "lucide-react";
import IndiaCommunityMap from "@/components/IndiaCommunityMap";
import AnimatedCurvedRibbon from "@/components/AnimatedCurvedRibbon";

// Premier Institute Logos
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

/* ─────────────────────────────────────────────────────────────
   SECTION 0: RECOGNIZED BY PREMIER INSTITUTES (MARQUEE)
───────────────────────────────────────────────────────────── */
export function AltruistMarquee() {
  return (
    <section className="framer-1iz3aqe" data-framer-name="Recognized Section">
      <div className="framer-14l6v7v" data-framer-name="Content Stack">
        <div className="framer-1n52tai" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
          <p
            className="framer-text framer-styles-preset-1t286ig"
            style={{
              "--framer-text-alignment": "center",
              "--framer-text-color": "var(--token-ebcd1cf0-2976-4608-8e6d-b5eb11f76c71, rgba(0, 0, 0, 0.5))",
              fontWeight: 600,
              fontSize: "14px",
              letterSpacing: "0.08em",
              textTransform: "uppercase"
            } as React.CSSProperties}
          >
            Evaluated copies & test series sourced from premier institutes:
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

/* ─────────────────────────────────────────────────────────────
   SECTION 1: OUR PURPOSE (WHAT WE STAND FOR) WITH ROTATING RIBBON
───────────────────────────────────────────────────────────── */
export function AltruistPurpose() {
  const [activeTab, setActiveTab] = useState(0);

  const pillars = [
    {
      title: "GS Papers 1–4",
      quote: "Every mark gained in Mains is a deliberate decision. Not luck.",
      subtitle: "Official scoring distributions decoded from 280+ verified gazette notifications across GS1 through GS4 Ethics.",
      img: "/images/altruist/upsc_hero_academic.webp",
      alt: "Civil services academy study hall"
    },
    {
      title: "Handwritten Copies",
      quote: "Study topper intros, structured diagrams, and examiner margin remarks line by line.",
      subtitle: "50+ genuine exam booklets evaluated by premier academies with actual examiner marks and feedback matrices.",
      img: "/images/toppers/ishita-kishore.jpg",
      alt: "Ishita Kishore AIR 1 evaluated copy"
    },
    {
      title: "Optional Analysis",
      quote: "Compare average marks, scoring shifts, and topper papers across 37 recognized optionals.",
      subtitle: "Historical peak benchmarks from 313 in PSIR to 298 in Maths and Anthropology — zero guesswork.",
      img: "/images/altruist/upsc_hero_academy.webp",
      alt: "LBSNAA Academy campus grounds"
    },
    {
      title: "AI Mentor & Strategy",
      quote: "Ask targeted syllabus queries and compare preparation paths against verified rank-1 frameworks.",
      subtitle: "Vector intelligence trained strictly on verified topper dossiers, ARC reports, and committee recommendations.",
      img: "/images/altruist/upsc_hero_altruist.webp",
      alt: "Aspirant studying strategy framework"
    }
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
        opacity: 1
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
                opacity: 1
              }}
            >
              <div className="framer-1csgvwc" data-framer-component-type="RichTextContainer" style={{ transform: "none", opacity: 1 }}>
                <p className="framer-text framer-styles-preset-ajns0" dir="auto">Academic Pillars</p>
              </div>
            </div>
          </div>

          <div className="framer-13cmbnc" data-framer-component-type="RichTextContainer" style={{ transform: "none", opacity: 1 }}>
            <h2
              className="framer-text framer-styles-preset-dw9di9"
              dir="auto"
              style={{ "--framer-text-alignment": "center" } as React.CSSProperties}
            >
              Structured preparation shouldn’t be a luxury!
            </h2>
          </div>

          <div className="framer-1mqy6uf" data-framer-component-type="RichTextContainer" style={{ opacity: 0.8, transform: "none" }}>
            <p
              className="framer-text framer-styles-preset-1t286ig"
              dir="auto"
              style={{ "--framer-text-alignment": "center" } as React.CSSProperties}
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
          opacity: 1
        }}
      >
        {/* Curved Rotating SVG Ribbon (Continuous glide + scroll acceleration) */}
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
            transform: "none"
          }}
        >
          {/* Left: Text & Tabs Stack */}
          <div className="framer-1kn7r6n" data-framer-name="Text Stack" style={{ opacity: 1 }}>
            <div
              className="framer-1nj5tdm"
              data-framer-component-type="RichTextContainer"
              style={{
                "--extracted-1lwpl3i": "var(--token-a7b6c3b9-9bcd-41ca-90cf-3832bfc2095a, rgb(0, 0, 0))",
                transform: "none",
                opacity: 1
              } as React.CSSProperties}
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
                        opacity: 1
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
                          justifyContent: "center"
                        }}
                      >
                        <span className={`text-[12px] font-bold ${isActive ? "text-white" : "text-[#16526e]"}`}>
                          0{idx + 1}
                        </span>
                      </div>
                      <div className="framer-1t1gjqa" data-framer-component-type="RichTextContainer" style={{ transform: "none", opacity: 1 }}>
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
              overflow: "hidden"
            }}
          >
            <div
              className="framer-1ha9k0h"
              data-framer-name="Image"
              style={{
                mask: "linear-gradient(rgba(0, 0, 0, 0.7) 0%, rgb(0, 0, 0) 100%)",
                opacity: 1
              }}
            >
              <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }} data-framer-background-image-wrapper="true">
                <img
                  src={current.img}
                  alt={current.alt}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    borderRadius: "inherit",
                    objectPosition: "center",
                    objectFit: "cover"
                  }}
                />
              </div>
            </div>

            <div
              className="framer-1hwg3ax"
              data-framer-name="Black Overlay"
              style={{
                background: "linear-gradient(0deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.35) 60%, rgba(0, 0, 0, 0.2) 100%)",
                opacity: 1,
                position: "absolute",
                inset: 0
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
                zIndex: 10
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
                  textShadow: "0 2px 10px rgba(0,0,0,0.85)"
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

/* ─────────────────────────────────────────────────────────────
   SECTION 2: ONGOING PROJECTS -> CURATED STORE
───────────────────────────────────────────────────────────── */
export function AltruistCuratedStore() {
  const storeProducts = [
    {
      title: "Top 10 Rankers Strategy",
      subtitle: "AIR 1–10 complete strategies & marks deep dives in one PDF",
      location: "Instant PDF Download",
      price: "₹299",
      oldPrice: "₹990",
      tagLabel: "Save 70%",
      img: "https://ik.imagekit.io/impiclabs/products/top-10-rankers-strategy.png?tr=w-600,h-450,f-auto,q-80",
      href: "/store"
    },
    {
      title: "Answer Copies Compilation",
      subtitle: "50+ actual handwritten answer sheets from rank holders (GS1–4, Essay)",
      location: "50+ Uncut Copies · Rubrics",
      price: "₹799",
      oldPrice: "₹1,999",
      tagLabel: "Save 60%",
      img: "https://ik.imagekit.io/impiclabs/products/answer-copies-compilation.png?tr=w-600,h-450,f-auto,q-80",
      href: "/store"
    },
    {
      title: "Government Schemes Compendium",
      subtitle: "All ministry-wise schemes with objectives, budget, and key facts",
      location: "Updated for CSE 2025/26",
      price: "₹99",
      oldPrice: "₹199",
      tagLabel: "Save 50%",
      img: "https://ik.imagekit.io/impiclabs/products/government-schemes-compilation.png?tr=w-600,h-450,f-auto,q-80",
      href: "/store"
    }
  ];

  return (
    <section className="framer-1vi0lun" data-framer-name="In Progress - Section" id="curated-store">
      <div className="framer-qpt9i0" data-framer-name="Content Stack">
        <div className="framer-8yrv9v" data-framer-name="Header Stack">
          <div className="framer-1oqgu60-container">
            <div
              className="framer-C5DvW framer-c8VI7 framer-ultdxd framer-v-ultdxd"
              data-framer-name="Variant 1"
              style={{
                backgroundColor: "var(--token-aa1fdafa-3658-4ff4-91fe-60ad3074fde3, rgb(222, 239, 248))",
                borderRadius: "10px",
                opacity: 1
              }}
            >
              <div className="framer-1csgvwc" data-framer-component-type="RichTextContainer" style={{ transform: "none", opacity: 1 }}>
                <p className="framer-text framer-styles-preset-ajns0" dir="auto">Curated Store</p>
              </div>
            </div>
          </div>

          <div className="framer-1gg27o" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
            <h2 className="framer-text framer-styles-preset-dw9di9" dir="auto">
              Official Topper Compilations & Strategy Reports
            </h2>
          </div>

          <div className="framer-17c81hq" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
            <p
              className="framer-text framer-styles-preset-1t286ig"
              dir="auto"
              style={{ "--framer-text-alignment": "left" } as React.CSSProperties}
            >
              High-resolution searchable digital compilations distilled from authentic UPSC gazette records and genuine test booklets.
            </p>
          </div>
        </div>

        {/* 3 Project Cards Deck */}
        <div className="framer-jfqnnm">
          {storeProducts.map((p, idx) => (
            <div key={idx} className="ssr-variant">
              <div className="framer-a9k4av-container" style={{ opacity: 1, transform: "none" }}>
                <div
                  className="framer-TLXzn framer-pqx4O framer-jVAG2 framer-1n3rv63 framer-v-1n3rv63"
                  data-framer-name="Variant 1"
                  style={{
                    backgroundColor: "var(--token-a7cc2964-d8ca-4e2b-a4dc-bf1002d1db68, rgb(235, 248, 255))",
                    width: "100%",
                    borderRadius: "17px",
                    opacity: 1,
                    transform: "none",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  {/* Top Background Image */}
                  <div
                    className="framer-ojezjg"
                    data-framer-name="Image"
                    style={{
                      mask: "linear-gradient(rgba(0, 0, 0, 0.85) 0%, rgb(0, 0, 0) 100%)",
                      opacity: 1
                    }}
                  >
                    <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }} data-framer-background-image-wrapper="true">
                      <img
                        src={p.img}
                        alt={p.title}
                        style={{
                          display: "block",
                          width: "100%",
                          height: "100%",
                          borderRadius: "inherit",
                          objectPosition: "center",
                          objectFit: "cover"
                        }}
                      />
                    </div>
                  </div>

                  {/* Floating Pill Tag (Top-Right) */}
                  <div
                    className="framer-1oux7ca"
                    data-framer-name="Tag"
                    style={{
                      backgroundColor: "var(--token-5e116048-a615-49a6-97d7-2d659f41a725, rgb(255, 255, 255))",
                      borderRadius: "6px",
                      opacity: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "4px 8px"
                    }}
                  >
                    <div className="framer-h5id97" data-framer-component-type="RichTextContainer" style={{ opacity: 0.8, transform: "none" }}>
                      <p className="framer-text framer-styles-preset-1n9fr5k" dir="auto" style={{ color: "rgba(0, 0, 0, 0.8)", fontWeight: 600, fontSize: "12px" }}>
                        {p.tagLabel}
                      </p>
                    </div>
                    <div className="framer-9e4o8l" data-framer-component-type="RichTextContainer" style={{ transform: "none", opacity: 1 }}>
                      <p className="framer-text framer-styles-preset-1n9fr5k" dir="auto" style={{ color: "#000", fontWeight: 700, fontSize: "12px" }}>
                        {p.price} <span className="line-through text-black/40 font-normal">{p.oldPrice}</span>
                      </p>
                    </div>
                  </div>

                  {/* Bottom Inset White Capsule */}
                  <div
                    className="framer-13jea5z"
                    data-framer-name="Info Stack"
                    style={{
                      backgroundColor: "var(--token-5e116048-a615-49a6-97d7-2d659f41a725, rgb(255, 255, 255))",
                      borderRadius: "12px",
                      opacity: 1
                    }}
                  >
                    <div className="framer-16cvhaq" data-framer-name="Text" style={{ opacity: 1 }}>
                      <div className="framer-ce3pnb" data-framer-component-type="RichTextContainer" style={{ "--framer-paragraph-spacing": "0px", transform: "none", opacity: 1 } as React.CSSProperties}>
                        <p className="framer-text framer-styles-preset-149n7s4" dir="auto" style={{ fontWeight: 700, fontSize: "16px", color: "#000" }}>
                          {p.title}
                        </p>
                      </div>
                      <div className="framer-9hgaq5" data-framer-component-type="RichTextContainer" style={{ "--framer-paragraph-spacing": "0px", transform: "none", opacity: 1 } as React.CSSProperties}>
                        <p className="framer-text framer-styles-preset-1n9fr5k" dir="auto" style={{ fontSize: "12px", color: "rgba(0,0,0,0.6)", marginTop: "3px" }}>
                          {p.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="framer-1cn3wfy-container" style={{ opacity: 1 }}>
                      <Link
                        className="framer-2Cqzj framer-pqx4O framer-9hvwit framer-v-9hvwit framer-1wkh8kp"
                        data-framer-name="Variant 1"
                        href={p.href}
                        tabIndex={0}
                        style={{
                          backgroundColor: "var(--token-eff9db75-30f0-4c7d-a7af-eaa94d6dc6ea, rgb(22, 82, 110))",
                          height: "100%",
                          width: "100%",
                          borderRadius: "10px",
                          opacity: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "10px 16px"
                        }}
                      >
                        <div className="framer-qr6cka" data-framer-name="Donate" data-framer-component-type="RichTextContainer" style={{ transform: "none", opacity: 1 }}>
                          <p
                            className="framer-text framer-styles-preset-149n7s4"
                            dir="auto"
                            style={{
                              "--framer-text-alignment": "center",
                              "--framer-text-color": "#fff",
                              fontWeight: 600,
                              fontSize: "14px"
                            } as React.CSSProperties}
                          >
                            Get Access · {p.price}
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Link to All Store Products */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/store"
            className="inline-flex items-center gap-2 rounded-[12px] bg-black px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-neutral-800"
          >
            <span>View All Official Store Compilations</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION 3: GOALS -> MAINS SCORING BLUEPRINTS (STAGGERED 3-SET)
───────────────────────────────────────────────────────────── */
export function AltruistMainsBlueprints() {
  return (
    <section className="framer-ims3zk" data-framer-name="Goals - Section" id="goals">
      <div className="framer-uqd12b" data-framer-name="Content Stack">
        <div className="framer-1ht9vbw" data-framer-name="Header Text">
          <div className="framer-155xoja-container">
            <div
              className="framer-C5DvW framer-c8VI7 framer-ultdxd framer-v-ultdxd"
              data-framer-name="Variant 1"
              style={{
                backgroundColor: "var(--token-aa1fdafa-3658-4ff4-91fe-60ad3074fde3, rgb(222, 239, 248))",
                borderRadius: "10px",
                opacity: 1
              }}
            >
              <div className="framer-1csgvwc" data-framer-component-type="RichTextContainer" style={{ transform: "none", opacity: 1 }}>
                <p className="framer-text framer-styles-preset-ajns0" dir="auto">Syllabus Blueprints</p>
              </div>
            </div>
          </div>

          <div className="framer-a58gm8" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
            <h2
              className="framer-text framer-styles-preset-dw9di9"
              dir="auto"
              style={{ "--framer-text-alignment": "center" } as React.CSSProperties}
            >
              Target Scoring Standards For Mains 2026
            </h2>
          </div>

          <div className="framer-1kqn82h" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
            <p
              className="framer-text framer-styles-preset-1t286ig"
              dir="auto"
              style={{ "--framer-text-alignment": "center" } as React.CSSProperties}
            >
              How verified rankers clear the cutoff with safe margins across General Studies papers.
            </p>
          </div>
        </div>

        {/* Staggered 3-Set Cards Deck */}
        <div className="framer-y1g8rr" data-framer-name="Goals Stack">
          {/* SET 1: GS1 (Peach Background #FFF2E3) */}
          <div className="framer-ol78uj" data-framer-name="Goal 1">
            {/* Left Big Image */}
            <div className="framer-48zefn" data-framer-name="Image" style={{ opacity: 1, transform: "none" }}>
              <div className="ssr-variant">
                <div className="framer-135p4iq" data-framer-name="(change)">
                  <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }} data-framer-background-image-wrapper="true">
                    <img
                      src="/images/toppers/ishita-kishore.jpg"
                      alt="Ishita Kishore GS1 evaluated answer copy"
                      style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        borderRadius: "inherit",
                        objectPosition: "center top",
                        objectFit: "cover"
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Info Stack */}
            <div className="framer-16u9ib2" data-framer-name="Info Stack" style={{ opacity: 1, transform: "none" }}>
              <div className="framer-4i287z" data-border="true" data-framer-name="Image">
                <div className="ssr-variant">
                  <div className="framer-1x0jqyb" data-framer-name="(change)">
                    <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }} data-framer-background-image-wrapper="true">
                      <img
                        src="/images/toppers/ishita-portrait.jpg"
                        alt="Ishita Kishore AIR 1"
                        style={{
                          display: "block",
                          width: "100%",
                          height: "100%",
                          borderRadius: "inherit",
                          objectPosition: "center top",
                          objectFit: "cover"
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Floating Italic Sticker Tag */}
                <div className="framer-1qivj49" data-border="true" data-framer-name="Tag">
                  <div className="framer-6llb67" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
                    <p className="framer-text framer-styles-preset-otdcmf" dir="auto">
                      121+ Target Benchmark (Ishita AIR 1)
                    </p>
                  </div>
                </div>
              </div>

              <div className="framer-1uunfr2" data-framer-name="Text Stack">
                <div className="framer-7klw87" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
                  <h3
                    className="framer-text framer-styles-preset-lt8qp6"
                    dir="auto"
                    style={{ color: "var(--token-749d8f28-b858-456d-9af6-21d9e7d33bbf, rgb(110, 70, 22))" }}
                  >
                    GS Paper 1: Geography & Heritage
                  </h3>
                </div>
                <div className="framer-65pgoc" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
                  <p
                    className="framer-text framer-styles-preset-1bcubwk"
                    dir="auto"
                    style={{
                      "--framer-text-alignment": "left",
                      color: "var(--token-749d8f28-b858-456d-9af6-21d9e7d33bbf, rgb(110, 70, 22))"
                    } as React.CSSProperties}
                  >
                    Ishita Kishore scored 121 in GS1 using hand-drawn spatial maps, cross-section drainage diagrams, and direct Article 21 citations in urban flood questions. Break past the 95-mark plateau.
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    href="/content/how-to-score-130-plus-in-gs1"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#6E4616] hover:underline"
                  >
                    <span>Read GS1 Scoring Strategy</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* SET 2: GS2 (Sage Background #F9FAE3) */}
          <div className="framer-1yazwgq" data-framer-name="Goal 2">
            {/* Left Info Stack */}
            <div className="framer-xj7b67" data-framer-name="Info Stack" style={{ opacity: 1, transform: "none" }}>
              <div className="framer-kuwhne" data-border="true" data-framer-name="Image">
                <div className="ssr-variant">
                  <div className="framer-gg6nid" data-framer-name="(change)">
                    <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }} data-framer-background-image-wrapper="true">
                      <img
                        src="/images/toppers/garima-portrait.jpg"
                        alt="Garima Lohia AIR 2"
                        style={{
                          display: "block",
                          width: "100%",
                          height: "100%",
                          borderRadius: "inherit",
                          objectPosition: "center",
                          objectFit: "cover"
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Floating Italic Sticker Tag */}
                <div className="framer-1mea7k1" data-border="true" data-framer-name="Tag">
                  <div className="framer-1vm7ru4" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
                    <p className="framer-text framer-styles-preset-otdcmf" dir="auto">
                      127+ Top 1% Benchmark (Garima AIR 2)
                    </p>
                  </div>
                </div>
              </div>

              <div className="framer-1xx0ung" data-framer-name="Text Stack">
                <div className="framer-ftse5n" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
                  <h3
                    className="framer-text framer-styles-preset-lt8qp6"
                    dir="auto"
                    style={{
                      "--framer-text-alignment": "left",
                      color: "var(--token-b831fea7-8dea-4517-a94d-beb21e51e3da, rgb(110, 95, 22))"
                    } as React.CSSProperties}
                  >
                    GS Paper 2: Polity & Governance
                  </h3>
                </div>
                <div className="framer-17uqwfd" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
                  <p
                    className="framer-text framer-styles-preset-1bcubwk"
                    dir="auto"
                    style={{
                      "--framer-text-alignment": "left",
                      color: "var(--token-b831fea7-8dea-4517-a94d-beb21e51e3da, rgb(110, 95, 22))"
                    } as React.CSSProperties}
                  >
                    Garima Lohia scored 127 in GS2 purely through self-study in Buxar. Structure every 15-marker with landmark Supreme Court precedents (S.R. Bommai, Nabam Rebia) and Sarkaria vs Punchhi commission comparative tables.
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    href="/content/how-to-score-120-plus-in-gs2"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#6E5F16] hover:underline"
                  >
                    <span>Read GS2 Case Law Blueprint</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Big Image */}
            <div className="framer-1c5ifez" data-framer-name="Image" style={{ opacity: 1, transform: "none" }}>
              <div className="ssr-variant">
                <div className="framer-yr3fxk" data-framer-name="(change)">
                  <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }} data-framer-background-image-wrapper="true">
                    <img
                      src="/images/toppers/garima-lohia.jpg"
                      alt="Garima Lohia GS2 answer booklet"
                      style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        borderRadius: "inherit",
                        objectPosition: "center top",
                        objectFit: "cover"
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SET 3: GS4 (Ice Blue Background #EBF8FF) */}
          <div className="framer-4m0nkz" data-framer-name="Goal 3">
            {/* Left Big Image */}
            <div className="framer-8l9grc" data-framer-name="Image" style={{ opacity: 1, transform: "none" }}>
              <div className="ssr-variant">
                <div className="framer-163el3z" data-framer-name="(change)">
                  <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }} data-framer-background-image-wrapper="true">
                    <img
                      src="/images/toppers/ayan-jain.jpg"
                      alt="Ayan Jain GS4 answer booklet"
                      style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        borderRadius: "inherit",
                        objectPosition: "center top",
                        objectFit: "cover"
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Info Stack */}
            <div className="framer-1elxywy" data-framer-name="Info Stack" style={{ opacity: 1, transform: "none" }}>
              <div className="framer-1d9nj1y" data-border="true" data-framer-name="Image">
                <div className="ssr-variant">
                  <div className="framer-82u432" data-framer-name="(change)">
                    <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }} data-framer-background-image-wrapper="true">
                      <img
                        src="/images/toppers/ayan-portrait.jpg"
                        alt="Ayan Jain AIR 16"
                        style={{
                          display: "block",
                          width: "100%",
                          height: "100%",
                          borderRadius: "inherit",
                          objectPosition: "center",
                          objectFit: "cover"
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Floating Italic Sticker Tag */}
                <div className="framer-1kudzjx" data-border="true" data-framer-name="Tag">
                  <div className="framer-9z517m" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
                    <p className="framer-text framer-styles-preset-otdcmf" dir="auto">
                      122+ High Ethics Benchmark (Ayan AIR 16)
                    </p>
                  </div>
                </div>
              </div>

              <div className="framer-jreqb" data-framer-name="Text Stack">
                <div className="framer-133c74n" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
                  <h3
                    className="framer-text framer-styles-preset-lt8qp6"
                    dir="auto"
                    style={{
                      "--framer-text-alignment": "left",
                      color: "var(--token-eff9db75-30f0-4c7d-a7af-eaa94d6dc6ea, rgb(22, 82, 110))"
                    } as React.CSSProperties}
                  >
                    GS Paper 4: Ethics & Case Studies
                  </h3>
                </div>
                <div className="framer-38lf6j" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
                  <p
                    className="framer-text framer-styles-preset-1bcubwk"
                    dir="auto"
                    style={{
                      "--framer-text-alignment": "left",
                      color: "var(--token-eff9db75-30f0-4c7d-a7af-eaa94d6dc6ea, rgb(22, 82, 110))"
                    } as React.CSSProperties}
                  >
                    Ayan Jain (former IPS) scored 122 in GS4 by replacing generic moral philosophizing with 2×2 stakeholder impact matrices, Rawlsian justice frameworks, and concrete 30-day administrative SOPs.
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    href="/content/how-to-score-100-plus-in-gs4"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#16526E] hover:underline"
                  >
                    <span>Read GS4 Ethics SOPs</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION 4: IMPACTS -> VERIFIED GAZETTE RECORDS WITH ROTATING RIBBON
───────────────────────────────────────────────────────────── */
export function AltruistGazetteRecords() {
  const records = [
    {
      title: "Ishita Kishore · AIR 01",
      sticker: "313 PSIR Record (5-Yr Peak)",
      role: "IAS · Uttar Pradesh Cadre",
      img: "/images/toppers/ishita-kishore.jpg",
      badge: "Roll No. 1910080460"
    },
    {
      title: "Garima Lohia · AIR 02",
      sticker: "141 Highest Essay in CSE 2022",
      role: "IAS · Bihar Cadre",
      img: "/images/toppers/garima-lohia.jpg",
      badge: "Roll No. 1910102924"
    },
    {
      title: "Ayan Jain · AIR 16",
      sticker: "298 Maths Record (Engineering Peak)",
      role: "IAS · Madhya Pradesh Cadre",
      img: "/images/toppers/ayan-jain.jpg",
      badge: "Roll No. 1040520"
    }
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
                opacity: 1
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
              style={{ "--framer-text-alignment": "left" } as React.CSSProperties}
            >
              Verified Results We Proudly Archive
            </h2>
          </div>

          <div className="framer-6iv1f1" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
            <p
              className="framer-text framer-styles-preset-1t286ig"
              dir="auto"
              style={{ "--framer-text-alignment": "left" } as React.CSSProperties}
            >
              Every marksheet and answer booklet indexed here has been verified against official Union Public Service Commission gazette notifications.
            </p>
          </div>
        </div>

        {/* 3 Impact Cards */}
        <div className="framer-1rsuefy" style={{ display: "flex", position: "relative" }}>
          <ul
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
              width: "100%",
              padding: 0,
              margin: 0,
              listStyle: "none"
            }}
          >
            {records.map((r, i) => (
              <li key={i} className="ticker-item" style={{ listStyle: "none" }}>
                <div
                  className="framer-1a0968r"
                  data-framer-name={`Impact ${i+1}`}
                  style={{ opacity: 1, transform: "none", position: "relative" }}
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
                            objectFit: "cover"
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

                  {/* Bottom Inset Label */}
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs rounded-[10px] p-3 border border-black/5 shadow-xs">
                    <p className="font-bold text-black text-sm">{r.title}</p>
                    <p className="text-xs text-black/60 font-medium mt-0.5">{r.role} · {r.badge}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Rotating Ribbon Underneath (Criss-crossing at +19deg with reverse glide) */}
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

/* ─────────────────────────────────────────────────────────────
   SECTION 5: TESTIMONIALS (SPLIT SLIDER ON #DEEFF8 SKY BLUE)
───────────────────────────────────────────────────────────── */
export function AltruistTestimonials() {
  const [slide, setSlide] = useState(0);

  const testimonials = [
    {
      quote: "Studying Ishita Kishore's actual 42-page evaluated GS1 copy changed how I format geography questions. Seeing how she drew micro-catchment cross-sections got me an extra 18 marks in my test series.",
      author: "Pooja Deshmukh",
      role: "Mains 2024 Candidate, New Delhi",
      img: "/images/toppers/ishita-portrait.jpg"
    },
    {
      quote: "The marks database is the only place online where you can compare written vs interview marks across 271+ toppers without marketing noise. It showed me exactly where the 100-mark cutoff margin lies.",
      author: "Rahul Varma",
      role: "Selected Candidate (IRTS), Maharashtra",
      img: "/images/toppers/ayan-portrait.jpg"
    },
    {
      quote: "Garima Lohia's GS2 copy proved to me that you don't need Delhi classroom coaching to score 127 in polity. Her tabular Punchhi vs Sarkaria commission structure became my default Mains format.",
      author: "Amitabh Sinha",
      role: "Self-Study Aspirant, Patna",
      img: "/images/toppers/garima-portrait.jpg"
    }
  ];

  const curr = testimonials[slide];

  const prev = () => setSlide((s) => (s === 0 ? testimonials.length - 1 : s - 1));
  const next = () => setSlide((s) => (s === testimonials.length - 1 ? 0 : s + 1));

  return (
    <section
      data-name="Testimonial - Section"
      className="framer-M7UUm framer-xhscK framer-AB6d5 framer-t3gz3r framer-v-t3gz3r"
      data-framer-name="Desktop"
      style={{
        backgroundColor: "var(--token-aa1fdafa-3658-4ff4-91fe-60ad3074fde3, rgb(222, 239, 248))",
        width: "100%",
        opacity: 1
      }}
    >
      <div className="framer-c1fmvg" data-framer-name="Content Stack" style={{ opacity: 1 }}>
        <div className="framer-pgcbqy" data-framer-name="Header" style={{ opacity: 1 }}>
          <div className="framer-b0t5rs-container" style={{ opacity: 1 }}>
            <div
              className="framer-C5DvW framer-c8VI7 framer-ultdxd framer-v-tq4stv"
              data-framer-name="Variant 2"
              style={{
                backgroundColor: "var(--token-5e116048-a615-49a6-97d7-2d659f41a725, rgb(255, 255, 255))",
                borderRadius: "10px",
                opacity: 1
              }}
            >
              <div className="framer-1csgvwc" data-framer-component-type="RichTextContainer" style={{ transform: "none", opacity: 1 }}>
                <p className="framer-text framer-styles-preset-ajns0" dir="auto">Aspirant Voices</p>
              </div>
            </div>
          </div>

          <div
            className="framer-uc8igs"
            data-framer-component-type="RichTextContainer"
            style={{
              "--extracted-1of0zx5": "var(--token-eff9db75-30f0-4c7d-a7af-eaa94d6dc6ea, rgb(22, 82, 110))",
              transform: "none",
              opacity: 1
            } as React.CSSProperties}
          >
            <h2
              className="framer-text framer-styles-preset-dw9di9"
              dir="auto"
              style={{
                "--framer-text-alignment": "left",
                color: "var(--token-eff9db75-30f0-4c7d-a7af-eaa94d6dc6ea, rgb(22, 82, 110))"
              } as React.CSSProperties}
            >
              Trusted by Serious Civil Services Aspirants
            </h2>
          </div>

          <div
            className="framer-kc3f8m"
            data-framer-component-type="RichTextContainer"
            style={{
              "--extracted-r6o4lv": "var(--token-892ed62d-73f0-47f6-b077-784b9a20f71e, rgba(22, 82, 110, 0.6))",
              transform: "none",
              opacity: 1
            } as React.CSSProperties}
          >
            <p
              className="framer-text framer-styles-preset-1t286ig"
              dir="auto"
              style={{
                "--framer-text-alignment": "left",
                color: "var(--token-892ed62d-73f0-47f6-b077-784b9a20f71e, rgba(22, 82, 110, 0.6))"
              } as React.CSSProperties}
            >
              How candidates across 28 states use UPSCPrepNotes to eliminate guesswork in their Mains preparation.
            </p>
          </div>
        </div>

        {/* Navigation Arrow Buttons */}
        <div className="framer-ctoq1e" data-framer-name="Nav Button" style={{ opacity: 1 }}>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous testimonial"
            className="framer-9kt5ed hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
            style={{
              backgroundColor: "var(--token-5e116048-a615-49a6-97d7-2d659f41a725, rgb(255, 255, 255))",
              borderRadius: "10px",
              opacity: 1
            }}
          >
            <ChevronLeft size={20} className="text-[#16526e]" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="framer-3ygyhj hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
            style={{
              backgroundColor: "var(--token-5e116048-a615-49a6-97d7-2d659f41a725, rgb(255, 255, 255))",
              borderRadius: "10px",
              opacity: 1
            }}
          >
            <ChevronRight size={20} className="text-[#16526e]" />
          </button>
        </div>

        {/* Testimonials Slide Container */}
        <div className="framer-1xpvl48" data-framer-name="Testimonials Cards" style={{ opacity: 1 }}>
          <div className="framer-1s8m9oq-container" style={{ opacity: 1, transform: "none" }}>
            <div
              className="framer-gSwfM framer-ZfgoP framer-vWQMs framer-1ltd01h framer-v-1ltd01h"
              data-framer-name="Variant 1"
              style={{ width: "100%", borderRadius: "10px", opacity: 1 }}
            >
              {/* Left Content Card */}
              <div
                className="framer-1a5wn3v"
                data-framer-name="Testimonials Content"
                style={{
                  backgroundColor: "var(--token-4a66cce6-00d5-40f7-836a-7512ad740f85, rgb(255, 255, 252))",
                  borderRadius: "10px",
                  opacity: 1
                }}
              >
                <div
                  className="framer-17qqi6w"
                  data-framer-component-type="RichTextContainer"
                  style={{
                    "--extracted-1lwpl3i": "var(--token-85830766-d92e-49aa-9ef0-6851da79996e, rgb(17, 110, 153))",
                    transform: "none",
                    opacity: 1
                  } as React.CSSProperties}
                >
                  <h5
                    className="framer-text framer-styles-preset-1a3qyz6"
                    dir="auto"
                    style={{
                      color: "var(--token-85830766-d92e-49aa-9ef0-6851da79996e, rgb(17, 110, 153))",
                      fontSize: "18px",
                      lineHeight: "1.5",
                      fontWeight: 600
                    }}
                  >
                    "{curr.quote}"
                  </h5>
                </div>

                <div
                  className="framer-slqsdf"
                  data-border="true"
                  data-framer-name="Reviewer Info"
                  style={{
                    borderTop: "1px solid rgba(0, 0, 0, 0.08)",
                    paddingTop: "12px",
                    marginTop: "16px",
                    opacity: 1
                  }}
                >
                  <div className="framer-xlni5a" data-framer-component-type="RichTextContainer" style={{ opacity: 1, transform: "none" }}>
                    <p className="font-bold text-[#16526e] text-sm">{curr.author}</p>
                    <p className="text-xs text-[#16526e]/70 mt-0.5">{curr.role}</p>
                  </div>
                </div>
              </div>

              {/* Right Image */}
              <div className="framer-1b5ywe7" data-framer-name="Image" style={{ borderRadius: "10px", opacity: 1 }}>
                <div
                  className="framer-e2izrf"
                  data-framer-name="(change)"
                  style={{
                    mask: "linear-gradient(rgba(0, 0, 0, 0.8) 0%, rgb(0, 0, 0) 100%)",
                    opacity: 1
                  }}
                >
                  <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }} data-framer-background-image-wrapper="true">
                    <img
                      src={curr.img}
                      alt={curr.author}
                      style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        borderRadius: "inherit",
                        objectPosition: "center",
                        objectFit: "cover"
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION 6: SCHEDULE -> OPTIONAL SUBJECT BENCHMARKS
───────────────────────────────────────────────────────────── */
export function AltruistOptionalBenchmarks() {
  const benchmarks = [
    {
      badge: "PSIR · ★ 313 Record",
      title: "Political Science & IR Benchmark",
      location: "ForumIAS MGP · 5-Yr Record",
      desc: "Classical Western & Indian political thought in Paper 1, grounded in foreign policy whitepapers.",
      img: "/images/altruist/event_1.webp",
      href: "/optional/psir"
    },
    {
      badge: "Anthropology · 298 Benchmark",
      title: "Anthropology Scoring Benchmark",
      location: "Vajiram & Ravi · Top 0.1%",
      desc: "Physical anthropology fossil sketches in Paper 1, Xaxa Committee tribal policy in Paper 2.",
      img: "/images/altruist/event_2.webp",
      href: "/optional/anthropology"
    },
    {
      badge: "Sociology · 295 Benchmark",
      title: "Sociology Paper Analysis",
      location: "Vision IAS · High GS-2 Link",
      desc: "Empirical field studies (MN Srinivas, Andre Beteille) paired with demographic census trends.",
      img: "/images/altruist/event_3.webp",
      href: "/optional/sociology"
    },
    {
      badge: "Mathematics · 298 Record",
      title: "Mathematics Precision Standard",
      location: "Vision IAS · Engineering Top",
      desc: "Uncompromising calculation speed. Solved entire 10-year question banks under strict 3-hour timer.",
      img: "/images/altruist/event_4.webp",
      href: "/optional/mathematics"
    }
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
                opacity: 1
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
              style={{ "--framer-text-alignment": "left" } as React.CSSProperties}
            >
              Highest Recorded Optional Scores
            </h2>
          </div>

          <div className="framer-gow4qv" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
            <p
              className="framer-text framer-styles-preset-1t286ig"
              dir="auto"
              style={{ "--framer-text-alignment": "left" } as React.CSSProperties}
            >
              Historical peak benchmarks and structural scoring nuances across premier optional subjects.
            </p>
          </div>
        </div>

        {/* Benchmarks Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10 w-full">
          {benchmarks.map((b, idx) => (
            <Link
              key={idx}
              href={b.href}
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
                padding: "16px"
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
                  zIndex: 10
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
                  width: "fit-content"
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
                  zIndex: 1
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
                    objectFit: "cover"
                  }}
                />
                <div
                  style={{
                    background: "linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.55) 100%)",
                    position: "absolute",
                    inset: 0
                  }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION 7: FAQ ACCORDION
───────────────────────────────────────────────────────────── */
export function AltruistFaq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "Where are the marksheets and answer copies sourced from?",
      a: "All marksheets are verified against official Union Public Service Commission gazette notifications and candidate roll numbers. Answer copies are sourced from candidate test submissions and institutional test-series evaluations from premier academies including ForumIAS, Vision IAS, Drishti IAS, and Vajiram & Ravi."
    },
    {
      q: "Can I download handwritten answer sheets for my optional subject?",
      a: "Yes. We host evaluated answer copies for popular optionals including PSIR (Political Science), Anthropology, Sociology, Mathematics, Geography, History, and Public Administration."
    },
    {
      q: "Are the digital downloads instant?",
      a: "Yes. All compilations, answer copies, and sample dossiers are delivered instantly as high-resolution searchable PDFs directly to your screen and email inbox."
    },
    {
      q: "How frequently is the marksheet archive updated?",
      a: "The archive is updated within 48 hours of every official UPSC CSE result declaration and marksheet notification by the Union Public Service Commission."
    },
    {
      q: "Is there an AI mentor to help me analyze topper answers?",
      a: "Yes. Our Ask AI Mentor allows you to query syllabus topics, compare how different rankers structured 15-marker intros, and extract high-yield case studies and diagrams directly from topper copies."
    }
  ];

  return (
    <section className="framer-1ibul1d" data-framer-name="FAQ - Section" id="faq">
      <div className="framer-1ums32s" data-framer-name="Content Stack">
        <div className="framer-1flfsew" data-framer-name="Header Stack">
          <div className="framer-1lw3nt5-container">
            <div
              className="framer-C5DvW framer-c8VI7 framer-ultdxd framer-v-ultdxd"
              data-framer-name="Variant 1"
              style={{
                backgroundColor: "var(--token-aa1fdafa-3658-4ff4-91fe-60ad3074fde3, rgb(222, 239, 248))",
                borderRadius: "10px",
                opacity: 1
              }}
            >
              <div className="framer-1csgvwc" data-framer-component-type="RichTextContainer" style={{ transform: "none", opacity: 1 }}>
                <p className="framer-text framer-styles-preset-ajns0" dir="auto">FAQ</p>
              </div>
            </div>
          </div>

          <div className="framer-1gsyge9" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
            <h2
              className="framer-text framer-styles-preset-dw9di9"
              dir="auto"
              style={{ "--framer-text-alignment": "center" } as React.CSSProperties}
            >
              Our Frequently Asked Questions
            </h2>
          </div>

          <div className="framer-1fnbf36" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
            <p
              className="framer-text framer-styles-preset-1t286ig"
              dir="auto"
              style={{ "--framer-text-alignment": "center" } as React.CSSProperties}
            >
              We’ve answered the most common questions about marksheet verification and answer copies.
            </p>
          </div>
        </div>

        {/* Accordions Stack */}
        <div className="framer-1eb4h3n" data-framer-name="FAQ Stack">
          {faqs.map((f, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="ssr-variant">
                <div className="framer-19wa32x-container" style={{ opacity: 1, transform: "none" }}>
                  <div
                    className="framer-Ca18r framer-vWQMs framer-hXo03 framer-ar32md framer-v-ar32md"
                    data-framer-name={isOpen ? "Open" : "Closed"}
                    style={{
                      backgroundColor: "var(--token-a7cc2964-d8ca-4e2b-a4dc-bf1002d1db68, rgb(235, 248, 255))",
                      width: "100%",
                      borderRadius: "15px",
                      opacity: 1,
                      cursor: "pointer"
                    }}
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                  >
                    <div className="framer-1hfky2g" data-framer-name="Content" style={{ opacity: 1 }}>
                      <div className="framer-16f7jjp" data-framer-name="Question" style={{ opacity: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div className="framer-nl732y" data-framer-name="Text" style={{ opacity: 1, flex: 1, paddingRight: "16px" }}>
                          <p className="font-bold text-black text-[16px] sm:text-[17px] leading-snug">
                            {f.q}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="framer-1iphdoh"
                          data-framer-name="Icon"
                          style={{
                            borderRadius: "100px",
                            opacity: 1,
                            backgroundColor: isOpen ? "#16526e" : "#000",
                            width: "32px",
                            height: "32px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            transition: "transform 0.2s"
                          }}
                        >
                          {isOpen ? <Minus size={16} className="text-white" /> : <Plus size={16} className="text-white" />}
                        </button>
                      </div>

                      {isOpen && (
                        <div
                          className="framer-1kltmf3 mt-3 pt-3 border-t border-black/5 animate-in fade-in duration-200"
                          style={{ opacity: 1, transform: "none" }}
                        >
                          <p className="text-sm text-black/75 leading-relaxed font-medium">
                            {f.a}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION 8: WANT TO VOLUNTEER -> FREE STARTER PACK (SOLID BLACK #000)
───────────────────────────────────────────────────────────── */
export function AltruistStarterPackLead() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [optional, setOptional] = useState("PSIR");
  const [targetYear, setTargetYear] = useState("CSE 2026");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/hero-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          optional,
          notes: targetYear,
          source: "altruist_starter_pack_lead"
        })
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Failed to register. Please try again.");
        setLoading(false);
        return;
      }
      setSubmitted(true);
      setLoading(false);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <section className="framer-1o56bo8" data-framer-name="Join Us - Section" id="starter-pack" style={{ position: "relative", overflow: "hidden", width: "100%" }}>
      {/* Background Cloud Image (Exact Altruist Architecture) */}
      <div className="framer-1a3k8ey" data-framer-name="Image (change)">
        <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }} data-framer-background-image-wrapper="true">
          <img
            src="/images/altruist/starter_pack.webp"
            alt="UPSC Mains Starter Pack Cloud Background"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              borderRadius: "inherit",
              objectPosition: "center",
              objectFit: "cover"
            }}
          />
        </div>
      </div>

      <div className="framer-19zbbl0" data-framer-name="Content Stack">
        {/* Left Column: Value Proposition */}
        <div className="framer-1m0wvko" data-framer-name="Text Stack">
          <div className="framer-8tyfgf" data-framer-name="Header Stack">
            <div className="framer-1r4shf6-container">
              <div
                className="framer-C5DvW framer-c8VI7 framer-ultdxd framer-v-ultdxd"
                data-framer-name="Variant 1"
                style={{
                  backgroundColor: "var(--token-aa1fdafa-3658-4ff4-91fe-60ad3074fde3, rgb(222, 239, 248))",
                  borderRadius: "10px",
                  opacity: 1
                }}
              >
                <div className="framer-1csgvwc" data-framer-component-type="RichTextContainer" style={{ transform: "none", opacity: 1 }}>
                  <p className="framer-text framer-styles-preset-ajns0" dir="auto">Instant Access</p>
                </div>
              </div>
            </div>

            <div className="framer-18hd2h8" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
              <h2
                className="framer-text framer-styles-preset-dw9di9"
                dir="auto"
                style={{
                  "--framer-text-alignment": "left",
                  color: "var(--token-5e116048-a615-49a6-97d7-2d659f41a725, rgb(255, 255, 255))"
                } as React.CSSProperties}
              >
                Claim Your Free UPSC Mains Starter Pack
              </h2>
            </div>

            <div className="framer-1jgi74h" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
              <p
                className="framer-text framer-styles-preset-1t286ig"
                dir="auto"
                style={{
                  "--framer-text-alignment": "left",
                  color: "var(--token-4bc1e64e-bf8f-40de-bd4d-66486502f606, rgba(255, 255, 255, 0.8))"
                } as React.CSSProperties}
              >
                Get 3 high-scoring evaluated answer copies, 2022–2025 cutoff trend tracker, and 20 free AI mentor queries delivered instantly.
              </p>
            </div>
          </div>

          <div className="framer-8g1gxn" data-framer-name="Bullet Points">
            <div className="framer-jwgud0" data-framer-name="Point 1" style={{ opacity: 1, transform: "none" }}>
              <div className="framer-XyDms framer-1prnl65 flex items-center justify-center">
                <Check size={14} className="text-[#16526e]" />
              </div>
              <div className="framer-1i63fjw" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
                <p
                  className="framer-text framer-styles-preset-1t286ig"
                  dir="auto"
                  style={{
                    "--framer-text-alignment": "left",
                    color: "var(--token-eff9db75-30f0-4c7d-a7af-eaa94d6dc6ea, rgb(22, 82, 110))",
                    fontWeight: 600
                  } as React.CSSProperties}
                >
                  3 genuine evaluated topper booklets (GS1, GS2, Ethics)
                </p>
              </div>
            </div>

            <div className="framer-1btolmk" data-framer-name="Point 2" style={{ opacity: 1, transform: "none" }}>
              <div className="framer-XyDms framer-1ebrjr7 flex items-center justify-center">
                <Check size={14} className="text-[#16526e]" />
              </div>
              <div className="framer-u3rdvf" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
                <p
                  className="framer-text framer-styles-preset-1t286ig"
                  dir="auto"
                  style={{
                    "--framer-text-alignment": "left",
                    color: "var(--token-eff9db75-30f0-4c7d-a7af-eaa94d6dc6ea, rgb(22, 82, 110))",
                    fontWeight: 600
                  } as React.CSSProperties}
                >
                  Complete 2022–2025 paper-wise cutoff trend tracker
                </p>
              </div>
            </div>

            <div className="framer-fn58fs" data-framer-name="Point 3" style={{ opacity: 1, transform: "none" }}>
              <div className="framer-XyDms framer-14ijgwy flex items-center justify-center">
                <Check size={14} className="text-[#16526e]" />
              </div>
              <div className="framer-6n5jvk" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
                <p
                  className="framer-text framer-styles-preset-1t286ig"
                  dir="auto"
                  style={{
                    "--framer-text-alignment": "left",
                    color: "var(--token-eff9db75-30f0-4c7d-a7af-eaa94d6dc6ea, rgb(22, 82, 110))",
                    fontWeight: 600
                  } as React.CSSProperties}
                >
                  Instant PDF download with zero marketing spam
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Clean White Form Card */}
        <div className="framer-5a15t" data-border="true" data-framer-name="Form Card" style={{ opacity: 1, transform: "none" }}>
          {submitted ? (
            <div className="p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#16526e] text-white">
                <Check size={24} />
              </div>
              <h3 className="mt-4 text-xl font-bold text-black">Your Starter Pack is Ready!</h3>
              <p className="mt-2 text-sm text-black/70">
                We have registered <span className="font-semibold text-black">{email}</span>. Check your inbox for the download link.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-6 inline-flex items-center justify-center rounded-[10px] bg-black px-6 py-2.5 text-sm font-semibold text-white"
              >
                Register Another Email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="framer-jnu8lh">
              {error && (
                <div className="mb-3 rounded-[8px] bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-700">
                  {error}
                </div>
              )}

              <label className="framer-4tlmtu">
                <div className="framer-1dnemg2" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
                  <p className="framer-text framer-styles-preset-1n9fr5k" dir="auto" style={{ color: "rgba(0, 0, 0, 0.8)", fontWeight: 600 }}>
                    Full Name
                  </p>
                </div>
                <div className="framer-form-text-input framer-form-input-wrapper framer-f08w4a framer-form-text-input-type">
                  <input
                    type="text"
                    required
                    name="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aditi Sharma"
                    className="framer-form-input"
                  />
                </div>
              </label>

              <div className="framer-kz0hbl" data-framer-name="Form Stack">
                <label className="framer-10gc9bz">
                  <div className="framer-8ffz8e" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
                    <p className="framer-text framer-styles-preset-1n9fr5k" dir="auto" style={{ color: "rgba(0, 0, 0, 0.8)", fontWeight: 600 }}>
                      Email Address
                    </p>
                  </div>
                  <div className="framer-form-text-input framer-form-input-wrapper framer-nunw1w">
                    <input
                      type="email"
                      required
                      name="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="aditi@example.com"
                      className="framer-form-input"
                    />
                  </div>
                </label>

                <label className="framer-171y10i" data-framer-name="Phone Number">
                  <div className="framer-1syx8q3" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
                    <p className="framer-text framer-styles-preset-1n9fr5k" dir="auto" style={{ color: "rgba(0, 0, 0, 0.8)", fontWeight: 600 }}>
                      Phone / WhatsApp
                    </p>
                  </div>
                  <div className="framer-form-text-input framer-form-input-wrapper framer-1plwbfh">
                    <input
                      type="tel"
                      required
                      name="Phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="framer-form-input"
                    />
                  </div>
                </label>
              </div>

              <label className="framer-1j0c49m" data-framer-name="Location">
                <div className="framer-1k14746" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
                  <p className="framer-text framer-styles-preset-1n9fr5k" dir="auto" style={{ color: "rgba(0, 0, 0, 0.8)", fontWeight: 600 }}>
                    Target Optional Subject
                  </p>
                </div>
                <div className="framer-form-input-wrapper framer-form-select-wrapper framer-1jbor9k">
                  <select
                    name="Optional"
                    value={optional}
                    onChange={(e) => setOptional(e.target.value)}
                    className="framer-form-input"
                  >
                    <option value="PSIR">PSIR (Political Science & IR)</option>
                    <option value="Anthropology">Anthropology</option>
                    <option value="Sociology">Sociology</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Geography">Geography</option>
                    <option value="History">History</option>
                    <option value="Public Administration">Public Administration</option>
                    <option value="Philosophy">Philosophy</option>
                    <option value="Other">Other Optional</option>
                  </select>
                </div>
              </label>

              <label className="framer-sc0nho" data-framer-name="Message">
                <div className="framer-pdinfd" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
                  <p className="framer-text framer-styles-preset-1n9fr5k" dir="auto" style={{ color: "rgba(0, 0, 0, 0.8)", fontWeight: 600 }}>
                    Target Examination Year & Prep Stage
                  </p>
                </div>
                <div className="framer-form-text-input framer-form-input-wrapper framer-14h6jqc framer-form-textarea-input-type">
                  <textarea
                    name="TargetYear"
                    value={targetYear}
                    onChange={(e) => setTargetYear(e.target.value)}
                    placeholder="e.g. UPSC CSE 2026 (1st attempt, preparing full-time)"
                    className="framer-form-input"
                  />
                </div>
              </label>

              <div className="ssr-variant mt-2">
                <div className="framer-1agvy3h-container">
                  <button
                    type="submit"
                    disabled={loading}
                    className="framer-cKbYZ framer-pqx4O framer-iu68iz framer-v-iu68iz cursor-pointer transition hover:opacity-90 disabled:opacity-50"
                    data-framer-name="Default"
                    style={{
                      backgroundColor: "var(--token-eff9db75-30f0-4c7d-a7af-eaa94d6dc6ea, rgb(22, 82, 110))",
                      width: "100%",
                      borderRadius: "10px",
                      opacity: 1,
                      padding: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <p className="font-bold text-white text-sm">
                      {loading ? "Registering..." : "Claim Free Starter Pack (Instant PDF)"}
                    </p>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>


      {/* Rotating Volunteer SVG Ribbon (Criss-crossing back at -18deg with smooth glide) */}
      <AnimatedCurvedRibbon
        id="ribbon-starter"
        unitText="FREE STARTER PACK • 3 EVALUATED COPIES • 2026 CUTOFF TRACKER • ZERO SPAM • "
        angle={-18}
        direction={1}
        baseSpeed={0.8}
        scrollSpeed={0.5}
        containerClass="framer-v0aev5-container"
        containerStyle={{ transform: "translateY(-50%) rotate(-18deg)" }}
        svgWidth={2032}
        svgHeight={300}
        viewBox="0 0 2032 300"
        pathD="M 101.5 150 L 330.1 198.5 L 787.4 101.5 L 1244.6 198.5 L 1701.9 101.5 L 2184.58 150"
        strokeColor="rgb(255, 255, 255)"
        textColor="rgb(37, 91, 115)"
      />
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION 9: NOTES FROM COMMUNITIES + OFFICIAL SURVEY OF INDIA MAP
───────────────────────────────────────────────────────────── */
export function AltruistCommunityVoices() {
  const notes = [
    {
      text: "Having Ishita Kishore's 313 PSIR paper broken down line by line removed all the anxiety about how to cite thinkers in Paper 1 Section A.",
      loc: "Aspirant, Old Rajinder Nagar, Delhi",
      bg: "var(--token-da0e9810-0881-4867-bf86-d2442ee77e28, rgb(250, 219, 255))",
      rot: "rotate(0deg)"
    },
    {
      text: "Preparing from Buxar without classroom coaching felt lonely until I saw Garima Lohia's GS2 scorecard and realized self-study with landmark judgments works.",
      loc: "Self-Study Candidate, Bihar",
      bg: "var(--token-b310f9bd-566a-49a6-a0be-aa5b1bb3c475, rgb(255, 234, 209))",
      rot: "rotate(-1deg)"
    },
    {
      text: "The ethics stakeholder matrices derived from Ayan Jain's copy helped me clear my test series plateau in Pune within three weeks.",
      loc: "Mains Aspirant, Pune, Maharashtra",
      bg: "var(--token-190aa3a9-ebc3-4655-911e-ab1b9b0c5835, rgb(249, 250, 227))",
      rot: "rotate(-3deg)"
    },
    {
      text: "The 280+ marksheets database made me realize cutoffs aren't won in Essay alone, but by maintaining a solid 105+ floor across all 4 GS papers.",
      loc: "Candidate, Bengaluru, Karnataka",
      bg: "var(--token-4832e1d9-0ba2-4ca2-b71c-210f580f47f1, rgb(221, 209, 255))",
      rot: "rotate(3deg)"
    }
  ];

  return (
    <section className="framer-pc7u1z" data-framer-name="CTA Section" style={{ backgroundColor: "var(--token-4a66cce6-00d5-40f7-836a-7512ad740f85, rgb(255, 255, 252))", padding: "90px 40px 60px", width: "100%", position: "relative" }}>
      <div className="framer-15730zy" data-framer-name="Content Stack">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-8">
          <span className="rounded-[10px] bg-[#EEF7F2] border border-[#D2E7D9] px-3.5 py-1 text-xs font-bold text-[#1A4D32] mb-3">
            Geographic Reach
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight leading-tight">
            Voices From Aspirants Across India
          </h2>
          <p className="mt-3 text-base text-black/70 leading-relaxed max-w-xl">
            Every marksheet decode reaches serious candidates across all 28 states and 8 Union Territories.
          </p>
          <div className="mt-5">
            <Link
              href="/toppers"
              className="inline-flex items-center justify-center rounded-[10px] bg-[#16526e] hover:bg-[#114258] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98]"
            >
              Browse 280+ Verified Marksheets
            </Link>
          </div>
        </div>

        {/* Interactive Survey of India Vector Map */}
        <div className="w-full max-w-4xl mx-auto my-10 bg-white/60 rounded-[18px] p-4 sm:p-6 border border-black/5 shadow-xs">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-black/50 mb-4">
            Interactive Geographic Distribution: 28 States & 8 Union Territories
          </p>
          <IndiaCommunityMap />
        </div>

        {/* Staggered Pastel Sticky Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-6">
          {notes.map((n, i) => (
            <div
              key={i}
              className="p-5 rounded-[10px] shadow-xs transition-transform duration-200 hover:scale-[1.02] flex flex-col justify-between"
              style={{
                backgroundColor: n.bg,
                transform: n.rot,
                minHeight: "180px",
                border: "1px solid rgba(0,0,0,0.06)"
              }}
            >
              <p className="text-sm font-medium text-black/85 leading-relaxed">
                "{n.text}"
              </p>
              <div className="mt-4 pt-3 border-t border-black/5">
                <p className="text-xs font-bold text-[#16526e]">{n.loc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION 10: ALTRUIST FOOTER IN #DEEFF8 SOFT BLUE
───────────────────────────────────────────────────────────── */
export function AltruistFooter() {
  return (
    <footer
      className="framer-os1win"
      data-framer-name="Footer"
      style={{
        backgroundColor: "var(--token-aa1fdafa-3658-4ff4-91fe-60ad3074fde3, rgb(222, 239, 248))",
        width: "100%",
        padding: "70px 40px 40px",
        position: "relative"
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 pb-10 border-b border-[#16526e]/15">
          <div className="max-w-sm">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="UPSCPrepNotes Wordmark"
                width={170}
                height={40}
                className="h-[40px] w-auto"
              />
            </Link>
            <p className="mt-3 text-sm text-[#16526e]/80 leading-relaxed font-medium">
              India's civil services archival intelligence repository. 280+ verified marksheets, authentic evaluated answer copies, and data-driven Mains strategies with zero marketing fluff.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12">
            {/* Column 1 */}
            <div>
              <p className="font-bold text-[#16526e] text-sm uppercase tracking-wider mb-4">Official Archive</p>
              <ul className="flex flex-col gap-2.5 text-sm font-medium text-[#116e99]">
                <li><Link href="/toppers" className="hover:text-black transition-colors">Toppers Marksheets</Link></li>
                <li><a href="#impacts" className="hover:text-black transition-colors">Handwritten Copies</a></li>
                <li><a href="#schedule" className="hover:text-black transition-colors">Optional Benchmarks</a></li>
                <li><Link href="/pyq" className="hover:text-black transition-colors">10-Year PYQ Archive</Link></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <p className="font-bold text-[#16526e] text-sm uppercase tracking-wider mb-4">Study Tools</p>
              <ul className="flex flex-col gap-2.5 text-sm font-medium text-[#116e99]">
                <li><Link href="/toppers/marks-database" className="hover:text-black transition-colors">Marks Database</Link></li>
                <li><Link href="/ask" className="hover:text-black transition-colors">Ask AI Mentor</Link></li>
                <li><Link href="/current-affairs" className="hover:text-black transition-colors">Current Affairs Hub</Link></li>
                <li><Link href="/free-materials" className="hover:text-black transition-colors">Free Study Materials</Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <p className="font-bold text-[#16526e] text-sm uppercase tracking-wider mb-4">Curated Store</p>
              <ul className="flex flex-col gap-2.5 text-sm font-medium text-[#116e99]">
                <li><Link href="/store" className="hover:text-black transition-colors">Rankers Strategy PDF</Link></li>
                <li><Link href="/store" className="hover:text-black transition-colors">Answer Copies Bundle</Link></li>
                <li><Link href="/store" className="hover:text-black transition-colors">Government Schemes</Link></li>
                <li><Link href="/store" className="hover:text-black transition-colors">View All Products</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#16526e]/75 font-medium">
          <p>© 2026 UPSCPrepNotes. Independent preparation platform. Not affiliated with UPSC.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-black transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-black transition-colors">Terms of Use</Link>
            <Link href="/disclaimer" className="hover:text-black transition-colors">Gazette Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

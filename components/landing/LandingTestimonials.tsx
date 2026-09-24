"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function LandingTestimonials() {
  const [slide, setSlide] = useState(0);

  const testimonials = [
    {
      quote:
        "Studying Ishita Kishore's actual 42-page evaluated GS1 copy changed how I format geography questions. Seeing how she drew micro-catchment cross-sections got me an extra 18 marks in my test series.",
      author: "Pooja Deshmukh",
      role: "Mains 2024 Candidate, New Delhi",
      img: "/images/toppers/ishita-portrait.jpg",
    },
    {
      quote:
        "The marks database is the only place online where you can compare written vs interview marks across 271+ toppers without marketing noise. It showed me exactly where the 100-mark cutoff margin lies.",
      author: "Rahul Varma",
      role: "Selected Candidate (IRTS), Maharashtra",
      img: "/images/toppers/ayan-portrait.jpg",
    },
    {
      quote:
        "Garima Lohia's GS2 copy proved to me that you don't need Delhi classroom coaching to score 127 in polity. Her tabular Punchhi vs Sarkaria commission structure became my default Mains format.",
      author: "Amitabh Sinha",
      role: "Self-Study Aspirant, Patna",
      img: "/images/toppers/garima-portrait.jpg",
    },
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
        opacity: 1,
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
                opacity: 1,
              }}
            >
              <div
                className="framer-1csgvwc"
                data-framer-component-type="RichTextContainer"
                style={{ transform: "none", opacity: 1 }}
              >
                <p className="framer-text framer-styles-preset-ajns0" dir="auto">
                  Aspirant Voices
                </p>
              </div>
            </div>
          </div>

          <div
            className="framer-uc8igs"
            data-framer-component-type="RichTextContainer"
            style={{
              transform: "none",
              opacity: 1,
            }}
          >
            <h2
              className="framer-text framer-styles-preset-dw9di9"
              dir="auto"
              style={{
                textAlign: "left",
                color: "var(--token-eff9db75-30f0-4c7d-a7af-eaa94d6dc6ea, rgb(22, 82, 110))",
              }}
            >
              Trusted by Serious Civil Services Aspirants
            </h2>
          </div>

          <div
            className="framer-kc3f8m"
            data-framer-component-type="RichTextContainer"
            style={{
              transform: "none",
              opacity: 1,
            }}
          >
            <p
              className="framer-text framer-styles-preset-1t286ig"
              dir="auto"
              style={{
                textAlign: "left",
                color: "var(--token-892ed62d-73f0-47f6-b077-784b9a20f71e, rgba(22, 82, 110, 0.6))",
              }}
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
            className="framer-9kt5ed hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center shadow-xs"
            style={{
              backgroundColor: "var(--token-5e116048-a615-49a6-97d7-2d659f41a725, rgb(255, 255, 255))",
              borderRadius: "10px",
              opacity: 1,
            }}
          >
            <ChevronLeft size={20} className="text-[#16526e]" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="framer-3ygyhj hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center shadow-xs"
            style={{
              backgroundColor: "var(--token-5e116048-a615-49a6-97d7-2d659f41a725, rgb(255, 255, 255))",
              borderRadius: "10px",
              opacity: 1,
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
                  opacity: 1,
                }}
              >
                <div
                  className="framer-17qqi6w"
                  data-framer-component-type="RichTextContainer"
                  style={{
                    transform: "none",
                    opacity: 1,
                  }}
                >
                  <h5
                    className="framer-text framer-styles-preset-1a3qyz6"
                    dir="auto"
                    style={{
                      color: "var(--token-85830766-d92e-49aa-9ef0-6851da79996e, rgb(17, 110, 153))",
                      fontSize: "18px",
                      lineHeight: "1.5",
                      fontWeight: 600,
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
                    opacity: 1,
                  }}
                >
                  <div
                    className="framer-xlni5a"
                    data-framer-component-type="RichTextContainer"
                    style={{ opacity: 1, transform: "none" }}
                  >
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
                    opacity: 1,
                  }}
                >
                  <div
                    style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
                    data-framer-background-image-wrapper="true"
                  >
                    <img
                      src={curr.img}
                      alt={curr.author}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Minus } from "lucide-react";
import { LANDING_FAQS } from "./faqs-data";

export default function LandingFaq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

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
                opacity: 1,
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
              style={{ textAlign: "center" }}
            >
              Frequently Asked Questions
            </h2>
          </div>

          <div className="framer-1fnbf36" data-framer-component-type="RichTextContainer" style={{ transform: "none" }}>
            <p
              className="framer-text framer-styles-preset-1t286ig"
              dir="auto"
              style={{ textAlign: "center" }}
            >
              Clear answers regarding marksheet verification, answer copies, and digital downloads.
            </p>
          </div>
        </div>

        {/* Accordions Stack */}
        <div className="framer-1eb4h3n" data-framer-name="FAQ Stack">
          {LANDING_FAQS.map((f, idx) => {
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
                      cursor: "pointer",
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
                            transition: "transform 0.2s",
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

        <div className="mt-8 flex justify-center">
          <Link
            href="/faq"
            data-track="home-faq-all-link"
            className="text-sm font-bold text-[#16526E] hover:underline"
          >
            See all frequently asked questions →
          </Link>
        </div>
      </div>
    </section>
  );
}

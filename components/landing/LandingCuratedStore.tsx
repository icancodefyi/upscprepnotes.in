import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export default function LandingCuratedStore() {
  const storeProducts = [
    {
      slug: "top-10-rankers-strategy",
      title: "Top 10 Rankers Strategy",
      subtitle: "AIR 1–10 complete strategies & marks deep dives in one searchable PDF",
      location: "Instant PDF Download",
      price: "₹299",
      oldPrice: "₹990",
      tagLabel: "Save 70%",
      img: "https://ik.imagekit.io/impiclabs/products/top-10-rankers-strategy.png?tr=w-600,h-450,f-auto,q-80",
      href: "/store/top-10-rankers-strategy",
      features: ["Paper-wise marks analysis", "Strongest vs weakest papers", "Board interview notes"],
    },
    {
      slug: "answer-copies-compilation",
      title: "Answer Copies Compilation",
      subtitle: "50+ actual handwritten answer sheets from rank holders (GS1–4, Essay)",
      location: "50+ Uncut Copies · Rubrics",
      price: "₹799",
      oldPrice: "₹1,999",
      tagLabel: "Save 60%",
      img: "https://ik.imagekit.io/impiclabs/products/answer-copies-compilation.png?tr=w-600,h-450,f-auto,q-80",
      href: "/store/answer-copies-compilation",
      features: ["Genuine evaluated exam hall booklets", "Examiner margins & rubrics", "All 4 GS Papers + Essay"],
    },
    {
      slug: "government-schemes-compilation",
      title: "Government Schemes Compendium",
      subtitle: "All ministry-wise schemes with objectives, budget, and key facts",
      location: "Updated for CSE 2025/26",
      price: "₹99",
      oldPrice: "₹199",
      tagLabel: "Save 50%",
      img: "https://ik.imagekit.io/impiclabs/products/government-schemes-compilation.png?tr=w-600,h-450,f-auto,q-80",
      href: "/store/government-schemes-compilation",
      features: ["Organized by Ministry & Sector", "Prelims facts & Mains data", "Annual budgetary allocations"],
    },
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
                opacity: 1,
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
              style={{ textAlign: "left" }}
            >
              Searchable, high-resolution digital compilations distilled from authentic UPSC gazette records and genuine test booklets.
            </p>
          </div>
        </div>

        {/* 3 Project Cards Deck */}
        <div className="framer-jfqnnm">
          {storeProducts.map((p, idx) => (
            <div key={idx} className="ssr-variant">
              <div className="framer-a9k4av-container" style={{ opacity: 1, transform: "none" }}>
                <div
                  className="framer-TLXzn framer-pqx4O framer-jVAG2 framer-1n3rv63 framer-v-1n3rv63 group transition-transform duration-200 hover:-translate-y-1"
                  data-framer-name="Variant 1"
                  style={{
                    backgroundColor: "var(--token-a7cc2964-d8ca-4e2b-a4dc-bf1002d1db68, rgb(235, 248, 255))",
                    width: "100%",
                    borderRadius: "17px",
                    opacity: 1,
                    transform: "none",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Top Product Showcase Frame (Uncropped 3D Mockup with Soft Light Backdrop) */}
                  <Link
                    href={p.href}
                    data-track={`home-product-image-${p.slug}`}
                    className="framer-ojezjg block transition-colors"
                    data-framer-name="Image"
                    style={{
                      opacity: 1,
                      background: "linear-gradient(180deg, #EBF5FB 0%, #D8EAF5 100%)",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "24px 20px 32px",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img
                        src={p.img}
                        alt={p.title}
                        style={{
                          display: "block",
                          maxHeight: "100%",
                          maxWidth: "100%",
                          width: "auto",
                          height: "auto",
                          objectPosition: "center",
                          objectFit: "contain",
                          filter: "drop-shadow(0 14px 22px rgba(22, 82, 110, 0.22))",
                          transition: "transform 0.3s ease",
                        }}
                        className="group-hover:scale-105"
                      />
                    </div>
                  </Link>

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
                      padding: "4px 8px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
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
                      opacity: 1,
                    }}
                  >
                    <div className="framer-16cvhaq" data-framer-name="Text" style={{ opacity: 1 }}>
                      <Link href={p.href} data-track={`home-product-title-${p.slug}`} className="group/title block">
                        <p className="framer-text framer-styles-preset-149n7s4 group-hover/title:text-[#16526e] transition-colors" dir="auto" style={{ fontWeight: 700, fontSize: "16px", color: "#000" }}>
                          {p.title}
                        </p>
                      </Link>
                      <div className="framer-9hgaq5" data-framer-component-type="RichTextContainer" style={{ transform: "none", opacity: 1 }}>
                        <p className="framer-text framer-styles-preset-1n9fr5k" dir="auto" style={{ fontSize: "12px", color: "rgba(0,0,0,0.6)", marginTop: "3px" }}>
                          {p.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="framer-1cn3wfy-container" style={{ opacity: 1 }}>
                      <Link
                        className="framer-2Cqzj framer-pqx4O framer-9hvwit framer-v-9hvwit framer-1wkh8kp transition hover:opacity-90 active:scale-[0.98]"
                        data-framer-name="Variant 1"
                        href={p.href}
                        data-track={`home-product-btn-${p.slug}`}
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
                          padding: "10px 16px",
                        }}
                      >
                        <div className="framer-qr6cka" data-framer-name="Donate" data-framer-component-type="RichTextContainer" style={{ transform: "none", opacity: 1 }}>
                          <p
                            className="framer-text framer-styles-preset-149n7s4"
                            dir="auto"
                            style={{
                              textAlign: "center",
                              color: "#fff",
                              fontWeight: 600,
                              fontSize: "14px",
                            }}
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
            data-track="home-store-all-link"
            className="inline-flex items-center gap-2 rounded-[12px] bg-[#16526e] hover:bg-[#114258] px-7 py-3 text-sm font-semibold text-white shadow-md transition active:scale-[0.98]"
          >
            <span>View All Official Store Compilations</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}

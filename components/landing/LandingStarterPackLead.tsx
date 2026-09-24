"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import AnimatedCurvedRibbon from "@/components/AnimatedCurvedRibbon";

export default function LandingStarterPackLead() {
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
          source: "altruist_starter_pack_lead",
        }),
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
    <section
      className="framer-1o56bo8"
      data-framer-name="Join Us - Section"
      id="starter-pack"
      style={{ position: "relative", overflow: "hidden", width: "100%" }}
    >
      {/* Background Cloud Image */}
      <div className="framer-1a3k8ey" data-framer-name="Image (change)">
        <div
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
          data-framer-background-image-wrapper="true"
        >
          <img
            src="/images/altruist/starter_pack.webp"
            alt="UPSC Mains Starter Pack Cloud Background"
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
                  opacity: 1,
                }}
              >
                <div
                  className="framer-1csgvwc"
                  data-framer-component-type="RichTextContainer"
                  style={{ transform: "none", opacity: 1 }}
                >
                  <p className="framer-text framer-styles-preset-ajns0" dir="auto">
                    Instant Access
                  </p>
                </div>
              </div>
            </div>

            <div
              className="framer-18hd2h8"
              data-framer-component-type="RichTextContainer"
              style={{ transform: "none" }}
            >
              <h2
                className="framer-text framer-styles-preset-dw9di9"
                dir="auto"
                style={{
                  textAlign: "left",
                  color: "var(--token-5e116048-a615-49a6-97d7-2d659f41a725, rgb(255, 255, 255))",
                }}
              >
                Claim Your Free UPSC Mains Starter Pack
              </h2>
            </div>

            <div
              className="framer-1jgi74h"
              data-framer-component-type="RichTextContainer"
              style={{ transform: "none" }}
            >
              <p
                className="framer-text framer-styles-preset-1t286ig"
                dir="auto"
                style={{
                  textAlign: "left",
                  color: "var(--token-4bc1e64e-bf8f-40de-bd4d-66486502f606, rgba(255, 255, 255, 0.8))",
                }}
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
                    textAlign: "left",
                    color: "var(--token-eff9db75-30f0-4c7d-a7af-eaa94d6dc6ea, rgb(22, 82, 110))",
                    fontWeight: 600,
                  }}
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
                    textAlign: "left",
                    color: "var(--token-eff9db75-30f0-4c7d-a7af-eaa94d6dc6ea, rgb(22, 82, 110))",
                    fontWeight: 600,
                  }}
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
                    textAlign: "left",
                    color: "var(--token-eff9db75-30f0-4c7d-a7af-eaa94d6dc6ea, rgb(22, 82, 110))",
                    fontWeight: 600,
                  }}
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
                className="mt-6 inline-flex items-center justify-center rounded-[10px] bg-[#16526E] hover:bg-[#114258] px-6 py-2.5 text-sm font-semibold text-white transition"
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
                      justifyContent: "center",
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

      {/* Rotating Volunteer SVG Ribbon */}
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

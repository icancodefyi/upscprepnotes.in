import Link from "next/link";
import { ArrowRight, Code } from "lucide-react";

export default function LandingFounderSection() {
  return (
    <section
      id="about-founder"
      className="relative w-full overflow-hidden py-16 sm:py-24 px-4 sm:px-8"
      style={{ backgroundColor: "var(--token-4a66cce6-00d5-40f7-836a-7512ad740f85, rgb(255, 255, 252))" }}
    >
      <div className="max-w-6xl mx-auto">
        <div
          className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 rounded-[22px] p-6 sm:p-10 border border-black/6 shadow-xs"
          style={{ backgroundColor: "#FFF2E3" }}
        >
          {/* Left: Playful Warm Gouache Illustration of the Engineer with Italic Sticker */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative aspect-[4/3] w-full rounded-[17px] overflow-hidden shadow-sm">
              <img
                src="/images/altruist/engineer_founder.jpg"
                alt="Zaid Rakhange - Software engineer analyzing civil services data"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Overlaid Playful Italic Libre Baskerville Sticker */}
            <div
              className="absolute -bottom-3 right-4 sm:right-6 z-10"
              style={{
                fontFamily: '"Libre Baskerville", Georgia, serif',
                fontStyle: "italic",
                transform: "rotate(-2deg)",
              }}
            >
              <div
                className="rounded-[6px] px-3.5 py-1.5 text-xs sm:text-sm font-bold text-[#6E4616]"
                style={{
                  backgroundColor: "#FFEAD1",
                  border: "1.5px solid #000000",
                  boxShadow: "2px 2px 0px #000000",
                }}
              >
                Built by an Engineer · Zero Coaching Bias
              </div>
            </div>
          </div>

          {/* Right: Editorial Story Stack */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between pt-4 lg:pt-0">
            <div>
              <div className="inline-flex items-center gap-2 rounded-[10px] bg-[#DEEFF8] px-3.5 py-1 text-xs font-bold text-[#16526E] mb-4">
                <Code size={13} />
                <span>Independent Archival Intelligence</span>
              </div>

              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mb-4"
                style={{ color: "#6E4616" }}
              >
                Built by a software engineer, not a coaching institute.
              </h2>

              <p
                className="text-sm sm:text-base leading-relaxed font-normal opacity-90 mb-4"
                style={{ color: "#6E4616" }}
              >
                I'm <strong className="font-bold text-[#4A2E0E]">Zaid Rakhange</strong> — a software engineer fascinated by civil services examination data. I personally extract and verify every single mark from official UPSC result PDFs because I believe preparation intelligence should be transparent, accurate, and completely free from commercial coaching bias.
              </p>

              <p
                className="text-sm sm:text-base leading-relaxed font-normal opacity-90 mb-6"
                style={{ color: "#6E4616" }}
              >
                No recycled marketing dossiers. Just 280+ authentic gazette score breakdowns, 50+ genuine evaluated answer copies, and data tools that help you prepare with surgical precision.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/about"
                data-track="home-about-story-cta"
                className="inline-flex items-center gap-2 rounded-[12px] bg-[#16526E] hover:bg-[#114258] px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition active:scale-[0.98]"
              >
                <span>Read the Full Story</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/contact"
                data-track="home-about-contact-cta"
                className="inline-flex items-center gap-2 rounded-[12px] border border-black/15 bg-white/80 hover:bg-white px-5 py-2.5 text-sm font-semibold text-black transition active:scale-[0.98]"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

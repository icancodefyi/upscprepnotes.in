import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingHero from "@/components/landing/LandingHero";
import LandingMarquee from "@/components/landing/LandingMarquee";
import LandingPurpose from "@/components/landing/LandingPurpose";
import LandingCuratedStore from "@/components/landing/LandingCuratedStore";
import LandingSyllabusBlueprints from "@/components/landing/LandingSyllabusBlueprints";
import LandingGazetteRecords from "@/components/landing/LandingGazetteRecords";
import LandingOptionalBenchmarks from "@/components/landing/LandingOptionalBenchmarks";
import LandingTestimonials from "@/components/landing/LandingTestimonials";
import LandingFaq from "@/components/landing/LandingFaq";
import LandingStarterPackLead from "@/components/landing/LandingStarterPackLead";
import LandingCommunityVoices from "@/components/landing/LandingCommunityVoices";
import LandingFounderSection from "@/components/landing/LandingFounderSection";
import LandingFooter from "@/components/landing/LandingFooter";

export const revalidate = 86400;

export default function LandingPage() {
  return (
    <div
      className="font-instrument min-h-screen overflow-x-hidden bg-[#FFFFFC] text-[#000000] selection:bg-[#DEEFF8] selection:text-[#16526E]"
      style={{
        fontFamily:
          '"Instrument Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* 1. Floating Navigation Bar */}
      <LandingNavbar />

      {/* 2. Hero Section */}
      <LandingHero />

      {/* 3. Master Content Stream (Authentic Altruist Design Language Chassis) */}
      <div
        className="framer-pOLR9 framer-0EsbE framer-pqx4O framer-AB6d5 framer-xhscK framer-8ZgQf framer-7Em8r framer-hXo03 framer-jVAG2 framer-72rtr7"
        style={{
          width: "100%",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "rgb(255, 255, 252)",
        }}
      >
        {/* Premier Academy Test Series Marquee */}
        <LandingMarquee />

        {/* Academic Pillars, Interactive Tabs & Rotating Bézier Ribbon */}
        <LandingPurpose />

        {/* Curated Official Store Compilations (Ongoing Projects Layout) */}
        <LandingCuratedStore />

        {/* Mains 2026 Scoring Blueprints (3 Staggered Sets with Gouache Artwork & Slanted Stickers) */}
        <LandingSyllabusBlueprints />

        {/* Gazette Records Spotlight with Evaluated Booklet Scans & Ribbon */}
        <LandingGazetteRecords />

        {/* Highest Recorded Optional Scores (4 Peak Benchmark Cards with Location Pins) */}
        <LandingOptionalBenchmarks />

        {/* Aspirant Testimonials Split Slider */}
        <LandingTestimonials />

        {/* Frequently Asked Questions Accordion */}
        <LandingFaq />

        {/* Free Mains Starter Pack Lead Capture with Clouds & Criss-crossing Ribbon */}
        <LandingStarterPackLead />

        {/* Community Reach: 28 States & 8 Union Territories India Vector Map & Pastel Notes */}
        <LandingCommunityVoices />

        {/* Founder Story: Built by a Software Engineer (Warm Editorial Gouache Card) */}
        <LandingFounderSection />
      </div>

      {/* 4. Complete Footer Link Tree & Gazette Disclaimer */}
      <LandingFooter />
    </div>
  );
}

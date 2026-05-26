import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — UPSCPrepNotes",
  description:
    "Information regarding analytics, usage data, and platform privacy.",
  alternates: {
    canonical: "https://upscprepnotes.in/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy — UPSCPrepNotes",
    description:
      "Information regarding analytics, usage data, and platform privacy.",
    url: "https://upscprepnotes.in/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="Information regarding analytics, usage data, and platform privacy."
    >
      <section className="space-y-5">
        <p className="leading-8 text-zinc-700">
          UPSCPrepNotes may collect basic analytics
          information including page visits, browser
          information, and usage patterns to improve
          platform experience and performance.
        </p>

        <p className="leading-8 text-zinc-700">
          No sensitive personal information is knowingly
          collected or sold to third parties.
        </p>

        <p className="leading-8 text-zinc-700">
          Third-party services such as analytics tools
          may use cookies or related technologies for
          traffic measurement and platform optimization.
        </p>
      </section>
    </LegalPage>
  );
}

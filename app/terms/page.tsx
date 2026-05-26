import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions — UPSCPrepNotes",
  description:
    "Platform usage terms and conditions.",
  alternates: {
    canonical: "https://upscprepnotes.in/terms",
  },
  openGraph: {
    title: "Terms & Conditions — UPSCPrepNotes",
    description:
      "Platform usage terms and conditions.",
    url: "https://upscprepnotes.in/terms",
  },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      description="Platform usage terms and conditions."
    >
      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Acceptance of Terms</h2>
        <p className="leading-8 text-zinc-700">
          By accessing or using UPSCPrepNotes, you agree to be bound by these
          Terms & Conditions. If you do not agree with any part of these terms,
          you should not use the platform.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Use of Service</h2>
        <p className="leading-8 text-zinc-700">
          UPSCPrepNotes is provided for lawful educational and informational
          purposes only. You agree to use the platform in a manner consistent
          with all applicable laws and regulations.
        </p>
        <p className="leading-8 text-zinc-700">
          You may browse, view, and reference the content on this platform for
          personal, non-commercial research and educational purposes. Any other
          use, including systematic scraping, automated data extraction, or
          commercial redistribution, is prohibited without explicit written
          permission.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Intellectual Property</h2>
        <p className="leading-8 text-zinc-700">
          The platform structure, data compilation, analysis, and presentation
          on UPSCPrepNotes are protected by applicable intellectual property
          laws. The underlying topper data is sourced from publicly available
          information compiled and structured by our platform.
        </p>
        <p className="leading-8 text-zinc-700">
          Content available on the platform may not be reproduced, redistributed,
          or misused without appropriate attribution or permission where applicable.
          Topper strategy content, where provided by the toppers themselves, remains
          their intellectual property.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">User Conduct</h2>
        <p className="leading-8 text-zinc-700">
          When using the platform, you agree not to:
        </p>
        <ul className="list-disc pl-6 text-zinc-700 space-y-2">
          <li>Attempt to gain unauthorized access to any part of the platform or its systems</li>
          <li>Use automated tools to scrape, crawl, or extract data without permission</li>
          <li>Submit false or misleading information through any forms or interfaces</li>
          <li>Use the platform for any illegal or unauthorized purpose</li>
          <li>Interfere with the proper functioning of the platform</li>
        </ul>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Third-Party Links and Services</h2>
        <p className="leading-8 text-zinc-700">
          UPSCPrepNotes may contain links to third-party websites or services,
          including answer copy repositories, reference materials, and external
          resources. These links are provided for convenience and do not imply
          endorsement. We have no control over and assume no responsibility for
          the content or practices of third-party sites.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
        <p className="leading-8 text-zinc-700">
          UPSCPrepNotes and its operators shall not be liable for any direct,
          indirect, incidental, consequential, or punitive damages arising from
          your use of or inability to use the platform. The platform is provided
          on an "as is" and "as available" basis without warranties of any kind,
          either express or implied.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Changes to Terms</h2>
        <p className="leading-8 text-zinc-700">
          UPSCPrepNotes reserves the right to modify, update, or remove these
          Terms & Conditions at any time without prior notice. Continued use of
          the platform after changes constitutes acceptance of the modified terms.
        </p>
        <p className="leading-8 text-zinc-700">
          These terms were last updated on May 26, 2026.
        </p>
      </section>
    </LegalPage>
  );
}

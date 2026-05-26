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
        <h2 className="text-2xl font-semibold">Information We Collect</h2>
        <p className="leading-8 text-zinc-700">
          UPSCPrepNotes collects minimal information necessary for platform
          operation and improvement. This includes anonymous usage data such
          as page views, browser type, device category, and general geographic
          location (at the country or city level).
        </p>
        <p className="leading-8 text-zinc-700">
          We do not collect personal information such as names, email addresses,
          or phone numbers unless you voluntarily provide it (for example, by
          sending us an email or filling a contact form).
        </p>
        <p className="leading-8 text-zinc-700">
          No sensitive personal information is knowingly collected, stored, or
          processed through this platform.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">How We Use Information</h2>
        <p className="leading-8 text-zinc-700">
          Usage data is used exclusively for:
        </p>
        <ul className="list-disc pl-6 text-zinc-700 space-y-2">
          <li>Measuring traffic patterns and popular content to improve the platform</li>
          <li>Identifying technical issues such as broken pages or slow load times</li>
          <li>Understanding broad user demographics to guide content development</li>
        </ul>
        <p className="leading-8 text-zinc-700">
          We do not sell, rent, or share personal information with third parties
          for their marketing purposes.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Third-Party Services</h2>
        <p className="leading-8 text-zinc-700">
          UPSCPrepNotes uses the following third-party services, each with its
          own privacy policy:
        </p>
        <ul className="list-disc pl-6 text-zinc-700 space-y-2">
          <li>
            <strong>Google Analytics</strong> (Measurement ID: G-Z58V360ESL) —
            collects anonymous browsing data for traffic analysis. Google Analytics
            uses cookies to distinguish unique users. You can learn more about
            Google's privacy practices at policies.google.com.
          </li>
          <li>
            <strong>Umami Analytics</strong> — a privacy-focused analytics service
            that collects minimal usage data without cookies or personal identifiers.
          </li>
          <li>
            <strong>Groq AI</strong> — used to power the Ask AI feature. Conversations
            submitted through the AI interface are processed by Groq's API. We do not
            store the content of these conversations beyond the current session unless
            explicitly saved by the user. Review Groq's privacy policy for details on
            their data handling.
          </li>
        </ul>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Cookies</h2>
        <p className="leading-8 text-zinc-700">
          UPSCPrepNotes uses minimal cookies. Google Analytics sets first-party
          cookies to distinguish unique visitors and track browsing sessions. These
          cookies do not contain personally identifiable information.
        </p>
        <p className="leading-8 text-zinc-700">
          You can configure your browser to reject cookies or notify you when a
          cookie is set. Disabling cookies will not affect your ability to browse
          the platform, though analytics data may be less accurate.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Data Security</h2>
        <p className="leading-8 text-zinc-700">
          We implement standard security measures to protect any information
          collected through the platform. This includes HTTPS encryption for all
          data transmitted between your browser and our servers.
        </p>
        <p className="leading-8 text-zinc-700">
          However, no method of electronic storage or transmission is completely
          secure. While we strive to protect your information, we cannot guarantee
          absolute security.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Your Rights</h2>
        <p className="leading-8 text-zinc-700">
          Depending on your jurisdiction, you may have the right to:
        </p>
        <ul className="list-disc pl-6 text-zinc-700 space-y-2">
          <li>Request information about what data we hold about you</li>
          <li>Request deletion of your data</li>
          <li>Opt out of analytics tracking (via browser settings or Do Not Track headers)</li>
        </ul>
        <p className="leading-8 text-zinc-700">
          To exercise any of these rights, please contact us at the email address
          listed on our Contact page.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Changes to This Policy</h2>
        <p className="leading-8 text-zinc-700">
          We may update this Privacy Policy from time to time. Changes will be
          posted on this page with an updated effective date. We encourage you
          to review this policy periodically.
        </p>
        <p className="leading-8 text-zinc-700">
          This policy was last updated on May 26, 2026.
        </p>
      </section>
    </LegalPage>
  );
}

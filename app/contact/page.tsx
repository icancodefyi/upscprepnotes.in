import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Contact — UPSCPrepNotes",
  description:
    "For platform inquiries, corrections, feedback, or collaboration.",
  alternates: {
    canonical: "https://upscprepnotes.in/contact",
  },
  openGraph: {
    title: "Contact — UPSCPrepNotes",
    description:
      "For platform inquiries, corrections, feedback, or collaboration.",
    url: "https://upscprepnotes.in/contact",
  },
};

export default function ContactPage() {
  return (
    <LegalPage
      title="Contact"
      description="For platform inquiries, corrections, feedback, or collaboration."
    >
      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Contact Information</h2>
        <p className="leading-8 text-zinc-700">
          Email:
          <br />
          <a href="mailto:hello@impiclabs.com" className="text-blue-600 underline underline-offset-2">
            hello@impiclabs.com
          </a>
        </p>
        <p className="leading-8 text-zinc-700">
          We welcome inquiries related to platform feedback, factual corrections,
          profile updates, collaboration opportunities, and general questions
          about the data we host.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">What to Include in Your Message</h2>
        <p className="leading-8 text-zinc-700">
          For factual corrections or profile-related requests, please include
          the specific URL of the page in question along with the source or
          reference for the correction. This helps us verify and update the
          information promptly.
        </p>
        <p className="leading-8 text-zinc-700">
          For collaboration or partnership inquiries, please describe your
          proposal briefly and include any relevant links or background
          information.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Response Time</h2>
        <p className="leading-8 text-zinc-700">
          We aim to respond to all inquiries within 2-3 business days. For
          urgent correction requests, please mention the urgency in your
          subject line and we will prioritize accordingly.
        </p>
      </section>
    </LegalPage>
  );
}

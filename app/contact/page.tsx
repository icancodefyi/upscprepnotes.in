import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import ContactFeedbackSection from "@/components/ContactFeedbackSection";

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "mainEntity": {
    "@type": "Organization",
    "name": "UPSCPrepNotes",
    "email": "hello@impiclabs.com",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "hello@impiclabs.com",
      "contactType": "customer service",
      "description": "For inquiries about topper data, platform feedback, factual corrections, and collaboration."
    },
    "sameAs": [
      "https://x.com/impiclabs",
    ]
  }
};

export const metadata: Metadata = {
  title: "Contact — UPSCPrepNotes",
  description:
    "Email hello@impiclabs.com for platform inquiries, factual corrections, profile updates, feedback, or collaboration. We respond within 2-3 business days.",
  alternates: {
    canonical: "https://upscprepnotes.in/contact",
  },
  openGraph: {
    title: "Contact — UPSCPrepNotes",
    description:
      "Email hello@impiclabs.com for platform inquiries, factual corrections, profile updates, feedback, or collaboration.",
    url: "https://upscprepnotes.in/contact",
  },
};

export default function ContactPage() {
  return (
    <LegalPage
      title="Contact"
      description="Email hello@impiclabs.com for platform inquiries, factual corrections, profile updates, feedback, or collaboration. We respond within 2-3 business days."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Contact Information</h2>
        <p className="leading-8 text-zinc-700">
          Email:
          <br />
           <a href="mailto:hello@impiclabs.com" data-track="contact-email-link" className="text-blue-600 underline underline-offset-2">
            hello@impiclabs.com
          </a>
        </p>
        <p className="leading-8 text-zinc-700">
          We welcome inquiries related to platform feedback, factual corrections,
          profile updates, collaboration opportunities, and general questions
          about the data we host.
        </p>
      </section>

      <ContactFeedbackSection />

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

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">How quickly do you respond to corrections?</h3>
            <p className="mt-2 leading-8 text-zinc-700">
              We typically verify and apply factual corrections within 2-3 business days. If a correction
              affects marks data or rank information, we cross-verify with official UPSC sources before
              updating. For urgent corrections, flagging your email with &quot;URGENT CORRECTION&quot; in the
              subject line helps us prioritize it.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Can I request a new topper profile to be added?</h3>
            <p className="mt-2 leading-8 text-zinc-700">
              Yes. If you have verified marks data for a UPSC topper not yet on our platform, send us
              the details along with your source. We prioritize profiles where official marks data is
              publicly available from UPSC.gov.in or reliable secondary sources.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">How can I collaborate with UPSCPrepNotes?</h3>
            <p className="mt-2 leading-8 text-zinc-700">
              We are open to collaborations that help aspirants make data-backed preparation decisions.
              This includes content partnerships, data sharing agreements, research collaborations, and
              cross-promotions. Send us your proposal at hello@impiclabs.com and we will respond within a week.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Do you offer technical support for the platform?</h3>
            <p className="mt-2 leading-8 text-zinc-700">
              Yes. If you encounter broken links, formatting issues, or any technical problems while
              browsing the platform, please report them with the specific page URL and a description
              of the issue. We use your reports to continuously improve the platform.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Can I suggest new features or data points?</h3>
            <p className="mt-2 leading-8 text-zinc-700">
              Absolutely. We built UPSCPrepNotes based on user feedback and we actively review feature
              suggestions. Whether it is a new data visualization, additional filter options, or a new
              category of analysis — send us your idea and we will evaluate it for the roadmap.
            </p>
          </div>
        </div>
      </section>
    </LegalPage>
  );
}

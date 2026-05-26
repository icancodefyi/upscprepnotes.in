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
        <h2 className="text-2xl font-semibold">
          Contact Information
        </h2>

        <p className="leading-8 text-zinc-700">
          Email:
          <br />
          hello@impiclabs.com
        </p>

        <p className="leading-8 text-zinc-700">
          For factual corrections, content concerns,
          or profile-related requests, please include
          relevant links and information in your email.
        </p>
      </section>
    </LegalPage>
  );
}

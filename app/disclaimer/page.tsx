import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Disclaimer — UPSCPrepNotes",
  description:
    "Educational and informational use disclaimer.",
  alternates: {
    canonical: "https://upscprepnotes.in/disclaimer",
  },
  openGraph: {
  title: "Disclaimer — UPSC Study Material & Topper Data",
    description:
      "Educational and informational use disclaimer.",
    url: "https://upscprepnotes.in/disclaimer",
  },
};

export default function DisclaimerPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Disclaimer", href: "/disclaimer" },
        ]}
      />
      <LegalPage
        title="Disclaimer"
        description="Educational and informational use disclaimer."
      >
      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Educational Purpose</h2>
        <p className="leading-8 text-zinc-700">
          UPSCPrepNotes is an independent educational platform intended for
          informational, analytical, and research purposes only. The content
          presented on this platform is designed to help aspirants make informed
          decisions about their UPSC Civil Services Examination preparation.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">No Affiliation</h2>
        <p className="leading-8 text-zinc-700">
          UPSCPrepNotes is not affiliated with, endorsed by, or connected to
          the Union Public Service Commission (UPSC), any government department,
          or any coaching institute. All topper data presented on this platform
          is compiled from publicly available sources including official UPSC
          notifications, topper interviews, and public statements.
        </p>
        <p className="leading-8 text-zinc-700">
          References to specific coaching institutes, books, or resources are
          provided for informational purposes and do not constitute endorsements.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Accuracy of Information</h2>
        <p className="leading-8 text-zinc-700">
          Information presented on UPSCPrepNotes is compiled from publicly
          available sources including official UPSC results, media reports,
          topper interviews, and educational materials. While we strive to
          maintain accuracy through cross-verification and regular updates,
          we cannot guarantee the completeness, timeliness, or absolute
          correctness of every data point.
        </p>
        <p className="leading-8 text-zinc-700">
          Marks data displayed on topper profiles is based on the best available
          public sources. In some cases, marks may be approximate or may not
          reflect final UPSC records. Users are encouraged to verify critical
          data points from official UPSC sources where possible.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">External Links</h2>
        <p className="leading-8 text-zinc-700">
          UPSCPrepNotes may link to external websites, answer copy repositories,
          reference documents, and third-party resources. These links are provided
          for user convenience and do not imply endorsement or responsibility for
          the content, accuracy, or practices of those external sites.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">No Professional Advice</h2>
        <p className="leading-8 text-zinc-700">
          The content on UPSCPrepNotes does not constitute professional coaching,
          career counseling, or guaranteed preparation advice. UPSC preparation
          is highly individualized, and what works for one aspirant may not work
          for another. Users should exercise their own judgment and consult
          qualified mentors or educators for personalized guidance.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
        <p className="leading-8 text-zinc-700">
          To the fullest extent permitted by law, UPSCPrepNotes and its operators
          disclaim all liability for any loss, damage, or inconvenience arising
          from the use of or reliance on information provided on this platform.
          Users assume full responsibility for their interpretation and application
          of the content.
        </p>
      </section>
      </LegalPage>
    </>
  );
}

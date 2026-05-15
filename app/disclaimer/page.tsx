import LegalPage from "@/components/legal/LegalPage";

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      description="Educational and informational use disclaimer."
    >
      <section className="space-y-5">
        <p className="leading-8 text-zinc-700">
          UPSCPrepNotes is an independent educational
          platform intended for informational and
          research purposes only.
        </p>

        <p className="leading-8 text-zinc-700">
          The platform is not affiliated with UPSC,
          any government organization, or coaching
          institute.
        </p>

        <p className="leading-8 text-zinc-700">
          Information presented on the platform may be
          compiled from publicly available sources,
          interviews, reports, and educational materials.
          While efforts are made to maintain accuracy,
          no guarantees are provided regarding completeness
          or correctness.
        </p>
      </section>
    </LegalPage>
  );
}

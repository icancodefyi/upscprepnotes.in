import LegalPage from "@/components/legal/LegalPage";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      description="Platform usage terms and conditions."
    >
      <section className="space-y-5">
        <p className="leading-8 text-zinc-700">
          By accessing UPSCPrepNotes, users agree to
          use the platform for lawful educational and
          informational purposes only.
        </p>

        <p className="leading-8 text-zinc-700">
          Content available on the platform may not be
          reproduced, redistributed, or misused without
          appropriate permission where applicable.
        </p>

        <p className="leading-8 text-zinc-700">
          UPSCPrepNotes reserves the right to modify,
          update, or remove platform content and
          functionality without prior notice.
        </p>
      </section>
    </LegalPage>
  );
}

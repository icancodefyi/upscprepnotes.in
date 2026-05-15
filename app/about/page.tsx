import LegalPage from "@/components/legal/LegalPage";

export default function AboutPage() {
  return (
    <LegalPage
      title="About"
      description="UPSCPrepNotes is a structured educational intelligence platform focused on topper analysis, preparation insights, marksheet indexing, and optional subject research."
    >
      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">
          What is UPSCPrepNotes?
        </h2>

        <p className="leading-8 text-zinc-700">
          UPSCPrepNotes organizes publicly available
          topper information into a structured research
          platform for aspirants exploring preparation
          strategies, score trends, interview performance,
          and optional subject insights.
        </p>

        <p className="leading-8 text-zinc-700">
          The platform focuses on educational intelligence
          rather than coaching-oriented content delivery.
          Information is indexed, structured, and presented
          for research and learning purposes.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold">
          Platform Vision
        </h2>

        <p className="leading-8 text-zinc-700">
          The objective of UPSCPrepNotes is to create a
          deeply interconnected archive of preparation
          intelligence that helps aspirants discover
          patterns, preparation methods, optional subject
          trends, and high-performing strategies.
        </p>
      </section>
    </LegalPage>
  );
}

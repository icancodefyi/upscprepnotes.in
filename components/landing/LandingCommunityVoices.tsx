import Link from "next/link";
import IndiaCommunityMap from "@/components/IndiaCommunityMap";

export default function LandingCommunityVoices() {
  const notes = [
    {
      text: "Having Ishita Kishore's 313 PSIR paper broken down line by line removed all the anxiety about how to cite thinkers in Paper 1 Section A.",
      loc: "Aspirant, Old Rajinder Nagar, Delhi",
      bg: "var(--token-da0e9810-0881-4867-bf86-d2442ee77e28, rgb(250, 219, 255))",
      rot: "rotate(0deg)",
    },
    {
      text: "Preparing from Buxar without classroom coaching felt lonely until I saw Garima Lohia's GS2 scorecard and realized self-study with landmark judgments works.",
      loc: "Self-Study Candidate, Bihar",
      bg: "var(--token-b310f9bd-566a-49a6-a0be-aa5b1bb3c475, rgb(255, 234, 209))",
      rot: "rotate(-1deg)",
    },
    {
      text: "The ethics stakeholder matrices derived from Ayan Jain's copy helped me clear my test series plateau in Pune within three weeks.",
      loc: "Mains Aspirant, Pune, Maharashtra",
      bg: "var(--token-190aa3a9-ebc3-4655-911e-ab1b9b0c5835, rgb(249, 250, 227))",
      rot: "rotate(-2deg)",
    },
    {
      text: "The 280+ marksheets database made me realize cutoffs aren't won in Essay alone, but by maintaining a solid 105+ floor across all 4 GS papers.",
      loc: "Candidate, Bengaluru, Karnataka",
      bg: "var(--token-4832e1d9-0ba2-4ca2-b71c-210f580f47f1, rgb(221, 209, 255))",
      rot: "rotate(2deg)",
    },
  ];

  return (
    <section
      className="framer-pc7u1z"
      data-framer-name="CTA Section"
      style={{
        backgroundColor: "var(--token-4a66cce6-00d5-40f7-836a-7512ad740f85, rgb(255, 255, 252))",
        padding: "90px 40px 60px",
        width: "100%",
        position: "relative",
      }}
    >
      <div className="framer-15730zy" data-framer-name="Content Stack">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-8">
          <span className="rounded-[10px] bg-[#EEF7F2] border border-[#D2E7D9] px-3.5 py-1 text-xs font-bold text-[#1A4D32] mb-3">
            Geographic Reach
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight leading-tight">
            Voices From Aspirants Across India
          </h2>
          <p className="mt-3 text-base text-black/70 leading-relaxed max-w-xl">
            Every marksheet decode reaches serious candidates across all 28 states and 8 Union Territories.
          </p>
          <div className="mt-5">
            <Link
              href="/toppers"
              data-track="home-community-toppers-cta"
              className="inline-flex items-center justify-center rounded-[10px] bg-[#16526e] hover:bg-[#114258] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98]"
            >
              Browse 280+ Verified Marksheets
            </Link>
          </div>
        </div>

        {/* Interactive Survey of India Vector Map */}
        <div className="w-full max-w-4xl mx-auto my-10 bg-white/60 rounded-[18px] p-4 sm:p-6 border border-black/5 shadow-xs">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-black/50 mb-4">
            Interactive Geographic Reach: 28 States & 8 Union Territories
          </p>
          <IndiaCommunityMap />
        </div>

        {/* Staggered Pastel Sticky Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-6">
          {notes.map((n, i) => (
            <div
              key={i}
              className="p-5 rounded-[12px] shadow-xs transition-transform duration-200 hover:scale-[1.02] flex flex-col justify-between"
              style={{
                backgroundColor: n.bg,
                transform: n.rot,
                minHeight: "180px",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <p className="text-sm font-medium text-black/85 leading-relaxed">
                "{n.text}"
              </p>
              <div className="mt-4 pt-3 border-t border-black/5">
                <p className="text-xs font-bold text-[#16526e]">{n.loc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

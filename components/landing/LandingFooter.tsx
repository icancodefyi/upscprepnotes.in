import Link from "next/link";
import Image from "next/image";

export default function LandingFooter() {
  return (
    <footer
      className="framer-os1win"
      data-framer-name="Footer"
      style={{
        backgroundColor: "var(--token-aa1fdafa-3658-4ff4-91fe-60ad3074fde3, rgb(222, 239, 248))",
        width: "100%",
        padding: "70px 40px 40px",
        position: "relative",
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 pb-10 border-b border-[#16526e]/15">
          <div className="max-w-sm">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="UPSCPrepNotes Wordmark"
                width={170}
                height={40}
                className="h-[40px] w-auto"
              />
            </Link>
            <p className="mt-3 text-sm text-[#16526e]/80 leading-relaxed font-medium">
              India's civil services archival intelligence repository. 280+ verified marksheets, authentic evaluated answer copies, and data-driven Mains strategies with zero marketing fluff.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12">
            {/* Column 1 */}
            <div>
              <p className="font-bold text-[#16526e] text-sm uppercase tracking-wider mb-4">Official Archive</p>
              <ul className="flex flex-col gap-2.5 text-sm font-medium text-[#116e99]">
                <li><Link href="/toppers" className="hover:text-black transition-colors">Toppers Marksheets</Link></li>
                <li><Link href="/toppers/marks-database" className="hover:text-black transition-colors">Marks Database</Link></li>
                <li><a href="#impacts" className="hover:text-black transition-colors">Handwritten Copies</a></li>
                <li><a href="#schedule" className="hover:text-black transition-colors">Optional Benchmarks</a></li>
                <li><Link href="/pyq" className="hover:text-black transition-colors">10-Year PYQ Archive</Link></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <p className="font-bold text-[#16526e] text-sm uppercase tracking-wider mb-4">Study Tools</p>
              <ul className="flex flex-col gap-2.5 text-sm font-medium text-[#116e99]">
                <li><Link href="/ask" className="hover:text-black transition-colors">Ask AI Mentor</Link></li>
                <li><Link href="/current-affairs" className="hover:text-black transition-colors">Current Affairs Hub</Link></li>
                <li><Link href="/free-materials" className="hover:text-black transition-colors">Free Study Materials</Link></li>
                <li><Link href="/content/data-methodology-and-editorial-standards" className="hover:text-black transition-colors">Data Methodology</Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <p className="font-bold text-[#16526e] text-sm uppercase tracking-wider mb-4">Curated Store</p>
              <ul className="flex flex-col gap-2.5 text-sm font-medium text-[#116e99]">
                <li><Link href="/store/top-10-rankers-strategy" className="hover:text-black transition-colors">Rankers Strategy PDF</Link></li>
                <li><Link href="/store/answer-copies-compilation" className="hover:text-black transition-colors">Answer Copies Bundle</Link></li>
                <li><Link href="/store/government-schemes-compilation" className="hover:text-black transition-colors">Government Schemes</Link></li>
                <li><Link href="/store" className="hover:text-black transition-colors">View All Products</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#16526e]/75 font-medium">
          <p>© 2026 UPSCPrepNotes. Independent civil services preparation platform. Not affiliated with UPSC.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-black transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-black transition-colors">Contact</Link>
            <Link href="/privacy-policy" className="hover:text-black transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-black transition-colors">Terms of Use</Link>
            <Link href="/disclaimer" className="hover:text-black transition-colors">Gazette Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

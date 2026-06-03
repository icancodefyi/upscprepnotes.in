import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-6">
              <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center">
                <span className="text-white text-xs font-bold">PN</span>
              </div>
              <span>UPSCPrepNotes</span>
            </Link>
            <p className="text-gray-500 text-sm leading-6">
              Structured UPSC preparation intelligence platform with topper profiles,
              marksheet analysis, answer copies, and AI-powered insights.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-[11px] uppercase tracking-wide text-gray-400">
              <span>280+ Profiles</span>
              <span>·</span>
              <span>18 Subjects</span>
              <span>·</span>
              <span>Updated Regularly</span>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-bold mb-4 text-sm">Platform</h4>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li>
                <Link href="/toppers" className="hover:text-black transition-colors">
                  Browse All Toppers
                </Link>
              </li>
              <li>
                <Link href="/toppers/toppers-copy-compilation" data-track="footer-answer-copies" className="hover:text-black transition-colors">
                  Answer Copies
                </Link>
              </li>
              <li>
                <Link href="/optional/psir" className="hover:text-black transition-colors">
                  Optional Subjects
                </Link>
              </li>
              <li>
                <Link href="/ask" className="hover:text-black transition-colors">
                  Ask AI
                </Link>
              </li>
              <li>
                <Link href="/pyq" className="hover:text-black transition-colors">
                  PYQs
                </Link>
              </li>
              <li>
                <Link href="/free-materials" className="hover:text-black transition-colors">
                  Free Materials
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold mb-4 text-sm">Resources</h4>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li>
                <Link href="/resources" className="hover:text-black transition-colors">
                  All Resources
                </Link>
              </li>
              <li>
                <Link href="/upsc-full-form" className="hover:text-black transition-colors">
                  UPSC Full Form
                </Link>
              </li>
              <li>
                <Link href="/upsc-syllabus" className="hover:text-black transition-colors">
                  UPSC Syllabus
                </Link>
              </li>
              <li>
                <Link href="/upsc-free-material" className="hover:text-black transition-colors">
                  Free UPSC Material
                </Link>
              </li>
              <li>
                <Link href="/upsc-full-form-hindi" className="hover:text-black transition-colors">
                  UPSC Full Form (हिंदी)
                </Link>
              </li>
              <li>
                <Link href="/year/2024" className="hover:text-black transition-colors">
                  2024 CSE
                </Link>
              </li>
              <li>
                <Link href="/year/2023" className="hover:text-black transition-colors">
                  2023 CSE
                </Link>
              </li>
              <li>
                <Link href="/year/2022" className="hover:text-black transition-colors">
                  2022 CSE
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-black transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-black transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4 text-sm">Legal</h4>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li>
                <Link href="/privacy-policy" className="hover:text-black transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-black transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-black transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-4 border-t border-gray-100 pt-6 text-xs text-gray-400 md:flex-row md:items-center md:justify-between">
          <p>© 2026 UPSCPrepNotes. Structured UPSC intelligence archive.</p>
          <div className="flex items-center gap-5 uppercase tracking-wide">
            <span>Educational Use</span>
            <span>Research Platform</span>
            <span>India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

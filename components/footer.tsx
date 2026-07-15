import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" data-track="footer-logo" className="flex items-center gap-2.5 font-bold text-xl mb-6">
              <Image src="/logo.png" alt="UPSCPrepNotes" width={32} height={32} className="h-8 w-auto" />
              <span>UPSCPrepNotes</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-6">
              Structured UPSC preparation intelligence platform with topper profiles,
              marksheet analysis, answer copies, and AI-powered insights.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-[11px] uppercase tracking-wide text-muted-foreground">
              <span>280+ Profiles</span>
              <span>·</span>
              <span>37 Subjects</span>
              <span>·</span>
              <span>Updated Regularly</span>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-bold mb-4 text-sm">Platform</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/toppers" data-track="footer-toppers" className="hover:text-foreground transition-colors">
                  Browse All Toppers
                </Link>
              </li>
              <li>
                <Link href="/store" data-track="footer-store" className="hover:text-foreground transition-colors">
                  Store
                </Link>
              </li>
              <li>
                <Link href="/optional/psir" data-track="footer-optional-subjects" className="hover:text-foreground transition-colors">
                  Optional Subjects
                </Link>
              </li>
              <li>
                <Link href="/ask" data-track="footer-ask-ai" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
                  Ask AI
                  <span className="rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-bold text-brand-foreground leading-none">New</span>
                </Link>
              </li>
              <li>
                <Link href="/pyq" data-track="footer-pyq" className="hover:text-foreground transition-colors">
                  PYQs
                </Link>
              </li>
              <li>
                <Link href="/free-materials" data-track="footer-free-materials" className="hover:text-foreground transition-colors">
                  Free Materials
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold mb-4 text-sm">Resources</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/resources" data-track="footer-all-resources" className="hover:text-foreground transition-colors">
                  All Resources
                </Link>
              </li>
              <li>
                <Link href="/content/upsc-full-form" data-track="footer-upsc-full-form" className="hover:text-foreground transition-colors">
                  UPSC Full Form
                </Link>
              </li>
              <li>
                <Link href="/content/upsc-syllabus" data-track="footer-upsc-syllabus" className="hover:text-foreground transition-colors">
                  UPSC Syllabus
                </Link>
              </li>
              <li>
                <Link href="/content/upsc-free-material" data-track="footer-free-upsc-material" className="hover:text-foreground transition-colors">
                  Free UPSC Material
                </Link>
              </li>
              <li>
                <Link href="/content/upsc-full-form-hindi" data-track="footer-upsc-full-form-hindi" className="hover:text-foreground transition-colors">
                  UPSC Full Form (हिंदी)
                </Link>
              </li>
              <li>
                <Link href="/year/2024" data-track="footer-year-2024" className="hover:text-foreground transition-colors">
                  2024 CSE
                </Link>
              </li>
              <li>
                <Link href="/year/2023" data-track="footer-year-2023" className="hover:text-foreground transition-colors">
                  2023 CSE
                </Link>
              </li>
              <li>
                <Link href="/year/2022" data-track="footer-year-2022" className="hover:text-foreground transition-colors">
                  2022 CSE
                </Link>
              </li>
              <li>
                <Link href="/about" data-track="footer-about" className="hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" data-track="footer-contact" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" data-track="footer-faq" className="hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/content/data-methodology-and-editorial-standards" data-track="footer-data-methodology" className="hover:text-foreground transition-colors">
                  Data & Methodology
                </Link>
              </li>
              <li>
                <Link href="/content/how-to-score-130-plus-in-gs1" data-track="footer-strategy-gs1" className="hover:text-foreground transition-colors">
                  Score 130+ in GS1
                </Link>
              </li>
              <li>
                <Link href="/content/how-to-score-120-plus-in-gs2" data-track="footer-strategy-gs2" className="hover:text-foreground transition-colors">
                  Score 120+ in GS2
                </Link>
              </li>
              <li>
                <Link href="/content/how-to-score-300-plus-in-psir-optional" data-track="footer-strategy-psir" className="hover:text-foreground transition-colors">
                  Score 300+ in PSIR Optional
                </Link>
              </li>
              <li>
                <Link href="/content/upsc-optional-subject-marks-analysis" data-track="footer-optional-marks" className="hover:text-foreground transition-colors">
                  Optional Marks Data
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold mb-4 text-sm">Legal</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy-policy" data-track="footer-privacy-policy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" data-track="footer-terms" className="hover:text-foreground transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" data-track="footer-disclaimer" className="hover:text-foreground transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
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

import Link from "next/link";

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md text-center">
        <div className="rounded-2xl border border-gray-200 bg-white p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-600"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <h1 className="text-lg font-bold text-gray-900">Strategy Report Preview</h1>
          <p className="mt-1 text-sm text-gray-500">Ishita Kishore — AIR 1, PSIR</p>
          <div className="mt-6 space-y-3">
            <Link
              href="/api/report-preview"
              className="block w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
            >
              Download Sample PDF
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

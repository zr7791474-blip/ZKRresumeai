/**
 * A realistic, fully-typeset resume example used as the landing page's
 * visual anchor. Content is fictional but the layout/typography is a real,
 * deliberate design — not an abstract skeleton — so a visitor can see
 * exactly what a finished document looks like.
 */
export function ResumeShowcase({ className = "" }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Example resume for a fictional Senior Product Designer, showing a header, summary, work experience with measurable achievements, and a skills list"
      className={`bg-white text-slate-900 shadow-2xl shadow-black/20 dark:shadow-black/50 ${className}`}
    >
      <div className="p-8 sm:p-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 border-b border-slate-200 pb-4">
          <div>
            <p className="text-2xl font-bold tracking-tight text-slate-900">Maya Okonkwo</p>
            <p className="mt-0.5 text-sm font-medium text-cyan-700">Senior Product Designer</p>
          </div>
          <div className="sm:text-right text-[11px] leading-relaxed text-slate-500">
            <p>maya.okonkwo@email.com</p>
            <p>San Francisco, CA</p>
          </div>
        </div>

        {/* Summary */}
        <p className="mt-4 text-[13px] leading-relaxed text-slate-600">
          Product designer with 7 years shipping design systems and 0-to-1 products for B2B SaaS.
          Led the redesign that cut onboarding time by 38% at a Series B startup.
        </p>

        {/* Experience */}
        <div className="mt-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Experience</p>
          <div className="mt-3 space-y-4">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-0.5 sm:gap-2">
                <p className="text-sm font-semibold text-slate-800">Lead Product Designer, Northlane</p>
                <p className="text-[11px] text-slate-400 shrink-0">2022 — Present</p>
              </div>
              <ul className="mt-1.5 space-y-1 text-[12.5px] leading-relaxed text-slate-600">
                <li>• Redesigned the onboarding flow, reducing time-to-first-value by 38%</li>
                <li>• Built and shipped a design system adopted across 6 product teams</li>
              </ul>
            </div>
            <div>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-0.5 sm:gap-2">
                <p className="text-sm font-semibold text-slate-800">Product Designer, Fielded</p>
                <p className="text-[11px] text-slate-400 shrink-0">2019 — 2022</p>
              </div>
              <ul className="mt-1.5 space-y-1 text-[12.5px] leading-relaxed text-slate-600">
                <li>• Owned end-to-end design for the billing and invoicing product line</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Skills</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {["Figma", "Design Systems", "User Research", "Prototyping", "A/B Testing"].map((s) => (
              <span key={s} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* ATS-tested footer strip — ties the visual back to a real product claim */}
      <div className="flex items-center gap-1.5 border-t border-slate-200 bg-slate-50 px-8 py-2.5 sm:px-10">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <span className="text-[11px] font-medium text-slate-500">Formatted to pass ATS parsing</span>
      </div>
    </div>
  );
}

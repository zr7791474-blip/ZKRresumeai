import type { ResumeWithSections } from "@/types";

function sectionLabel(type: string, title: string | null): string {
  if (title) return title;
  return type
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function ResumePreview({ resume }: { resume: ResumeWithSections }) {
  const personalInfo = resume.data as Record<string, string | undefined>;
  const sortedSections = resume.sections.slice().sort((a, b) => a.order - b.order);

  return (
    <div className="bg-white text-slate-900 rounded-lg border shadow-sm p-8 sm:p-10 space-y-6 max-w-[720px] mx-auto">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">{personalInfo.fullName || resume.title}</h1>
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-500">
          {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.website]
            .filter(Boolean)
            .map((line, i) => (
              <span key={i}>{line}</span>
            ))}
        </div>
      </div>

      {sortedSections.length === 0 && (
        <p className="text-sm text-slate-400 italic">Add sections in the editor to see them here.</p>
      )}

      {sortedSections.map((section) => {
        const content = section.content;
        return (
          <div key={section.id} className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wide text-slate-400">
              {sectionLabel(section.type, section.title)}
            </h2>

            {typeof content.text === "string" && content.text && (
              <p className="text-sm leading-relaxed text-slate-700">{content.text}</p>
            )}

            {Array.isArray(content.items) && content.items.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {(content.items as string[]).map((item, i) => (
                  <span key={i} className="text-xs rounded-full border px-2.5 py-1 text-slate-600">
                    {item}
                  </span>
                ))}
              </div>
            )}

            {Array.isArray(content.entries) && content.entries.length > 0 && (
              <div className="space-y-3">
                {(content.entries as Array<Record<string, string>>).map((entry, i) => (
                  <div key={i}>
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-800">
                        {entry.title}
                        {entry.subtitle ? <span className="font-normal text-slate-500"> — {entry.subtitle}</span> : null}
                      </p>
                      {entry.period && <span className="text-xs text-slate-400 shrink-0">{entry.period}</span>}
                    </div>
                    {entry.description && (
                      <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">{entry.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
